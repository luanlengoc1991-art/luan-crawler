// MCP server (Streamable HTTP, stateless JSON responses) for real-estate sales tables.
import * as XLSX from "xlsx";
import { dashboardPage } from "./dashboard-ui.js";
import { handleDashboardApi } from "./dashboard-api.js";

const API = "https://api.vhub.com.vn";
const DEFAULT_PROJECT = "vinhomes-global-gate-ha-long";
const CACHE_TTL_MS = 5 * 60 * 1000;
const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];
const SERVER_INFO = { name: "luan-bang-hang", version: "1.0.0" };

// ---------- data access ----------

const cache = new Map();

async function cached(key, loader) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value;
  const value = await loader();
  cache.set(key, { at: Date.now(), value });
  return value;
}

async function getJson(path) {
  const res = await fetch(API + path, { headers: { "User-Agent": "luan-mcp/1.0", Accept: "application/json" } });
  if (!res.ok) throw new Error(`Data API ${res.status} for ${path}`);
  return res.json();
}

function listProjects() {
  return cached("projects", async () => {
    const r = await getJson("/tours/published?limit=200");
    return (r.data || []).map((t) => ({
      id: t.id,
      name: t.title || t.name,
      status: t.status,
      totalUnits: t.productCount ?? null,
      availableUnits: t.availableCount ?? null,
      address: t.uiSettings?.address ?? null,
      investor: t.investor ?? null,
    }));
  });
}

async function resolveProject(input) {
  const q = norm(input || DEFAULT_PROJECT);
  const projects = await listProjects();
  const found =
    projects.find((p) => norm(p.id) === q) ||
    projects.find((p) => norm(p.name) === q) ||
    projects.find((p) => norm(p.id).includes(q) || norm(p.name).includes(q));
  if (!found) throw new Error(`Không tìm thấy dự án "${input}". Dùng tool list_projects để xem danh sách.`);
  return found;
}

function loadUnits(projectId) {
  return cached("units:" + projectId, async () => {
    const all = [];
    for (let page = 1; page <= 50; page++) {
      const r = await getJson(`/products/published?projectId=${encodeURIComponent(projectId)}&page=${page}&limit=200`);
      all.push(...(r.data || []));
      if (!r.data?.length || !r.meta?.hasNextPage) break;
    }
    return all.map(toUnit);
  });
}

const num = (v) => {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) && n !== 0 ? n : null;
};
const txt = (v) => (v == null ? null : String(v).trim() || null);

function toUnit(x) {
  return {
    code: txt(x.productCode),
    subdivision: txt(x.subdivisionName),
    type: txt(x.apartmentTypeName),
    direction: txt(x.baseDirectionName),
    landArea: num(x.landArea),
    constructionArea: num(x.constructionArea),
    priceFull: num(x.totalPrice ?? x.pricePainInFull),
    priceEarlyPayment: num(x.earlyPaymentPrice),
    priceProgress: num(x.progressPaymentPrice ?? x.priceTttd),
    priceLoan: num(x.loanPrice ?? x.priceAboard),
    pricePerSqm: num(x.pricePerMeter ?? x.pricePerSqm),
    priceBeforeVat: num(x.priceBeforeVat),
    vat: num(x.vatAmount),
    maintenanceFee: num(x.maintenanceFeeAmount ?? x.kpbt),
    landTotal: num(x.landTotal),
    constructionTotal: num(x.constructionTotal),
    handover: txt(x.deliveryStandards),
    fund: txt(x.fundGroupsSellName),
    policy: txt(x.policyCode),
    banks: txt(x.supportingBanks),
    gift: txt(x.gift),
    description: txt(x.xSaleDescription),
    status: txt(x.stateLineName) || (x.stateLine === "available" ? "Còn hàng" : txt(x.stateLine)),
    updatedAt: txt(x.updatedAt),
  };
}

// ---------- filtering ----------

function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9.]/g, "");
}

const collator = new Intl.Collator("vi", { numeric: true });
const TY = 1e9;

function filterUnits(units, a = {}) {
  const has = (field, q) => !q || norm(field).includes(norm(q));
  let out = units.filter(
    (u) =>
      has(u.code, a.code) &&
      has(u.subdivision, a.subdivision) &&
      has(u.type, a.type) &&
      has(u.direction, a.direction) &&
      has(u.handover, a.handover) &&
      (a.min_price_ty == null || (u.priceFull ?? 0) >= a.min_price_ty * TY) &&
      (a.max_price_ty == null || (u.priceFull != null && u.priceFull <= a.max_price_ty * TY)) &&
      (a.min_land == null || (u.landArea ?? 0) >= a.min_land) &&
      (a.max_land == null || (u.landArea != null && u.landArea <= a.max_land)),
  );
  const by = {
    price_asc: (p, q) => (p.priceFull ?? Infinity) - (q.priceFull ?? Infinity),
    price_desc: (p, q) => (q.priceFull ?? -1) - (p.priceFull ?? -1),
    land_asc: (p, q) => (p.landArea ?? Infinity) - (q.landArea ?? Infinity),
    land_desc: (p, q) => (q.landArea ?? -1) - (p.landArea ?? -1),
    price_per_sqm_asc: (p, q) => (p.pricePerSqm ?? Infinity) - (q.pricePerSqm ?? Infinity),
    code: (p, q) => collator.compare(p.subdivision ?? "", q.subdivision ?? "") || collator.compare(p.code ?? "", q.code ?? ""),
  };
  return out.sort(by[a.sort] || by.code);
}

const ty = (v) => (v == null ? null : `${(v / TY).toLocaleString("vi-VN", { maximumFractionDigits: 3 })} tỷ`);

function summarize(units) {
  const prices = units.map((u) => u.priceFull).filter((v) => v != null).sort((p, q) => p - q);
  const group = (key) => {
    const m = {};
    for (const u of units) m[u[key] || "(trống)"] = (m[u[key] || "(trống)"] || 0) + 1;
    return Object.fromEntries(Object.entries(m).sort((p, q) => q[1] - p[1]));
  };
  return {
    units: units.length,
    priceFull: prices.length
      ? { min: ty(prices[0]), median: ty(prices[Math.floor(prices.length / 2)]), max: ty(prices.at(-1)) }
      : null,
    byType: group("type"),
    bySubdivision: group("subdivision"),
    byDirection: group("direction"),
    byHandover: group("handover"),
  };
}

// ---------- excel ----------

const COLUMNS = [
  ["Mã căn", "code"], ["Phân khu", "subdivision"], ["Loại hình", "type"], ["Hướng", "direction"],
  ["DT đất (m²)", "landArea"], ["DT xây dựng (m²)", "constructionArea"],
  ["Giá Full (VNĐ)", "priceFull"], ["Giá TT sớm (VNĐ)", "priceEarlyPayment"], ["Giá TT tiến độ (VNĐ)", "priceProgress"],
  ["Giá vay (VNĐ)", "priceLoan"], ["Đơn giá (VNĐ/m²)", "pricePerSqm"], ["Giá trước VAT", "priceBeforeVat"], ["VAT", "vat"],
  ["Phí bảo trì", "maintenanceFee"], ["Tiền đất", "landTotal"], ["Tiền xây dựng", "constructionTotal"],
  ["Tiêu chuẩn bàn giao", "handover"], ["Quỹ hàng", "fund"], ["Chính sách", "policy"], ["Ngân hàng", "banks"],
  ["Quà tặng", "gift"], ["Mô tả", "description"], ["Trạng thái", "status"], ["Cập nhật", "updatedAt"],
];

function buildXlsx(units, projectName) {
  const rows = [["STT", ...COLUMNS.map((c) => c[0])], ...units.map((u, i) => [i + 1, ...COLUMNS.map((c) => u[c[1]] ?? "")])];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 6 }, ...COLUMNS.map((c) => ({ wch: /Giá|Tiền|VAT|phí/i.test(c[0]) ? 17 : c[0] === "Quà tặng" || c[0] === "Mô tả" ? 30 : 14 }))];
  ws["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length - 1, c: COLUMNS.length } }) };
  for (let r = 1; r < rows.length; r++)
    for (let c = 5; c <= 16; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      if (cell && cell.t === "n") cell.z = c <= 6 ? "#,##0.0" : "#,##0";
    }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bảng hàng");
  wb.Props = { Title: `Bảng hàng ${projectName}` };
  return XLSX.write(wb, { type: "array", bookType: "xlsx" });
}

// ---------- MCP tools ----------

const FILTER_PROPS = {
  project: { type: "string", description: `Mã hoặc tên dự án (mặc định ${DEFAULT_PROJECT}). Xem list_projects.` },
  code: { type: "string", description: "Mã căn, khớp một phần (vd: 'NĐ11', 'VBM1-05')." },
  subdivision: { type: "string", description: "Phân khu, khớp một phần, không phân biệt dấu (vd: 'binh minh', 'TĐNĐ 1.2')." },
  type: { type: "string", description: "Loại hình (vd: 'liền kề', 'song lập', 'đơn lập', 'góc')." },
  direction: { type: "string", description: "Hướng (vd: 'Đông Nam')." },
  handover: { type: "string", description: "Tiêu chuẩn bàn giao (vd: 'thô', 'hoàn thiện', 'giãn xây')." },
  min_price_ty: { type: "number", description: "Giá Full tối thiểu, đơn vị tỷ VNĐ." },
  max_price_ty: { type: "number", description: "Giá Full tối đa, đơn vị tỷ VNĐ." },
  min_land: { type: "number", description: "Diện tích đất tối thiểu (m²)." },
  max_land: { type: "number", description: "Diện tích đất tối đa (m²)." },
  sort: { type: "string", enum: ["code", "price_asc", "price_desc", "land_asc", "land_desc", "price_per_sqm_asc"], description: "Sắp xếp (mặc định theo phân khu + mã căn)." },
};

const TOOLS = [
  {
    name: "list_projects",
    description: "Danh sách các dự án đang có bảng hàng, kèm số căn tổng và số căn còn hàng.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: "search_units",
    description: "Tìm căn trong bảng hàng một dự án theo mã căn, phân khu, loại hình, hướng, khoảng giá, diện tích. Trả về mã căn và đầy đủ các loại giá (VNĐ).",
    inputSchema: {
      type: "object",
      properties: {
        ...FILTER_PROPS,
        limit: { type: "integer", description: "Số căn tối đa trả về (mặc định 50, tối đa 500).", minimum: 1, maximum: 500 },
        offset: { type: "integer", description: "Bỏ qua bao nhiêu căn đầu (phân trang).", minimum: 0 },
      },
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: "get_unit",
    description: "Chi tiết đầy đủ của một căn theo mã căn chính xác (giá, chính sách, quà tặng, ngân hàng...).",
    inputSchema: { type: "object", properties: { project: FILTER_PROPS.project, code: { type: "string", description: "Mã căn chính xác, vd 'NĐ11-41'." } }, required: ["code"] },
    annotations: { readOnlyHint: true },
  },
  {
    name: "project_summary",
    description: "Thống kê bảng hàng một dự án: số căn còn hàng, giá thấp/trung vị/cao nhất, số căn theo loại hình, phân khu, hướng, bàn giao.",
    inputSchema: { type: "object", properties: { project: FILTER_PROPS.project } },
    annotations: { readOnlyHint: true },
  },
  {
    name: "export_excel",
    description: "Tạo link tải file Excel (.xlsx) bảng hàng với các bộ lọc tùy chọn. Dữ liệu được lấy mới tại thời điểm tải.",
    inputSchema: { type: "object", properties: FILTER_PROPS },
    annotations: { readOnlyHint: true },
  },
];

const FILTER_KEYS = Object.keys(FILTER_PROPS);

async function callTool(name, args, origin) {
  args = args || {};
  if (name === "list_projects") return listProjects();

  const project = await resolveProject(args.project);
  const units = await loadUnits(project.id);
  const head = { project: project.id, projectName: project.name };

  if (name === "search_units") {
    const matched = filterUnits(units, args);
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 500);
    const offset = Math.max(args.offset ?? 0, 0);
    const page = matched.slice(offset, offset + limit).map((u) => ({
      code: u.code, subdivision: u.subdivision, type: u.type, direction: u.direction,
      landArea: u.landArea, constructionArea: u.constructionArea,
      priceFull: u.priceFull, priceEarlyPayment: u.priceEarlyPayment, priceProgress: u.priceProgress,
      priceLoan: u.priceLoan, pricePerSqm: u.pricePerSqm, handover: u.handover, policy: u.policy,
    }));
    return { ...head, totalMatched: matched.length, offset, returned: page.length, units: page };
  }
  if (name === "get_unit") {
    const u = units.find((x) => norm(x.code) === norm(args.code));
    if (!u) throw new Error(`Không có căn "${args.code}" trong bảng hàng ${project.name} (có thể đã bán).`);
    return { ...head, unit: u, priceFullText: ty(u.priceFull) };
  }
  if (name === "project_summary") {
    return { ...head, totalUnits: project.totalUnits, ...summarize(units) };
  }
  if (name === "export_excel") {
    const qs = new URLSearchParams({ project: project.id });
    for (const k of FILTER_KEYS) if (k !== "project" && args[k] != null && args[k] !== "") qs.set(k, String(args[k]));
    const count = filterUnits(units, args).length;
    return { ...head, units: count, downloadUrl: `${origin}/export.xlsx?${qs}` };
  }
  throw new RpcError(-32602, `Unknown tool: ${name}`);
}

// ---------- JSON-RPC / HTTP ----------

class RpcError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

async function handleRpc(msg, origin) {
  const { id, method, params } = msg || {};
  if (method === "initialize") {
    const requested = params?.protocolVersion;
    return {
      protocolVersion: PROTOCOL_VERSIONS.includes(requested) ? requested : PROTOCOL_VERSIONS[0],
      capabilities: { tools: { listChanged: false } },
      serverInfo: SERVER_INFO,
      instructions:
        "Tra cứu bảng hàng (mã căn và giá) các dự án bất động sản. Giá trả về là VNĐ. Dùng search_units để lọc, get_unit để xem chi tiết, export_excel để lấy link tải Excel.",
    };
  }
  if (method === "ping") return {};
  if (method === "tools/list") return { tools: TOOLS };
  if (method === "tools/call") {
    try {
      const data = await callTool(params?.name, params?.arguments, origin);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 1) }], structuredContent: Array.isArray(data) ? { items: data } : data };
    } catch (e) {
      if (e instanceof RpcError) throw e;
      return { content: [{ type: "text", text: `Lỗi: ${e.message}` }], isError: true };
    }
  }
  throw new RpcError(-32601, `Method not found: ${method}`);
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Authorization",
  "Access-Control-Expose-Headers": "Mcp-Session-Id",
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...CORS } });

async function handleMcp(request, origin) {
  if (request.method === "GET") return new Response("Server không hỗ trợ SSE stream; dùng POST.", { status: 405, headers: { Allow: "POST", ...CORS } });
  if (request.method === "DELETE") return new Response(null, { status: 204, headers: CORS });
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400);
  }
  const batch = Array.isArray(body);
  const msgs = batch ? body : [body];
  const responses = [];
  for (const m of msgs) {
    if (m?.id === undefined || m?.id === null) continue; // notifications / responses
    try {
      responses.push({ jsonrpc: "2.0", id: m.id, result: await handleRpc(m, origin) });
    } catch (e) {
      responses.push({ jsonrpc: "2.0", id: m.id, error: { code: e.code ?? -32603, message: e.message } });
    }
  }
  if (!responses.length) return new Response(null, { status: 202, headers: CORS });
  return json(batch ? responses : responses[0]);
}

async function handleExport(url) {
  const p = Object.fromEntries(url.searchParams);
  for (const k of ["min_price_ty", "max_price_ty", "min_land", "max_land"]) if (p[k] != null) p[k] = Number(p[k]);
  const project = await resolveProject(p.project);
  const units = filterUnits(await loadUnits(project.id), p);
  const date = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  const file = `BangHang_${project.id}_${date}.xlsx`;
  return new Response(buildXlsx(units, project.name), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${file}"`,
      "Cache-Control": "no-store",
      ...CORS,
    },
  });
}

function homePage(origin) {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Luan MCP</title><style>body{font:16px/1.6 system-ui,sans-serif;max-width:720px;margin:40px auto;padding:0 16px;background:#fff;color:#222}
code{background:#f2f2f2;padding:2px 6px;border-radius:4px;word-break:break-all}@media(prefers-color-scheme:dark){body{background:#111;color:#eee}code{background:#222}}</style></head>
<body><h1>Luan bảng hàng – MCP server</h1>
<p>MCP endpoint (Streamable HTTP): <code>${origin}/mcp</code></p>
<p>Tools: list_projects, search_units, get_unit, project_summary, export_excel.</p>
<p>Tải nhanh Excel Global Gate Hạ Long: <a href="${origin}/export.xlsx?project=${DEFAULT_PROJECT}">export.xlsx</a></p></body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    try {
      const dashboardResponse = await handleDashboardApi(request, env, { resolveProject, loadUnits });
      if (dashboardResponse) return dashboardResponse;
      if (url.pathname === "/mcp") return await handleMcp(request, url.origin);
      if (url.pathname === "/export.xlsx") return await handleExport(url);
      if (url.pathname === "/") return new Response(dashboardPage(), { headers: { "Content-Type": "text/html; charset=utf-8" } });
      return new Response("Not found", { status: 404 });
    } catch (e) {
      return new Response(`Lỗi: ${e.message}`, { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS } });
    }
  },
};
