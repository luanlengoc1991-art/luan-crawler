/** LUAN CRAWLER — watchlist dashboard UI for Cloudflare Workers (LUAN GROUP emerald style). */
export function dashboardPage() {
  return String.raw`<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#03261d">
<meta name="description" content="LUAN CRAWLER — Theo dõi giỏ hàng, bảng giá từ nhiều website. Tự cập nhật mỗi 60 phút, báo đỏ khi có thay đổi, xuất Excel và tích hợp MCP.">
<title>LUAN CRAWLER | Theo dõi dữ liệu — LUAN GROUP</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--deep:#03261d;--deep-2:#064533;--em:#059669;--em-2:#047857;--mint:#8ef0c4;--mint-2:#5fe0a8;--ink:#0a1f19;--text:#4b5a55;--muted:#7b8a85;--line:#e2ece8;--soft:#f3f8f6;--bad:#c2410c;--r:24px;--r-lg:32px;--wrap:1320px;--ease:cubic-bezier(.2,.8,.2,1);--grad:linear-gradient(120deg,var(--mint),var(--mint-2));--sheet:linear-gradient(170deg,#ffffff,#effaf5 48%,#e5f3fb)}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:110px}
body{margin:0;font-family:'Be Vietnam Pro',Arial,Helvetica,sans-serif;background:#fff;color:var(--ink);font-size:15px;line-height:1.65;-webkit-font-smoothing:antialiased}
button,input,textarea,select{font:inherit;color:inherit}button{cursor:pointer}button:disabled{opacity:.45;cursor:not-allowed}a{color:inherit;text-decoration:none}::selection{background:var(--mint);color:var(--deep)}
.wrap{width:min(var(--wrap),calc(100% - 80px));margin-inline:auto}

/* header: floating glass pill over the dark hero, solid white once scrolled */
.site-header{position:fixed;inset:22px 32px auto;height:70px;z-index:40;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:background .35s,box-shadow .35s,border-color .35s,color .35s;color:#fff}
.is-scrolled .site-header,.site-header:hover{background:rgba(255,255,255,.94);border-color:#fff;box-shadow:0 18px 40px -22px rgba(2,38,29,.35);color:var(--ink)}
.header-inner{height:100%;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 10px 0 26px}
.brand{display:flex;align-items:center;gap:12px;flex-shrink:0}
.brand-mark{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--grad);color:var(--deep);font-weight:800;font-size:20px;letter-spacing:-.04em}
.brand-text{display:flex;flex-direction:column;line-height:1.15}.brand-text strong{font-weight:800;font-size:17px;letter-spacing:.06em}.brand-text small{font-size:9px;letter-spacing:.24em;font-weight:600;opacity:.7;margin-top:3px}
.nav{display:flex;align-items:center;gap:4px}
.nav a{position:relative;font-weight:500;font-size:14.5px;letter-spacing:-.01em;padding:10px 16px;white-space:nowrap;opacity:.92}
.nav a:before{content:"";position:absolute;left:16px;right:16px;bottom:5px;height:2px;border-radius:2px;background:var(--mint-2);transform:scaleX(0);transform-origin:left;transition:transform .35s var(--ease)}
.nav a:hover:before,.nav a.active:before{transform:scaleX(1)}
.head-actions{display:flex;align-items:center;gap:10px}
.header-link{font-size:13.5px;font-weight:500;opacity:.85;white-space:nowrap;padding:0 8px}
.mobile-menu{display:none;width:46px;height:46px;border-radius:999px;border:1px solid currentColor;background:transparent;font-size:20px;opacity:.85}

/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;height:50px;padding:0 24px;border-radius:999px;border:1px solid transparent;font-weight:600;font-size:14px;white-space:nowrap;transition:transform .35s var(--ease),box-shadow .3s,background .3s,border-color .3s}
.btn:hover:not(:disabled){transform:translateY(-2px)}
.btn-mint,.btn-green{background:var(--grad);color:var(--deep);font-weight:700}.btn-mint:hover,.btn-green:hover{box-shadow:0 14px 28px -14px rgba(5,150,105,.7)}
.btn-dark{background:linear-gradient(120deg,var(--em-2),var(--em));color:#fff;box-shadow:0 14px 30px -14px rgba(4,120,87,.6)}.btn-dark:hover{background:linear-gradient(120deg,#065f46,var(--em-2))}
.btn-outline{background:#fff;border-color:var(--line);color:var(--ink)}.btn-outline:hover{border-color:var(--mint-2);background:var(--soft)}
.btn-white{background:#fff;color:var(--ink);box-shadow:0 10px 30px -14px rgba(0,0,0,.35)}
.btn-ghost{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.3);color:#fff}.btn-ghost:hover{background:rgba(255,255,255,.16)}
.btn-arrow{height:56px;padding:0 6px 0 24px;gap:14px;font-size:14.5px}
.btn-arrow i{width:44px;height:44px;border-radius:999px;display:grid;place-items:center;font-style:normal;font-size:17px;background:var(--deep);color:var(--mint)}
.btn-white.btn-arrow i{background:var(--grad);color:var(--deep)}
.header-cta{height:50px}

/* eyebrow pill + headings */
.eyebrow{display:inline-flex;align-items:center;gap:8px;height:30px;padding:0 14px 0 12px;border:1px solid var(--mint-2);border-radius:999px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--ink);background:#fff}
.eyebrow:before{content:"";width:7px;height:7px;border-radius:50%;background:var(--grad)}
.on-dark .eyebrow{background:rgba(255,255,255,.08);color:#e9fff5;border-color:rgba(142,240,196,.45)}
.h2{font-size:clamp(38px,4.6vw,66px);line-height:1.02;letter-spacing:-.05em;font-weight:700;margin:18px 0 0;color:var(--ink)}
.h2 span{background:linear-gradient(120deg,var(--em-2),var(--mint-2));-webkit-background-clip:text;background-clip:text;color:transparent}
.lead{color:var(--text);font-size:16px;max-width:620px;margin:18px 0 0}
.section{padding-block:110px}
.section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin-bottom:44px}
.outline-num{font-size:110px;font-weight:700;line-height:.8;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:1px rgba(5,150,105,.35);user-select:none}

/* hero */
.hero{position:relative;min-height:clamp(720px,100svh,940px);background:var(--deep);color:#fff;overflow:hidden;isolation:isolate;display:flex;margin:10px;border-radius:var(--r-lg)}
.hero:before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(60% 55% at 85% 20%,rgba(95,224,168,.28),transparent 70%),radial-gradient(45% 50% at 10% 90%,rgba(5,150,105,.35),transparent 70%),linear-gradient(160deg,#064533 0%,#03261d 55%,#021a14 100%)}
.hero:after{content:"";position:absolute;right:-180px;top:-160px;width:720px;height:720px;border-radius:50%;border:1px solid rgba(142,240,196,.14);box-shadow:0 0 0 90px rgba(142,240,196,.035),0 0 0 200px rgba(142,240,196,.02);z-index:-1}
.hero-body{position:relative;padding:170px 0 56px;display:flex;flex-direction:column;justify-content:space-between;gap:60px}
.hero h1{font-size:clamp(48px,6.4vw,96px);line-height:.98;letter-spacing:-.055em;font-weight:700;margin:26px 0 0;max-width:980px}
.hero h1 span{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;margin-top:34px}
.hero-statement{font-size:clamp(18px,1.6vw,22px);font-weight:500;line-height:1.5;letter-spacing:-.02em;color:#c3dfd0;max-width:680px;margin:0}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap}
.hero-under{margin:22px 0 0;font-size:13px;color:#9fc5b4;display:flex;gap:18px;flex-wrap:wrap}.hero-under b{color:var(--mint);font-weight:600}
.hero-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.glass{padding:26px 26px 28px;border-radius:var(--r);background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,.05));border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);transition:transform .5s var(--ease),background .4s}
.glass:hover{transform:translateY(-4px);background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.07))}
.stat .heading{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#c3dfd0}
.stat strong{display:block;font-size:52px;line-height:1;font-weight:700;letter-spacing:-.05em;margin:18px 0 10px;color:#fff}
.stat small{font-size:13px;color:#9fc5b4;padding-top:12px;border-top:1px solid rgba(255,255,255,.18);display:block}

/* import */
.import-layout{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(40px,6vw,100px);align-items:start}
.step-list{display:grid;gap:14px;margin-top:40px}
.step-item{display:flex;gap:18px;align-items:flex-start;padding:20px 22px;border-radius:var(--r);background:var(--soft);transition:background .3s}
.step-item:hover{background:#e9f6f0}
.step-item .step-num{flex:none;width:44px;height:44px;border-radius:999px;display:grid;place-items:center;background:var(--grad);color:var(--deep);font-weight:700;font-size:14px}
.step-item strong{display:block;font-size:15.5px;letter-spacing:-.01em}.step-item span{display:block;color:var(--muted);font-size:13.5px;margin-top:2px}
.panel{background:#fff;border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.form-card{padding:34px;border-radius:var(--r-lg);background:var(--sheet);border:1px solid var(--line);box-shadow:0 40px 70px -40px rgba(2,38,29,.25)}
.form-card-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:26px}.form-card-heading strong{font-size:20px;letter-spacing:-.03em}
.tag{display:inline-flex;align-items:center;height:28px;padding:0 12px;border-radius:999px;background:var(--grad);color:var(--deep);font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.label{display:block;font-size:13px;font-weight:600;color:var(--text);margin:0 0 8px 6px}
.textarea,.input,.select,.preview-select{display:block;width:100%;border:1px solid transparent;background:var(--soft);color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s,background .2s}
.form-card .textarea,.form-card .input,.form-card .select{background:#fff;border-color:var(--line)}
.textarea:focus,.input:focus,.select:focus,.preview-select:focus{border-color:var(--mint-2);box-shadow:0 0 0 4px rgba(95,224,168,.22);background:#fff}
.textarea{min-height:180px;padding:18px 22px;border-radius:var(--r);resize:vertical;font-size:14px;line-height:1.8}
.input,.select,.preview-select{height:52px;padding:0 20px;border-radius:999px;font-size:14px;font-weight:500}
.form-help{font-size:13px;color:var(--muted);margin:12px 6px 22px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.button-group{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.button-group .btn{flex:1}
.helper-bar{margin-top:22px;padding:14px 20px;border-radius:18px;background:rgba(255,255,255,.75);border:1px solid var(--line);font-size:13px;color:var(--text)}.helper-bar b{color:var(--em-2)}
.settings{display:none;margin-top:16px;padding:22px 26px;border-radius:var(--r);background:var(--soft)}.settings.open{display:block}.settings .form-row{margin-top:14px}.settings .form-row>div:last-child{display:flex;align-items:flex-end}.settings .form-row .btn{width:100%}
.notice{font-size:13px;color:var(--muted);line-height:1.75}

/* source manager */
.sheet-section{background:var(--sheet);border-radius:var(--r-lg);margin:0 10px}
.manager-toolbar{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:22px}
.toolbar-left{flex:1;max-width:720px;display:flex;gap:12px}
.search-wrap{position:relative;flex:1}.search-wrap:before{content:"⌕";position:absolute;left:18px;top:50%;transform:translateY(-52%);color:var(--muted);font-size:22px;pointer-events:none}.search-wrap .input{padding-left:46px}
.toolbar-actions{display:flex;gap:10px}
.manager-panel{border-radius:var(--r-lg);box-shadow:0 40px 70px -50px rgba(2,38,29,.3)}
.source{display:flex;align-items:center;gap:16px;padding:18px 22px;border-top:1px solid var(--line);transition:background .25s}
.source:hover,.source.active{background:var(--soft)}
.source-icon{flex:none;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:var(--grad);color:var(--deep);font-weight:700}
.source-name{flex:1;min-width:0}.source-name strong{display:block;font-size:15px;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.source-name span{display:block;font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.status-tag{padding:6px 13px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;background:var(--soft);color:var(--muted);white-space:nowrap}
.status-tag.done{background:var(--grad);color:var(--deep)}.status-tag.error{background:#fff1e8;color:var(--bad)}.status-tag.loading{background:#fff8dc;color:#a16207}
.source-btns{display:flex;gap:6px}.source-btns button{width:38px;height:38px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--em-2);font-size:16px;line-height:1;transition:border-color .2s,background .2s}.source-btns button:hover{border-color:var(--mint-2);background:var(--soft)}
.manager-footer{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:16px 22px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}
.connection{display:inline-flex;align-items:center;height:30px;padding:0 14px;border-radius:999px;background:#e7f8ef;color:var(--em-2);font-size:12px;font-weight:700}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:240px;padding:40px 16px;border-top:1px solid var(--line);color:var(--muted)}
.empty .big{width:64px;height:64px;border-radius:999px;display:grid;place-items:center;background:var(--soft);color:var(--em);font-size:26px;margin-bottom:14px}.empty b{font-size:16px;color:var(--ink)}.empty p{margin:4px 0 0;font-size:13.5px}

/* preview */
.preview-top{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:20px 22px;border-bottom:1px solid var(--line)}
.preview-top-left,.preview-top-right{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.preview-select{width:min(340px,100%)}
.pill{display:inline-flex;align-items:center;height:34px;padding:0 14px;border-radius:999px;background:var(--soft);color:var(--em-2);font-size:13px;font-weight:600}
.table-scroll{width:100%;overflow:auto;max-height:540px;min-height:260px}.table-scroll .empty{border-top:0}
.data-table{border-collapse:collapse;width:100%;font-size:13px;white-space:nowrap;text-align:left}
.data-table th{position:sticky;top:0;z-index:1;background:var(--deep);color:#e9fff5;font-weight:600;padding:14px 18px;font-size:12px;letter-spacing:.04em;text-transform:uppercase}
.data-table td{padding:13px 18px;border-bottom:1px solid var(--line);color:var(--text);max-width:260px;overflow:hidden;text-overflow:ellipsis}
.data-table tbody tr:hover{background:var(--soft)}
.preview-meta{display:flex;justify-content:space-between;gap:10px;padding:16px 22px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}

/* sync band */
.band{margin:0 10px;border-radius:var(--r-lg);background:var(--deep);color:#fff;position:relative;overflow:hidden;isolation:isolate}
.band:before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(50% 60% at 90% 0%,rgba(95,224,168,.22),transparent 70%),radial-gradient(40% 50% at 0% 100%,rgba(5,150,105,.3),transparent 70%)}
.band .h2{color:#fff}.band .lead{color:#c3dfd0}.band .outline-num{-webkit-text-stroke:1px rgba(142,240,196,.4)}
.sync-layout{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.sync-card{min-height:260px}.sync-card h3{margin:0 0 6px;font-size:22px;font-weight:700;letter-spacing:-.03em}.sync-card p{margin:0;color:#c3dfd0;font-size:14px}
.sync-card-title{display:flex;align-items:center;justify-content:space-between;gap:10px}
.sync-feature{display:flex;align-items:center;gap:16px;margin:24px 0 16px;padding:18px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12)}
.sync-symbol{flex:none;width:48px;height:48px;border-radius:999px;display:grid;place-items:center;background:var(--grad);color:var(--deep);font-size:22px}
.sync-feature strong{font-size:16px}.sync-feature span{font-size:13px;color:#9fc5b4}
.band .notice{color:#9fc5b4}
.log{max-height:220px;overflow-y:auto;margin-top:18px}
.log-line{display:flex;gap:14px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:13px;color:#d7efe4}.log-line span{min-width:78px;color:var(--mint)}
.band .btn-outline{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.3);color:#fff;height:38px;padding:0 16px;font-size:12.5px}

/* ecosystem (GitHub project tools) */
.eco-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:44px}
.eco-card{position:relative;display:flex;flex-direction:column;gap:12px;min-height:280px;padding:30px;border-radius:var(--r);background:var(--soft);border:1px solid var(--line);transition:transform .5s var(--ease),box-shadow .4s}
.eco-card:hover{transform:translateY(-6px);box-shadow:0 30px 60px -36px rgba(2,38,29,.35)}
.eco-card .num{font-size:13px;font-weight:700;color:var(--em)}
.eco-card h3{margin:0;font-size:24px;line-height:1.15;letter-spacing:-.04em}
.eco-card p{margin:0;color:var(--text);font-size:14px}
.eco-card code{font-family:ui-monospace,Consolas,monospace;font-size:12px;background:#fff;border:1px solid var(--line);border-radius:8px;padding:2px 7px;word-break:break-all}
.eco-card .go{margin-top:auto;display:inline-flex;align-items:center;gap:10px;font-weight:600;font-size:14px;color:var(--em-2)}
.eco-card .go i{width:36px;height:36px;border-radius:999px;display:grid;place-items:center;font-style:normal;background:var(--grad);color:var(--deep)}
.eco-card.feature{background:var(--deep);border-color:var(--deep);color:#fff}.eco-card.feature p{color:#c3dfd0}.eco-card.feature .num,.eco-card.feature .go{color:var(--mint)}.eco-card.feature code{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.18);color:#e9fff5}

/* footer */
.footer{margin:0 10px 10px;border-radius:var(--r-lg);background:var(--deep);color:#fff;padding:64px 0 28px}
.footer-main{display:flex;justify-content:space-between;gap:30px;padding-bottom:40px;border-bottom:1px solid rgba(255,255,255,.12)}
.footer p{color:#9fc5b4;font-size:14px;margin:20px 0 0;max-width:380px}
.footer-nav{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start}.footer-nav a{font-size:14px;color:#c3dfd0}.footer-nav a:hover{color:var(--mint)}
.footer-bottom{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-top:24px;font-size:13px;color:#86a99a}
.session-status{display:flex;gap:8px;align-items:center}.clock{color:var(--mint)}

.toast{position:fixed;right:24px;bottom:24px;z-index:60;max-width:430px;padding:15px 22px;border-radius:18px;background:var(--deep);color:#fff;font-size:14px;box-shadow:0 20px 50px -20px rgba(2,38,29,.6);opacity:0;transform:translateY(16px);pointer-events:none;transition:opacity .25s,transform .25s}.toast.show{opacity:1;transform:none}

@media(max-width:1180px){.header-link{display:none}.nav a{padding:10px 11px;font-size:14px}.hero-cards{grid-template-columns:repeat(2,1fr)}.eco-grid{grid-template-columns:1fr 1fr}.eco-card.feature{grid-column:1/-1}}
@media(max-width:960px){.site-header{inset:14px 14px auto;height:64px}.nav{display:none;position:absolute;top:74px;left:0;right:0;flex-direction:column;align-items:stretch;padding:14px;border-radius:var(--r);background:#fff;color:var(--ink);box-shadow:0 30px 50px -30px rgba(2,38,29,.4)}.nav.open{display:flex}.nav a{padding:12px 16px}.mobile-menu{display:block}.header-cta{display:none}.hero-row,.import-layout,.sync-layout{grid-template-columns:1fr}.section{padding-block:80px}.outline-num{font-size:80px}}
@media(max-width:640px){.wrap{width:calc(100% - 32px)}.hero,.sheet-section,.band,.footer{margin-inline:6px}.hero{border-radius:var(--r)}.hero-body{padding:130px 0 40px}.hero h1{font-size:46px}.hero-cards{gap:10px}.glass{padding:18px}.stat strong{font-size:36px;margin:12px 0 8px}.stat .heading{font-size:10.5px}.btn-arrow{height:52px}.h2{font-size:36px}.section-head{flex-direction:column;align-items:flex-start}.outline-num{display:none}.form-card{padding:22px}.form-row{grid-template-columns:1fr}.button-group .btn{width:100%}.toolbar-left{flex-direction:column;width:100%}.toolbar-left .select{width:100%!important}.toolbar-actions,.toolbar-actions .btn{width:100%}.source{flex-wrap:wrap;gap:10px;padding:16px}.source-name{flex-basis:calc(100% - 62px)}.source-btns{margin-left:auto}.preview-top-left,.preview-top-right,.preview-select{width:100%}.preview-top-right .btn{flex:1}.preview-meta{flex-direction:column}.eco-grid{grid-template-columns:1fr}.footer-main{flex-direction:column}.brand-text small{display:none}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
:root{--red:#e11d48;--red-soft:#fff1f3;--amber:#b45309;--amber-soft:#fff7e6}
/* hero with the setup form as the main element */
.hero{min-height:auto}
.hero-body{padding:150px 0 64px;gap:0}
.hero-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,600px);gap:clamp(32px,4vw,64px);align-items:start}
.hero h1{font-size:clamp(40px,4.6vw,70px)}
.hero-statement{margin-top:22px}
.hero-cards{grid-template-columns:repeat(2,1fr);margin-top:34px}
.stat strong{font-size:44px}
.stat.alert{border-color:rgba(255,120,140,.45);background:linear-gradient(180deg,rgba(225,29,72,.28),rgba(225,29,72,.08))}
.stat.alert strong{color:#ffd1d9}
.stat.calm strong:after{content:" ✓";font-size:.55em;color:var(--mint)}
.setup{position:relative;padding:30px;border-radius:var(--r-lg);background:#fff;color:var(--ink);box-shadow:0 50px 90px -40px rgba(0,0,0,.55),0 0 0 8px rgba(142,240,196,.12)}
.setup:before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(140deg,var(--mint),transparent 40%,transparent 60%,var(--mint-2));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
.setup-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px}
.setup-head strong{font-size:22px;letter-spacing:-.035em}
.setup .textarea{min-height:120px;background:var(--soft);border-color:transparent}
.setup .input,.setup .select{background:var(--soft);border-color:transparent}
.setup .form-row{margin-top:14px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.chip{position:relative;display:inline-flex}.chip input{position:absolute;opacity:0;pointer-events:none}
.chip span{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 15px;border-radius:999px;border:1px solid var(--line);background:#fff;font-size:13px;font-weight:600;color:var(--text);cursor:pointer;transition:.2s}
.chip input:checked+span{background:var(--deep);border-color:var(--deep);color:#e9fff5}
.chip input:checked+span:before{content:"✓";color:var(--mint)}
.chip input:focus-visible+span{box-shadow:0 0 0 4px rgba(95,224,168,.35)}
.setup .button-group{margin-top:20px}
.setup-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-top:16px;font-size:12.5px;color:var(--muted)}
.linkish{border:0;background:none;padding:0;font-size:12.5px;font-weight:600;color:var(--em-2);text-decoration:underline;text-underline-offset:3px}
.hosts{font-size:12.5px;color:var(--muted);margin:10px 6px 0}
.hosts b{color:var(--ink);font-weight:600}
/* status badges */
.badge{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 12px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap}
.badge.red{background:var(--red);color:#fff;box-shadow:0 0 0 0 rgba(225,29,72,.5);animation:pulse 1.8s infinite}
.badge.green{background:#e7f8ef;color:var(--em-2)}
.badge.grey{background:var(--soft);color:var(--muted)}
.badge.amber{background:var(--amber-soft);color:var(--amber)}
.badge.busy{background:#eef6ff;color:#1d4ed8}
.badge.busy:before{content:"";width:10px;height:10px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:spin .8s linear infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(225,29,72,.45)}70%{box-shadow:0 0 0 10px rgba(225,29,72,0)}100%{box-shadow:0 0 0 0 rgba(225,29,72,0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.delta{display:inline-flex;align-items:center;height:24px;padding:0 9px;border-radius:999px;font-size:11.5px;font-weight:700;margin:2px 4px 2px 0}
.delta.add{background:#e7f8ef;color:var(--em-2)}.delta.rem{background:#f1f2f2;color:#57534e}.delta.price{background:var(--red-soft);color:var(--red)}.delta.other{background:var(--amber-soft);color:var(--amber)}
/* watchlist */
.toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:18px 20px;border-bottom:1px solid var(--line)}
.toolbar .search-wrap{flex:1 1 260px}
.toolbar .select{width:auto;min-width:150px;flex:0 1 auto}
.toolbar-right{display:flex;gap:10px;margin-left:auto;flex-wrap:wrap}
.livebar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 22px;background:var(--soft);font-size:13px;color:var(--muted)}
.live-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--em);margin-right:8px;box-shadow:0 0 0 4px rgba(5,150,105,.15)}
.wgrid{display:grid;grid-template-columns:150px minmax(220px,1.6fr) 90px minmax(170px,1.1fr) 150px 150px 214px;align-items:center;gap:14px}
.whead{padding:12px 22px;font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line)}
.wrow{padding:16px 22px;border-bottom:1px solid var(--line);transition:background .2s}
.wrow:hover{background:#fafdfb}.wrow.is-alert{background:linear-gradient(90deg,var(--red-soft),#fff 60%)}.wrow.is-selected{box-shadow:inset 4px 0 0 var(--em)}
.wname{min-width:0}.wname strong{display:block;font-size:15px;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wname a{display:inline-block;max-width:100%;font-size:12.5px;color:var(--em-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom}
.wname a:hover{text-decoration:underline}
.wmeta{font-size:12px;color:var(--muted)}
.tagpill{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;background:var(--soft);color:var(--em-2);font-size:11px;font-weight:700;margin-right:6px}
.wnum{font-size:18px;font-weight:700;letter-spacing:-.03em}
.wtime b{display:block;font-size:13.5px;font-weight:600}.wtime span{font-size:12px;color:var(--muted)}
.mini-select{height:30px;padding:0 10px;border-radius:999px;border:1px solid var(--line);background:#fff;font-size:12px;font-weight:600;margin-top:4px;max-width:100%}
.wact{display:flex;gap:6px;justify-content:flex-end}
.icon-btn{width:36px;height:36px;border-radius:999px;border:1px solid var(--line);background:#fff;color:var(--em-2);font-size:15px;line-height:1;display:grid;place-items:center;transition:.2s}
.icon-btn:hover:not(:disabled){border-color:var(--mint-2);background:var(--soft)}
.icon-btn.danger{color:var(--red)}.icon-btn.ok{background:var(--deep);border-color:var(--deep);color:var(--mint)}
.wlabel{display:none}
/* data view */
.data-head{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center;padding:20px 22px;border-bottom:1px solid var(--line)}
.data-title strong{display:block;font-size:19px;letter-spacing:-.03em}.data-title a{font-size:13px;color:var(--em-2)}
.filters{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px;padding:18px 22px;border-bottom:1px solid var(--line);background:#fcfefd}
.filters .input,.filters .select{height:46px;font-size:13.5px}
.range{display:flex;gap:6px;grid-column:span 2}.range .input{padding:0 14px}
.data-table th{cursor:pointer;user-select:none}.data-table th.sorted:after{content:" ▾";color:var(--mint)}.data-table th.sorted.asc:after{content:" ▴"}
.data-table tr.r-added td{background:#f0fbf5}.data-table tr.r-price td,.data-table tr.r-other td{background:var(--red-soft)}
.data-table tr.r-removed td{color:#a8a29e;text-decoration:line-through;background:#fafaf9}
.data-table td.cell-changed{color:var(--red);font-weight:700}
.data-table td small{display:block;font-size:11px;font-weight:500;color:#9f1239;text-decoration:line-through}
.more{display:flex;justify-content:center;padding:16px}.more[hidden]{display:none}
/* change feed */
.feed{max-height:520px;overflow-y:auto;margin-top:16px}
.feed-item{display:grid;grid-template-columns:86px 1fr;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:13.5px;color:#d7efe4}
.feed-item time{color:var(--mint);font-size:12.5px}
.feed-item b{color:#fff;font-weight:600}
.feed-item .src{display:block;font-size:12px;color:#9fc5b4}
.feed-filter{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.feed-filter button{height:32px;padding:0 13px;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#d7efe4;font-size:12.5px;font-weight:600}
.feed-filter button.on{background:var(--grad);border-color:transparent;color:var(--deep)}
.checks{margin-top:14px;max-height:300px;overflow-y:auto}
.check-line{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.1);font-size:13px;color:#d7efe4}
.check-line span:last-child{color:#9fc5b4;text-align:right}
.how{display:grid;gap:10px;margin-top:18px}
.how div{display:flex;gap:12px;align-items:flex-start;font-size:13.5px;color:#c3dfd0}
.how i{flex:none;width:28px;height:28px;border-radius:999px;display:grid;place-items:center;font-style:normal;font-size:12px;font-weight:700;background:var(--grad);color:var(--deep)}

/* emphasis pass: watchlist on deep green, data on mint sheet, stronger type */
#watch{margin-top:0}
.band .h2 span{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
#watch .manager-panel{box-shadow:0 50px 90px -40px rgba(0,0,0,.6),0 0 0 6px rgba(142,240,196,.14)}
#watch .toolbar{background:#fff}
#watch .livebar{background:#e7f8ef;color:var(--ink);font-weight:500}
.whead{background:var(--deep);color:var(--mint);font-size:12px;border-bottom:0}
.wrow{border-left:5px solid transparent;color:var(--ink)}
.wrow.is-calm{border-left-color:var(--em)}
.wrow.is-alert{border-left-color:var(--red);background:linear-gradient(90deg,#ffe4e9,#fff 70%)}
.wrow.is-error{border-left-color:var(--amber)}
.wrow.is-selected{box-shadow:inset 0 0 0 2px var(--mint-2)}
.wname strong{font-size:16.5px;font-weight:700;color:var(--deep)}
.wname a{font-size:13px;font-weight:600}
.wmeta{color:#52635d}
.wnum{font-size:24px;font-weight:800;color:var(--deep)}
.wtime b{font-size:15.5px;font-weight:700;color:var(--ink)}
.wtime span{color:#52635d}
.badge{height:32px;font-size:12.5px}
.badge.green{background:var(--em);color:#fff;box-shadow:0 8px 18px -10px rgba(5,150,105,.8)}
.badge.grey{background:#e6ece9;color:#3f4f49}
.delta{height:26px;font-size:12.5px}
.delta.add{background:#d1f5e3;color:#065f46}
.mini-select{border-color:#cfe3da;color:var(--ink)}
.icon-btn{border-color:#cfe3da;color:var(--em-2);font-weight:700}
.data-zone .panel{box-shadow:0 40px 80px -45px rgba(2,38,29,.35);border-color:#cfe3da}
.data-head{background:var(--deep);color:#fff;border-bottom:0}
.data-title strong{font-size:22px;color:#fff}
.data-title a{color:var(--mint);font-weight:600}
.data-title .wmeta{color:#c3dfd0}
.data-head .preview-select{background:#fff}
.data-head .btn-outline{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.35);color:#fff}
.data-head .btn-dark{background:var(--grad);color:var(--deep);box-shadow:none}
.filters{background:#e7f8ef;border-bottom:1px solid #cfe3da}
.filters .input,.filters .select{background:#fff;border-color:#cfe3da;color:var(--ink)}
.data-zone .livebar{background:#f3faf6;color:var(--ink);font-weight:500;border-bottom:1px solid #cfe3da}
.data-table{font-size:14px}
.data-table th{background:var(--deep-2);color:var(--mint);font-size:12.5px;padding:15px 18px}
.data-table td{color:var(--ink);font-weight:500;padding:14px 18px}
.data-table tbody tr:nth-child(even) td{background:#f5fbf8}
.data-table tbody tr:hover td{background:#e7f8ef}
.data-table td.key{font-weight:800;color:var(--deep)}
.data-table td.money{font-weight:700;color:var(--em-2)}
.data-table td.cell-changed{color:var(--red)}
.data-table tr.r-price td,.data-table tr.r-other td{background:#ffe4e9!important}
.data-table tr.r-added td{background:#d9f7e8!important}
#watch .toolbar .btn-outline{background:#fff;border-color:#cfe3da;color:var(--ink);height:50px;padding:0 24px;font-size:14px}#watch .toolbar .btn-outline:hover{background:var(--soft);border-color:var(--mint-2)}.data-head .preview-select{width:280px}@media(min-width:1181px){.data-head .preview-top-right{flex-wrap:nowrap}}
.tick{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:999px;background:#d1f5e3;color:var(--em-2);font-weight:800;font-size:12px}

/* ---- effects (luangroup /du-an) ---- */
html,body{overflow-x:clip}
.eyebrow .eb-window{overflow:hidden;max-width:260px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent);mask-image:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.eyebrow .eb-track{display:flex;width:max-content;animation:sz-tick 12s linear infinite}
.eyebrow .eb-track span{padding-right:28px;white-space:nowrap}
@keyframes sz-tick{to{transform:translateX(-50%)}}
.btn-arrow{position:relative;overflow:hidden;isolation:isolate;transition:color .45s var(--ease),transform .35s var(--ease)}
.btn-arrow i{position:relative;background:none!important;transition:transform .45s var(--ease)}
.btn-arrow i:before{content:"";position:absolute;inset:0;border-radius:50%;z-index:-1;background:var(--deep);transition:transform .55s var(--ease)}
.btn-white.btn-arrow i:before{background:var(--grad)}
.btn-arrow:hover i{transform:rotate(45deg)}
.btn-arrow:hover i:before{transform:scale(9)}
.btn-white.btn-arrow:hover{color:var(--deep)}
.glass:hover{transform:translateY(-8px)}
.hero .blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.55;z-index:-1;pointer-events:none;animation:qc-float 14s ease-in-out infinite}
.hero .blob.b1{width:420px;height:420px;right:8%;top:12%;background:#1fbf86}
.hero .blob.b2{width:360px;height:360px;left:-6%;bottom:-10%;background:#0b6b4f;animation-delay:-6s}
@keyframes qc-float{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-30px,24px,0) scale(1.08)}}
.fx-marquee{position:relative;z-index:3;overflow:hidden;padding:20px 0;margin:-34px 0 -26px;background:linear-gradient(90deg,#065f46,#059669 50%,#065f46);color:#fff;transform:rotate(-1.2deg) scale(1.02);box-shadow:0 20px 40px -24px rgba(2,38,29,.5)}
.fx-marquee-track{display:flex;width:max-content;animation:fx-marquee 38s linear infinite}
.fx-marquee:hover .fx-marquee-track{animation-play-state:paused}
.fx-marquee-track span{display:flex;align-items:center;gap:22px;padding-right:22px;font-size:clamp(18px,2vw,26px);font-weight:700;letter-spacing:-.03em;white-space:nowrap}
.fx-marquee-track b{width:12px;height:12px;border-radius:50%;background:var(--mint);flex:none}
@keyframes fx-marquee{to{transform:translateX(-50%)}}
[data-reveal]{opacity:0;transform:translateY(28px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
[data-reveal].is-in{opacity:1;transform:none}
.refresh-bar{position:relative;height:3px;background:#cfe3da;border-radius:3px;overflow:hidden;width:120px;display:inline-block;vertical-align:middle;margin-left:10px}
.refresh-bar i{position:absolute;inset:0;background:linear-gradient(90deg,var(--em),var(--mint-2));transform-origin:0 50%;animation:sz-bar-x 60s linear forwards}
@keyframes sz-bar-x{from{transform:scaleX(0)}to{transform:scaleX(1)}}
/* ---- unit code search ---- */
.hero-search{display:flex;align-items:center;gap:10px;margin-top:28px;padding:8px 8px 8px 22px;border-radius:999px;background:rgba(255,255,255,.1);border:1px solid rgba(142,240,196,.45);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);max-width:640px;box-shadow:0 0 0 6px rgba(142,240,196,.08);transition:box-shadow .3s,border-color .3s}
.hero-search:focus-within{border-color:var(--mint);box-shadow:0 0 0 8px rgba(142,240,196,.18)}
.hero-search .hs-icon{font-size:24px;color:var(--mint);line-height:1}
.hero-search input{flex:1;min-width:0;height:48px;border:0;outline:0;background:transparent;color:#fff;font-size:17px;font-weight:600;letter-spacing:-.01em}
.hero-search input::placeholder{color:#a8cfbf;font-weight:500}
.hs-hint{margin:10px 0 0 22px;font-size:12.5px;color:#9fc5b4}
kbd{display:inline-block;min-width:22px;padding:1px 7px;border-radius:6px;border:1px solid currentColor;font:600 11.5px ui-monospace,Consolas,monospace;opacity:.85}
.fab{position:fixed;right:26px;bottom:26px;z-index:55;display:flex;align-items:center;gap:10px;height:60px;padding:0 24px 0 8px;border:0;border-radius:999px;background:var(--grad);color:var(--deep);font-weight:800;font-size:15px;box-shadow:0 18px 40px -14px rgba(5,150,105,.75);isolation:isolate;transition:transform .35s var(--ease)}
.fab:hover{transform:translateY(-3px)}
.fab .fab-ic{position:relative;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:var(--deep);color:var(--mint);font-size:22px}
.fab .fab-wave{position:absolute;inset:0;border-radius:50%;border:2px solid #34d399;opacity:0;animation:sz-rc-wave 2.8s ease-out infinite;z-index:-1}
.fab .fab-wave.is-2{animation-delay:1.4s}
@keyframes sz-rc-wave{0%{transform:scale(1);opacity:.75}100%{transform:scale(2.2);opacity:0}}
.sx[hidden]{display:none}
.sx{position:fixed;inset:0;z-index:80;display:flex;align-items:flex-start;justify-content:center;padding:9vh 16px 16px}
.sx-backdrop{position:absolute;inset:0;background:rgba(2,26,20,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:sx-fade .25s ease}
.sx-panel{position:relative;width:min(860px,100%);max-height:82vh;display:flex;flex-direction:column;border-radius:var(--r-lg);background:#fff;box-shadow:0 60px 120px -40px rgba(0,0,0,.6);overflow:hidden;animation:sx-up .35s var(--ease)}
@keyframes sx-fade{from{opacity:0}}
@keyframes sx-up{from{opacity:0;transform:translateY(24px) scale(.98)}}
.sx-bar{display:flex;align-items:center;gap:14px;padding:14px 18px 14px 24px;background:var(--deep);color:#fff}
.sx-bar>span{font-size:26px;color:var(--mint)}
.sx-bar input{flex:1;min-width:0;height:56px;border:0;outline:0;background:transparent;color:#fff;font-size:22px;font-weight:700;letter-spacing:-.02em}
.sx-bar input::placeholder{color:#8fb8a7;font-weight:500}
.sx-bar kbd{cursor:pointer;color:#c3dfd0}
.sx-meta{padding:12px 24px;font-size:13px;color:var(--text);background:#e7f8ef;border-bottom:1px solid #cfe3da}
.sx-results{overflow-y:auto}
.sx-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px 20px;align-items:center;padding:18px 24px;border-bottom:1px solid var(--line);transition:background .2s}
.sx-item:hover,.sx-item.is-active{background:#f0fbf5}
.sx-code{font-size:21px;font-weight:800;letter-spacing:-.03em;color:var(--deep)}
.sx-code mark{background:#bff3da;color:inherit;border-radius:4px;padding:0 2px}
.sx-tags{display:inline-flex;gap:6px;margin-left:10px;vertical-align:middle}
.sx-info{font-size:13.5px;color:var(--text);margin-top:4px}
.sx-info b{color:var(--ink);font-weight:600}
.sx-src{font-size:12.5px;color:var(--em-2);font-weight:600;margin-top:2px}
.sx-right{text-align:right}
.sx-price{font-size:22px;font-weight:800;letter-spacing:-.03em;color:var(--em-2)}
.sx-price small{display:block;font-size:12px;font-weight:600;color:var(--muted);letter-spacing:0}
.sx-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}
.sx-actions .btn{height:36px;padding:0 14px;font-size:12.5px}
.sx-empty{padding:46px 24px;text-align:center;color:var(--muted)}
.sx-empty b{display:block;font-size:17px;color:var(--ink);margin-bottom:4px}
@media(max-width:640px){.hero-search{padding-left:16px}.hero-search .btn-arrow{height:48px;padding:0 4px 0 14px;font-size:13px}.hero-search .btn-arrow i{width:40px;height:40px}.fab{right:16px;bottom:16px;height:56px;padding-right:18px}.fab b{display:none}.fab{padding:0 5px}.sx{padding-top:4vh}.sx-bar input{font-size:18px}.sx-item{grid-template-columns:1fr}.sx-right{text-align:left}.sx-actions{justify-content:flex-start}.fx-marquee{margin:-22px 0 -16px}}
@media(prefers-reduced-motion:reduce){.eyebrow .eb-track,.fx-marquee-track,.hero .blob,.fab .fab-wave,.refresh-bar i{animation:none}[data-reveal]{opacity:1;transform:none}}
@media(max-width:1180px){.hero-grid{grid-template-columns:1fr}.setup{max-width:760px}.wgrid{grid-template-columns:140px minmax(200px,1.5fr) 80px minmax(150px,1fr) 140px 200px}.wgrid>.wnext{display:none}.whead .wnext{display:none}}
@media(max-width:900px){.whead{display:none}.wgrid{grid-template-columns:1fr 1fr;gap:10px 14px}.wrow{padding:18px}.wgrid>.wname,.wgrid>.wact,.wgrid>.wchg{grid-column:1/-1}.wgrid>.wnext{display:block}.wact{justify-content:flex-start;flex-wrap:wrap}.wlabel{display:block;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:2px}.toolbar .select{flex:1 1 140px}.toolbar-right{width:100%}.toolbar-right .btn{flex:1}}
@media(max-width:640px){.hero-body{padding:110px 0 36px}.setup{padding:20px}.setup-head strong{font-size:19px}.stat strong{font-size:32px}.feed-item{grid-template-columns:1fr}.filters{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="#top" aria-label="LUAN CRAWLER - về đầu trang"><span class="brand-mark">L</span><span class="brand-text"><strong>LUAN CRAWLER</strong><small>BY LUAN GROUP</small></span></a>
    <nav class="nav" id="primary-nav" aria-label="Điều hướng"><a class="active" href="#top">Thiết lập</a><a href="#watch">Theo dõi</a><a href="#data">Dữ liệu</a><a href="#changes">Thay đổi</a><a href="#ecosystem">MCP &amp; API</a></nav>
    <div class="head-actions"><a class="header-link" href="https://github.com/luanlengoc1991-art/luan-crawler" target="_blank" rel="noopener">GitHub ↗</a><a class="btn btn-mint header-cta" href="#watch" id="header-alert">Bảng theo dõi ↘</a><button class="mobile-menu" id="menu-toggle" aria-label="Mở menu" aria-expanded="false">☰</button></div>
  </div>
</header>
<main>
<section class="hero on-dark" id="top">
  <span class="blob b1" aria-hidden="true"></span><span class="blob b2" aria-hidden="true"></span>
  <div class="wrap hero-body">
    <div class="hero-grid">
      <div>
        <div class="eyebrow"><span class="eb-window"><span class="eb-track"><span>LUAN CRAWLER · Theo dõi giỏ hàng</span><span>Báo đỏ khi có thay đổi</span><span>Tự cập nhật 60 phút</span><span>LUAN CRAWLER · Theo dõi giỏ hàng</span><span>Báo đỏ khi có thay đổi</span><span>Tự cập nhật 60 phút</span></span></span></div>
        <h1>Mọi thay đổi giỏ hàng.<br><span>Biết ngay lập tức.</span></h1>
        <p class="hero-statement">Dán link bảng hàng, hệ thống lưu lại toàn bộ dữ liệu và liên kết với link gốc. Tự kiểm tra lại mỗi 60 phút, kể cả khi bạn tắt máy. Có căn mới, căn đã bán hay đổi giá là báo đỏ; không có gì thay đổi thì tích xanh.</p>
        <form class="hero-search" id="hero-search" role="search"><span class="hs-icon" aria-hidden="true">⌕</span><input id="hero-q" autocomplete="off" placeholder="Tìm nhanh mã căn, VD: NĐ11-41" aria-label="Tìm mã căn"><button class="btn btn-white btn-arrow" type="submit">Tìm mã căn <i>↗</i></button></form>
        <p class="hs-hint">Tìm trong mọi nguồn đang theo dõi · nhấn <kbd>/</kbd> hoặc <kbd>Ctrl K</kbd> ở bất kỳ đâu</p>
        <div class="hero-cards" aria-label="Tổng quan theo dõi">
          <div class="glass stat"><div class="heading">Nguồn đang theo dõi</div><strong id="stat-total">0</strong><small>Link gốc đã lưu</small></div>
          <div class="glass stat" id="stat-alert-card"><div class="heading">Có cập nhật mới</div><strong id="stat-alerts">0</strong><small id="stat-alerts-note">Chưa có thay đổi</small></div>
          <div class="glass stat"><div class="heading">Bản ghi đang lưu</div><strong id="stat-rows">0</strong><small>Căn / dòng dữ liệu</small></div>
          <div class="glass stat"><div class="heading">Lượt kiểm tra tới</div><strong id="stat-next">—</strong><small id="stat-next-note">Tự động mỗi 60 phút</small></div>
        </div>
      </div>
      <form class="setup" id="setup" autocomplete="off">
        <div class="setup-head"><strong>Thiết lập nguồn dữ liệu</strong><span class="tag">Multi-URL import</span></div>
        <label class="label" for="urls">Link bảng hàng / website cần theo dõi</label>
        <textarea class="textarea" id="urls" spellcheck="false" required placeholder="https://vhub.com.vn/du-an/vinhomes-global-gate-ha-long/bang-hang&#10;Mỗi link một dòng, tối đa 50 link mỗi lần"></textarea>
        <div class="form-row">
          <div><label class="label" for="src-name">Tên gợi nhớ <span style="font-weight:400;color:var(--muted)">(tuỳ chọn)</span></label><input class="input" id="src-name" maxlength="120" placeholder="Tự lấy tên dự án nếu để trống"></div>
          <div><label class="label" for="src-tag">Nhóm / khu vực</label><input class="input" id="src-tag" maxlength="60" list="tag-list" placeholder="VD: Hạ Long, Quỹ độc quyền"><datalist id="tag-list"></datalist></div>
        </div>
        <div class="form-row">
          <div><label class="label" for="frequency">Tự cập nhật</label><select class="select" id="frequency"><option value="15">Mỗi 15 phút</option><option value="30">Mỗi 30 phút</option><option value="60" selected>Mỗi 60 phút</option><option value="120">Mỗi 2 giờ</option><option value="360">Mỗi 6 giờ</option><option value="720">Mỗi 12 giờ</option><option value="1440">Mỗi ngày</option><option value="0">Chỉ cập nhật thủ công</option></select></div>
          <div><span class="label">Báo đỏ khi có</span><div class="chips" id="alert-on"><label class="chip"><input type="checkbox" value="added" checked><span>Căn mới</span></label><label class="chip"><input type="checkbox" value="removed" checked><span>Đã bán / gỡ</span></label><label class="chip"><input type="checkbox" value="price" checked><span>Đổi giá</span></label><label class="chip"><input type="checkbox" value="other" checked><span>Khác</span></label></div></div>
        </div>
        <div class="button-group"><button type="submit" class="btn btn-green" id="add">＋ Thêm &amp; quét ngay</button><button type="button" class="btn btn-outline" id="check-all">↻ Cập nhật tất cả ngay</button></div>
        <p class="hosts" id="hosts">Đang kiểm tra máy chủ…</p>
        <div class="setup-foot"><span class="connection" id="connect">● Đang kiểm tra API</span><button type="button" class="linkish" id="settings-toggle">⚙ Cài đặt quyền truy cập</button></div>
        <div class="settings" id="settings"><div class="notice">Chỉ cần khi máy chủ có đặt DASHBOARD_TOKEN. Mã được lưu trong phiên tab hiện tại.</div><div class="form-row"><div><label class="label" for="token">Access token</label><input class="input" id="token" type="password" autocomplete="off" placeholder="Nhập DASHBOARD_TOKEN"></div><div><button type="button" class="btn btn-green" id="save-token">Lưu cho phiên này</button></div></div></div>
      </form>
    </div>
  </div>
</section>

<div class="fx-marquee" aria-hidden="true"><div class="fx-marquee-track"><span><b></b>Theo dõi giỏ hàng<b></b>Báo đỏ khi có căn mới<b></b>Đổi giá<b></b>Đã bán / gỡ<b></b>Tự cập nhật 60 phút<b></b>Tìm mã căn tức thì<b></b>Xuất Excel<b></b>MCP cho AI</span><span><b></b>Theo dõi giỏ hàng<b></b>Báo đỏ khi có căn mới<b></b>Đổi giá<b></b>Đã bán / gỡ<b></b>Tự cập nhật 60 phút<b></b>Tìm mã căn tức thì<b></b>Xuất Excel<b></b>MCP cho AI</span></div></div>
<section class="section band on-dark" id="watch"><div class="wrap">
 <div class="section-head"><div><div class="eyebrow">01 · Bảng theo dõi</div><h2 class="h2">Toàn bộ link gốc.<br><span>Thay đổi nào cũng thấy.</span></h2><p class="lead">Đỏ là có cập nhật mới chưa xem, xanh là không có thay đổi gì. Nguồn có cập nhật mới luôn nằm trên cùng.</p></div><div class="outline-num" aria-hidden="true">01</div></div>
 <div class="panel manager-panel">
  <div class="toolbar">
   <div class="search-wrap"><input class="input" id="search" aria-label="Tìm nguồn" placeholder="Tìm tên nguồn, link, nhóm…"></div>
   <select class="select" id="f-status" aria-label="Lọc trạng thái"><option value="all">Mọi trạng thái</option><option value="alert">● Có cập nhật mới</option><option value="calm">✓ Không đổi</option><option value="error">Lỗi</option><option value="pending">Chưa quét</option></select>
   <select class="select" id="f-tag" aria-label="Lọc nhóm"><option value="">Mọi nhóm</option></select>
   <select class="select" id="f-host" aria-label="Lọc tên miền"><option value="">Mọi website</option></select>
   <select class="select" id="f-sort" aria-label="Sắp xếp"><option value="alert">Ưu tiên cập nhật mới</option><option value="changed">Thay đổi gần nhất</option><option value="checked">Kiểm tra gần nhất</option><option value="name">Tên A → Z</option><option value="rows">Nhiều bản ghi nhất</option></select>
   <div class="toolbar-right"><button class="btn btn-outline" id="seen-all">✓ Đã xem tất cả</button><button class="btn btn-dark" id="check-all-2">↻ Cập nhật tất cả</button></div>
  </div>
  <div class="livebar"><span><span class="live-dot"></span><span id="live-text">Màn hình tự làm mới mỗi 60 giây</span><span class="refresh-bar" aria-hidden="true"><i id="refresh-bar"></i></span></span><span id="clock">—</span></div>
  <div class="wgrid whead"><span>Trạng thái</span><span>Nguồn · link gốc</span><span>Bản ghi</span><span>Thay đổi gần nhất</span><span>Kiểm tra lúc</span><span class="wnext">Lần tới</span><span style="text-align:right">Thao tác</span></div>
  <div id="watch-list" aria-live="polite"><div class="empty"><span class="big">⌁</span><b>Chưa có nguồn theo dõi</b><p>Dán link vào ô Thiết lập nguồn dữ liệu ở đầu trang.</p></div></div>
 </div>
</div></section>

<section class="section sheet-section data-zone" id="data"><div class="wrap">
 <div class="section-head"><div><div class="eyebrow">02 · Dữ liệu đã lưu</div><h2 class="h2">Bảng hàng đầy đủ.<br><span>Lọc chuyên nghiệp.</span></h2><p class="lead">Dữ liệu tải về được lưu trên máy chủ và đối chiếu với link gốc. Dòng đỏ là thay đổi chưa xem, giá cũ hiển thị gạch ngang ngay bên dưới.</p></div><div class="outline-num" aria-hidden="true">02</div></div>
 <div class="panel" style="border-radius:var(--r-lg)">
  <div class="data-head"><div class="data-title" id="data-title"><strong>Chọn một nguồn để xem</strong><span class="wmeta">Bấm ▤ ở bảng theo dõi hoặc chọn bên phải</span></div><div class="preview-top-right"><select class="preview-select" id="data-source" aria-label="Chọn nguồn"><option value="">Chọn nguồn dữ liệu</option></select><button class="btn btn-outline" id="data-csv">⇩ CSV theo bộ lọc</button><button class="btn btn-dark" id="data-xlsx">⇩ Excel đầy đủ</button></div></div>
  <div class="filters" id="filters"></div>
  <div class="livebar"><span id="data-count">0 bản ghi</span><span id="data-time">—</span></div>
  <div class="table-scroll" id="table-scroll" style="max-height:640px"><div class="empty"><span class="big">▤</span><b>Chưa chọn nguồn</b><p>Dữ liệu sẽ hiện ở đây.</p></div></div>
  <div class="more" id="more" hidden><button class="btn btn-outline" id="more-btn">Xem thêm</button></div>
 </div>
</div></section>

<section class="section band on-dark" id="changes"><div class="wrap">
 <div class="section-head"><div><div class="eyebrow">03 · Dòng thời gian thay đổi</div><h2 class="h2">Dữ liệu thay đổi.<br>Hệ thống luôn sẵn sàng.</h2><p class="lead">Máy chủ tự kiểm tra từng link theo chu kỳ đã chọn (mặc định 60 phút), kể cả khi bạn tắt trình duyệt.</p></div><div class="outline-num" aria-hidden="true">03</div></div>
 <div class="sync-layout">
  <div class="glass sync-card"><div class="sync-card-title"><h3>Thay đổi mới nhất</h3><span class="badge grey" id="feed-count">0</span></div><div class="feed-filter" id="feed-filter"><button class="on" data-type="">Tất cả</button><button data-type="added">Căn mới</button><button data-type="removed">Đã bán / gỡ</button><button data-type="price">Đổi giá</button><button data-type="other">Khác</button></div><div class="feed" id="feed"><div class="feed-item"><time>—</time><span>Chưa có thay đổi nào được ghi nhận.</span></div></div></div>
  <div class="glass sync-card"><h3>Lịch cập nhật tự động</h3><p>Cách hệ thống giữ dữ liệu luôn mới nhất.</p>
   <div class="sync-feature"><div class="sync-symbol">◷</div><div><strong id="schedule-title">Chưa có lịch</strong><br><span id="schedule-text">Thêm nguồn để bắt đầu</span></div></div>
   <div class="how"><div><i>1</i>Mỗi 15 phút máy chủ rà soát, link nào đến hạn theo chu kỳ của nó thì tải lại.</div><div><i>2</i>So sánh từng căn với lần trước theo mã căn: căn mới, đã bán / gỡ, đổi giá, đổi thông tin.</div><div><i>3</i>Có thay đổi thì nguồn chuyển đỏ cho tới khi bạn bấm ✓ Đã xem.</div></div>
   <h3 style="margin-top:26px;font-size:17px">Lịch sử quét của nguồn đang xem</h3><div class="checks" id="checks"><div class="check-line"><span>Chọn một nguồn ở mục Dữ liệu</span><span></span></div></div>
  </div>
 </div>
</div></section>

<section class="section" id="ecosystem"><div class="wrap">
 <div class="section-head"><div><div class="eyebrow">04 · Hệ sinh thái LUAN CRAWLER</div><h2 class="h2">Kết nối công cụ.<br><span>Mở rộng khả năng.</span></h2><p class="lead">Bảng theo dõi, máy chủ MCP và API quỹ căn chạy cùng trên Cloudflare Workers, mã nguồn mở trên GitHub.</p></div><div class="outline-num" aria-hidden="true">04</div></div>
 <div class="eco-grid">
  <a class="eco-card feature" href="/mcp" target="_blank" rel="noopener"><span class="num">MCP Server</span><h3>Tra cứu bảng hàng bằng AI</h3><p>Kết nối Claude hoặc AI khác qua <code>/mcp</code>. Tools: <code>list_projects</code>, <code>search_units</code>, <code>get_unit</code>, <code>project_summary</code>, <code>export_excel</code>.</p><span class="go"><i>↗</i> Mở endpoint MCP</span></a>
  <a class="eco-card" href="/export.xlsx?project=vinhomes-global-gate-ha-long" target="_blank" rel="noopener"><span class="num">Excel quỹ căn</span><h3>Mã căn &amp; giá đầy đủ</h3><p>Xuất ngay bảng hàng Vinhomes Global Gate Hạ Long: giá Full, TT sớm, TT tiến độ, giá vay, đơn giá/m².</p><span class="go"><i>⇩</i> Tải file Excel</span></a>
  <a class="eco-card" href="https://github.com/luanlengoc1991-art/luan-crawler" target="_blank" rel="noopener"><span class="num">Mã nguồn</span><h3>GitHub luan-crawler</h3><p>Toàn bộ Worker, bảng theo dõi và MCP. Mỗi lần push lên <code>main</code>, Cloudflare tự build và triển khai.</p><span class="go"><i>↗</i> Xem trên GitHub</span></a>
 </div>
</div></section>
</main>
<footer class="footer"><div class="wrap"><div class="footer-main"><div><a href="#top" class="brand"><span class="brand-mark">L</span><span class="brand-text"><strong>LUAN CRAWLER</strong><small>BY LUAN GROUP</small></span></a><p>Theo dõi giỏ hàng và bảng giá từ nhiều website trong một không gian làm việc, luôn đồng bộ với link gốc.</p></div><div class="footer-nav"><a href="#top">Thiết lập</a><a href="#watch">Theo dõi</a><a href="#data">Dữ liệu</a><a href="#changes">Thay đổi</a><a href="#ecosystem">MCP &amp; API</a><a href="https://luangroup.asia/du-an" target="_blank" rel="noopener">LUAN GROUP ↗</a></div></div><div class="footer-bottom"><span>© 2026 LUAN GROUP · LUAN CRAWLER</span><span>Giờ Việt Nam (GMT+7)</span><span>Thiết kế cho mọi thiết bị.</span></div></div></footer>
<button class="fab" id="fab-search" type="button" aria-label="Tìm mã căn"><span class="fab-ic"><span class="fab-wave"></span><span class="fab-wave is-2"></span>⌕</span><b>Tìm mã căn</b></button>
<div class="sx" id="sx" hidden><div class="sx-backdrop" data-close></div><div class="sx-panel" role="dialog" aria-modal="true" aria-label="Tìm mã căn"><div class="sx-bar"><span aria-hidden="true">⌕</span><input id="sx-q" autocomplete="off" spellcheck="false" placeholder="Nhập mã căn, VD: NĐ11-41, BM1-164"><kbd data-close title="Đóng">Esc</kbd></div><div class="sx-meta" id="sx-meta">Gõ ít nhất 2 ký tự. Không cần gõ dấu: "nd11" vẫn ra "NĐ11".</div><div class="sx-results" id="sx-results"></div></div></div>
<div id="toast" class="toast" role="status" aria-live="polite"></div>
<script>
(function(){
'use strict';
var TZ='Asia/Ho_Chi_Minh';
var LABELS={code:'Mã căn',subdivision:'Phân khu',type:'Loại hình',direction:'Hướng',landArea:'DT đất (m²)',constructionArea:'DT xây dựng (m²)',priceFull:'Giá Full',priceEarlyPayment:'Giá TT sớm',priceProgress:'Giá TT tiến độ',priceLoan:'Giá vay',pricePerSqm:'Đơn giá/m²',priceBeforeVat:'Giá trước VAT',vat:'VAT',maintenanceFee:'Phí bảo trì',landTotal:'Tiền đất',constructionTotal:'Tiền xây dựng',handover:'Bàn giao',fund:'Quỹ hàng',policy:'Chính sách',banks:'Ngân hàng',gift:'Quà tặng',description:'Mô tả',status:'Trạng thái',updatedAt:'Cập nhật nguồn'};
var TYPE_TEXT={added:'Căn mới',removed:'Đã bán / gỡ',price:'Đổi giá',other:'Thay đổi'};
var MONEY=/price|gia|giá|vat|total|tien|tiền|fee|phi|phí/i;
var FACET_PREF=['subdivision','type','direction','handover','fund','status','policy'];
var state={sources:[],totals:{},now:Date.now(),selected:null,data:null,sort:{col:null,asc:true},limit:200,feedType:'',changes:[],busy:{},hosts:[]};
var $=function(id){return document.getElementById(id)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var num=function(n){return Number(n||0).toLocaleString('vi-VN')};
var host=function(u){try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return u}};
function fmtTime(ms,withDate){if(!ms)return '—';var o={timeZone:TZ,hour:'2-digit',minute:'2-digit'};if(withDate){o.day='2-digit';o.month='2-digit'}return new Date(ms).toLocaleString('vi-VN',o)}
function ago(ms){if(!ms)return 'chưa có';var s=Math.round((Date.now()-ms)/1000);if(s<60)return 'vừa xong';var m=Math.round(s/60);if(m<60)return m+' phút trước';var h=Math.round(m/60);if(h<48)return h+' giờ trước';return Math.round(h/24)+' ngày trước'}
function until(ms){if(!ms)return 'Thủ công';var m=Math.round((ms-Date.now())/60000);if(m<=0)return 'đến hạn';if(m<60)return 'còn '+m+' phút';var h=Math.floor(m/60);return 'còn '+h+' giờ '+(m%60)+' phút'}
function money(v){var n=Number(v);if(!isFinite(n)||v===''||v==null)return v;var a=Math.abs(n);if(a>=1e9)return (n/1e9).toLocaleString('vi-VN',{maximumFractionDigits:3})+' tỷ';if(a>=1e6)return (n/1e6).toLocaleString('vi-VN',{maximumFractionDigits:1})+' tr';return n.toLocaleString('vi-VN')}
function show(col,v){if(v==null||v==='')return '';if(typeof v==='number'&&MONEY.test(col))return money(v);if(typeof v==='number')return v.toLocaleString('vi-VN');if(col==='updatedAt'){var d=new Date(v);if(!isNaN(d))return fmtTime(d.getTime(),true)}return String(v)}
function label(c){return LABELS[c]||c}
var toastT;function toast(m){$('toast').textContent=m;$('toast').classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){$('toast').classList.remove('show')},4500)}
function token(){try{return sessionStorage.getItem('luan-crawler.token')||''}catch(e){return ''}}
async function api(path,opts){opts=opts||{};opts.headers=Object.assign({'Accept':'application/json'},opts.body?{'Content-Type':'application/json'}:{},opts.headers||{});if(token())opts.headers.Authorization='Bearer '+token();var r=await fetch(path,opts);if(!r.ok){var msg='HTTP '+r.status;try{msg=(await r.json()).error||msg}catch(e){}throw new Error(msg)}return r}
async function getJSON(path){return (await api(path)).json()}
function download(blob,name){var a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},3000)}

/* ---------- status of a source ---------- */
function statusOf(s){if(state.busy[s.id]||s.checking)return 'busy';if(s.status==='error')return 'error';if(!s.lastCheckedAt)return 'pending';return s.unseen>0?'alert':'calm'}
function badge(s){var st=statusOf(s);if(st==='busy')return '<span class="badge busy">Đang quét</span>';if(st==='error')return '<span class="badge amber" title="'+esc(s.error)+'">⚠ Lỗi</span>';if(st==='pending')return '<span class="badge grey">Chưa quét</span>';if(st==='alert')return '<span class="badge red">● '+num(s.unseen)+' cập nhật mới</span>';return '<span class="badge green">✓ Không đổi</span>'}
function deltas(s){var x=s.summary;if(!x)return '<span class="wmeta">—</span>';if(x.baseline)return '<span class="delta add">Khởi tạo · '+num(s.rowCount)+' dòng</span>';var out='';if(x.added)out+='<span class="delta add">+'+num(x.added)+' mới</span>';if(x.removed)out+='<span class="delta rem">−'+num(x.removed)+' gỡ</span>';if(x.changed)out+='<span class="delta price">'+num(x.changed)+' thay đổi</span>';if(!out)out='<span class="delta add">Không đổi</span>';return out+'<div class="wmeta">Lần đổi gần nhất: '+ago(s.lastChangedAt)+'</div>'}
var INTERVAL_OPTS=[[15,'15 phút'],[30,'30 phút'],[60,'60 phút'],[120,'2 giờ'],[360,'6 giờ'],[720,'12 giờ'],[1440,'1 ngày'],[0,'Thủ công']];

/* ---------- watchlist ---------- */
function renderWatch(){
  var t=state.totals||{},list=state.sources;
  countTo($('stat-total'),t.sources);countTo($('stat-rows'),t.rows);countTo($('stat-alerts'),t.alerts);
  $('stat-alert-card').className='glass stat '+(t.alerts?'alert':(t.sources?'calm':''));
  $('stat-alerts-note').textContent=t.alerts?'Nguồn có thay đổi chưa xem':(t.sources?'Mọi nguồn đều không đổi':'Chưa có thay đổi');
  $('stat-next').textContent=t.nextCheckAt?fmtTime(t.nextCheckAt):'—';$('stat-next-note').textContent=t.nextCheckAt?until(t.nextCheckAt):'Tự động mỗi 60 phút';
  document.title=(t.alerts?'('+t.alerts+') ● ':'')+'LUAN CRAWLER | Theo dõi dữ liệu — LUAN GROUP';
  $('header-alert').textContent=t.alerts?'● '+t.alerts+' cập nhật mới':'✓ Bảng theo dõi';$('header-alert').style.background=t.alerts?'#e11d48':'';$('header-alert').style.color=t.alerts?'#fff':'';
  var auto=list.filter(function(s){return s.intervalMin>0}).length;$('schedule-title').textContent=auto?auto+' nguồn đang tự cập nhật':'Chưa có lịch tự động';$('schedule-text').textContent=t.nextCheckAt?'Lượt tới lúc '+fmtTime(t.nextCheckAt)+' · '+until(t.nextCheckAt):'Thêm nguồn để bắt đầu';
  fillSelect($('f-tag'),'Mọi nhóm',uniq(list.map(function(s){return s.tag}).filter(Boolean)));
  fillSelect($('f-host'),'Mọi website',uniq(list.map(function(s){return host(s.url)})));
  $('tag-list').innerHTML=uniq(list.map(function(s){return s.tag}).filter(Boolean)).map(function(x){return '<option value="'+esc(x)+'">'}).join('');
  var dsel=$('data-source'),cur=dsel.value;dsel.innerHTML='<option value="">Chọn nguồn dữ liệu</option>'+list.map(function(s){return '<option value="'+s.id+'">'+(s.unseen>0?'● ':'')+esc(s.name||host(s.url))+'</option>'}).join('');dsel.value=state.selected?String(state.selected):cur;
  var q=$('search').value.trim().toLowerCase(),fs=$('f-status').value,ft=$('f-tag').value,fh=$('f-host').value,so=$('f-sort').value;
  var rows=list.filter(function(s){return (!q||(s.name||'').toLowerCase().indexOf(q)>=0||s.url.toLowerCase().indexOf(q)>=0||(s.tag||'').toLowerCase().indexOf(q)>=0)&&(fs==='all'||statusOf(s)===fs)&&(!ft||s.tag===ft)&&(!fh||host(s.url)===fh)});
  var cmp={alert:function(a,b){return (b.unseen>0)-(a.unseen>0)||(b.lastChangedAt||0)-(a.lastChangedAt||0)},changed:function(a,b){return (b.lastChangedAt||0)-(a.lastChangedAt||0)},checked:function(a,b){return (b.lastCheckedAt||0)-(a.lastCheckedAt||0)},name:function(a,b){return (a.name||a.url).localeCompare(b.name||b.url,'vi')},rows:function(a,b){return (b.rowCount||0)-(a.rowCount||0)}}[so];rows.sort(cmp);
  if(!list.length){$('watch-list').innerHTML='<div class="empty"><span class="big">⌁</span><b>Chưa có nguồn theo dõi</b><p>Dán link vào ô Thiết lập nguồn dữ liệu ở đầu trang.</p></div>';return}
  if(!rows.length){$('watch-list').innerHTML='<div class="empty"><span class="big">⌕</span><b>Không có nguồn phù hợp bộ lọc</b><p>Thử đổi trạng thái, nhóm hoặc từ khoá.</p></div>';return}
  $('watch-list').innerHTML=rows.map(function(s){var st=statusOf(s);return '<div class="wgrid wrow'+(st==='alert'?' is-alert':st==='calm'?' is-calm':st==='error'?' is-error':'')+(s.id===state.selected?' is-selected':'')+'" data-id="'+s.id+'">'+
    '<div><span class="wlabel">Trạng thái</span>'+badge(s)+'</div>'+
    '<div class="wname"><strong title="'+esc(s.name||'')+'">'+esc(s.name||host(s.url))+'</strong><a href="'+esc(s.url)+'" target="_blank" rel="noopener" title="Mở link gốc">↗ '+esc(s.url.replace(/^https:\/\/(www\.)?/,''))+'</a><div class="wmeta">'+(s.tag?'<span class="tagpill">'+esc(s.tag)+'</span>':'')+esc(s.kind||'Chưa xác định')+(s.error&&st==='error'?' · '+esc(s.error):'')+'</div></div>'+
    '<div><span class="wlabel">Bản ghi</span><span class="wnum">'+num(s.rowCount)+'</span></div>'+
    '<div class="wchg"><span class="wlabel">Thay đổi gần nhất</span>'+deltas(s)+'</div>'+
    '<div class="wtime"><span class="wlabel">Kiểm tra lúc</span><b>'+fmtTime(s.lastCheckedAt,true)+'</b><span>'+ago(s.lastCheckedAt)+'</span></div>'+
    '<div class="wtime wnext"><span class="wlabel">Lần tới</span><b>'+(s.intervalMin?fmtTime(s.nextCheckAt):'—')+'</b><select class="mini-select" data-interval="'+s.id+'" aria-label="Chu kỳ cập nhật">'+INTERVAL_OPTS.map(function(o){return '<option value="'+o[0]+'"'+(o[0]===s.intervalMin?' selected':'')+'>'+(o[0]?'Mỗi '+o[1]:o[1])+'</option>'}).join('')+'</select><span style="display:block">'+(s.intervalMin?until(s.nextCheckAt):'')+'</span></div>'+
    '<div class="wact"><button class="icon-btn" data-act="check" title="Cập nhật ngay"'+(st==='busy'?' disabled':'')+'>↻</button><button class="icon-btn" data-act="view" title="Xem dữ liệu">▤</button><button class="icon-btn" data-act="xlsx" title="Tải Excel">⇩</button>'+(s.unseen>0?'<button class="icon-btn ok" data-act="seen" title="Đánh dấu đã xem">✓</button>':'')+'<button class="icon-btn danger" data-act="remove" title="Xoá nguồn">×</button></div>'+
  '</div>'}).join('');
}
function uniq(a){return a.filter(function(x,i){return a.indexOf(x)===i}).sort(function(a,b){return String(a).localeCompare(String(b),'vi')})}
function fillSelect(el,first,vals){var cur=el.value;el.innerHTML='<option value="">'+first+'</option>'+vals.map(function(v){return '<option value="'+esc(v)+'">'+esc(v)+'</option>'}).join('');if(vals.indexOf(cur)>=0)el.value=cur}

async function loadSources(){var d=await getJSON('/api/watch/sources');var prev={};state.sources.forEach(function(s){prev[s.id]=s.lastCheckedAt});state.sources=d.sources;state.totals=d.totals;renderWatch();$('live-text').textContent='Màn hình tự làm mới mỗi 60 giây · lần làm mới cuối '+fmtTime(Date.now());var rb=$('refresh-bar');rb.style.animation='none';void rb.offsetWidth;rb.style.animation='';
  if(!state.selected&&state.sources.length){var first=state.sources.find(function(s){return s.unseen>0})||state.sources[0];selectSource(first.id);return}
  var sel=state.sources.find(function(s){return s.id===state.selected});if(sel&&state.data&&prev[sel.id]!==sel.lastCheckedAt)loadData(sel.id,true);}
async function loadFeed(){try{var d=await getJSON('/api/watch/changes?limit=150');state.changes=d.changes;renderFeed()}catch(e){}}
function changeText(c){if(c.type==='added')return (c.fields&&c.fields[0]&&c.fields[0].f==='_restored')?'mở bán lại':'xuất hiện mới';if(c.type==='removed')return 'đã bán / gỡ khỏi bảng hàng';return (c.fields||[]).slice(0,3).map(function(f){return label(f.f)+': '+esc(show(f.f,f.o)||'trống')+' → <b>'+esc(show(f.f,f.n)||'trống')+'</b>'}).join(' · ')}
function renderFeed(){var list=state.changes.filter(function(c){return !state.feedType||c.type===state.feedType});$('feed-count').textContent=num(list.length);$('feed').innerHTML=list.length?list.map(function(c){return '<div class="feed-item"><time>'+fmtTime(c.at,true)+'</time><span><b>'+esc(c.key)+'</b> · <span class="delta '+(c.type==='added'?'add':c.type==='removed'?'rem':c.type)+'">'+TYPE_TEXT[c.type]+'</span> '+(c.type==='added'||c.type==='removed'?changeText(c):'<br>'+changeText(c))+'<span class="src">'+esc(c.sourceName||host(c.url))+'</span></span></div>'}).join(''):'<div class="feed-item"><time>—</time><span>Chưa có thay đổi nào được ghi nhận.</span></div>'}

async function checkOne(id,quiet){if(state.busy[id])return;state.busy[id]=true;renderWatch();try{var d=await (await api('/api/watch/sources/'+id+'/check',{method:'POST'})).json();var r=d.result;if(!quiet){if(!r.ok)toast('Lỗi: '+r.error);else if(r.baseline)toast('Đã lưu '+num(r.rowCount)+' dòng làm mốc so sánh.');else if(r.added+r.removed+r.changed)toast('Có cập nhật: +'+r.added+' mới, −'+r.removed+' gỡ, '+r.changed+' thay đổi.');else toast('✓ Không có thay đổi.')}return r}catch(e){if(!quiet)toast('Không cập nhật được: '+e.message)}finally{delete state.busy[id]}}
async function checkMany(ids){if(!ids.length){toast('Chưa có nguồn để cập nhật.');return}toast('Đang cập nhật '+ids.length+' nguồn…');var queue=ids.slice(),n=0,changed=0;await Promise.all([0,1].map(async function(){while(queue.length){var id=queue.shift();var r=await checkOne(id,true);n++;if(r&&r.ok&&!r.baseline&&r.added+r.removed+r.changed)changed++;await loadSources().catch(function(){})}}));await loadFeed();toast('Đã cập nhật '+n+' nguồn · '+(changed?changed+' nguồn có thay đổi':'không có thay đổi mới')+'.')}

/* ---------- add sources ---------- */
$('setup').addEventListener('submit',async function(ev){ev.preventDefault();var urls=$('urls').value.split(/[\r\n\s]+/).map(function(x){return x.trim()}).filter(Boolean);if(!urls.length){toast('Dán ít nhất một link.');return}
  var alertOn=[].slice.call(document.querySelectorAll('#alert-on input:checked')).map(function(i){return i.value});
  $('add').disabled=true;try{var d=await (await api('/api/watch/sources',{method:'POST',body:JSON.stringify({urls:urls,name:$('src-name').value.trim(),tag:$('src-tag').value.trim(),intervalMin:Number($('frequency').value),alertOn:alertOn})})).json();
    if(d.skipped&&d.skipped.length)toast('Bỏ qua '+d.skipped.length+' link: '+d.skipped.map(function(x){return host(x.url)+' ('+x.reason+')'}).join(', '));
    $('urls').value='';$('src-name').value='';await loadSources();if(d.created.length){document.getElementById('watch').scrollIntoView({behavior:'smooth'});await checkMany(d.created);if(d.created.length===1)selectSource(d.created[0])}}catch(e){toast('Không thêm được: '+e.message)}finally{$('add').disabled=false}});
function allIds(){return state.sources.map(function(s){return s.id})}
$('check-all').addEventListener('click',function(){checkMany(allIds())});$('check-all-2').addEventListener('click',function(){checkMany(allIds())});
$('seen-all').addEventListener('click',async function(){try{await api('/api/watch/seen-all',{method:'POST'});await loadSources();if(state.selected)loadData(state.selected,true);toast('Đã đánh dấu xem tất cả.')}catch(e){toast(e.message)}});
['search','f-status','f-tag','f-host','f-sort'].forEach(function(id){$(id).addEventListener(id==='search'?'input':'change',renderWatch)});
$('watch-list').addEventListener('change',async function(ev){var sel=ev.target.closest('[data-interval]');if(!sel)return;try{await api('/api/watch/sources/'+sel.getAttribute('data-interval'),{method:'PATCH',body:JSON.stringify({intervalMin:Number(sel.value)})});await loadSources();toast('Đã đổi chu kỳ cập nhật.')}catch(e){toast(e.message)}});
$('watch-list').addEventListener('click',async function(ev){var b=ev.target.closest('[data-act]');if(!b)return;var id=Number(b.closest('[data-id]').getAttribute('data-id')),act=b.getAttribute('data-act'),s=state.sources.find(function(x){return x.id===id});
  if(act==='check'){await checkOne(id);await loadSources();loadFeed()}
  if(act==='view')selectSource(id,true);
  if(act==='xlsx')exportXlsx(id);
  if(act==='seen'){await api('/api/watch/sources/'+id+'/seen',{method:'POST'});await loadSources();if(state.selected===id)loadData(id,true)}
  if(act==='remove'&&s&&confirm('Xoá nguồn "'+(s.name||s.url)+'" và toàn bộ dữ liệu đã lưu?')){await api('/api/watch/sources/'+id,{method:'DELETE'});if(state.selected===id){state.selected=null;state.data=null;renderData()}await loadSources();loadFeed();toast('Đã xoá nguồn.')}});
async function exportXlsx(id){try{var s=state.sources.find(function(x){return x.id===id});var blob=await (await api('/api/watch/sources/'+id+'/export.xlsx')).blob();download(blob,'LUAN_'+String((s&&s.name)||'nguon').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/gi,'-').slice(0,40)+'.xlsx')}catch(e){toast('Không tải được Excel: '+e.message)}}

/* ---------- data view ---------- */
function selectSource(id,scroll){state.selected=id;$('data-source').value=String(id);state.limit=200;state.sort={col:null,asc:true};state.filters={};loadData(id);renderWatch();if(scroll)document.getElementById('data').scrollIntoView({behavior:'smooth'})}
$('data-source').addEventListener('change',function(){if(this.value)selectSource(Number(this.value))});
async function loadData(id,keep){try{var d=await getJSON('/api/watch/sources/'+id+'/items');if(state.selected!==id)return;state.data=d;if(!keep)buildFilters();if(state.pendingQ){var qi=document.querySelector('#filters [data-f="q"]');if(qi){qi.value=state.pendingQ;state.filters.q=state.pendingQ}state.pendingQ=null}renderData();loadChecks(id)}catch(e){toast('Không tải được dữ liệu: '+e.message)}}
async function loadChecks(id){try{var d=await getJSON('/api/watch/sources/'+id+'/changes');$('checks').innerHTML=d.checks.length?d.checks.map(function(c){return '<div class="check-line"><span>'+fmtTime(c.at,true)+' · '+(c.status==='ok'?num(c.row_count)+' dòng':'⚠ Lỗi')+'</span><span>'+(c.status==='ok'?(c.added+c.removed+c.changed?'+'+c.added+' / −'+c.removed+' / '+c.changed+' đổi':'✓ Không đổi'):esc(c.error||''))+'</span></div>'}).join(''):'<div class="check-line"><span>Chưa có lượt quét</span><span></span></div>'}catch(e){}}
function buildFilters(){var d=state.data;if(!d){$('filters').innerHTML='';return}var cols=d.columns,items=d.items;state.filters={};
  var html='<input class="input" data-f="q" placeholder="Tìm mã căn, nội dung…" aria-label="Tìm trong dữ liệu">';
  html+='<select class="select" data-f="view" aria-label="Hiển thị"><option value="">Tất cả bản ghi</option><option value="live">Đang có trên link gốc</option><option value="unseen">● Thay đổi chưa xem</option><option value="added">Căn mới</option><option value="price">Đổi giá</option><option value="other">Thay đổi khác</option><option value="removed">Đã bán / gỡ</option></select>';
  var facets=FACET_PREF.filter(function(c){return cols.indexOf(c)>=0});cols.forEach(function(c){if(facets.length<4&&facets.indexOf(c)<0){var n=uniq(items.map(function(i){return i.data[c]}).filter(function(v){return v!=null&&v!==''})).length;if(n>=2&&n<=40&&!MONEY.test(c))facets.push(c)}});
  facets.slice(0,5).forEach(function(c){var vals=uniq(items.map(function(i){return i.data[c]}).filter(function(v){return v!=null&&v!==''}).map(String));if(vals.length>=2&&vals.length<=80)html+='<select class="select" data-f="col:'+esc(c)+'" aria-label="'+esc(label(c))+'"><option value="">'+esc(label(c))+': tất cả</option>'+vals.map(function(v){return '<option value="'+esc(v)+'">'+esc(v)+'</option>'}).join('')+'</select>'});
  var priceCol=cols.indexOf('priceFull')>=0?'priceFull':cols.filter(function(c){return MONEY.test(c)&&items.some(function(i){return typeof i.data[c]==='number'})})[0];
  if(priceCol){state.priceCol=priceCol;html+='<div class="range"><input class="input" data-f="pmin" type="number" step="0.1" min="0" placeholder="Giá từ (tỷ)" aria-label="Giá từ"><input class="input" data-f="pmax" type="number" step="0.1" min="0" placeholder="đến (tỷ)" aria-label="Giá đến"></div>'}else state.priceCol=null;
  if(cols.indexOf('landArea')>=0)html+='<div class="range"><input class="input" data-f="amin" type="number" min="0" placeholder="DT từ (m²)" aria-label="Diện tích từ"><input class="input" data-f="amax" type="number" min="0" placeholder="đến (m²)" aria-label="Diện tích đến"></div>';
  html+='<button class="btn btn-outline" id="f-reset" type="button">Xoá bộ lọc</button>';
  $('filters').innerHTML=html;}
$('filters').addEventListener('input',function(ev){var f=ev.target.getAttribute('data-f');if(!f)return;state.filters[f]=ev.target.value;state.limit=200;renderData()});
$('filters').addEventListener('click',function(ev){if(ev.target.id==='f-reset'){buildFilters();state.limit=200;renderData()}});
function filtered(){var d=state.data,f=state.filters||{};if(!d)return [];var q=(f.q||'').trim().toLowerCase();var pmin=f.pmin?Number(f.pmin)*1e9:null,pmax=f.pmax?Number(f.pmax)*1e9:null,amin=f.amin?Number(f.amin):null,amax=f.amax?Number(f.amax):null;
  var rows=d.items.filter(function(it){var ch=it.change;if(f.view==='live'&&it.removedAt)return false;if(f.view==='unseen'&&!ch)return false;if(f.view==='removed'&&!it.removedAt)return false;if((f.view==='added'||f.view==='price'||f.view==='other')&&!(ch&&ch.type===f.view))return false;
    for(var k in f){if(k.indexOf('col:')===0&&f[k]&&String(it.data[k.slice(4)])!==f[k])return false}
    if(state.priceCol){var p=it.data[state.priceCol];if(pmin!=null&&!(p>=pmin))return false;if(pmax!=null&&!(p<=pmax))return false}
    if(amin!=null&&!(it.data.landArea>=amin))return false;if(amax!=null&&!(it.data.landArea<=amax))return false;
    if(q&&(it.key+' '+Object.values(it.data).join(' ')).toLowerCase().indexOf(q)<0)return false;return true});
  var sc=state.sort.col;if(sc){rows.sort(function(a,b){var x=sc==='_status'?rank(a):a.data[sc],y=sc==='_status'?rank(b):b.data[sc];if(x==null||x==='')return 1;if(y==null||y==='')return -1;var r=typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y),'vi',{numeric:true});return state.sort.asc?r:-r})}
  else rows.sort(function(a,b){return rank(b)-rank(a)});return rows}
function rank(it){return it.change?(it.removedAt?2:3):(it.removedAt?1:0)}
function renderData(){var d=state.data;if(!d){$('data-title').innerHTML='<strong>Chọn một nguồn để xem</strong><span class="wmeta">Bấm ▤ ở bảng theo dõi hoặc chọn bên phải</span>';$('table-scroll').innerHTML='<div class="empty"><span class="big">▤</span><b>Chưa chọn nguồn</b><p>Dữ liệu sẽ hiện ở đây.</p></div>';$('more').hidden=true;$('data-count').textContent='0 bản ghi';$('data-time').textContent='—';return}
  var s=d.source;$('data-title').innerHTML='<strong>'+(s.unseen>0?'<span class="badge red" style="height:24px;margin-right:8px">● '+num(s.unseen)+'</span>':'<span class="badge green" style="height:24px;margin-right:8px">✓</span>')+esc(s.name||host(s.url))+'</strong><a href="'+esc(s.url)+'" target="_blank" rel="noopener">↗ Link gốc: '+esc(s.url.replace(/^https:\/\//,''))+'</a>';
  var rows=filtered(),cols=d.columns;var live=d.items.filter(function(i){return !i.removedAt}).length;
  $('data-count').innerHTML='Hiển thị <b>'+num(Math.min(rows.length,state.limit))+'</b> / '+num(rows.length)+' bản ghi lọc được · '+num(live)+' đang có trên link gốc';
  $('data-time').textContent='Kiểm tra lúc '+fmtTime(s.lastCheckedAt,true)+' · '+ago(s.lastCheckedAt);
  if(!rows.length){$('table-scroll').innerHTML='<div class="empty"><span class="big">⌕</span><b>Không có bản ghi phù hợp</b><p>Thử nới bộ lọc.</p></div>';$('more').hidden=true;return}
  var th='<th data-sort="_status"'+(state.sort.col==='_status'?' class="sorted'+(state.sort.asc?' asc':'')+'"':'')+'>Trạng thái</th>'+cols.map(function(c){return '<th data-sort="'+esc(c)+'"'+(state.sort.col===c?' class="sorted'+(state.sort.asc?' asc':'')+'"':'')+'>'+esc(label(c))+'</th>'}).join('');
  var body=rows.slice(0,state.limit).map(function(it){var ch=it.change,cls=it.removedAt?'r-removed':ch?'r-'+ch.type:'';var old={};if(ch&&ch.fields)ch.fields.forEach(function(f){old[f.f]=f.o});
    var st=it.removedAt?'<span class="delta rem">Đã gỡ '+fmtTime(it.removedAt,true)+'</span>':ch?'<span class="delta '+(ch.type==='added'?'add':ch.type)+'">'+TYPE_TEXT[ch.type]+'</span>':'<span class="tick">✓</span>';
    return '<tr class="'+cls+'"><td>'+st+'</td>'+cols.map(function(c){var v=show(c,it.data[c]);var changed=Object.prototype.hasOwnProperty.call(old,c);var cc=(MONEY.test(c)&&typeof it.data[c]==='number'?'money ':'')+(c===cols[0]?'key ':'')+(changed?'cell-changed':'');return '<td'+(cc?' class="'+cc.trim()+'"':'')+' title="'+esc(v)+'">'+esc(v)+(changed?'<small>'+esc(show(c,old[c])||'trống')+'</small>':'')+'</td>'}).join('')+'</tr>'}).join('');
  $('table-scroll').innerHTML='<table class="data-table"><thead><tr>'+th+'</tr></thead><tbody>'+body+'</tbody></table>';$('more').hidden=rows.length<=state.limit;$('more-btn').textContent='Xem thêm ('+num(rows.length-state.limit)+' bản ghi)'}
$('table-scroll').addEventListener('click',function(ev){var th=ev.target.closest('th[data-sort]');if(!th)return;var c=th.getAttribute('data-sort');state.sort=state.sort.col===c?{col:c,asc:!state.sort.asc}:{col:c,asc:true};renderData()});
$('more-btn').addEventListener('click',function(){state.limit+=300;renderData()});
$('data-xlsx').addEventListener('click',function(){if(state.selected)exportXlsx(state.selected);else toast('Chọn một nguồn trước.')});
$('data-csv').addEventListener('click',function(){var d=state.data;if(!d){toast('Chọn một nguồn trước.');return}var rows=filtered(),cols=d.columns;var e=function(v){var s=String(v==null?'':v);if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};var lines=[['Trạng thái'].concat(cols.map(label)).map(e).join(',')].concat(rows.map(function(it){return [it.removedAt?'Đã gỡ':it.change?TYPE_TEXT[it.change.type]:''].concat(cols.map(function(c){return it.data[c]})).map(e).join(',')}));download(new Blob(['﻿'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'}),'LUAN_loc_'+new Date().toISOString().slice(0,10)+'.csv')});
$('feed-filter').addEventListener('click',function(ev){var b=ev.target.closest('button');if(!b)return;state.feedType=b.getAttribute('data-type');[].forEach.call(this.querySelectorAll('button'),function(x){x.classList.toggle('on',x===b)});renderFeed()});


/* ---------- effects ---------- */
function countTo(el,target){target=Number(target||0);var from=Number(el.getAttribute('data-v')||0);el.setAttribute('data-v',target);if(from===target){el.textContent=num(target);return}var t0=performance.now(),d=900;(function step(t){var p=Math.min(1,(t-t0)/d),e=1-Math.pow(1-p,3);el.textContent=num(Math.round(from+(target-from)*e));if(p<1)requestAnimationFrame(step)})(t0)}
(function reveal(){var els=document.querySelectorAll('.section-head,.manager-panel,.data-zone .panel,.sync-card,.eco-card,.setup');if(!('IntersectionObserver' in window))return;var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('is-in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px'});[].forEach.call(els,function(el,i){el.setAttribute('data-reveal','');el.style.transitionDelay=(el.classList.contains('eco-card')||el.classList.contains('sync-card')?(i%3)*0.12:0)+'s';io.observe(el)})})();

/* ---------- unit code search ---------- */
var sxTimer,sxSeq=0,sxActive=-1,sxList=[];
function skey(s){return String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]/g,'')}
function highlight(code,q){var n=skey(q);if(!n)return esc(code);var map=[],plain='';for(var i=0;i<code.length;i++){var k=skey(code[i]);for(var j=0;j<k.length;j++){plain+=k[j];map.push(i)}}var at=plain.indexOf(n);if(at<0)return esc(code);var a=map[at],b=map[at+n.length-1]+1;return esc(code.slice(0,a))+'<mark>'+esc(code.slice(a,b))+'</mark>'+esc(code.slice(b))}
function openSearch(q){$('sx').hidden=false;document.body.style.overflow='hidden';var inp=$('sx-q');inp.value=q||inp.value;setTimeout(function(){inp.focus();inp.select()},30);if(inp.value.trim().length>=2)runSearch(inp.value)}
function closeSearch(){$('sx').hidden=true;document.body.style.overflow=''}
async function runSearch(q){var seq=++sxSeq;q=q.trim();if(skey(q).length<2){sxList=[];$('sx-results').innerHTML='';$('sx-meta').textContent='Gõ ít nhất 2 ký tự. Không cần gõ dấu: "nd11" vẫn ra "NĐ11".';return}
  $('sx-meta').textContent='Đang tìm "'+q+'"…';
  try{var d=await getJSON('/api/watch/search?q='+encodeURIComponent(q));if(seq!==sxSeq)return;sxList=d.results;sxActive=sxList.length?0:-1;
    $('sx-meta').innerHTML=d.total?'Tìm thấy <b>'+num(d.total)+'</b> mã căn khớp "'+esc(q)+'" trong '+num(state.sources.length)+' nguồn đang theo dõi'+(d.total>sxList.length?' · hiển thị '+sxList.length+' kết quả đầu':''):'Không có mã căn nào khớp "'+esc(q)+'" trong '+num(state.sources.length)+' nguồn đang theo dõi.';
    renderSearch(q)}catch(e){if(seq===sxSeq)$('sx-meta').textContent='Lỗi tìm kiếm: '+e.message}}
function renderSearch(q){if(!sxList.length){$('sx-results').innerHTML='<div class="sx-empty"><b>Không tìm thấy mã căn</b>Thử gõ ngắn hơn, ví dụ chỉ phần đầu "BM1" hoặc "NĐ11". Chỉ tìm được trong các nguồn đã thêm vào bảng theo dõi.</div>';return}
  $('sx-results').innerHTML=sxList.map(function(r,i){var x=r.data||{};var st=r.removedAt?'<span class="delta rem">Đã bán / gỡ</span>':r.unseenChange?'<span class="delta price">● Có thay đổi</span>':'<span class="delta add">✓ Đang có</span>';
    var info=[x.subdivision&&('Phân khu <b>'+esc(x.subdivision)+'</b>'),x.type&&('<b>'+esc(x.type)+'</b>'),x.direction&&('Hướng <b>'+esc(x.direction)+'</b>'),x.landArea&&('Đất <b>'+esc(show('landArea',x.landArea))+' m²</b>'),x.constructionArea&&('XD <b>'+esc(show('constructionArea',x.constructionArea))+' m²</b>')].filter(Boolean).join(' · ');
    if(!info){info=Object.keys(x).slice(1,4).map(function(k){return esc(label(k))+': <b>'+esc(show(k,x[k]))+'</b>'}).join(' · ')}
    var price=x.priceFull!=null?'<div class="sx-price">'+esc(money(x.priceFull))+'<small>Giá Full'+(x.pricePerSqm?' · '+esc(money(x.pricePerSqm))+'/m²':'')+'</small></div>':'';
    return '<div class="sx-item'+(i===sxActive?' is-active':'')+'" data-i="'+i+'"><div><div><span class="sx-code">'+highlight(r.key,q)+'</span><span class="sx-tags">'+st+'</span></div><div class="sx-info">'+info+'</div><div class="sx-src">'+esc(r.sourceName||host(r.url))+' · kiểm tra '+ago(r.checkedAt)+'</div></div><div class="sx-right">'+price+'<div class="sx-actions"><button class="btn btn-dark" data-go="'+i+'">▤ Xem trong bảng</button><a class="btn btn-outline" href="'+esc(r.url)+'" target="_blank" rel="noopener">↗ Link gốc</a></div></div></div>'}).join('')}
function goResult(i){var r=sxList[i];if(!r)return;closeSearch();state.pendingQ=r.key;if(state.selected===r.sourceId&&state.data){var qi=document.querySelector('#filters [data-f="q"]');if(qi){qi.value=r.key;state.filters.q=r.key;state.pendingQ=null;renderData()}document.getElementById('data').scrollIntoView({behavior:'smooth'})}else selectSource(r.sourceId,true)}
$('sx-q').addEventListener('input',function(){var v=this.value;clearTimeout(sxTimer);sxTimer=setTimeout(function(){runSearch(v)},180)});
$('sx-q').addEventListener('keydown',function(ev){if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ev.preventDefault();if(!sxList.length)return;sxActive=(sxActive+(ev.key==='ArrowDown'?1:-1)+sxList.length)%sxList.length;renderSearch(this.value);var a=document.querySelector('.sx-item.is-active');if(a)a.scrollIntoView({block:'nearest'})}if(ev.key==='Enter'){ev.preventDefault();goResult(sxActive<0?0:sxActive)}});
$('sx').addEventListener('click',function(ev){if(ev.target.closest('[data-close]')){closeSearch();return}var g=ev.target.closest('[data-go]');if(g){goResult(Number(g.getAttribute('data-go')));return}var it=ev.target.closest('.sx-item');if(it&&!ev.target.closest('a'))goResult(Number(it.getAttribute('data-i')))});
$('fab-search').addEventListener('click',function(){openSearch('')});
function hashSearch(){var m=location.hash.match(/^#tim=(.+)$/);if(m){try{openSearch(decodeURIComponent(m[1]))}catch(e){}}}window.addEventListener('hashchange',hashSearch);setTimeout(hashSearch,300);
$('hero-search').addEventListener('submit',function(ev){ev.preventDefault();openSearch($('hero-q').value)});
document.addEventListener('keydown',function(ev){var tag=(ev.target.tagName||'').toLowerCase(),typing=tag==='input'||tag==='textarea'||tag==='select';if(ev.key==='Escape'&&!$('sx').hidden){closeSearch();return}if(((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='k')||(ev.key==='/'&&!typing)){ev.preventDefault();openSearch('')}});

/* ---------- settings, status, timers ---------- */
$('settings-toggle').addEventListener('click',function(){$('settings').classList.toggle('open')});
$('save-token').addEventListener('click',function(){var t=$('token').value.trim();try{if(t)sessionStorage.setItem('luan-crawler.token',t);else sessionStorage.removeItem('luan-crawler.token')}catch(e){}$('token').value='';toast('Đã cập nhật quyền truy cập.');refresh()});
function tickClock(){$('clock').textContent='Giờ Việt Nam: '+new Date().toLocaleString('vi-VN',{timeZone:TZ,weekday:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',day:'2-digit',month:'2-digit'})}
async function refresh(){try{await loadSources();$('connect').textContent='● Đã kết nối máy chủ';await loadFeed()}catch(e){$('connect').textContent='● '+e.message;$('connect').style.background='#fff1e8';$('connect').style.color='#c2410c'}}
api('/api/dashboard/status').then(function(r){return r.json()}).then(function(d){state.hosts=d.allowedHosts||[];$('hosts').innerHTML='Website được hỗ trợ: <b>'+state.hosts.map(esc).join('</b>, <b>')+'</b>'+(d.requiresToken&&!token()?' · <span style="color:#e11d48">Cần nhập mã truy cập</span>':'')}).catch(function(){$('hosts').textContent='Không đọc được cấu hình máy chủ.'});
tickClock();setInterval(tickClock,1000);refresh();setInterval(refresh,60000);setInterval(renderWatch,30000);
})();
</script>
<script>
function onScroll(){document.documentElement.classList.toggle('is-scrolled',window.scrollY>40)}onScroll();window.addEventListener('scroll',onScroll,{passive:true});
var navLinks=[].slice.call(document.querySelectorAll('#primary-nav a'));if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){navLinks.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+en.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});['top','watch','data','changes','ecosystem'].forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el)})}
document.getElementById('menu-toggle').addEventListener('click',function(){var n=document.getElementById('primary-nav');n.classList.toggle('open');this.setAttribute('aria-expanded',String(n.classList.contains('open')))});
navLinks.forEach(function(a){a.addEventListener('click',function(){document.getElementById('primary-nav').classList.remove('open');document.getElementById('menu-toggle').setAttribute('aria-expanded','false')})});
</script>
</body></html>`;
}
