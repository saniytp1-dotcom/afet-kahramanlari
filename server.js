// Afete Hazır Kahramanlar · Takım Düellosu sunucusu.
// Öğretmen bilgisayarında çalışır; projektör ekranı http://localhost:PORT/ , tabletler http://<IP>:PORT/tablet
// Hiçbir paket gerektirmez (yalnızca Node yerleşik modülleri). Tek dosya .exe olarak da paketlenebilir (Node SEA).
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const { exec } = require("child_process");
if (process.platform === "win32") { try { require("child_process").execSync("chcp 65001", { stdio: "ignore" }); } catch (e) {} process.title = "Afete Hazir Kahramanlar - Takim Duellosu"; }

const DIR = (() => {
  // .exe olarak çalışırken dosyalar exe'nin yanındadır
  const exeDir = path.dirname(process.execPath);
  if (fs.existsSync(path.join(exeDir, "host.html"))) return exeDir;
  return __dirname;
})();

// ortak içerik (content.js) – sea içinde require kullanılamadığı için vm ile yüklenir
const ctx = { module: { exports: {} } };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(DIR, "content.js"), "utf8"), ctx);
const C = ctx.module.exports;

const COLORS = [{ c: "#DA0815", name: "red" }, { c: "#1f6fd1", name: "blue" }];
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const now = () => Date.now();

// ---------------- state ----------------
// ---------------- rooms (each teacher screen has its own class code) ----------------
let S, timers, clients, R;
const rooms = new Map();
function use(room) { R = room; S = room.S; timers = room.timers; clients = room.clients; }
function getRoom(code) {
  code = String(code || "0000").replace(/[^0-9A-Za-z]/g, "").slice(0, 8) || "0000";
  let room = rooms.get(code);
  if (!room) { room = { code, timers: {}, clients: new Set(), seen: now() }; rooms.set(code, room); use(room); fresh(); }
  room.seen = now();
  use(room);
  return room;
}
/** setTimeout that remembers which room it belongs to */
function later(k, fn, ms) { const room = R; clearT(k); timers[k] = setTimeout(() => { use(room); delete room.timers[k]; fn(); broadcast(); }, ms); }
function fresh() {
  R.S = S = {
    teams: [], // {id, name, color, score, online}
    phase: "lobby",
    done: {},
    sc: null, hz: null, bag: null, mem: null,
    lastEvent: null,
  };
}
const clearT = (k) => { if (timers[k]) { clearTimeout(timers[k]); delete timers[k]; } };
const team = (id) => S.teams.find((t) => t.id === id);
const addScore = (id, n) => { const t = team(id); if (t) t.score += n; };
const event = (e) => { S.lastEvent = Object.assign({ at: now(), n: (S.lastEvent?.n || 0) + 1 }, e); };

// ---------------- SSE ----------------
function broadcast() {
  const msg = `data: ${JSON.stringify({ S, now: now() })}\n\n`;
  for (const c of clients) c.res.write(msg);
}
setInterval(() => {
  for (const room of rooms.values()) for (const c of room.clients) c.res.write(": ping\n\n");
  // forget rooms nobody used for 6 hours
  for (const [code, room] of rooms) if (!room.clients.size && now() - room.seen > 6 * 3600e3) { for (const t of Object.values(room.timers)) clearTimeout(t); rooms.delete(code); }
}, 15000);
function online() {
  for (const t of S.teams) t.online = [...clients].filter((c) => c.team === t.id).length;
}

// ---------------- rounds ----------------
const SC_TIME = 20000, HZ_TIME = 90000, BAG_TIME = 60000;
const QUESTIONS = Object.entries(C.STORIES).flatMap(([k, st]) => st.steps.map((s, i) => ({ k, i })));

function startScenario(count) {
  const pick = shuffle(QUESTIONS).slice(0, count || 6);
  S.phase = "scenario";
  S.sc = { list: pick, i: -1, stage: "intro", deadline: 0, answers: {}, order: [], gained: {} };
  event({ type: "round", round: "scenario" });
}
function scQuestion() {
  const sc = S.sc;
  sc.i++;
  if (sc.i >= sc.list.length) { endRound("scenario"); return; }
  const q = sc.list[sc.i];
  const step = C.STORIES[q.k].steps[q.i];
  sc.order = shuffle([0, 1, 2]).slice(0, step.o.length);
  sc.stage = "question"; sc.answers = {}; sc.gained = {};
  sc.start = now(); sc.deadline = now() + SC_TIME;
  later("sc", scReveal, SC_TIME + 300);
}
function scReveal() {
  const sc = S.sc; if (!sc || sc.stage !== "question") return;
  clearT("sc");
  const q = sc.list[sc.i];
  const step = C.STORIES[q.k].steps[q.i];
  for (const t of S.teams) {
    const a = sc.answers[t.id];
    if (a && step.o[a.choice][1]) {
      const left = Math.max(0, sc.deadline - a.t) / SC_TIME;
      const pts = 100 + Math.round(50 * left);
      sc.gained[t.id] = pts; addScore(t.id, pts);
    } else sc.gained[t.id] = 0;
  }
  sc.stage = "reveal";
}

function startHazard() {
  S.phase = "hazard";
  S.hz = { found: {}, deadline: now() + HZ_TIME, freeze: {}, over: false, last: null };
  event({ type: "round", round: "hazard" });
  later("hz", endHazard, HZ_TIME + 300);
}
function endHazard() { if (!S.hz || S.hz.over) return; clearT("hz"); S.hz.over = true; S.done.hazard = true; }

function startBag() {
  S.phase = "bag";
  const bags = {}; for (const t of S.teams) bags[t.id] = [];
  S.bag = { bags, deadline: now() + BAG_TIME, over: false, order: shuffle(C.ITEMS.map((_, i) => i)), result: null };
  event({ type: "round", round: "bag" });
  later("bag", endBag, BAG_TIME + 300);
}
function endBag() {
  const b = S.bag; if (!b || b.over) return;
  clearT("bag"); b.over = true; S.done.bag = true;
  b.result = {};
  for (const t of S.teams) {
    const list = b.bags[t.id] || [];
    const good = list.filter((i) => C.ITEMS[i].ok).length, bad = list.length - good;
    const pts = good * 50 - bad * 50;
    b.result[t.id] = { good, bad, pts };
    addScore(t.id, pts);
  }
}

function startMemory() {
  S.phase = "memory";
  const cards = C.PAIRS.flatMap((p, i) => [{ id: i, side: "a" }, { id: i, side: "b" }]);
  const first = S.teams.length ? S.teams[Math.floor(Math.random() * S.teams.length)].id : null;
  S.mem = { cards: shuffle(cards), open: [], matched: {}, turn: first, lock: false, over: false, last: null };
  event({ type: "round", round: "memory" });
}
function memPick(tid, pos) {
  const m = S.mem; if (!m || m.over || m.lock) return;
  if (m.turn !== tid) return;
  if (m.matched[pos] !== undefined || m.open.includes(pos)) return;
  m.open.push(pos);
  if (m.open.length === 2) {
    const [a, b] = m.open.map((p) => m.cards[p]);
    if (a.id === b.id) {
      m.matched[m.open[0]] = tid; m.matched[m.open[1]] = tid;
      addScore(tid, 100); m.last = { type: "match", team: tid, pair: a.id, at: now() };
      m.open = [];
      if (Object.keys(m.matched).length === m.cards.length) { m.over = true; S.done.memory = true; }
    } else {
      m.lock = true; m.last = { type: "miss", team: tid, at: now() };
      later("mem", () => {
        m.open = []; m.lock = false;
        const others = S.teams.filter((t) => t.id !== tid);
        if (others.length) m.turn = others[0].id;
      }, 1600);
    }
  }
}

function endRound(r) { S.done[r] = true; if (r === "scenario") S.sc.stage = "done"; }

// ---------------- actions ----------------
function act(body) {
  const a = body.action;
  // tablet actions
  if (a === "join") {
    const name = String(body.name || "").trim().slice(0, 24) || "Takım";
    let t = body.team && team(body.team);
    if (t) { t.name = name; return { team: t.id }; }
    if (S.teams.length >= 2) return { error: "full" };
    const used = S.teams.map((x) => x.color);
    const color = COLORS.find((c) => !used.includes(c.c)).c;
    t = { id: Math.random().toString(36).slice(2, 9), name, color, score: 0, online: 0 };
    S.teams.push(t);
    if (S.bag && !S.bag.over) S.bag.bags[t.id] = [];
    event({ type: "join", team: t.id });
    return { team: t.id };
  }
  if (a === "answer") {
    const sc = S.sc; if (!sc || sc.stage !== "question" || !team(body.team) || sc.answers[body.team]) return {};
    if (now() > sc.deadline) return {};
    sc.answers[body.team] = { choice: Number(body.choice), t: now() };
    if (S.teams.every((t) => sc.answers[t.id])) scReveal();
    return {};
  }
  if (a === "hazard") {
    const hz = S.hz; if (!hz || hz.over || !team(body.team)) return {};
    if ((hz.freeze[body.team] || 0) > now()) return {};
    if (body.key === "__miss") { hz.freeze[body.team] = now() + 2000; return {}; }
    if (!C.HZ[body.key] || hz.found[body.key]) return {};
    hz.found[body.key] = body.team; addScore(body.team, 100);
    hz.last = { key: body.key, team: body.team, at: now() };
    if (Object.keys(hz.found).length === Object.keys(C.HZ).length) endHazard();
    return {};
  }
  if (a === "bag") {
    const b = S.bag; if (!b || b.over || !team(body.team)) return {};
    const list = b.bags[body.team] || (b.bags[body.team] = []);
    const i = Number(body.item);
    if (list.includes(i)) list.splice(list.indexOf(i), 1);
    else if (list.length < 12 && C.ITEMS[i]) list.push(i);
    return {};
  }
  if (a === "mem") { memPick(body.team, Number(body.pos)); return {}; }

  // teacher actions
  if (a === "start") {
    for (const k of ["sc", "hz", "bag", "mem"]) clearT(k);
    if (body.round === "scenario") startScenario(body.count);
    if (body.round === "hazard") startHazard();
    if (body.round === "bag") startBag();
    if (body.round === "memory") startMemory();
    return {};
  }
  if (a === "next" && S.phase === "scenario") { if (S.sc.stage === "question") scReveal(); else scQuestion(); return {}; }
  if (a === "finishRound") {
    if (S.phase === "hazard") endHazard();
    if (S.phase === "bag") endBag();
    if (S.phase === "memory" && S.mem) { S.mem.over = true; S.done.memory = true; }
    if (S.phase === "scenario" && S.sc) { scReveal(); endRound("scenario"); }
    return {};
  }
  if (a === "lobby") { for (const k of ["sc", "hz", "bag", "mem"]) clearT(k); S.phase = "lobby"; return {}; }
  if (a === "final") { S.phase = "final"; event({ type: "final" }); return {}; }
  if (a === "reset") { for (const k of Object.keys(timers)) clearT(k); fresh(); return {}; }
  if (a === "kick") { S.teams = S.teams.filter((t) => t.id !== body.team); return {}; }
  if (a === "score") { addScore(body.team, Number(body.delta) || 0); return {}; }
  return {};
}

// ---------------- http ----------------
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".png": "image/png", ".woff2": "font/woff2", ".svg": "image/svg+xml" };
const ROUTES = { "/": "host.html", "/tablet": "tablet.html", "/t": "tablet.html", "/solo": "index.html" };

function lanIPs() {
  const out = [];
  for (const [name, list] of Object.entries(os.networkInterfaces())) {
    for (const a of list || []) if (a.family === "IPv4" && !a.internal) out.push({ name, ip: a.address });
  }
  // Wi-Fi / hotspot adresleri önce
  out.sort((x, y) => (/wi-?fi|wlan|kablosuz/i.test(y.name) ? 1 : 0) - (/wi-?fi|wlan|kablosuz/i.test(x.name) ? 1 : 0));
  return out;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/events") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive", "X-Accel-Buffering": "no" });
    getRoom(url.searchParams.get("room"));
    const c = { res, team: url.searchParams.get("team") || null };
    const room = R;
    clients.add(c); online();
    res.write(`data: ${JSON.stringify({ S, now: now() })}\n\n`);
    broadcast();
    req.on("close", () => { use(room); clients.delete(c); online(); broadcast(); });
    return;
  }
  if (url.pathname === "/api" && req.method === "POST") {
    let body = "";
    req.on("data", (d) => { body += d; if (body.length > 1e5) req.destroy(); });
    req.on("end", () => {
      let out = {};
      try { const b = JSON.parse(body || "{}"); getRoom(b.room); out = act(b) || {}; } catch (e) { out = { error: String(e.message || e) }; }
      online();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(out));
      broadcast();
    });
    return;
  }
  if (url.pathname === "/info") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ips: lanIPs(), port: PORT, hosted: !!(process.env.RENDER || process.env.HOSTED) }));
    return;
  }
  if (url.pathname === "/favicon.ico") { res.writeHead(204); res.end(); return; }
  const file = ROUTES[url.pathname] || decodeURIComponent(url.pathname).replace(/^\/+/, "");
  const full = path.join(DIR, file);
  if (!full.startsWith(DIR) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) { res.writeHead(404); res.end("Bulunamadı"); return; }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(full)] || "application/octet-stream", "Cache-Control": "no-cache" });
  fs.createReadStream(full).pipe(res);
});

let PORT = Number(process.env.PORT || 8080);
function listen() {
  server.once("error", (e) => {
    if (e.code === "EADDRINUSE" && PORT < 8090) { PORT++; listen(); return; }
    console.error("Sunucu başlatılamadı:", e.message);
  });
  server.listen(PORT, "0.0.0.0", () => {
    const ips = lanIPs();
    console.log("\n  AFETE HAZIR KAHRAMANLAR · Takım Düellosu");
    console.log("  ----------------------------------------");
    console.log(`  Projektör ekranı : http://localhost:${PORT}/`);
    for (const x of ips) console.log(`  Tabletler        : http://${x.ip}:${PORT}/tablet   (${x.name})`);
    if (!ips.length) console.log("  ! Ağ bağlantısı bulunamadı. Bilgisayarı Wi-Fi'ye ya da telefonun erişim noktasına bağlayın.");
    console.log("\n  Bu pencereyi oyun bitene kadar KAPATMAYIN.\n");
    if (process.platform === "win32" && !process.env.NO_BROWSER) exec(`start "" "http://localhost:${PORT}/"`);
  });
}
listen();
