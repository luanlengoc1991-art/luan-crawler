/**
 * LUAN CRAWLER — Cloudflare Worker crawling API.
 * This extracts server-rendered HTML tables or public JSON and preserves VHub
 * project exports. JS-rendered pages may require a separate Playwright server.
 */
import * as XLSX from "xlsx";

const MAX_BYTES = 1500000;
const MAX_ROWS = 500;
const MAX_SOURCES = 12;
const DEFAULT_HOSTS = ["vhub.com.vn","salepro.com","luangroup.asia","vinhomegreencity.com.vn"];
const headers = {"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","X-Content-Type-Options":"nosniff"};
const json = (x,status=200) => new Response(JSON.stringify(x),{status,headers});
const error = (msg,status=400) => json({error:String(msg)},status);
const clean = value => String(value ?? "").replace(/\s+/g," ").trim();

function allowedHosts(env) {
  return [...new Set([...DEFAULT_HOSTS,...String(env?.DASHBOARD_ALLOWED_HOSTS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean)])];
}
function safeURL(input, hosts) {
  if (typeof input !== "string" || input.length > 2100) throw new Error("Đường dẫn không hợp lệ.");
  let u;
  try { u = new URL(input); } catch { throw new Error("URL không đúng định dạng."); }
  if (u.protocol !== "https:" || u.port || u.username || u.password) throw new Error("Chỉ hỗ trợ HTTPS.");
  const host=u.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal") || /^[0-9.:\[\]]+$/.test(host) || !hosts.some(h => h === host || host.endsWith("." + h))) {
    throw new Error("Tên miền không được cho phép: " + host + ". Cấu hình DASHBOARD_ALLOWED_HOSTS.");
  }
  u.hash="";
  return u;
}
function decodeHTML(value) {
  const named={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" ",ndash:"–",mdash:"—",hellip:"…"};
  return String(value ?? "").replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);/gi, (_, entity) => {
    if(entity[0] !== "#") return named[entity.toLowerCase()] ?? "&" + entity + ";";
    const hex=entity[1].toLowerCase() === "x";
    const code=parseInt(entity.slice(hex?2:1),hex?16:10);
    return code>0 && code<=0x10ffff ? String.fromCodePoint(code) : "";
  });
}
function plain(v) {
  return clean(decodeHTML(String(v ?? "").replace(/<(script|style|noscript|svg|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi," ").replace(/<\s*br\s*\/?\s*>/gi," ").replace(/<[^>]*>/g," ")));
}
function extractJSON(data,url) {
  const root=Array.isArray(data) ? data : (data?.data ?? data?.items ?? data?.results ?? data?.products ?? data);
  const list=Array.isArray(root) ? root.slice(0,MAX_ROWS) : [root];
  const rows=list.map(x => x && typeof x==="object" && !Array.isArray(x) ? x : {value:x});
  const columns=[...new Set(rows.flatMap(x => Object.keys(x || {})))].slice(0,24);
  return {url,title:new URL(url).hostname,kind:"JSON API",columns,rows,links:[],rowCount:rows.length};
}
function extractHTML(html,url) {
  const title=plain((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [,""])[1]) || new URL(url).hostname;
  const desc=plain((html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)/i)||[,""])[1]);
  const links=[], seen=new Set();
  const anchors=/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  let a;
  while ((a=anchors.exec(html)) && links.length < 60) {
    const href=(a[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)||[,""])[1];
    if(!href)continue;
    try {
      const u=new URL(decodeHTML(href),url);
      if(!["https:","http:"].includes(u.protocol))continue;
      u.hash="";
      if(!seen.has(u.href)){ seen.add(u.href);links.push({url:u.href,text:plain(a[2]).slice(0,120)}); }
    } catch {}
  }
  let best=[];
  for(const match of html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table\s*>/gi)) {
    const rows=[...match[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr\s*>/gi)].slice(0,MAX_ROWS+1)
      .map(m=>[...m[1].matchAll(/<(td|th)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi)].map(cell=>plain(cell[2]).slice(0,2000))).filter(x=>x.length>=2);
    if(rows.length>best.length)best=rows;
  }
  if(best.length>=2) {
    const columns=best[0].slice(0,24).map((c,i)=>(c || "Cột " + (i+1)).slice(0,100));
    const unique=columns.map((c,i)=>columns.indexOf(c)===i?c:c+" #"+(i+1));
    const rows=best.slice(1,MAX_ROWS+1).map(cells=>Object.fromEntries(unique.map((c,i)=>[c,cells[i] || ""])));
    return {url,title,kind:"HTML Table",columns:unique,rows,links,rowCount:rows.length};
  }
  const columns=["Tiêu đề","Mô tả","Nội dung","URL","Số liên kết"];
  const rows=[{"Tiêu đề":title,"Mô tả":desc,"Nội dung":plain(html).slice(0,6000),"URL":url,"Số liên kết":links.length}];
  return {url,title,kind:"HTML Text",columns,rows,links,rowCount:rows.length};
}
async function fetchPublic(input, hosts) {
  let u=safeURL(input,hosts);
  for(let i=0;i<4;i++){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
    let res;
    try {
      res=await fetch(u.href,{redirect:"manual",signal:controller.signal,headers:{"Accept":"text/html,application/json;q=0.9,*/*;q=0.5","User-Agent":"LuanCrawlerDashboard/1.0"}});
    } finally {clearTimeout(timer);}
    if([301,302,303,307,308].includes(res.status)){
      const location=res.headers.get("location");
      if(!location)throw new Error("Chuyển hướng không hợp lệ.");
      u=safeURL(new URL(location,u).href,hosts);
      continue;
    }
    if(!res.ok)throw new Error("Website trả về HTTP "+res.status+".");
    if(Number(res.headers.get("content-length")||0)>MAX_BYTES)throw new Error("Trang lớn hơn 1,5 MB.");
    const ct=res.headers.get("content-type")||"";
    if(!/html|json|text\/plain/i.test(ct))throw new Error("Chỉ hỗ trợ HTML hoặc JSON.");
    if(!res.body)throw new Error("Phản hồi không có dữ liệu.");
    const reader=res.body.getReader(),parts=[];let n=0;
    try {
      for(;;){const p=await reader.read();if(p.done)break;n+=p.value.byteLength;if(n>MAX_BYTES)throw new Error("Nội dung quá 1,5 MB.");parts.push(p.value);}
    }finally{try{await reader.cancel();}catch{}}
    const bytes=new Uint8Array(n);let start=0;
    for(const part of parts){bytes.set(part,start);start+=part.length;}
    const body=new TextDecoder().decode(bytes);
    let data=null;
    if(/json/i.test(ct)||/^\s*[\[{]/.test(body)){try{data=extractJSON(JSON.parse(body),u.href);}catch(e){if(/json/i.test(ct))throw new Error("JSON không hợp lệ.");}}
    const out=data||extractHTML(body,u.href);
    return {...out,fetchedAt:new Date().toISOString()};
  }
  throw new Error("Website chuyển hướng quá nhiều lần.");
}
function excelValue(v) {
  if(v==null)return "";
  if(typeof v==="object")v=JSON.stringify(v);
  if(typeof v!=="string")return v;
  const s=v.slice(0,32000);
  return /^\s*[=+@\-\t\r]/.test(s)?"'"+s:s;
}
async function makeExcel(sources,special) {
  if(!Array.isArray(sources)||sources.length<1||sources.length>MAX_SOURCES)throw new Error("Chỉ xuất 1–12 nguồn mỗi lần.");
  const book=XLSX.utils.book_new(),summary=[["Nguồn","URL","Số bản ghi"]];
  for(let i=0;i<sources.length;i++) {
    const source=sources[i]||{};
    let rows=Array.isArray(source.rows)?source.rows.slice(0,MAX_ROWS):[];
    if(source.projectId && special?.loadUnits)rows=await special.loadUnits(String(source.projectId));
    const keys=(Array.isArray(source.columns)&&source.columns.length?source.columns:Object.keys(rows[0]||{})).slice(0,24).map(String);
    const data=[keys.map(excelValue),...rows.map(row=>keys.map(key=>excelValue(row?.[key])))];
    const sheet=XLSX.utils.aoa_to_sheet(data);
    sheet["!cols"]=keys.map(()=>({wch:22}));
    if(rows.length && keys.length)sheet["!autofilter"]={ref:XLSX.utils.encode_range({s:{r:0,c:0},e:{r:data.length-1,c:keys.length-1}})};
    XLSX.utils.book_append_sheet(book,sheet,"Nguon_"+(i+1));
    summary.push([excelValue(source.title||"Nguồn "+(i+1)),excelValue(source.url),rows.length]);
  }
  XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet(summary),"Tong_quan");
  return XLSX.write(book,{type:"array",bookType:"xlsx"});
}
export async function handleDashboardApi(request,env={},special={}) {
  const pathname=new URL(request.url).pathname;
  if(!pathname.startsWith("/api/dashboard/"))return null;
  if(pathname==="/api/dashboard/status" && request.method==="GET")return json({ready:true,requiresToken:!!env.DASHBOARD_TOKEN,allowedHosts:allowedHosts(env)});
  if(env?.DASHBOARD_TOKEN && request.headers.get("Authorization")!=="Bearer "+env.DASHBOARD_TOKEN)return error("Không có quyền truy cập. Nhập mã trong Cài đặt truy cập.",401);
  if(request.method!=="POST")return error("Method not allowed.",405);
  let payload;
  try{payload=await request.json();}catch{return error("JSON không hợp lệ.");}
  if(pathname==="/api/dashboard/crawl"){
    try{
      const u=safeURL(payload?.url,allowedHosts(env));
      const match=/^(?:www\.)?vhub\.com\.vn$/.test(u.hostname)&&u.pathname.match(/^\/du-an\/([^/]+)\/bang-hang\/?$/);
      if(match && special?.resolveProject && special?.loadUnits) {
        const project=await special.resolveProject(decodeURIComponent(match[1]));
        const units=await special.loadUnits(project.id),rows=units.slice(0,MAX_ROWS);
        return json({url:u.href,title:project.name,kind:"Vhub API · Quỹ căn",rows,columns:Object.keys(rows[0]||{}),projectId:project.id,rowCount:units.length,limited:units.length>MAX_ROWS,fetchedAt:new Date().toISOString(),links:[]});
      }
      return json(await fetchPublic(u.href,allowedHosts(env)));
    }catch(e){return error(e.message||String(e),422);}
  }
  if(pathname==="/api/dashboard/export"){
    try{
      const bytes=await makeExcel(payload?.sources,special);
      return new Response(bytes,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":'attachment; filename="LUAN_CRAWLER.xlsx"',"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
    }catch(e){return error(e.message||String(e),422);}
  }
  return error("API không tồn tại.",404);
}
