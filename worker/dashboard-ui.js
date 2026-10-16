/** LUAN CRAWLER — landing page UI for Cloudflare Workers (LUAN GROUP emerald style). */
export function dashboardPage() {
  return String.raw`<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#03261d">
<meta name="description" content="LUAN CRAWLER — Nền tảng thu thập, quản lý và đồng bộ dữ liệu website từ nhiều nguồn, xuất Excel và tích hợp MCP.">
<title>LUAN CRAWLER | Nền tảng dữ liệu — LUAN GROUP</title>
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
</style>
</head>
<body>
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="#top" aria-label="LUAN CRAWLER - về đầu trang"><span class="brand-mark">L</span><span class="brand-text"><strong>LUAN CRAWLER</strong><small>BY LUAN GROUP</small></span></a>
    <nav class="nav" id="primary-nav" aria-label="Điều hướng"><a class="active" href="#top">Tổng quan</a><a href="#sources">Thu thập URL</a><a href="#manager">Nguồn dữ liệu</a><a href="#preview">Xuất báo cáo</a><a href="#scheduler">Đồng bộ</a><a href="#ecosystem">MCP &amp; API</a></nav>
    <div class="head-actions"><a class="header-link" href="https://github.com/luanlengoc1991-art/luan-crawler" target="_blank" rel="noopener">GitHub ↗</a><a class="btn btn-mint header-cta" href="#sources">Bắt đầu thu thập ↗</a><button class="mobile-menu" id="menu-toggle" aria-label="Mở menu" aria-expanded="false">☰</button></div>
  </div>
</header>
<main id="overview">
<section class="hero on-dark" id="top">
  <div class="wrap hero-body">
    <div>
      <div class="eyebrow">LUAN CRAWLER · Intelligent data platform</div>
      <h1>Kết nối dữ liệu.<br>Khai thác <span>mọi nguồn.</span></h1>
      <div class="hero-row">
        <div>
          <p class="hero-statement">Thu thập thông tin website, quản lý hàng loạt đường dẫn và đồng bộ dữ liệu liên tục. Tất cả được tổ chức rõ ràng, sẵn sàng xuất Excel, CSV, JSON chỉ với một thao tác.</p>
          <p class="hero-under"><span><b>●</b> Nhiều URL cùng lúc</span><span><b>●</b> Excel · CSV · JSON</span><span><b>●</b> Tích hợp MCP</span></p>
        </div>
        <div class="hero-cta"><a href="#sources" class="btn btn-white btn-arrow">Bắt đầu với một đường dẫn <i>↗</i></a><a href="#ecosystem" class="btn btn-ghost btn-arrow" style="padding-right:24px">Khám phá MCP</a></div>
      </div>
    </div>
    <div class="hero-cards" aria-label="Tổng quan dữ liệu">
      <div class="glass stat"><div class="heading">Nguồn đang theo dõi</div><strong id="stat-total">0</strong><small>Đường dẫn đã thêm</small></div>
      <div class="glass stat"><div class="heading">Thu thập thành công</div><strong id="stat-done">0</strong><small>Nguồn đã quét</small></div>
      <div class="glass stat"><div class="heading">Bản ghi dữ liệu</div><strong id="stat-rows">0</strong><small>Dòng được thu thập</small></div>
      <div class="glass stat"><div class="heading">Đang tự cập nhật</div><strong id="stat-auto">0</strong><small>Nguồn có lịch đồng bộ</small></div>
    </div>
  </div>
</section>

<section class="section" id="sources">
 <div class="wrap import-layout">
  <div>
    <div class="eyebrow">01 · Khởi tạo</div>
    <h2 class="h2">Một nơi nhập link.<br><span>Vô vàn dữ liệu.</span></h2>
    <p class="lead">Dán danh sách website, tạo nguồn dữ liệu, đặt chu kỳ cập nhật và chủ động tải những gì cần thiết. Thiết kế tinh gọn để tập trung vào thao tác quan trọng nhất.</p>
    <div class="step-list">
      <div class="step-item"><span class="step-num">01</span><div><strong>Dán đường dẫn website</strong><span>Mỗi URL một dòng, tối đa 50 nguồn đang quản lý.</span></div></div>
      <div class="step-item"><span class="step-num">02</span><div><strong>Thiết lập chu kỳ làm mới</strong><span>Chọn thủ công hoặc tự cập nhật khi mở ứng dụng.</span></div></div>
      <div class="step-item"><span class="step-num">03</span><div><strong>Quét, kiểm tra và xuất dữ liệu</strong><span>Xem bảng trước khi tải Excel, CSV hoặc JSON.</span></div></div>
    </div>
  </div>
  <div>
   <div class="form-card"><div class="form-card-heading"><strong>Thiết lập nguồn dữ liệu</strong><span class="tag">Multi-URL import</span></div>
    <label class="label" for="urls">URL website bạn muốn thu thập</label>
    <textarea class="textarea" id="urls" spellcheck="false" placeholder="https://vhub.com.vn/du-an/vinhomes-global-gate-ha-long/bang-hang&#10;https://salepro.com/project-detail/vinhomes-green-paradise#quy-can"></textarea>
    <p class="form-help">Mỗi đường dẫn trên một dòng. Tối đa 50 URL trong danh sách, tối đa 12 URL mỗi lượt quét. Trang dùng JavaScript phức tạp có thể cần bộ thu thập chuyên dụng.</p>
    <div class="form-row"><div><label class="label" for="frequency">Tần suất cập nhật</label><select class="select" id="frequency"><option value="0">Tắt tự động</option><option value="5">Mỗi 5 phút</option><option value="15" selected>Mỗi 15 phút</option><option value="30">Mỗi 30 phút</option><option value="60">Mỗi 1 giờ</option></select></div><div><label class="label" for="format">Định dạng xuất dữ liệu</label><select class="select" id="format"><option value="xlsx">Excel (.xlsx)</option><option value="csv">CSV (.csv)</option><option value="json">JSON (.json)</option></select></div></div>
    <div class="button-group"><button class="btn btn-green" id="add">＋ Thêm đường dẫn</button><button class="btn btn-outline" id="scan-all">↻ Quét tất cả</button></div>
    <div class="helper-bar"><b>ⓘ Lưu ý:</b> Danh sách URL được lưu trong trình duyệt của bạn, không đồng bộ giữa các thiết bị.</div>
   </div>
   <div style="text-align:right;margin-top:14px"><button class="btn btn-outline" id="settings-toggle" style="height:42px;font-size:13px">⚙ Cài đặt quyền truy cập</button></div>
   <div class="settings" id="settings"><div class="notice">Access token chỉ lưu trong phiên tab hiện tại và chỉ cần khi máy chủ có cấu hình DASHBOARD_TOKEN.</div><div class="form-row"><div><label class="label" for="token">Access token (nếu có cấu hình)</label><input class="input" id="token" type="password" autocomplete="off" placeholder="Nhập DASHBOARD_TOKEN"></div><div><button class="btn btn-green" id="save-token">Lưu cho phiên này</button></div></div></div>
  </div>
 </div>
</section>

<section class="section sheet-section" id="manager"><div class="wrap">
 <div class="section-head"><div><div class="eyebrow">02 · Quản lý thông minh</div><h2 class="h2">Tất cả nguồn dữ liệu.<br><span>Trong một không gian.</span></h2><p class="lead">Theo dõi nguồn, quản lý trạng thái, quét lại hoặc tải file cho từng website.</p></div><div class="outline-num" aria-hidden="true">02</div></div>
 <div class="panel manager-panel"><div class="manager-toolbar"><div class="toolbar-left"><div class="search-wrap"><input class="input" id="search" aria-label="Tìm nguồn dữ liệu" placeholder="Tìm website, tên nguồn, đường dẫn..."></div><select id="filter" class="select" aria-label="Lọc trạng thái" style="width:190px"><option value="all">Tất cả trạng thái</option><option value="done">Hoàn tất</option><option value="error">Có lỗi</option><option value="pending">Chưa quét</option></select></div><div class="toolbar-actions"><button class="btn btn-dark" id="export-all">⇩ Xuất dữ liệu tất cả</button></div></div>
 <div id="source-list" aria-live="polite"><div class="empty"><span class="big">⌁</span><b>Chưa có nguồn dữ liệu</b><p>Thêm link tại phần Khởi tạo để bắt đầu.</p></div></div>
 <div class="manager-footer"><span class="connection" id="connect">● Đang kiểm tra API</span><span>Dữ liệu của phiên quản lý trên trình duyệt này.</span></div></div>
</div></section>

<section class="section" id="preview"><div class="wrap">
 <div class="section-head"><div><div class="eyebrow">03 · Dữ liệu thực tế</div><h2 class="h2">Dữ liệu rõ ràng.<br><span>Quyết định nhanh hơn.</span></h2><p class="lead">Xem lại bảng dữ liệu đã thu thập trước khi xuất xuống thiết bị.</p></div><div class="outline-num" aria-hidden="true">03</div></div>
 <div class="panel" style="border-radius:var(--r-lg)"><div class="preview-top"><div class="preview-top-left"><select id="preview-source" class="preview-select" aria-label="Chọn nguồn dữ liệu"><option value="">Chọn nguồn dữ liệu</option></select><span class="pill" id="preview-count">0 bản ghi</span></div><div class="preview-top-right"><button class="btn btn-outline" id="import-links" title="Nhập các liên kết con được phát hiện trên trang">＋ Thêm link con</button><button class="btn btn-dark" id="download-current">⇩ Tải bảng dữ liệu</button></div></div><div class="table-scroll" id="table-scroll"><div class="empty"><span class="big">▤</span><b>Chưa có dữ liệu để hiển thị</b><p>Chạy quét để xem kết quả.</p></div></div><div class="preview-meta"><span id="preview-timestamp">Chưa cập nhật</span><span id="preview-type">Crawl4AI &amp; HTTP</span></div></div>
</div></section>

<section class="section band on-dark" id="scheduler"><div class="wrap">
 <div class="section-head"><div><div class="eyebrow">04 · Liên tục cập nhật</div><h2 class="h2">Dữ liệu thay đổi.<br>Hệ thống luôn sẵn sàng.</h2><p class="lead">Kiểm soát nhịp đồng bộ của những nguồn bạn quan tâm.</p></div><div class="outline-num" aria-hidden="true">04</div></div>
 <div class="sync-layout">
  <div class="glass sync-card"><h3>Tự động làm mới</h3><p>Chủ động cấu hình nhịp cập nhật của từng đường dẫn.</p><div class="sync-feature"><div class="sync-symbol">◷</div><div><strong id="schedule-title">Chưa có lịch tự động</strong><br><span id="schedule-text">Thêm URL và chọn chu kỳ quét</span></div></div><div class="notice">Lịch tự động hoạt động khi đang mở trang. Muốn thu thập 24/7 kể cả khi tắt máy, cần thêm Cloudflare Cron và nơi lưu dữ liệu phía máy chủ.</div></div>
  <div class="glass sync-card"><div class="sync-card-title"><h3>Nhật ký hoạt động</h3><button id="clear-logs" class="btn btn-outline">Xóa nhật ký</button></div><p>Những thao tác mới nhất trong phiên làm việc.</p><div id="logs" class="log"><div class="log-line">Chưa có hoạt động nào.</div></div></div>
 </div>
</div></section>

<section class="section" id="ecosystem"><div class="wrap">
 <div class="section-head"><div><div class="eyebrow">05 · Hệ sinh thái LUAN CRAWLER</div><h2 class="h2">Kết nối công cụ.<br><span>Mở rộng khả năng.</span></h2><p class="lead">Dashboard là lớp giao diện phía trước hệ thống LUAN CRAWLER. Máy chủ MCP và API quỹ căn chạy cùng trên Cloudflare Workers, mã nguồn mở trên GitHub.</p></div><div class="outline-num" aria-hidden="true">05</div></div>
 <div class="eco-grid">
  <a class="eco-card feature" href="/mcp" target="_blank" rel="noopener"><span class="num">MCP Server</span><h3>Tra cứu bảng hàng bằng AI</h3><p>Kết nối Claude hoặc AI khác qua <code>/mcp</code>. Tools: <code>list_projects</code>, <code>search_units</code>, <code>get_unit</code>, <code>project_summary</code>, <code>export_excel</code>.</p><span class="go"><i>↗</i> Mở endpoint MCP</span></a>
  <a class="eco-card" href="/export.xlsx?project=vinhomes-global-gate-ha-long" target="_blank" rel="noopener"><span class="num">Excel quỹ căn</span><h3>Mã căn &amp; giá đầy đủ</h3><p>Xuất ngay bảng hàng Vinhomes Global Gate Hạ Long: giá Full, TT sớm, TT tiến độ, giá vay, đơn giá/m².</p><span class="go"><i>⇩</i> Tải file Excel</span></a>
  <a class="eco-card" href="https://github.com/luanlengoc1991-art/luan-crawler" target="_blank" rel="noopener"><span class="num">Mã nguồn</span><h3>GitHub luan-crawler</h3><p>Toàn bộ Worker, dashboard và MCP. Mỗi lần push lên <code>main</code>, Cloudflare tự build và triển khai.</p><span class="go"><i>↗</i> Xem trên GitHub</span></a>
 </div>
</div></section>
</main>
<footer class="footer"><div class="wrap"><div class="footer-main"><div><a href="#top" class="brand"><span class="brand-mark">L</span><span class="brand-text"><strong>LUAN CRAWLER</strong><small>BY LUAN GROUP</small></span></a><p>Nền tảng kết nối, thu thập và khai thác dữ liệu từ nhiều nguồn website trong một không gian làm việc.</p></div><div class="footer-nav"><a href="#top">Tổng quan</a><a href="#sources">Thu thập</a><a href="#manager">Quản lý URL</a><a href="#preview">Xuất file</a><a href="#scheduler">Đồng bộ</a><a href="#ecosystem">MCP &amp; API</a><a href="https://luangroup.asia/du-an" target="_blank" rel="noopener">LUAN GROUP ↗</a></div></div><div class="footer-bottom"><span>© 2026 LUAN GROUP · LUAN CRAWLER</span><span class="session-status">THỜI GIAN PHIÊN: <span id="clock" class="clock">—</span></span><span>Thiết kế cho mọi thiết bị.</span></div></div></footer>
<div id="toast" class="toast" role="status" aria-live="polite"></div>
<script id="app-main-script">
(function(){
'use strict';
var STORAGE='luan-crawler.dashboard.v1';
var sources=[];var selected='';var busy=false;var logs=[];var lastAutoCheck=Date.now();
var $=function(id){return document.getElementById(id)};
var e=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})};
var dateText=function(s){if(!s)return 'Chưa cập nhật';var d=new Date(s);return isNaN(d)?'Chưa cập nhật':d.toLocaleString('vi-VN')};
var number=function(n){return Number(n||0).toLocaleString('vi-VN')};
var host=function(url){try{return new URL(url).hostname}catch{return url}};
var toastTimeout;function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(function(){$('toast').classList.remove('show')},4500)}
function note(message){logs.unshift({t:new Date().toISOString(),text:message});logs=logs.slice(0,25);renderLogs()}
function renderLogs(){$('logs').innerHTML=logs.length?logs.map(function(x){return '<div class="log-line"><span>'+e(new Date(x.t).toLocaleTimeString('vi-VN'))+'</span>'+e(x.text)+'</div>'}).join(''):'<div class="log-line">Chưa có hoạt động trong phiên.</div>'}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(sources.map(function(x){return Object.assign({},x,{rows:(x.rows||[]).slice(0,160),links:(x.links||[]).slice(0,30)})})))}catch(err){toast('Bộ nhớ trình duyệt đầy: dữ liệu mới chỉ còn trong phiên này.')}}
function load(){try{var a=JSON.parse(localStorage.getItem(STORAGE)||'[]');if(Array.isArray(a)){sources=a.filter(function(x){return x&&x.id&&x.url}).slice(0,50).map(function(x){if(x.status==='loading')x.status='pending';return x})}}catch(err){sources=[]}}
function validUrl(value){try{var x=new URL(value);return x.protocol==='https:'&&!x.username&&!x.password&&!x.port}catch{return false}}
function cleanUrl(value){try{var u=new URL(value.trim());u.hash='';return u.href}catch{return value.trim()}}
function render(){var done=sources.filter(function(x){return x.status==='done'}).length;var auto=sources.filter(function(x){return Number(x.frequency)>0}).length;$('stat-total').textContent=number(sources.length);$('stat-done').textContent=number(done);$('stat-rows').textContent=number(sources.reduce(function(n,x){return n+(x.rowCount||0)},0));$('stat-auto').textContent=number(auto);$('schedule-title').textContent=auto?auto+' nguồn đang bật làm mới':'Chưa có lịch tự động';$('schedule-text').textContent=auto?'Chu kỳ kiểm tra theo từng nguồn, khi đang mở trang':'Thêm URL và chọn chu kỳ quét';
var q=$('search').value.toLowerCase(),f=$('filter').value;var visible=sources.filter(function(x){return (x.url.toLowerCase().includes(q)||(x.title||'').toLowerCase().includes(q))&&(f==='all'||x.status===f)});
$('source-list').innerHTML=visible.length?visible.map(function(x){var status=x.status==='done'?'Hoàn tất':x.status==='loading'?'Đang lấy':x.status==='error'?'Có lỗi':'Chưa quét';var name=x.title||host(x.url);return '<div class="source '+(x.id===selected?'active':'')+'"><div class="source-icon">↗</div><div class="source-name" data-select="'+e(x.id)+'" role="button" tabindex="0" style="cursor:pointer"><strong title="'+e(name)+'">'+e(name)+'</strong><span title="'+e(x.url)+'">'+e(x.url)+' · '+(x.frequency?x.frequency+' phút':'Thủ công')+'</span></div><span class="status-tag '+(x.status==='done'?'done':x.status==='error'?'error':x.status==='loading'?'loading':'')+'">'+status+'</span><div class="source-btns"><button title="Quét lại" data-action="scan" data-id="'+e(x.id)+'">↻</button><button title="Tải dữ liệu" data-action="download" data-id="'+e(x.id)+'">⇩</button><button title="Bật/tắt cập nhật" data-action="toggle" data-id="'+e(x.id)+'">'+(x.frequency?'◷':'⊘')+'</button><button title="Xóa nguồn" data-action="remove" data-id="'+e(x.id)+'" style="color:#b78677">×</button></div></div>'}).join(''):'<div class="empty"><span class="big">⌁</span><b>Không tìm thấy nguồn</b><p>Nhập URL hoặc thay bộ lọc.</p></div>';
$('preview-source').innerHTML='<option value="">Chọn nguồn dữ liệu</option>'+sources.map(function(x){return '<option value="'+e(x.id)+'">'+e(x.title||host(x.url))+'</option>'}).join('');if(!sources.some(function(x){return x.id===selected}))selected=sources.length?sources[0].id:'';$('preview-source').value=selected;renderPreview()}
function renderPreview(){var x=sources.find(function(y){return y.id===selected});$('preview-count').textContent=number(x&&x.rowCount||0)+' bản ghi';$('preview-timestamp').textContent=x&&x.fetchedAt?'Cập nhật: '+dateText(x.fetchedAt):'Chưa cập nhật';$('preview-type').textContent=x&&x.kind?x.kind:'Crawl4AI & HTTP';$('import-links').disabled=!(x&&x.links&&x.links.length);var rows=x&&x.rows||[],columns=x&&x.columns||[];if(!columns.length&&rows.length)columns=Object.keys(rows[0]);if(!rows.length||!columns.length){$('table-scroll').innerHTML='<div class="empty"><span class="big">▤</span><b>'+(x&&x.status==='error'?'Không thể thu thập dữ liệu':'Chưa có dữ liệu để hiển thị')+'</b><p>'+e(x&&x.error||'Chạy quét nguồn để xem nội dung trích xuất.')+'</p></div>';return}
$('table-scroll').innerHTML='<table class="data-table"><thead><tr>'+columns.slice(0,16).map(function(c){return '<th>'+e(c)+'</th>'}).join('')+'</tr></thead><tbody>'+rows.slice(0,80).map(function(r){return '<tr>'+columns.slice(0,16).map(function(c){var v=r[c];return '<td title="'+e(v==null?'':v)+'">'+e(v==null?'':(typeof v==='object'?JSON.stringify(v):v))+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table>'}
function addUrls(){var lines=$('urls').value.split(/[\r\n]+/).map(function(x){return x.trim()}).filter(Boolean);var count=0,duplicates=0,invalid=0;for(var value of lines){if(!validUrl(value)){invalid++;continue}var url=cleanUrl(value);if(sources.some(function(x){return cleanUrl(x.url)===url})){duplicates++;continue}if(sources.length>=50)break;sources.push({id:(Date.now()+Math.random()).toString(36).replace('.',''),url:url,title:'',frequency:Number($('frequency').value),status:'pending',rows:[],columns:[],rowCount:0});count++}if(count){selected=sources[sources.length-1].id;save();render();note('Đã thêm '+count+' URL.');$('urls').value=''}toast('Đã thêm '+count+' nguồn'+(duplicates?', trùng '+duplicates:'')+(invalid?', URL không hợp lệ '+invalid:'')+'.');}
function token(){return sessionStorage.getItem('luan-crawler.token')||''}
async function request(path,opts){opts=opts||{};opts.headers=Object.assign({'Accept':'application/json','Content-Type':'application/json'},opts.headers||{});if(token())opts.headers.Authorization='Bearer '+token();var r=await fetch(path,opts);if(!r.ok){var msg='HTTP '+r.status;try{var data=await r.json();msg=data.error||msg}catch(_){}throw new Error(msg)}return r}
async function scanOne(x){if(!x||x.status==='loading')return;var start=Date.now();x.status='loading';x.error='';render();try{var r=await request('/api/dashboard/crawl',{method:'POST',body:JSON.stringify({url:x.url})});var data=await r.json();var previous=x.fetchedAt?JSON.stringify(x.rows||[]):null;x.title=data.title||host(x.url);x.rows=Array.isArray(data.rows)?data.rows:[];x.columns=Array.isArray(data.columns)?data.columns:[];x.rowCount=data.rowCount||x.rows.length;x.links=data.links||[];x.kind=data.kind||'HTML';x.projectId=data.projectId||null;x.fetchedAt=data.fetchedAt||new Date().toISOString();x.status='done';x.lastRun=Date.now();var changed=previous!==null&&previous!==JSON.stringify(x.rows||[]);note('Đã quét '+host(x.url)+': '+x.rowCount+' dòng ('+Math.round((Date.now()-start)/1000)+'s)'+(changed?' · Dữ liệu đã thay đổi.':'.'))}catch(err){x.status='error';x.lastRun=Date.now();x.error=String(err.message||err);note('Lỗi tại '+host(x.url)+': '+x.error)}save();render()}
async function scanGroup(items){if(busy){toast('Hệ thống đang quét, vui lòng đợi thao tác hiện tại.');return}if(!items.length){toast('Chưa có URL cần quét.');return}busy=true;$('scan-all').disabled=true;var queue=items.slice(0,12);var runners=Array.from({length:Math.min(3,queue.length)},async function(){while(queue.length){var x=queue.shift();await scanOne(x)}});await Promise.all(runners);busy=false;$('scan-all').disabled=false;toast('Đã hoàn thành lượt quét '+Math.min(items.length,12)+' nguồn.');if(items.length>12)toast('Chỉ quét tối đa 12 nguồn mỗi lượt để giới hạn tải.');}
function safeName(s){return (s||'du-lieu').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-_]+/gi,'-').slice(0,45)}
function downloadBlob(bytes,name,type){var blob=bytes instanceof Blob?bytes:new Blob([bytes],{type:type});var a=document.createElement('a');var u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},3000)}
function csvEsc(value){var s=String(value==null?'':value);if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
async function exportItems(items){items=items.filter(function(x){return (x.rows||[]).length});if(!items.length){toast('Chưa có dữ liệu. Hãy quét ít nhất một URL thành công.');return}var format=$('format').value;var date=new Date().toISOString().slice(0,10);if(format==='json'){downloadBlob(JSON.stringify(items.map(function(x){return {url:x.url,title:x.title,fetchedAt:x.fetchedAt,columns:x.columns,rows:x.rows}}),null,2),'luan-crawler-'+date+'.json','application/json');return}if(format==='csv'){var lines=[];items.forEach(function(x){var cols=x.columns||Object.keys(x.rows[0]||{});lines.push(csvEsc('Nguồn: '+x.url));lines.push(cols.map(csvEsc).join(','));x.rows.forEach(function(row){lines.push(cols.map(function(k){return csvEsc(row[k])}).join(','))});lines.push('')});downloadBlob('\ufeff'+lines.join('\r\n'),'luan-crawler-'+date+'.csv','text/csv;charset=utf-8');return}
try{var r=await request('/api/dashboard/export',{method:'POST',body:JSON.stringify({sources:items.map(function(x){return {url:x.url,title:x.title,projectId:x.projectId,columns:x.columns,rows:x.rows}})})});var blob=await r.blob();downloadBlob(blob,'LUAN_CRAWLER_'+date+'.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}catch(err){toast('Không xuất được Excel: '+err.message)}}
$('add').addEventListener('click',addUrls);$('scan-all').addEventListener('click',function(){scanGroup(sources)});$('export-all').addEventListener('click',function(){exportItems(sources)});$('download-current').addEventListener('click',function(){exportItems(sources.filter(function(x){return x.id===selected}))});$('search').addEventListener('input',render);$('filter').addEventListener('change',render);$('preview-source').addEventListener('change',function(){selected=this.value;renderPreview()});$('import-links').addEventListener('click',function(){var source=sources.find(function(x){return x.id===selected});if(!source||!source.links)return;var candidates=source.links.map(function(x){return x.url}).filter(function(x){return validUrl(x)&&host(x)===host(source.url)});var count=0;candidates.forEach(function(url){url=cleanUrl(url);if(sources.length<50&&!sources.some(function(x){return x.url===url})){sources.push({id:(Date.now()+Math.random()).toString(36).replace('.',''),url:url,title:'',frequency:source.frequency||0,status:'pending',rows:[],columns:[],rowCount:0});count++}});save();render();note('Đã phát hiện và thêm '+count+' link con từ '+host(source.url));toast('Đã thêm '+count+' liên kết con cùng tên miền.');});$('clear-logs').addEventListener('click',function(){logs=[];renderLogs()});$('settings-toggle').addEventListener('click',function(){$('settings').classList.toggle('open')});$('save-token').addEventListener('click',function(){var t=$('token').value.trim();if(t)sessionStorage.setItem('luan-crawler.token',t);else sessionStorage.removeItem('luan-crawler.token');$('token').value='';toast('Đã cập nhật quyền truy cập cho phiên hiện tại.')});
$('source-list').addEventListener('click',function(event){var btn=event.target.closest('[data-action]');if(btn){var id=btn.getAttribute('data-id'),action=btn.getAttribute('data-action'),x=sources.find(function(y){return y.id===id});if(!x)return;if(action==='scan')scanGroup([x]);if(action==='download')exportItems([x]);if(action==='toggle'){x.frequency=x.frequency?0:Number($('frequency').value)||15;note((x.frequency?'Bật':'Tắt')+' tự cập nhật '+host(x.url));save();render()}if(action==='remove'){sources=sources.filter(function(y){return y.id!==id});save();render();note('Đã xóa nguồn '+host(x.url))}return}var item=event.target.closest('[data-select]');if(item){selected=item.getAttribute('data-select');render()}});
$('source-list').addEventListener('keydown',function(ev){if(ev.key==='Enter'){var item=ev.target.closest('[data-select]');if(item){selected=item.getAttribute('data-select');render()}}});
function tick(){var now=Date.now();if(busy)return;var due=sources.filter(function(x){return x.frequency>0&&x.status!=='loading'&&now-(x.lastRun||0)>x.frequency*60000});if(due.length){scanGroup(due.slice(0,12))}}
setInterval(tick,30000);
function updateClock(){$('clock').textContent=new Date().toLocaleString('vi-VN',{weekday:'short',hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit'})}updateClock();setInterval(updateClock,60000);
load();render();renderLogs();request('/api/dashboard/status',{method:'GET'}).then(function(r){return r.json()}).then(function(data){$('connect').textContent='● '+(data.ready?'API sẵn sàng':'Cần cấu hình');$('connect').style.background=data.ready?'#e7f3e9':'#fff1dc';if(data.requiresToken&&!token())toast('API đang yêu cầu mã truy cập. Mở Cài đặt truy cập.');}).catch(function(){$('connect').textContent='● API chưa tích hợp';$('connect').style.background='#fff0dc';toast('Không kết nối được API dashboard.');});
})();
</script>
<script>
function onScroll(){document.documentElement.classList.toggle('is-scrolled',window.scrollY>40)}onScroll();window.addEventListener('scroll',onScroll,{passive:true});
var navLinks=[].slice.call(document.querySelectorAll('#primary-nav a'));if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){navLinks.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+en.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});['top','sources','manager','preview','scheduler','ecosystem'].forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el)})}
document.getElementById('menu-toggle').addEventListener('click',function(){var n=document.getElementById('primary-nav');n.classList.toggle('open');this.setAttribute('aria-expanded',String(n.classList.contains('open')))});
document.querySelectorAll('#primary-nav a').forEach(function(a){a.addEventListener('click',function(){document.getElementById('primary-nav').classList.remove('open');document.getElementById('menu-toggle').setAttribute('aria-expanded','false')})});
</script>
</body></html>`;
}
