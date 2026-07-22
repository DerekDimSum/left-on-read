/* ============================================================
   Left on Read — group-chat survival game
   The chat feed IS the playfield. Messages stream in; the ones
   that need you light up with inline action chips. Act right,
   act fast — or leave it on read (sometimes the correct move).
   Members = your health. Built on the GO LIVE / 6-Seven engine.
   ============================================================ */

/* ===================== CAST ===================== */

const CAST = {
  tita:    { name: "Tita Baby",   emoji: "👵" },
  lolo:    { name: "Lolo Ben",    emoji: "👴" },
  crush:   { name: "the crush 😳", emoji: "😍" },
  drama:   { name: "Drama Starter", emoji: "🐍" },
  marites: { name: "Marites",     emoji: "🕵️‍♀️" },
  scammer: { name: "cousin (?)",  emoji: "💸" },
  sib:     { name: "kapatid",     emoji: "👶" },
  mom:     { name: "Mommy",       emoji: "👩" },
  ate:     { name: "Ate",         emoji: "👧" },
  friend:  { name: "bestie",      emoji: "🫶" },
  randos:  { name: "+63 9xx",     emoji: "❓" },
};
const CAST_KEYS = Object.keys(CAST);

/* ===================== VOICES (EN / Taglish) ===================== */

const VOICES = {
  en: {
    ambient: [
      "hoy", "HAHAHA", "who's awake", "real", "😭😭", "lmaooo", "grabe",
      "u guys ok over there", "brb", "who's this 😊", "gm ☀️", "where we at",
      "sana all", "😮‍💨", "k", "no bc why", "i'm so tired", "🫡", "amp", "luh",
      "anyone else seeing this", "stop 💀", "omg", "same", "wait what",
    ],
    // Each message maps to ONE correct tool from your action bar.
    types: {
      scam:     { cast: "scammer", text: "pa-GCash lang 500, emergency 🥺 09xx", tool: "report", expire: 5200, onExpire: "lose",
                  ok: "reported the scammer ✓", bad: "you got scammed 💸" },
      crush:    { cast: "crush", text: "uy… you busy? 👉👈", tool: "reply", expire: 4400, onExpire: "lose",
                  ok: "replied in time ❤️", bad: "left the crush on read 💔" },
      fight:    { cast: "drama", text: "@bestie you really said that 😤", tool: "defuse", expire: 4600, onExpire: "lose",
                  ok: "you defused it 🕊️", bad: "it blew up 🔥" },
      chain:    { cast: "tita", text: "Forward to 10 ppl or bad luck 🙏🕯️", tool: "delete", expire: 5600, onExpire: "ok",
                  ok: "deleted the chain ✓", bad: "you forwarded it 💀" },
      troll:    { cast: "drama", text: "edi wow so full of yourself 🙄", tool: "ignore", expire: 5200, onExpire: "ok",
                  ok: "ignored the troll ✓", bad: "you fed the troll 🔥" },
      chismis:  { cast: "marites", text: "psst tea… so apparently ___ 👀", tool: "ignore", expire: 5400, onExpire: "ok",
                  ok: "stayed out of it ✓", bad: "you spread the tea 🫢" },
      sib:      { cast: "sib", text: "pahingi load 🥺 pls pls now", tool: "ignore", expire: 5600, onExpire: "ok",
                  ok: "ignored (you're broke) ✓", bad: "you sent the load 💸" },
      nice:     { cast: "friend", text: "thanks for yesterday ha 🫶 love u", tool: "react", expire: 5200, onExpire: "ok",
                  ok: "showed some love ❤️", bad: "…that was cold 🥶" },
      bday:     { cast: "ate", text: "GUYS it's Marites' bday today!! 🎂", tool: "react", expire: 5400, onExpire: "lose",
                  ok: "you greeted them 🎉", bad: "you missed the bday 😬" },
      stranger: { cast: "mom", text: "who's this? 😊 (new number joined)", tool: "report", expire: 5000, onExpire: "lose",
                  ok: "kicked the stranger 🛡️", bad: "the scammer got in 💀" },
    },
    banners: {
      dead: "💀 THE GC DIED.", banked: "✌️ YOU LEFT ON A HIGH NOTE",
    },
    sys: {
      join: (n) => `${n} joined the group`, leave: (n) => `${n} left the group 👋`,
      added: "Marites added you to the group 🎉",
    },
    milestones: { 25: "the GC is THRIVING 🔥", 50: "your GC went viral 📈", 100: "MEGA GC 👑", 250: "legendary GC 🏆" },
    personas: {
      ghoster:  { t: "The Ghoster",        l: "Left almost everything on read. Somehow survived.",   h: "Ignore a lot (correctly)" },
      online:   { t: "Chronically Online", l: "Replied in 0.2s. Every time. Touch grass.",           h: "Act on everything, fast" },
      admin:    { t: "GC Admin Energy",    l: "Killed the scams, kept the peace. The backbone.",     h: "Report 3 scams in one run" },
      peace:    { t: "The Peacemaker",     l: "Defused every fight. Nobody left angry.",             h: "Defuse 3 fights" },
      marites:  { t: "Certified Marites",  l: "Spread the most tea. Feared. Respected.",             h: "Engage the tea 👀" },
      titasfav: { t: "Tita's Favorite",    l: "Forwarded the chains, fed the trolls 💀",             h: "Take the bait a few times" },
      lurker:   { t: "The Lurker",         l: "Barely typed. Still made it to 2AM.",                 h: "Do almost nothing, survive" },
      scammed:  { t: "The Scammed One",    l: "Sent the load. Clicked the link. Oh no.",             h: "Fall for the scams 😬" },
      crushwin: { t: "Rizz Certified",     l: "Never left the crush on read. Legend.",               h: "Always reply to the crush" },
      menace:   { t: "The Menace",         l: "Left chaos in your wake. Iconic, honestly.",          h: "Make a LOT of wrong calls" },
      kicked:   { t: "Ex-Group Member",    l: "Killed the GC. A legend, briefly.",                   h: "Let the group die" },
      steady:   { t: "The Reliable One",   l: "No drama. Solid member. Rare W.",                     h: "Just… have a normal GC day" },
    },
    ui: {
      leftread: "left on read 👀",
      share: (t, p, time) => `I'm "${t}" — my GC hit ${p} members in ${time} on Left on Read. Survive yours?`,
      vsBanner: (t, p) => `"${t}" grew a ${p}-member GC. Beat that?`,
      win: "Bigger GC! 🎉", tie: "Same size?! 😤", lose: "Theirs was bigger… rematch?",
      collected: (n, total) => `🎭 Personas: ${n}/${total}`,
      newUnlock: "✨ NEW YOU:", newMulti: (n) => `✨ ${n} NEW SIDES OF YOU:`,
      shareBtn: "📤 Share with the GC", leaveConfirm: "leave? tap again",
      howTo: "You're in the group chat and it never stops. Read each message and hit the right move from your bar — reply to the crush, report the scam, defuse the fight… or leave it on read. Some things you should NOT touch. Keep the group alive.",
    },
  },
};

// Your action bar — the toolkit YOU decide how to use.
const TOOLS = [
  { id: "react",  emoji: "❤️", name: "React" },
  { id: "reply",  emoji: "💬", name: "Reply" },
  { id: "defuse", emoji: "🛡️", name: "Defuse" },
  { id: "report", emoji: "🚫", name: "Report" },
  { id: "delete", emoji: "🗑️", name: "Delete" },
  { id: "ignore", emoji: "🙈", name: "Ignore" },
];

function voice() { return VOICES.en; }

/* ===================== PERSONAS (archetypes) ===================== */

const STAMPS = { PINNED: "#2e7d32", "SEEN ✓✓": "#1565c0", MUTED: "#e65100", BLOCKED: "#c62828" };
const PERSONAS = [
  { id: "kicked",   by: "the_group",     emoji: "🚪", stamp: "BLOCKED",
    match: (s) => s.ending === "dead" },
  { id: "scammed",  by: "GCash",         emoji: "💸", stamp: "MUTED",
    match: (s) => s.scammed >= 2 },
  { id: "admin",    by: "the_admins",    emoji: "🛡️", stamp: "PINNED",
    match: (s) => s.scamsReported >= 3 },
  { id: "peace",    by: "everyone",      emoji: "🕊️", stamp: "PINNED",
    match: (s) => s.fightsDefused >= 3 },
  { id: "crushwin", by: "the_crush",     emoji: "😍", stamp: "SEEN ✓✓",
    match: (s) => s.crushReplied >= 2 && s.crushMissed === 0 },
  { id: "menace",   by: "the_admins",    emoji: "😈", stamp: "MUTED",
    match: (s) => s.wrong >= 6 },
  { id: "marites",  by: "the_barangay",  emoji: "🕵️‍♀️", stamp: "SEEN ✓✓",
    match: (s) => s.chismisEngaged >= 2 },
  { id: "titasfav", by: "Tita Baby",     emoji: "📿", stamp: "MUTED",
    match: (s) => s.baitTaken >= 3 },
  { id: "online",   by: "your_therapist", emoji: "⚡", stamp: "SEEN ✓✓",
    match: (s) => s.acted >= 20 && s.leftOnRead <= 2 },
  { id: "ghoster",  by: "everyone",      emoji: "👻", stamp: "SEEN ✓✓",
    match: (s) => s.leftOnRead >= 8 && s.acted <= s.leftOnRead },
  { id: "lurker",   by: "nobody",        emoji: "🫥", stamp: "PINNED",
    match: (s) => s.acted + s.leftOnRead <= 12 && s.peak >= 15 },
  { id: "steady",   by: "the_group",     emoji: "🙂", stamp: "PINNED",
    match: () => true },
];
function personaText(id) { const v = voice().personas[id]; return { title: v.t, line: v.l }; }
function pickPersona(s) {
  const p = PERSONAS.find((x) => x.match(s));
  const t = personaText(p.id);
  return { id: p.id, emoji: p.emoji, stamp: p.stamp, by: p.by, title: t.title, line: t.line };
}

/* ===================== TUNING ===================== */

const MILESTONES = [25, 50, 100, 250, 500];
const TUNING = {
  startMembers: 12,
  ambientEveryMin: 900, ambientEveryMax: 1700,
  actionableGapStart: 2400, actionableGapMin: 900,
  capBase: 1, capMax: 3,
  gainCorrect: 1, loseWrong: 2, loseExpire: 1,
  reviveMembers: 8,
  maxRows: 13,
  leaveMinSec: 15,
};

/* ===================== STATE ===================== */

const state = {
  running: false, paused: false, pausedAt: 0,
  lang: "en", handle: "you",
  members: TUNING.startMembers, peak: TUNING.startMembers,
  streak: 0, bestStreak: 0, elapsed: 0,
  actives: [],          // live actionable messages: {el, def, id, spawnedAt, resolved, timerBar}
  target: null,         // the message your next tool applies to
  seq: 0,
  lastFrame: 0, lastSecondTick: 0, nextAmbient: 0, nextActionable: 0,
  leaveArmedUntil: 0,
  mercyUsed: false, challenger: null, loopId: 0,
  stats: null,
};
function freshStats() {
  return {
    acted: 0, leftOnRead: 0, correct: 0, wrong: 0,
    scamsReported: 0, scammed: 0, fightsDefused: 0,
    chismisEngaged: 0, baitTaken: 0, crushReplied: 0, crushMissed: 0,
    ending: null, peak: 0, survived: 0,
  };
}

const TICK_MS = 16;
function startLoop() { clearInterval(state.loopId); state.loopId = setInterval(() => gameLoop(performance.now()), TICK_MS); startMusic(); }
function stopLoop() { clearInterval(state.loopId); stopMusic(); }

/* ===================== AUDIO ===================== */

let audioCtx = null, masterGain = null;
const MUTE_KEY = "lorMuted";
let muted = false; try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch { /* ok */ }
function initAudio() {
  if (!audioCtx) { const C = window.AudioContext || window.webkitAudioContext; if (C) { audioCtx = new C(); masterGain = audioCtx.createGain(); masterGain.gain.value = muted ? 0 : 1; masterGain.connect(audioCtx.destination); } }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
function toggleMute() { muted = !muted; try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch { /* ok */ } if (masterGain) masterGain.gain.value = muted ? 0 : 1; $("mute-btn").textContent = muted ? "🔇" : "🔊"; track("mute_toggle", { muted }); }
function beep(freq, dur, type = "sine", vol = 0.05, delay = 0) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime + delay, o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(masterGain); o.start(t); o.stop(t + dur);
}
const sfx = {
  pop()    { beep(880, .06, "sine", .05); },       // message in
  correct(){ beep(660, .07, "sine", .06); beep(990, .09, "sine", .05, .06); },
  wrong()  { beep(150, .18, "sawtooth", .07); },
  leave()  { beep(300, .12, "triangle", .06); beep(200, .18, "triangle", .06, .1); },
  ms()     { beep(880, .1, "square", .06); beep(1100, .2, "square", .06, .12); },
  dead()   { beep(392, .15, "triangle"); beep(262, .25, "triangle", .06, .15); beep(180, .4, "triangle", .07, .3); },
  banked() { beep(523, .12, "triangle"); beep(659, .12, "triangle", .05, .12); beep(784, .22, "triangle", .06, .24); },
};
function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch { /* ok */ } }
function shake() { el.frame.classList.remove("shake"); void el.frame.offsetWidth; el.frame.classList.add("shake"); }
function flashBad() { el.frame.classList.remove("flash-bad"); void el.frame.offsetWidth; el.frame.classList.add("flash-bad"); }

const MELODY = [523, 0, 659, 0, 784, 0, 659, 0];
const music = { timer: 0, step: 0, nextAt: 0 };
function startMusic() {
  if (!audioCtx || music.timer) return;
  music.step = 0; music.nextAt = audioCtx.currentTime + 0.05;
  music.timer = setInterval(() => {
    while (music.nextAt < audioCtx.currentTime + 0.3) {
      const i = music.step % 8; if (MELODY[i]) beep(MELODY[i], 0.08, "sine", 0.014, music.nextAt - audioCtx.currentTime);
      music.nextAt += 0.28; music.step++;
    }
  }, 100);
}
function stopMusic() { clearInterval(music.timer); music.timer = 0; }

/* ===================== ANALYTICS ===================== */

const POSTHOG_KEY = "phc_yofPb4Vtm8mjaJVoyba66aafMxgrrf7kdNhk8ENxEGcJ";
let phReady = false; const phQueue = [];
function initPostHog() {
  if (!POSTHOG_KEY) return;
  if (/^(localhost|127\.|192\.168\.|10\.)/.test(location.hostname)) return;
  const s = document.createElement("script"); s.async = true;
  s.src = "https://us-assets.i.posthog.com/static/array.js";
  s.onload = () => {
    try {
      window.posthog.init(POSTHOG_KEY, { api_host: "https://us.i.posthog.com", autocapture: false, capture_pageview: true });
      window.posthog.register({ lang: state.lang, game: "leftonread" });
      try { if (new URLSearchParams(location.search).has("test")) localStorage.setItem("lorInternal", "1"); if (localStorage.getItem("lorInternal")) window.posthog.register({ internal: true }); } catch { /* ok */ }
      phReady = true; for (const e of phQueue.splice(0)) window.posthog.capture(e.name, e.data);
    } catch { /* ok */ }
  };
  s.onerror = () => phQueue.length = 0;
  document.head.appendChild(s);
}
function track(name, data) {
  try {
    if (window.va) window.va("event", { name, data });
    if (POSTHOG_KEY) { if (phReady) window.posthog.capture(name, data); else if (phQueue.length < 50) phQueue.push({ name, data }); }
    const t = JSON.parse(localStorage.getItem("lorEvents") || "{}"); t[name] = (t[name] || 0) + 1; localStorage.setItem("lorEvents", JSON.stringify(t));
  } catch { /* ok */ }
}

/* ===================== BEST + COLLECTION ===================== */

const BEST_KEY = "lorBest";
function loadBest() { try { const b = JSON.parse(localStorage.getItem(BEST_KEY)) || {}; return { peak: b.peak || 0, time: b.time || 0 }; } catch { return { peak: 0, time: 0 }; } }
function saveBest(b) { try { localStorage.setItem(BEST_KEY, JSON.stringify(b)); } catch { /* ok */ } }
function renderBestLine() { const b = loadBest(); el.bestLine.textContent = `🏆 Biggest GC: ${b.peak} · ⏱ ${fmtTime(b.time)}`; }

const COLL_KEY = "lorPersonas";
function loadColl() { try { return JSON.parse(localStorage.getItem(COLL_KEY)) || {}; } catch { return {}; } }
function collect(id) { const c = loadColl(); const first = !c[id]; c[id] = (c[id] || 0) + 1; try { localStorage.setItem(COLL_KEY, JSON.stringify(c)); } catch { /* ok */ } return first; }
function renderCollLine() { $("coll-line").textContent = voice().ui.collected(Object.keys(loadColl()).length, PERSONAS.length); }
function renderGallery() {
  const coll = loadColl(); const grid = $("gallery-grid"); grid.innerHTML = "";
  for (const p of PERSONAS) {
    const found = !!coll[p.id]; const cell = document.createElement("div"); cell.className = "gallery-cell" + (found ? "" : " locked");
    const name = found ? personaText(p.id).title : "???";
    const sub = found ? `<span class="gallery-count">×${coll[p.id]}</span>` : `<span class="gallery-hint">${voice().personas[p.id].h}</span>`;
    cell.innerHTML = `<span class="gallery-emoji">${found ? p.emoji : "❓"}</span><span class="gallery-name">${name}</span>` + sub;
    grid.appendChild(cell);
  }
  $("gallery-progress").textContent = voice().ui.collected(Object.keys(coll).length, PERSONAS.length);
}

/* ===================== DOM ===================== */

const $ = (id) => document.getElementById(id);
const el = {
  frame: $("game-frame"), hud: $("hud"), chat: $("chat"),
  members: $("members-val"), timer: $("hud-timer"), streakTag: $("streak-tag"),
  chaosBanner: $("chaos-banner"), milestone: $("milestone"), pauseOverlay: $("pause-overlay"),
  fx: $("fx-layer"),
  startScreen: $("start-screen"), adScreen: $("ad-screen"), resultScreen: $("result-screen"),
  bestLine: $("best-line"), newBest: $("new-best"),
};

/* ===================== SETUP / START ===================== */

function startGame() {
  initAudio();
  if (!document.fullscreenElement && el.frame.requestFullscreen) el.frame.requestFullscreen().catch(() => {});
  state.running = true; state.paused = false;
  state.members = TUNING.startMembers; state.peak = TUNING.startMembers;
  state.streak = 0; state.bestStreak = 0; state.elapsed = 0;
  state.actives = []; state.target = null; state.seq = 0; state.mercyUsed = false; state.leaveArmedUntil = 0;
  state.stats = freshStats();
  state.handle = readHandle();

  const now = performance.now();
  state.lastFrame = now; state.lastSecondTick = now;
  state.nextAmbient = now + 500; state.nextActionable = now + 1600;

  el.chat.innerHTML = "";
  el.startScreen.classList.add("hidden"); el.adScreen.classList.add("hidden");
  el.resultScreen.classList.add("hidden"); $("gallery-screen").classList.add("hidden");
  el.pauseOverlay.classList.add("hidden");
  el.hud.classList.remove("hidden"); el.chat.classList.remove("hidden"); $("action-bar").classList.remove("hidden");
  $("leave-btn").textContent = "Leave";
  sysMsg(voice().sys.added, "join");
  updateHud();
  startLoop();
  track("run_start", { challenged: !!state.challenger });
}

/* ===================== MAIN LOOP ===================== */

function gameLoop(now) {
  if (!state.running) return;
  updateClock(now);
  if (!state.running) return;

  // tick actionable timers
  for (const a of state.actives) {
    if (a.resolved) continue;
    const frac = 1 - (now - a.spawnedAt) / a.def.expire;
    if (frac <= 0) { resolveActionable(a, null); continue; }
    a.timerBar.style.width = (frac * 100) + "%";
    a.timerBar.classList.toggle("warn", frac < 0.35);
  }
  refreshTarget();

  // ambient chatter
  if (now >= state.nextAmbient) {
    state.nextAmbient = now + rand(TUNING.ambientEveryMin, TUNING.ambientEveryMax);
    if (liveActionables() < cap()) ambientMsg();
  }

  // actionable spawns (the things that need you)
  if (now >= state.nextActionable && liveActionables() < cap()) {
    spawnActionable();
    const g = Math.max(TUNING.actionableGapMin, TUNING.actionableGapStart - state.peak * 8);
    state.nextActionable = now + g * rand(0.8, 1.2);
  }

  if (state.leaveArmedUntil && now >= state.leaveArmedUntil) { state.leaveArmedUntil = 0; $("leave-btn").textContent = "Leave"; }
}

function updateClock(now) {
  if (now - state.lastSecondTick >= 1000) {
    state.lastSecondTick += 1000; state.elapsed++;
    el.timer.textContent = fmtTime(state.elapsed);
  }
}
function fmtTime(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
function liveActionables() { return state.actives.filter((a) => !a.resolved).length; }
function cap() { return Math.min(TUNING.capMax, TUNING.capBase + Math.floor(state.peak / 40)); }

/* ===================== MEMBERS (health) ===================== */

function changeMembers(delta, who) {
  if (!state.running || delta === 0) return;
  state.members = Math.max(0, state.members + delta);
  el.members.textContent = state.members;
  el.members.classList.remove("gain", "lose");
  void el.members.offsetWidth;
  el.members.classList.add(delta > 0 ? "gain" : "lose");
  if (state.members > state.peak) state.peak = state.members;
  // milestone check (upward)
  if (delta > 0) {
    for (const m of MILESTONES) {
      if (state.peak >= m && !state["ms_" + m]) {
        state["ms_" + m] = true;
        const txt = voice().milestones[m]; if (txt) showMilestone(txt);
        sfx.ms(); buzz([60, 40, 90]); track("member_milestone", { m });
      }
    }
  }
  if (delta > 0 && who) sysMsg(voice().sys.join(who), "join");
  else if (delta < 0 && who) sysMsg(voice().sys.leave(who), "leave");
  if (state.members <= 0) gcDying();
}

function gcDying() {
  state.running = false; stopLoop(); shake(); flashBad(); sfx.dead();
  if (!state.mercyUsed) el.adScreen.classList.remove("hidden"); else endRun("dead");
  track("gc_zero", { peak: state.peak });
}
function reviveGC() {
  track("revive"); state.mercyUsed = true; el.adScreen.classList.add("hidden");
  const now = performance.now(); state.running = true; state.members = 0;
  state.lastFrame = now; state.lastSecondTick = now; state.nextActionable = now + 900;
  changeMembers(TUNING.reviveMembers, "your other friends");
  updateHud(); startLoop();
}

/* ===================== CHAT RENDERING ===================== */

function trimChat() { while (el.chat.children.length > TUNING.maxRows) el.chat.firstChild.remove(); }

function sysMsg(text, kind) {
  const row = document.createElement("div"); row.className = "msg-row sys";
  row.innerHTML = `<span class="sys-pill ${kind || ""}">${text}</span>`;
  el.chat.appendChild(row); trimChat();
}

function ambientMsg() {
  const who = CAST[pick(CAST_KEYS)];
  const row = document.createElement("div"); row.className = "msg-row them";
  row.innerHTML = `<span class="who">${who.emoji} ${who.name}</span><span class="bubble">${pick(voice().ambient)}</span>`;
  el.chat.appendChild(row); trimChat();
  sfx.pop();
}

// A message that needs you: highlighted bubble + timer + inline chips.
function spawnActionable() {
  const key = pick(Object.keys(voice().types));
  const def = { ...voice().types[key], key };
  const who = CAST[def.cast];
  const seq = ++state.seq;

  const row = document.createElement("div");
  row.className = "msg-row them actionable";
  row.innerHTML =
    `<span class="who">${who.emoji} ${who.name}</span>` +
    `<span class="bubble">${def.text}</span>` +
    `<div class="timer-wrap"><div class="timer-bar"></div></div>`;
  el.chat.appendChild(row); trimChat();
  sfx.pop(); buzz(15);

  const a = { el: row, def, seq, spawnedAt: performance.now(), resolved: false, timerBar: row.querySelector(".timer-bar") };
  state.actives.push(a);
  // tap a message to target it (default target = whichever is most urgent)
  row.addEventListener("pointerdown", () => { if (!a.resolved) { state.target = a; refreshTarget(); } });
  refreshTarget();
}

/* Targeting: the player owns the toolkit; the game just points at the
   most urgent unhandled message (or one they tapped to target). */
function getTarget() {
  if (state.target && !state.target.resolved) return state.target;
  let best = null, least = Infinity;
  for (const a of state.actives) {
    if (a.resolved) continue;
    const left = a.def.expire - (performance.now() - a.spawnedAt);
    if (left < least) { least = left; best = a; }
  }
  return best;
}
function refreshTarget() {
  const t = getTarget();
  for (const a of state.actives) if (a.el) a.el.classList.toggle("targeted", a === t && !a.resolved);
}
function applyTool(toolId) {
  if (!state.running || state.paused) return;
  const t = getTarget();
  if (!t) { floatText("nothing to handle", "#8b90a0"); return; }
  resolveActionable(t, toolId);
}

// toolId null = expired (you left it on read).
function resolveActionable(a, toolId) {
  if (a.resolved) return;
  a.resolved = true;
  const def = a.def;
  a.el.classList.remove("actionable", "targeted");
  const tw = a.el.querySelector(".timer-wrap"); if (tw) tw.remove();
  let outcome = "", good = false;

  if (toolId === null) {
    state.stats.leftOnRead++;
    if (def.onExpire === "ok") { good = true; outcome = def.ok; bumpCorrect(0); }
    else { good = false; outcome = def.bad; loseMember(1); if (def.key === "crush") state.stats.crushMissed++; }
  } else {
    state.stats.acted++;
    if (toolId === def.tool) { good = true; outcome = def.ok; creditCorrect(def); bumpCorrect(1); }
    else { good = false; outcome = def.bad; creditWrong(def); loseMember(2); }
  }

  const div = document.createElement("div");
  div.className = "outcome " + (good ? "good" : "bad");
  div.textContent = outcome;
  a.el.appendChild(div);
  if (state.target === a) state.target = null;
  setTimeout(() => { state.actives = state.actives.filter((x) => x !== a); }, 400);
  refreshTarget();
  updateHud();
}

function bumpCorrect(grow) {
  state.stats.correct += grow ? 1 : 0;
  state.streak = grow ? state.streak + 1 : state.streak;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  if (grow) {
    sfx.correct(); buzz(18);
    const gain = TUNING.gainCorrect + Math.floor(state.streak / 5);
    changeMembers(gain, null);
    floatText(`+${gain} 🫂`, "#4cc79a");
  }
}
// sev = how many members leave (wrong tap hurts more than a missed expire)
function loseMember(sev) {
  state.streak = 0;
  sfx.leave(); shake(); buzz(120);
  changeMembers(-Math.max(1, sev || 1), null);
}
function creditCorrect(def) {
  if (def.key === "scam" || def.key === "stranger") state.stats.scamsReported++;
  if (def.key === "fight") state.stats.fightsDefused++;
  if (def.key === "crush") state.stats.crushReplied++;
}
function creditWrong(def) {
  state.stats.wrong++;
  if (def.key === "scam" || def.key === "sib" || def.key === "stranger") state.stats.scammed++;
  if (def.key === "chain" || def.key === "troll") state.stats.baitTaken++;
  if (def.key === "chismis") state.stats.chismisEngaged++;
  if (def.key === "crush") state.stats.crushMissed++;
}

/* ===================== ENDINGS ===================== */

function armLeave() {
  if (!state.running) return;
  if (state.elapsed < TUNING.leaveMinSec) { floatText(voice().ui.leaveConfirm, "#8b90a0"); return; }
  const now = performance.now();
  if (now < state.leaveArmedUntil) { endRun("banked"); return; }
  state.leaveArmedUntil = now + 2000;
  $("leave-btn").textContent = "sure?";
}

function endRun(ending) {
  state.running = false; stopLoop();
  state.actives = [];
  el.pauseOverlay.classList.add("hidden");
  state.stats.ending = ending; state.stats.peak = state.peak; state.stats.survived = state.elapsed;
  showChaosBanner(ending === "banked" ? voice().banners.banked : voice().banners.dead);
  if (ending === "banked") sfx.banked(); else sfx.dead();
  buzz([120, 80, 200]);
  setTimeout(() => { if (!state.running) showResult(); }, 1100);
}

/* ===================== RESULT / CARD ===================== */

let lastPersona = null, cardBlob = null;
function showResult() {
  el.adScreen.classList.add("hidden");
  const best = loadBest();
  const isNew = state.peak > best.peak;
  best.peak = Math.max(best.peak, state.peak); best.time = Math.max(best.time, state.elapsed); saveBest(best);
  el.newBest.classList.toggle("hidden", !isNew);
  $("result-best-line").textContent = `🏆 Biggest GC: ${best.peak}`;
  renderBestLine();

  lastPersona = pickPersona(state.stats);
  const qualified = PERSONAS.filter((p) => p.id === lastPersona.id || (p.id !== "steady" && p.match(state.stats))).map((p) => p.id);
  const newly = [];
  for (const id of qualified) if (collect(id)) { newly.push(id); track("persona_new", { persona: id }); }
  $("new-persona").classList.toggle("hidden", newly.length === 0);
  if (newly.length) {
    const names = newly.map((id) => { const p = PERSONAS.find((x) => x.id === id); return `${p.emoji} ${personaText(id).title}`; }).join(" · ");
    $("new-persona").textContent = `${newly.length > 1 ? voice().ui.newMulti(newly.length) : voice().ui.newUnlock} ${names}`;
  }
  $("result-coll-line").textContent = voice().ui.collected(Object.keys(loadColl()).length, PERSONAS.length);
  renderCollLine();

  renderCard(lastPersona, false);
  const stampFor = lastPersona;
  setTimeout(() => { if (lastPersona !== stampFor) return; renderCard(stampFor, true); sfx.pop(); shake(); buzz([60, 40, 120]); const img = $("card-preview"); img.classList.remove("slam"); void img.offsetWidth; img.classList.add("slam"); }, 700);

  const vs = $("versus-result"); let beat = null;
  if (state.challenger) {
    const them = state.challenger; beat = state.peak > them.peak;
    const ui = voice().ui; const verdict = state.peak > them.peak ? ui.win : state.peak === them.peak ? ui.tie : ui.lose;
    vs.textContent = `🥊 ${state.peak} — ${them.peak} "${them.title}" · ${verdict}`; vs.classList.remove("hidden");
  } else vs.classList.add("hidden");

  track("run_end", { peak: state.peak, survived: state.elapsed, ending: state.stats.ending, persona: lastPersona.id, acted: state.stats.acted, leftOnRead: state.stats.leftOnRead, newBest: isNew, revived: state.mercyUsed, challenged: !!state.challenger, beatChallenger: beat });
  el.resultScreen.classList.remove("hidden");
}

// The GC-screenshot wrapped card.
function renderCard(p, withStamp = true) {
  const cv = $("card-canvas"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
  const F = "'Comic Sans MS','Chalkboard SE',sans-serif";
  ctx.fillStyle = "#0c0d12"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#15171e"; ctx.fillRect(20, 20, W - 40, H - 40);
  ctx.strokeStyle = "#2b2f3d"; ctx.lineWidth = 3; ctx.strokeRect(20, 20, W - 40, H - 40);
  // header like a chat
  ctx.fillStyle = "#f7476b"; ctx.fillRect(20, 20, W - 40, 54);
  ctx.fillStyle = "#fff"; ctx.font = `bold 30px ${F}`; ctx.textAlign = "center";
  ctx.fillText("💬 THE BARKADA GC · WRAPPED", W / 2, 58);
  // persona photo
  ctx.fillStyle = "#22242e"; ctx.beginPath(); ctx.arc(110, 150, 48, 0, 7); ctx.fill();
  ctx.strokeStyle = "#f7476b"; ctx.lineWidth = 4; ctx.stroke();
  ctx.font = "54px serif"; ctx.fillText(p.emoji, 110, 170);
  ctx.textAlign = "left"; ctx.fillStyle = "#eceaf0"; ctx.font = `bold 34px ${F}`;
  ctx.fillText("@" + (state.handle || "you"), 180, 140);
  ctx.fillStyle = "#8b90a0"; ctx.font = `26px ${F}`;
  ctx.fillText(`survived to ${fmtTime(state.elapsed)} · ${new Date().toISOString().slice(0, 10)}`, 180, 178);
  // caption
  ctx.fillStyle = "#8b90a0"; ctx.font = `28px ${F}`; ctx.fillText("this run I was:", 60, 248);
  ctx.fillStyle = "#eceaf0"; ctx.font = `bold 48px ${F}`; wrapText(ctx, p.title, 60, 300, 780, 54);
  // big number
  ctx.fillStyle = "#22242e"; ctx.fillRect(60, 390, 780, 250); ctx.strokeStyle = "#2b2f3d"; ctx.lineWidth = 3; ctx.strokeRect(60, 390, 780, 250);
  ctx.textAlign = "center"; ctx.font = "120px serif"; ctx.fillText(p.emoji, 250, 560);
  ctx.fillStyle = "#4cc79a"; ctx.font = `bold 92px ${F}`; ctx.fillText(String(state.peak), 610, 530);
  ctx.fillStyle = "#8b90a0"; ctx.font = `24px ${F}`; ctx.fillText("BIGGEST GC", 610, 575);
  // wrapped stats
  ctx.textAlign = "left"; ctx.fillStyle = "#eceaf0"; ctx.font = `28px ${F}`;
  ctx.fillText(`✅ ${state.stats.acted} handled   👀 ${state.stats.leftOnRead} left on read`, 60, 700);
  ctx.fillText(`🔥 best streak ${state.bestStreak}   ⏱ ${fmtTime(state.elapsed)}`, 60, 742);
  // comment
  const bub = (y, h) => { ctx.fillStyle = "#22242e"; if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(60, y, 780, h, 18); ctx.fill(); } else ctx.fillRect(60, y, 780, h); };
  bub(780, 118);
  ctx.fillStyle = "#8f7bff"; ctx.font = `bold 28px ${F}`; ctx.fillText(p.by, 84, 820);
  ctx.fillStyle = "#eceaf0"; ctx.font = `28px ${F}`; wrapText(ctx, p.line, 84, 856, 700, 34);
  ctx.textAlign = "right"; ctx.font = "40px serif"; ctx.fillText(p.emoji, 816, 826); ctx.textAlign = "left";
  // stamp
  if (withStamp) {
    ctx.save(); ctx.translate(640, 430); ctx.rotate(-0.14);
    const col = STAMPS[p.stamp]; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 7; ctx.globalAlpha = 0.92; ctx.textAlign = "center";
    ctx.font = `bold 22px ${F}`; ctx.fillText("THE GROUP SAYS:", 0, -52);
    ctx.strokeRect(-200, -40, 400, 84); ctx.font = `bold 40px ${F}`; ctx.fillText(p.stamp, 0, 16);
    ctx.restore(); ctx.globalAlpha = 1;
  }
  const collN = Object.keys(loadColl()).length;
  ctx.textAlign = "center"; ctx.fillStyle = "#8b90a0"; ctx.font = `26px ${F}`;
  ctx.fillText(`🎭 personas: ${collN}/${PERSONAS.length}`, W / 2, 1030);
  ctx.font = `24px ${F}`;
  ctx.fillText("play: " + (location.host + location.pathname).replace(/\/$/, "") + "  ·  #leftonread", W / 2, 1072);

  $("card-preview").src = cv.toDataURL("image/png");
  cardBlob = null; if (withStamp) cv.toBlob((b) => { cardBlob = b; }, "image/png");
}
function wrapText(ctx, text, x, y, maxW, lh, center) {
  const words = String(text).split(" "); let line = "", cy = y; const prev = ctx.textAlign; ctx.textAlign = center ? "center" : "left";
  for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, cy); line = w; cy += lh; } else line = t; }
  ctx.fillText(line, x, cy); ctx.textAlign = prev;
}

/* ===================== SHARE / VERSUS ===================== */

function shareText(p) { return voice().ui.share(p.title, state.peak, fmtTime(state.elapsed)); }
function challengeUrl(p) { const pl = btoa(JSON.stringify({ p: state.peak, t: p.title, l: state.lang })); return `${location.origin}${location.pathname}?vs=${encodeURIComponent(pl)}`; }
function parseChallenge() { try { const raw = new URLSearchParams(location.search).get("vs"); if (!raw) return null; const c = JSON.parse(atob(raw)); if (typeof c.p !== "number" || typeof c.t !== "string") return null; return { peak: c.p, title: c.t.slice(0, 40), lang: VOICES[c.l] ? c.l : null }; } catch { return null; } }
function renderVersusBanner() { state.challenger = parseChallenge(); if (!state.challenger) return; track("challenge_open", { theirPeak: state.challenger.peak }); $("versus-text").textContent = voice().ui.vsBanner(state.challenger.title, state.challenger.peak); $("versus-banner").classList.remove("hidden"); }

async function shareCard() {
  if (!lastPersona) return;
  const text = shareText(lastPersona) + " " + challengeUrl(lastPersona);
  const file = cardBlob && new File([cardBlob], "left-on-read.png", { type: "image/png" });
  try {
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); track("share_card", { method: "native-image", persona: lastPersona.id }); return; }
    if (navigator.share) { await navigator.share({ text }); track("share_card", { method: "native-text", persona: lastPersona.id }); return; }
  } catch { track("share_cancel", { persona: lastPersona.id }); return; }
  if (cardBlob) { const a = document.createElement("a"); a.href = URL.createObjectURL(cardBlob); a.download = "left-on-read.png"; a.click(); URL.revokeObjectURL(a.href); }
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
  track("share_card", { method: "download", persona: lastPersona.id });
  const b = $("share-card-btn"); b.textContent = "✅ Saved + copied!"; setTimeout(() => (b.textContent = voice().ui.shareBtn), 2000);
}
function copyChallenge() {
  if (!lastPersona) return; const text = shareText(lastPersona) + " " + challengeUrl(lastPersona);
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
  track("copy_challenge", { persona: lastPersona.id });
  const b = $("copy-share-btn"); b.textContent = "✅ Copied!"; setTimeout(() => (b.textContent = "🔗 Copy Challenge Link"), 1500);
}
function showMenu() {
  el.resultScreen.classList.add("hidden"); el.adScreen.classList.add("hidden"); $("gallery-screen").classList.add("hidden");
  el.hud.classList.add("hidden"); el.chat.classList.add("hidden"); $("action-bar").classList.add("hidden");
  renderBestLine(); renderCollLine(); el.startScreen.classList.remove("hidden"); track("menu_open");
}

/* ===================== HUD / FX ===================== */

function updateHud() {
  el.members.textContent = state.members;
  if (state.streak >= 3) { el.streakTag.textContent = `🔥 x${state.streak}`; el.streakTag.classList.remove("hidden"); el.streakTag.classList.toggle("fire", state.streak >= 5); }
  else { el.streakTag.classList.add("hidden"); el.streakTag.classList.remove("fire"); }
}
let msTimer = 0;
function showMilestone(t) { el.milestone.textContent = t; el.milestone.classList.remove("hidden"); void el.milestone.offsetWidth; clearTimeout(msTimer); msTimer = setTimeout(() => el.milestone.classList.add("hidden"), 1200); }
let banTimer = 0;
function showChaosBanner(t) { el.chaosBanner.textContent = t; el.chaosBanner.classList.remove("hidden"); void el.chaosBanner.offsetWidth; clearTimeout(banTimer); banTimer = setTimeout(() => el.chaosBanner.classList.add("hidden"), 1000); }
function floatText(text, color) {
  const span = document.createElement("span"); span.className = "fx-float"; span.textContent = text; span.style.color = color;
  span.style.left = (30 + Math.random() * 40) + "%"; span.style.top = "40%";
  el.fx.appendChild(span); setTimeout(() => span.remove(), 800);
}

/* ===================== HELPERS ===================== */
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function rand(a, b) { return a + Math.random() * (b - a); }

/* ===================== LANGUAGE / HANDLE ===================== */
function readHandle() {
  let h = ($("handle-input").value || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 16);
  if (!h) { try { h = localStorage.getItem("lorHandle") || ""; } catch { /* ok */ } }
  if (!h) h = pick(["makulit", "tahimik_lang", "gc_ghost", "always_late", "sana_all"]);
  try { localStorage.setItem("lorHandle", h); } catch { /* ok */ }
  $("handle-input").value = h; return h;
}
function applyLang() {
  const ui = voice().ui;
  $("how-to-text").textContent = ui.howTo;
  $("share-card-btn").textContent = ui.shareBtn;
  renderCollLine();
  if (state.challenger) $("versus-text").textContent = ui.vsBanner(state.challenger.title, state.challenger.peak);
}

// Build the action bar (your toolkit).
function buildActionBar() {
  const bar = $("action-bar"); bar.innerHTML = "";
  for (const t of TOOLS) {
    const b = document.createElement("button");
    b.className = "tool"; b.dataset.tool = t.id;
    b.innerHTML = `<span class="t-emoji">${t.emoji}</span><span class="t-name">${t.name}</span>`;
    b.addEventListener("pointerdown", () => applyTool(t.id));
    bar.appendChild(b);
  }
}

/* ===================== PAUSE SAFETY ===================== */
function onVisibility() {
  if (document.hidden) { if (!state.running || state.paused) return; state.paused = true; state.pausedAt = performance.now(); stopLoop(); el.pauseOverlay.classList.remove("hidden"); }
  else {
    if (!state.paused) return; state.paused = false;
    const now = performance.now(), d = now - state.pausedAt;
    state.nextAmbient += d; state.nextActionable += d; state.lastFrame = now; state.lastSecondTick = now;
    for (const a of state.actives) a.spawnedAt += d;   // don't punish for the pause
    el.pauseOverlay.classList.add("hidden"); startLoop();
  }
}
document.addEventListener("visibilitychange", onVisibility);

/* ===================== WIRE UP ===================== */

state.lang = "en";
initPostHog();
buildActionBar();
renderBestLine(); renderVersusBanner();
applyLang();
$("mute-btn").textContent = muted ? "🔇" : "🔊";
try { $("handle-input").value = localStorage.getItem("lorHandle") || ""; } catch { /* ok */ }
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

$("start-btn").addEventListener("click", startGame);
$("play-again-btn").addEventListener("click", startGame);
$("ad-btn").addEventListener("click", reviveGC);
$("ad-skip-btn").addEventListener("click", () => endRun("dead"));
$("leave-btn").addEventListener("click", armLeave);
$("share-card-btn").addEventListener("click", shareCard);
$("copy-share-btn").addEventListener("click", copyChallenge);
$("menu-btn").addEventListener("click", showMenu);
$("mute-btn").addEventListener("click", toggleMute);
const openGallery = () => { track("gallery_open", { collected: Object.keys(loadColl()).length }); renderGallery(); $("gallery-screen").classList.remove("hidden"); };
$("gallery-btn").addEventListener("click", openGallery);
$("result-coll-line").addEventListener("click", openGallery);
$("gallery-close-btn").addEventListener("click", () => $("gallery-screen").classList.add("hidden"));
