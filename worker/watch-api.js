/**
 * LUAN CRAWLER — watchlist: sources stored in D1, re-checked on a schedule,
 * diffed row by row against the original page so inventory changes surface.
 */
import * as XLSX from "xlsx";
import { allowedHosts, fetchPublic } from "./dashboard-api.js";

const MAX_SOURCES = 200;
const MAX_ROWS = 3000;
const MAX_COLUMNS = 30;
const MAX_CHANGE_ROWS = 600; // detailed change records kept per check
const INTERVALS = [0, 15, 30, 60, 120, 360, 720, 1440];
const ALERT_TYPES = ["added", "removed", "price", "other"];
const VOLATILE = /^(updatedat|updated_at|fetchedat|viewcount|favoritecount|createdat|created_at|lastupdate|timestamp)$/i;
const PRICE_FIELD = /price|gia|giá|vat|total|tien|tiền|phi|phí|kpbt/i;
const CRON_SUBREQUEST_BUDGET = 40;

const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const json = (x, status = 200) => new Response(JSON.stringify(x), { status, headers });
const fail = (msg, status = 400) => json({ error: String(msg) }, status);

// ---------- schema ----------

let schemaReady = false;
async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS sources(
      id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT UNIQUE NOT NULL, name TEXT, tag TEXT, kind TEXT, project_id TEXT,
      interval_min INTEGER NOT NULL DEFAULT 60, alert_on TEXT NOT NULL DEFAULT 'added,removed,price,other',
      created_at INTEGER NOT NULL, last_checked_at INTEGER, last_changed_at INTEGER, seen_at INTEGER NOT NULL DEFAULT 0,
      unseen INTEGER NOT NULL DEFAULT 0, row_count INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'pending',
      error TEXT, columns TEXT, last_summary TEXT, checking_until INTEGER NOT NULL DEFAULT 0)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS items(
      source_id INTEGER NOT NULL, key TEXT NOT NULL, data TEXT NOT NULL, hash TEXT NOT NULL,
      first_seen INTEGER NOT NULL, changed_at INTEGER, removed_at INTEGER, PRIMARY KEY(source_id, key))`),
    db.prepare(`CREATE TABLE IF NOT EXISTS changes(
      id INTEGER PRIMARY KEY AUTOINCREMENT, source_id INTEGER NOT NULL, at INTEGER NOT NULL, key TEXT NOT NULL,
      type TEXT NOT NULL, fields TEXT)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS changes_by_source ON changes(source_id, at DESC)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS changes_by_time ON changes(at DESC)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS checks(
      id INTEGER PRIMARY KEY AUTOINCREMENT, source_id INTEGER NOT NULL, at INTEGER NOT NULL, ms INTEGER,
      status TEXT NOT NULL, added INTEGER DEFAULT 0, removed INTEGER DEFAULT 0, changed INTEGER DEFAULT 0,
      row_count INTEGER DEFAULT 0, error TEXT)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS checks_by_source ON checks(source_id, at DESC)`),
  ]);
  schemaReady = true;
}

// ---------- helpers ----------

function fnv(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

function cellValue(v) {
  if (v == null) return null;
  if (typeof v === "object") v = JSON.stringify(v);
  if (typeof v === "string") return v.slice(0, 1000);
  return v;
}

function rowHash(data) {
  const keys = Object.keys(data).filter((k) => !VOLATILE.test(k)).sort();
  return fnv(JSON.stringify(keys.map((k) => [k, data[k]])));
}

function normalizeUrl(input) {
  const u = new URL(String(input).trim());
  u.hash = "";
  return u.href;
}

function vhubProjectSlug(u) {
  const m = /^(?:www\.)?vhub\.com\.vn$/.test(u.hostname) && u.pathname.match(/^\/du-an\/([^/]+)(?:\/bang-hang)?\/?$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function pickKey(columns, rows) {
  for (const c of columns.slice(0, 3)) {
    const vals = rows.map((r) => String(r[c] ?? "").trim());
    if (vals.every(Boolean) && new Set(vals).size === vals.length) return (r) => String(r[c]).trim();
  }
  return null;
}

async function fetchSource(url, env, deps) {
  const u = new URL(url);
  const slug = vhubProjectSlug(u);
  if (slug && deps.resolveProject && deps.loadUnits) {
    const project = await deps.resolveProject(slug);
    const units = await deps.loadUnits(project.id, { fresh: true });
    const columns = Object.keys(units[0] || {}).slice(0, MAX_COLUMNS);
    return { title: project.name, kind: "Vhub · Quỹ căn", projectId: project.id, columns, rows: units, keyOf: (r) => r.code, subrequests: 1 + Math.ceil(units.length / 200) };
  }
  const page = await fetchPublic(url, allowedHosts(env));
  const columns = (page.columns || Object.keys(page.rows?.[0] || {})).slice(0, MAX_COLUMNS);
  const rows = page.rows || [];
  const keyOf = pickKey(columns, rows) || ((r, i) => (page.kind === "HTML Text" ? "page" : `#${i + 1}·${rowHash(r)}`));
  return { title: page.title, kind: page.kind, projectId: null, columns, rows, keyOf, subrequests: 1 };
}

function diffFields(oldData, newData) {
  const out = [];
  for (const k of new Set([...Object.keys(oldData), ...Object.keys(newData)])) {
    if (VOLATILE.test(k)) continue;
    const o = oldData[k] ?? null, n = newData[k] ?? null;
    if (JSON.stringify(o) !== JSON.stringify(n)) out.push({ f: k, o, n });
  }
  return out;
}

// ---------- core check ----------

export async function checkSource(env, src, deps) {
  const db = env.DB;
  const started = Date.now();
  const now = started;
  try {
    const page = await fetchSource(src.url, env, deps);
    const fresh = new Map();
    page.rows.slice(0, MAX_ROWS).forEach((r, i) => {
      const data = {};
      for (const c of page.columns) data[c] = cellValue(r[c]);
      const key = String(page.keyOf(r, i) ?? `#${i + 1}`).slice(0, 300);
      if (!fresh.has(key)) fresh.set(key, { data, hash: rowHash(data) });
    });

    const existing = new Map();
    const { results } = await db.prepare("SELECT key, data, hash, removed_at FROM items WHERE source_id = ?").bind(src.id).all();
    for (const row of results) existing.set(row.key, row);
    const baseline = existing.size === 0;
    const alertOn = new Set(String(src.alert_on || ALERT_TYPES.join(",")).split(","));

    const writes = [];
    const changeRows = [];
    let added = 0, removed = 0, changed = 0, alerts = 0;
    const record = (key, type, fields) => {
      if (baseline) return;
      if (alertOn.has(type)) alerts++;
      if (changeRows.length < MAX_CHANGE_ROWS) changeRows.push([key, type, fields ? JSON.stringify(fields) : null]);
    };

    for (const [key, item] of fresh) {
      const old = existing.get(key);
      if (!old) {
        added += baseline ? 0 : 1;
        writes.push(db.prepare("INSERT INTO items(source_id, key, data, hash, first_seen, changed_at) VALUES(?,?,?,?,?,?)")
          .bind(src.id, key, JSON.stringify(item.data), item.hash, now, baseline ? null : now));
        record(key, "added", null);
      } else if (old.removed_at) {
        added++;
        writes.push(db.prepare("UPDATE items SET data=?, hash=?, changed_at=?, removed_at=NULL WHERE source_id=? AND key=?")
          .bind(JSON.stringify(item.data), item.hash, now, src.id, key));
        record(key, "added", [{ f: "_restored", o: null, n: true }]);
      } else if (old.hash !== item.hash) {
        const fields = diffFields(JSON.parse(old.data), item.data);
        writes.push(db.prepare("UPDATE items SET data=?, hash=?, changed_at=? WHERE source_id=? AND key=?")
          .bind(JSON.stringify(item.data), item.hash, fields.length ? now : null, src.id, key));
        if (fields.length) {
          changed++;
          record(key, fields.some((x) => PRICE_FIELD.test(x.f)) ? "price" : "other", fields.slice(0, 12));
        }
      }
    }
    for (const [key, old] of existing) {
      if (!fresh.has(key) && !old.removed_at) {
        removed++;
        writes.push(db.prepare("UPDATE items SET removed_at=?, changed_at=? WHERE source_id=? AND key=?").bind(now, now, src.id, key));
        record(key, "removed", null);
      }
    }
    for (const [key, type, fields] of changeRows)
      writes.push(db.prepare("INSERT INTO changes(source_id, at, key, type, fields) VALUES(?,?,?,?,?)").bind(src.id, now, key, type, fields));

    const total = added + removed + changed;
    const summary = { added, removed, changed, baseline, at: now };
    writes.push(db.prepare(`UPDATE sources SET last_checked_at=?, row_count=?, status='ok', error=NULL, kind=?, project_id=?, columns=?,
        name=COALESCE(NULLIF(name,''), ?), last_summary=?, checking_until=0,
        last_changed_at=CASE WHEN ? > 0 THEN ? ELSE last_changed_at END, unseen=unseen + ? WHERE id=?`)
      .bind(now, fresh.size, page.kind, page.projectId, JSON.stringify(page.columns), page.title || new URL(src.url).hostname,
        JSON.stringify(summary), total, now, alerts, src.id));
    writes.push(db.prepare("INSERT INTO checks(source_id, at, ms, status, added, removed, changed, row_count) VALUES(?,?,?,?,?,?,?,?)")
      .bind(src.id, now, Date.now() - started, "ok", added, removed, changed, fresh.size));

    for (let i = 0; i < writes.length; i += 400) await db.batch(writes.slice(i, i + 400));
    return { ok: true, ...summary, alerts, rowCount: fresh.size, subrequests: page.subrequests };
  } catch (e) {
    const msg = String(e?.message || e).slice(0, 500);
    await db.batch([
      db.prepare("UPDATE sources SET last_checked_at=?, status='error', error=?, checking_until=0 WHERE id=?").bind(now, msg, src.id),
      db.prepare("INSERT INTO checks(source_id, at, ms, status, error) VALUES(?,?,?,?,?)").bind(src.id, now, Date.now() - started, "error", msg),
    ]);
    return { ok: false, error: msg, subrequests: 1 };
  }
}

// ---------- scheduled refresh ----------

export async function runScheduled(env, deps) {
  if (!env.DB) return;
  await ensureSchema(env.DB);
  const now = Date.now();
  const { results } = await env.DB.prepare(
    `SELECT * FROM sources WHERE interval_min > 0 AND checking_until < ?
       AND (last_checked_at IS NULL OR last_checked_at + interval_min * 60000 <= ? + 120000)
     ORDER BY COALESCE(last_checked_at, 0) ASC LIMIT 25`).bind(now, now).all();
  let budget = CRON_SUBREQUEST_BUDGET;
  for (const src of results) {
    const estimate = src.kind && src.kind.startsWith("Vhub") ? Math.ceil((src.row_count || 200) / 200) + 2 : 2;
    if (estimate > budget) continue;
    const r = await checkSource(env, src, deps);
    budget -= r.subrequests || estimate;
    if (budget <= 1) break;
  }
}

// ---------- serialization ----------

function publicSource(s) {
  const next = s.interval_min > 0 ? (s.last_checked_at || s.created_at) + s.interval_min * 60000 : null;
  return {
    id: s.id, url: s.url, name: s.name, tag: s.tag, kind: s.kind, projectId: s.project_id,
    intervalMin: s.interval_min, alertOn: String(s.alert_on || "").split(",").filter(Boolean),
    createdAt: s.created_at, lastCheckedAt: s.last_checked_at, lastChangedAt: s.last_changed_at, seenAt: s.seen_at,
    unseen: s.unseen, rowCount: s.row_count, status: s.status, error: s.error,
    summary: s.last_summary ? JSON.parse(s.last_summary) : null, nextCheckAt: next,
    checking: s.checking_until > Date.now(),
  };
}

async function getSource(db, id) {
  const s = await db.prepare("SELECT * FROM sources WHERE id = ?").bind(id).first();
  if (!s) throw Object.assign(new Error("Không tìm thấy nguồn."), { status: 404 });
  return s;
}

async function sourceItems(db, s) {
  const { results: items } = await db.prepare("SELECT key, data, first_seen, changed_at, removed_at FROM items WHERE source_id = ? ORDER BY rowid").bind(s.id).all();
  const { results: recent } = await db.prepare("SELECT key, type, fields, at FROM changes WHERE source_id = ? AND at > ? ORDER BY at DESC LIMIT 2000").bind(s.id, s.seen_at || 0).all();
  const latest = new Map();
  for (const c of recent) if (!latest.has(c.key)) latest.set(c.key, { type: c.type, at: c.at, fields: c.fields ? JSON.parse(c.fields) : null });
  return {
    source: publicSource(s),
    columns: s.columns ? JSON.parse(s.columns) : [],
    items: items.map((it) => ({ key: it.key, data: JSON.parse(it.data), firstSeen: it.first_seen, changedAt: it.changed_at, removedAt: it.removed_at, change: latest.get(it.key) || null })),
  };
}

function excelCell(v) {
  if (v == null) return "";
  if (typeof v !== "string") return v;
  return /^\s*[=+@\-\t\r]/.test(v) ? "'" + v : v;
}

function itemsWorkbook(payload) {
  const { columns, items, source } = payload;
  const status = (it) => (it.removedAt ? "Đã gỡ" : it.change ? { added: "Mới", price: "Đổi giá", other: "Thay đổi", removed: "Đã gỡ" }[it.change.type] : "");
  const rows = [["STT", "Trạng thái", ...columns], ...items.map((it, i) => [i + 1, status(it), ...columns.map((c) => excelCell(it.data[c]))])];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 6 }, { wch: 11 }, ...columns.map(() => ({ wch: 18 }))];
  if (rows.length > 1) ws["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length - 1, c: columns.length + 1 } }) };
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Du_lieu");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["Nguồn", source.name], ["URL gốc", source.url], ["Số bản ghi", source.rowCount], ["Kiểm tra lúc", new Date(source.lastCheckedAt || Date.now()).toISOString()]]), "Nguon");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" });
}

// ---------- HTTP API ----------

export async function handleWatchApi(request, env, deps) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/watch")) return null;
  if (!env.DB) return fail("Chưa cấu hình cơ sở dữ liệu D1 (binding DB).", 503);
  const auth = request.headers.get("Authorization") || (url.searchParams.get("token") ? "Bearer " + url.searchParams.get("token") : "");
  if (env.DASHBOARD_TOKEN && auth !== "Bearer " + env.DASHBOARD_TOKEN) return fail("Không có quyền truy cập. Nhập mã trong Cài đặt truy cập.", 401);
  const db = env.DB;
  await ensureSchema(db);
  const parts = url.pathname.replace(/^\/api\/watch\/?/, "").split("/").filter(Boolean);
  const method = request.method;
  const body = async () => { try { return await request.json(); } catch { return {}; } };

  try {
    // GET /api/watch/sources
    if (parts[0] === "sources" && parts.length === 1 && method === "GET") {
      const { results } = await db.prepare("SELECT * FROM sources ORDER BY (unseen > 0) DESC, COALESCE(last_changed_at, 0) DESC, id DESC").all();
      const sources = results.map(publicSource);
      return json({ now: Date.now(), sources, totals: {
        sources: sources.length, alerts: sources.filter((s) => s.unseen > 0).length,
        rows: sources.reduce((n, s) => n + (s.rowCount || 0), 0), errors: sources.filter((s) => s.status === "error").length,
        nextCheckAt: sources.map((s) => s.nextCheckAt).filter(Boolean).sort((a, b) => a - b)[0] || null,
      } });
    }
    // POST /api/watch/sources  {urls[], name, tag, intervalMin, alertOn[]}
    if (parts[0] === "sources" && parts.length === 1 && method === "POST") {
      const b = await body();
      const urls = [...new Set((Array.isArray(b.urls) ? b.urls : []).map((x) => { try { return normalizeUrl(x); } catch { return null; } }).filter(Boolean))].slice(0, 50);
      if (!urls.length) return fail("Chưa có URL hợp lệ.");
      const count = (await db.prepare("SELECT COUNT(*) AS n FROM sources").first()).n;
      if (count + urls.length > MAX_SOURCES) return fail(`Tối đa ${MAX_SOURCES} nguồn theo dõi.`);
      const hosts = allowedHosts(env);
      const interval = INTERVALS.includes(Number(b.intervalMin)) ? Number(b.intervalMin) : 60;
      const alertOn = (Array.isArray(b.alertOn) ? b.alertOn : ALERT_TYPES).filter((x) => ALERT_TYPES.includes(x));
      const created = [], skipped = [];
      for (const u of urls) {
        const host = new URL(u).hostname.toLowerCase();
        if (new URL(u).protocol !== "https:" || !hosts.some((h) => host === h || host.endsWith("." + h))) { skipped.push({ url: u, reason: "Tên miền chưa được cho phép" }); continue; }
        const r = await db.prepare("INSERT OR IGNORE INTO sources(url, name, tag, interval_min, alert_on, created_at) VALUES(?,?,?,?,?,?) RETURNING id")
          .bind(u, urls.length === 1 && b.name ? String(b.name).slice(0, 120) : null, b.tag ? String(b.tag).slice(0, 60) : null, interval, alertOn.join(","), Date.now()).first();
        if (r) created.push(r.id); else skipped.push({ url: u, reason: "Đã có trong danh sách" });
      }
      return json({ created, skipped });
    }
    // POST /api/watch/seen-all
    if (parts[0] === "seen-all" && method === "POST") {
      await db.prepare("UPDATE sources SET unseen = 0, seen_at = ?").bind(Date.now()).run();
      return json({ ok: true });
    }
    // GET /api/watch/changes?limit=
    if (parts[0] === "changes" && method === "GET") {
      const limit = Math.min(Number(url.searchParams.get("limit")) || 60, 300);
      const { results } = await db.prepare(`SELECT c.source_id, c.at, c.key, c.type, c.fields, s.name, s.url FROM changes c JOIN sources s ON s.id = c.source_id ORDER BY c.at DESC, c.id DESC LIMIT ?`).bind(limit).all();
      return json({ changes: results.map((c) => ({ sourceId: c.source_id, sourceName: c.name, url: c.url, at: c.at, key: c.key, type: c.type, fields: c.fields ? JSON.parse(c.fields) : null })) });
    }

    if (parts[0] === "sources" && parts[1]) {
      const s = await getSource(db, Number(parts[1]));
      const action = parts[2];
      if (!action && method === "DELETE") {
        await db.batch([
          db.prepare("DELETE FROM items WHERE source_id = ?").bind(s.id),
          db.prepare("DELETE FROM changes WHERE source_id = ?").bind(s.id),
          db.prepare("DELETE FROM checks WHERE source_id = ?").bind(s.id),
          db.prepare("DELETE FROM sources WHERE id = ?").bind(s.id),
        ]);
        return json({ ok: true });
      }
      if (!action && method === "PATCH") {
        const b = await body();
        const interval = INTERVALS.includes(Number(b.intervalMin)) ? Number(b.intervalMin) : s.interval_min;
        const alertOn = Array.isArray(b.alertOn) ? b.alertOn.filter((x) => ALERT_TYPES.includes(x)).join(",") : s.alert_on;
        await db.prepare("UPDATE sources SET name = ?, tag = ?, interval_min = ?, alert_on = ? WHERE id = ?")
          .bind(b.name !== undefined ? String(b.name).slice(0, 120) : s.name, b.tag !== undefined ? String(b.tag).slice(0, 60) : s.tag, interval, alertOn, s.id).run();
        return json({ source: publicSource(await getSource(db, s.id)) });
      }
      if (action === "check" && method === "POST") {
        if (s.checking_until > Date.now()) return fail("Nguồn này đang được quét.", 409);
        await db.prepare("UPDATE sources SET checking_until = ? WHERE id = ?").bind(Date.now() + 90000, s.id).run();
        const result = await checkSource(env, s, deps);
        return json({ result, source: publicSource(await getSource(db, s.id)) });
      }
      if (action === "seen" && method === "POST") {
        await db.prepare("UPDATE sources SET unseen = 0, seen_at = ? WHERE id = ?").bind(Date.now(), s.id).run();
        return json({ ok: true });
      }
      if (action === "items" && method === "GET") return json(await sourceItems(db, s));
      if (action === "changes" && method === "GET") {
        const { results } = await db.prepare("SELECT at, key, type, fields FROM changes WHERE source_id = ? ORDER BY at DESC, id DESC LIMIT 300").bind(s.id).all();
        const { results: checks } = await db.prepare("SELECT at, ms, status, added, removed, changed, row_count, error FROM checks WHERE source_id = ? ORDER BY at DESC LIMIT 30").bind(s.id).all();
        return json({ changes: results.map((c) => ({ ...c, fields: c.fields ? JSON.parse(c.fields) : null })), checks });
      }
      if (action === "export.xlsx" && method === "GET") {
        const payload = await sourceItems(db, s);
        const date = new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
        const file = `LUAN_${String(s.name || "nguon").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}_${date}.xlsx`;
        return new Response(itemsWorkbook(payload), { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": `attachment; filename="${file}"`, "Cache-Control": "no-store" } });
      }
    }
    return fail("API không tồn tại.", 404);
  } catch (e) {
    return fail(e.message || String(e), e.status || 500);
  }
}
