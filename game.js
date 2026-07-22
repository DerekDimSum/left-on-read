/* ============================================================
   Wrong Chat — you got added to the wrong group chat.
   They think you're someone else (same name). Figure out WHO
   you're supposed to be from the clues, act in character, and
   don't get exposed — until they drop the party address, then
   talk your way into a plus-one so you can go as yourself.
   Two meters: SUS (health) and LIKES (score). Built on the
   Left on Read / GO LIVE engine.
   ============================================================ */

/* ===================== CAST / NAMES ===================== */

// The name you were mistaken for (assumed identity).
const NAMES = ["Kai", "Sam", "Alex", "Jordan", "Robin", "Casey", "Ezra", "Ari", "Nico", "Wren", "Andie", "Jules"];

/* The group members are fixed CHARACTERS with consistent personalities —
   you learn them across replays ("Rhea's the sharp one, watch her").
   role drives behaviour: impatient double-texts first, sharp is the one
   who asks "is this even the real ___?", ally vouches, nosy asks the
   pointed questions, the rest are flavour/noise. */
const CAST = {
  "Bea":       { emoji: "💅", role: "impatient", tag: "double-texts, zero chill" },
  "Ate Rhea":  { emoji: "🧐", role: "sharp",     tag: "clocks everything" },
  "Migs":      { emoji: "😌", role: "ally",      tag: "always has your back" },
  "Lance":     { emoji: "🎤", role: "nosy",      tag: "asks the pointed questions" },
  "JM":        { emoji: "🤪", role: "chaos",     tag: "pure noise, harmless" },
  "Pia":       { emoji: "🥺", role: "sweet",     tag: "soft, easily won over" },
  "Kuya Deng": { emoji: "😎", role: "chill",     tag: "unbothered, goes with it" },
  "Ysa":       { emoji: "📸", role: "hype",      tag: "lives for the group" },
  "Tonio":     { emoji: "🍻", role: "chill",     tag: "just here for the party" },
  "Mimi":      { emoji: "💬", role: "sweet",     tag: "replies to everything" },
};
const MEMBERS = Object.keys(CAST);
const GROUPS = ["Riverdale Squad 🎉", "Beach Trip 2026 🏖️", "the barkada 💯", "College Besties", "Condo 12F 🍻", "Basketball Team 🏀"];

const AMBIENT = [
  "who's driving", "i'm so excited", "😭😭", "wait what time", "lmaooo",
  "bringing chips", "someone bring ice", "can't wait", "omg finally", "🎉🎉",
  "sino may speaker", "i'll be there", "grabe", "🫶", "let's gooo",
  "who's late this time 👀", "same", "real", "i already told my mom", "🔥",
];

/* ===================== TRAITS =====================
   Each run rolls one value per category → your hidden identity.
   `clue` reveals it (adds to your YOU panel). `q` is a test whose
   right answer only makes sense if you've figured the trait out. */

const TRAITS = {
  diet: {
    veg:  { chip: "🥗 vegetarian",  clue: "you're bringing the vegan dish again right?? 😂 iconic",
            q: "what should we order for you?", right: "🥗 no meat pls", wrong: "🍖 extra bacon" },
    meat: { chip: "🍖 carnivore",   clue: "still on that all-meat diet?? 😅 legend",
            q: "what should we order for you?", right: "🍖 steak, rare", wrong: "🥗 just greens" },
  },
  pace: {
    late: { chip: "⏰ always late",  clue: "classic you, 20 mins late to everything 🙄",
            q: "you gonna be on time tn?", right: "lol we'll see 😌", wrong: "early as always ✨" },
    early:{ chip: "🐦 always early", clue: "you were there before ALL of us last time 🐦",
            q: "you gonna be on time tn?", right: "already ready tbh 🐦", wrong: "knowing me, late 😅" },
  },
  pet: {
    dog:  { chip: "🐕 dog: Miso",   clue: "give Miso a kiss for me 🐕🥺",
            q: "omg send a pic of the baby!!", right: "🐕 Miso says hi", wrong: "🐈 cat's asleep" },
    cat:  { chip: "🐈 cat: Chairman", clue: "how's Chairman Meow 🐈👑",
            q: "send a pic of your baby!!", right: "🐈 chairman is plotting", wrong: "🐕 walking the dog" },
    none: { chip: "🚫 no pets",     clue: "you're still allergic to anything with fur 😷",
            q: "you bringing your pet?", right: "you know I can't 😷", wrong: "🐕 bringing the pup!" },
  },
  vibe: {
    chill: { chip: "😎 the chill one", clue: "you're always so unbothered lol 😎",
             q: "REACT to this cursed pic 👇", right: "😎", wrong: "😱", react: true },
    chaos: { chip: "💀 chaotic",       clue: "you're so unhinged omg 💀 never change",
             q: "REACT to this cursed pic 👇", right: "💀", wrong: "🥰", react: true },
  },
  rel: {
    taken:  { chip: "💘 dating Migs",  clue: "how are you & Migs?? 🥰 relationship goals",
              q: "is Migs coming with you?", right: "ofc, my plus one 🥰", wrong: "who's Migs? 😅" },
    single: { chip: "🦋 single",       clue: "still single and thriving huh 🦋 respect",
              q: "you bringing a date?", right: "just me & my vibes 🦋", wrong: "yeah my partner 💑" },
  },
};
const TRAIT_KEYS = Object.keys(TRAITS);
const DEFLECTS = ["haha 😅", "you know me 😌", "ur funny 😂", "brb", "😭 stop", "we'll see", "lowkey 👀"];

/* ===================== PERSONAS (share card) ===================== */

const STAMPS = { "PLUS ONE": "#2e7d32", "MADE IT": "#1565c0", "SUS": "#e65100", "EXPOSED": "#c62828" };
const PERSONAS = [
  // --- Act 3B endings: the real one showed up ---
  { id: "usurper", by: "the_group", emoji: "👑", stamp: "PLUS ONE",
    match: (s) => s.ending === "usurper" },
  { id: "adopted", by: "the_group", emoji: "🥹", stamp: "MADE IT",
    match: (s) => s.ending === "adopted" },
  { id: "slipped", by: "nobody", emoji: "🫥", stamp: "MADE IT",
    match: (s) => s.ending === "slipped" },
  { id: "busted_real", by: "the_real_one", emoji: "💀", stamp: "EXPOSED",
    match: (s) => s.ending === "busted" },
  // --- Act 3A endings: you kept the room ---
  { id: "exposed_name", by: "the_group", emoji: "🫣", stamp: "EXPOSED",
    match: (s) => s.exposed && s.exposedBy === "name" },
  { id: "exposed",      by: "the_group", emoji: "🚨", stamp: "EXPOSED",
    match: (s) => s.exposed },
  { id: "perfect",      by: "everyone",  emoji: "🕶️", stamp: "PLUS ONE",
    match: (s) => !s.exposed && s.wrongs === 0 && s.yes >= s.members - 1 && s.likes >= 6 },
  { id: "beloved",      by: "everyone",  emoji: "🌟", stamp: "PLUS ONE",
    match: (s) => !s.exposed && s.yes >= s.members - 1 },
  { id: "chameleon",    by: "nobody",    emoji: "🦎", stamp: "PLUS ONE",
    match: (s) => !s.exposed && s.learned >= 5 && s.likes >= 5 },
  { id: "deflector",    by: "the_group", emoji: "🌫️", stamp: "MADE IT",
    match: (s) => !s.exposed && s.deflects >= 6 },
  { id: "barely",       by: "one_person", emoji: "😮‍💨", stamp: "MADE IT",
    match: (s) => !s.exposed && s.yes <= 2 },
  { id: "smooth",       by: "the_group", emoji: "😎", stamp: "PLUS ONE",
    match: (s) => !s.exposed && s.yes >= Math.ceil(s.members / 2) },
  { id: "wallflower",   by: "no_one",    emoji: "🪴", stamp: "MADE IT",
    match: () => true },
];
function personaText(id) { return PERSONAS_TEXT[id]; }
const PERSONAS_TEXT = {
  usurper:      { t: "The Better Kai",    l: "The real one showed up. They took YOUR side. Unreal." },
  adopted:      { t: "Adopted Anyway",    l: "You came clean and they invited you regardless. 🥹" },
  slipped:      { t: "The Ghost",         l: "Left before they could prove anything. No trace." },
  busted_real:  { t: "Caught by the Real One", l: "They brought the actual person in. Brutal." },
  exposed_name: { t: "Caught Red-Handed", l: "They asked your name. You blanked. It's over." },
  exposed:      { t: "Fully Exposed",     l: "One wrong move too many. 'who ARE you??'" },
  perfect:      { t: "The Perfect Impostor", l: "Zero slips. Everyone loved you. Flawless run." },
  beloved:      { t: "Certified Plus-One", l: "The whole group vouched for you. Icon." },
  chameleon:    { t: "The Chameleon",     l: "You became them completely. Nobody suspected a thing." },
  deflector:    { t: "The Master Deflector", l: "Dodged every question. Still got the invite. Legend." },
  barely:       { t: "Barely Crashed It", l: "You're going… to sit alone in the corner." },
  smooth:       { t: "Smooth Operator",  l: "Talked your way in. Half the group's got your back." },
  wallflower:   { t: "The Wallflower",   l: "Kept your head down. Made it out clean." },
};
const PERSONA_HINT = {
  usurper: "Out-Kai the real Kai", adopted: "Confess to a group that loves you",
  slipped: "Leave before they prove it", busted_real: "Get caught by the real one",
  exposed_name: "Fail a name test", exposed: "Rack up too much sus", perfect: "Flawless run, everyone yes",
  beloved: "Get everyone to say yes", chameleon: "Learn all 5 traits + charm", deflector: "Deflect 6+ times",
  barely: "Scrape in with ≤2 yes", smooth: "Win over half the group", wallflower: "Just survive quietly",
};

/* ===================== TUNING ===================== */

const TUNING = {
  susMax: 100,
  spawnGapStart: 2300, spawnGapMin: 1300,
  clueChance: 0.42,
  // social escalation when you ignore something aimed at you (no timer!).
  // measured in messages-since-asked, NOT seconds. the first nudge is FREE —
  // you get a real beat to notice it's about you before it ever costs you.
  escalate: [
    { age: 3, trust: 0 },    // "@you?" — just a nudge, no penalty
    { age: 6, trust: -10 },  // "i can see you're online 😐"
    { age: 9, trust: -18 },  // "…is this even the real ___?"
  ],
  ignorePerMsg: -16,         // past the last rung, each ignored message stings
  susPerTrust: 2.2,          // trust lost -> sus gained
  maxRows: 12,
  members: 8,

  /* ---- per-person trust: the social map. every member feels about you
     independently, so no two runs sour the same way. ---- */
  trustStart: { ally: 68, sweet: 58, chill: 52, hype: 52, chaos: 50, nosy: 45, impatient: 45, sharp: 34 },
  trustRight: 13, trustRightOthers: 4,     // nailing X's question wins X over
  trustWrong: -19, trustWrongOthers: -6,   // blowing it costs X the most
  trustDeflect: -2,
  trustReact: 6,                           // reacting to someone's message warms them
  trustIgnore: -9,                         // per escalation rung, aimed at the asker
  trustProbe: -5,                          // asking what you "should" know costs you

  probes: 3,                               // player-initiated info gathering per run
  interrogateBelow: 26,                    // a member this cold starts grilling you
  act3AtSec: 68,                           // when the third act fires
  act3NeedsAvg: 44,                        // below this average trust, the REAL one shows up instead
};
// filler replies you can send ANY time to stay present in the chat
const FILLERS = ["😂", "same", "🫶", "brb", "real", "true", "lmaooo", "😭"];
// player-initiated probes: fish for a clue instead of waiting to be fed one
const PROBES = [
  { say: "wait who all is coming again?", back: "you were literally there when we planned it 😭" },
  { say: "remind me what i said i'd bring?", back: "same as always lol" },
  { say: "sorry catching up — what'd i miss?", back: "scroll up 😂 but ok" },
  { say: "hold on, refresh my memory 😅", back: "you're so forgetful lately" },
];

/* ===================== STATE ===================== */

const state = {
  running: false, paused: false, pausedAt: 0,
  realName: "you", assumedName: "Kai", group: "the GC",
  profile: {},               // hidden truth: {diet:'veg', pace:'late', ...}
  learned: {},               // traits the player has seen clues for
  cluesLeft: [], testsLeft: [],
  sus: 0, likes: 0, streak: 0, bestStreak: 0, elapsed: 0,
  pending: null,             // a message directed at YOU that wants a reply (no timer — social escalation instead)
  cast: [], impatient: "Bea", sharp: "Ate Rhea", ally: "Migs", nosy: "Lance",
  trust: {},                 // name -> 0..100, the social map
  probesLeft: 0, reacted: {}, // player-initiated verbs
  grilledBy: {},             // who has already interrogated you
  act3: null,                // 'vote' | 'real' — which third act you earned
  realHere: false,           // the actual person you're impersonating has arrived
  finaleStarted: false, membersN: TUNING.members,
  seq: 0, lastFrame: 0, lastSecondTick: 0, nextSpawn: 0,
  loopId: 0, challenger: null,
  stats: null,
};
function freshStats() {
  return { rights: 0, wrongs: 0, deflects: 0, misses: 0, learned: 0,
           reacts: 0, probes: 0, grills: 0, ending: null, confront: null,
           exposed: false, exposedBy: null, likes: 0, yes: 0, members: TUNING.members, survived: 0 };
}

const TICK_MS = 16;
function startLoop() { clearInterval(state.loopId); state.loopId = setInterval(() => gameLoop(performance.now()), TICK_MS); startMusic(); }
function stopLoop() { clearInterval(state.loopId); stopMusic(); }

/* ===================== AUDIO ===================== */

let audioCtx = null, masterGain = null;
const MUTE_KEY = "wcMuted";
let muted = false; try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch { /* ok */ }
function initAudio() {
  if (!audioCtx) { const C = window.AudioContext || window.webkitAudioContext; if (C) { audioCtx = new C(); masterGain = audioCtx.createGain(); masterGain.gain.value = muted ? 0 : 1; masterGain.connect(audioCtx.destination); } }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
}
function toggleMute() { muted = !muted; try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch { /* ok */ } if (masterGain) masterGain.gain.value = muted ? 0 : 1; $("mute-btn").textContent = muted ? "🔇" : "🔊"; track("mute_toggle", { muted }); }
function beep(f, d, type = "sine", v = 0.05, delay = 0) {
  if (!audioCtx) return;
  const t = audioCtx.currentTime + delay, o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
  o.connect(g).connect(masterGain); o.start(t); o.stop(t + d);
}
const sfx = {
  pop()   { beep(880, .06, "sine", .05); },
  right() { beep(660, .07, "sine", .06); beep(990, .09, "sine", .05, .06); },
  wrong() { beep(392, .09, "triangle", .05); beep(294, .14, "triangle", .05, .09); },   // soft "hm-mm", not an alarm
  learn() { beep(700, .08, "triangle", .06); beep(1050, .1, "triangle", .05, .08); },
  sus()   { beep(200, .16, "square", .06); },
  yes()   { beep(784, .1, "sine", .06); },
  no()    { beep(220, .16, "triangle", .06); },
  exposed(){ beep(392, .15, "triangle"); beep(262, .25, "triangle", .06, .15); beep(160, .4, "triangle", .07, .3); },
  party() { beep(523, .12, "triangle"); beep(659, .12, "triangle", .05, .12); beep(784, .12, "triangle", .06, .24); beep(1047, .25, "triangle", .06, .36); },
};
function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch { /* ok */ } }
function shake() { el.frame.classList.remove("shake"); void el.frame.offsetWidth; el.frame.classList.add("shake"); }

const MEL = [523, 0, 587, 0, 659, 0, 587, 0];
const music = { timer: 0, step: 0, nextAt: 0 };
function startMusic() { if (!audioCtx || music.timer) return; music.step = 0; music.nextAt = audioCtx.currentTime + 0.05;
  music.timer = setInterval(() => { while (music.nextAt < audioCtx.currentTime + 0.3) { const i = music.step % 8; if (MEL[i]) beep(MEL[i], 0.08, "sine", 0.012, music.nextAt - audioCtx.currentTime); music.nextAt += 0.3; music.step++; } }, 100); }
function stopMusic() { clearInterval(music.timer); music.timer = 0; }

/* ===================== ANALYTICS ===================== */

const POSTHOG_KEY = "phc_yofPb4Vtm8mjaJVoyba66aafMxgrrf7kdNhk8ENxEGcJ";
let phReady = false; const phQueue = [];
function initPostHog() {
  if (!POSTHOG_KEY) return;
  if (/^(localhost|127\.|192\.168\.|10\.)/.test(location.hostname)) return;
  const s = document.createElement("script"); s.async = true; s.src = "https://us-assets.i.posthog.com/static/array.js";
  s.onload = () => { try { window.posthog.init(POSTHOG_KEY, { api_host: "https://us.i.posthog.com", autocapture: false, capture_pageview: true }); window.posthog.register({ game: "wrongchat" }); try { if (new URLSearchParams(location.search).has("test")) localStorage.setItem("wcInternal", "1"); if (localStorage.getItem("wcInternal")) window.posthog.register({ internal: true }); } catch { /* ok */ } phReady = true; for (const e of phQueue.splice(0)) window.posthog.capture(e.name, e.data); } catch { /* ok */ } };
  s.onerror = () => phQueue.length = 0; document.head.appendChild(s);
}
function track(name, data) {
  try { if (window.va) window.va("event", { name, data }); if (POSTHOG_KEY) { if (phReady) window.posthog.capture(name, data); else if (phQueue.length < 50) phQueue.push({ name, data }); }
    const t = JSON.parse(localStorage.getItem("wcEvents") || "{}"); t[name] = (t[name] || 0) + 1; localStorage.setItem("wcEvents", JSON.stringify(t)); } catch { /* ok */ }
}

/* ===================== BEST + COLLECTION ===================== */

const BEST_KEY = "wcBest";
function loadBest() { try { const b = JSON.parse(localStorage.getItem(BEST_KEY)) || {}; return { yes: b.yes || 0, best: b.best || "—" }; } catch { return { yes: 0, best: "—" }; } }
function saveBest(b) { try { localStorage.setItem(BEST_KEY, JSON.stringify(b)); } catch { /* ok */ } }
function renderBestLine() { const b = loadBest(); el.bestLine.textContent = `🏆 Best invite: ${b.yes} yes votes`; }

const COLL_KEY = "wcPersonas";
function loadColl() { try { return JSON.parse(localStorage.getItem(COLL_KEY)) || {}; } catch { return {}; } }
function collect(id) { const c = loadColl(); const first = !c[id]; c[id] = (c[id] || 0) + 1; try { localStorage.setItem(COLL_KEY, JSON.stringify(c)); } catch { /* ok */ } return first; }
function renderCollLine() { $("coll-line").textContent = `You: ${Object.keys(loadColl()).length}/${PERSONAS.length}`; }
function renderGallery() {
  const coll = loadColl(); const grid = $("gallery-grid"); grid.innerHTML = "";
  for (const p of PERSONAS) {
    const found = !!coll[p.id]; const cell = document.createElement("div"); cell.className = "gallery-cell" + (found ? "" : " locked");
    const name = found ? personaText(p.id).t : "???";
    const sub = found ? `<span class="gallery-count">×${coll[p.id]}</span>` : `<span class="gallery-hint">${PERSONA_HINT[p.id]}</span>`;
    cell.innerHTML = `<span class="gallery-emoji">${found ? p.emoji : "❓"}</span><span class="gallery-name">${name}</span>` + sub;
    grid.appendChild(cell);
  }
  $("gallery-progress").textContent = `${Object.keys(coll).length}/${PERSONAS.length}`;
}

/* ===================== DOM ===================== */

const $ = (id) => document.getElementById(id);
const el = {
  frame: $("game-frame"), hud: $("hud"), chat: $("chat"), youPanel: $("you-panel"),
  gcName: $("gc-name"), susBar: $("sus-bar"), susPct: $("sus-pct"), likes: $("likes-val"), timer: $("hud-timer"),
  castStrip: $("cast-strip"), whoTip: $("who-tip"), picker: $("react-picker"),
  replyBar: $("reply-bar"), replyCtx: $("reply-ctx"), replyFillers: $("reply-fillers"),
  milestone: $("milestone"), pauseOverlay: $("pause-overlay"), fx: $("fx-layer"), banner: $("chaos-banner"),
  startScreen: $("start-screen"), resultScreen: $("result-screen"),
  bestLine: $("best-line"),
};

/* ===================== SETUP / START ===================== */

function rollProfile() {
  state.assumedName = pick(NAMES);
  state.group = pick(GROUPS);
  state.profile = {};
  for (const k of TRAIT_KEYS) state.profile[k] = pick(Object.keys(TRAITS[k]));
  state.learned = {};
  // schedule: each trait gets ~1 clue and ~1-2 tests; shuffle
  state.cluesLeft = shuffle([...TRAIT_KEYS]);
  state.testsLeft = shuffle([...TRAIT_KEYS, ...TRAIT_KEYS]);   // two passes of tests
  assignCast();
}

// Build this run's group. Always include the roles that MATTER
// (impatient / sharp / ally / nosy) so escalation + the finale feel
// characterful, then fill the rest with random members.
function assignCast() {
  const roleHolder = (r) => MEMBERS.find((m) => CAST[m].role === r);
  state.impatient = roleHolder("impatient");
  state.sharp = roleHolder("sharp");
  state.ally = roleHolder("ally");
  state.nosy = roleHolder("nosy");
  const core = [state.impatient, state.sharp, state.ally, state.nosy];
  state.hype = roleHolder("hype");
  if (state.hype && !core.includes(state.hype)) core.push(state.hype);
  const rest = shuffle(MEMBERS.filter((m) => !core.includes(m)));
  const n = Math.min(TUNING.members, MEMBERS.length);
  state.cast = shuffle([...core, ...rest].slice(0, n));
  state.membersN = state.cast.length;
}
// pick a random member of THIS run's group
function who() { return pick(state.cast.length ? state.cast : MEMBERS); }

/* ===================== TRUST — the social map =====================
   One global SUS bar made every run feel identical. Now each member
   has their own read on you: the ally starts warm, the sharp one starts
   cold, and who sours (and therefore who grills you, and who votes yes)
   is different every time. */

function initTrust() {
  state.trust = {};
  for (const m of state.cast) state.trust[m] = TUNING.trustStart[CAST[m].role] ?? 50;
  state.trustStartAvg = avgTrust();   // sus measures how far you fall from here
}
function addTrust(name, n) {
  if (!(name in state.trust)) return;
  state.trust[name] = Math.max(0, Math.min(100, state.trust[name] + n));
}
// everyone except `except` moves a little too — the room has a mood
function addTrustAll(n, except) {
  for (const m of state.cast) if (m !== except) addTrust(m, n);
}
function avgTrust() {
  const v = state.cast.map((m) => state.trust[m] ?? 50);
  return v.reduce((a, b) => a + b, 0) / (v.length || 1);
}
function coldest() {
  return state.cast.slice().sort((a, b) => (state.trust[a] ?? 50) - (state.trust[b] ?? 50))[0];
}
function trustTone(v) { return v >= 62 ? "warm" : v >= 38 ? "mid" : "cold"; }

/* SUS is no longer its own invented number — it IS the room turning on you:
   how far the group's average opinion has fallen since you walked in. One
   source of truth (trust), one bar. */
function syncSus(worse) {
  const drop = state.trustStartAvg - avgTrust();
  state.sus = Math.max(0, Math.min(TUNING.susMax, Math.round(drop * TUNING.susPerTrust)));
  updateMeters(); renderCastStrip();
  if (worse) sfx.sus();
  if (state.running && state.sus >= TUNING.susMax) exposeYou("sus");
}

/* The strip of faces under the YOU panel: at a glance, who likes you and
   who's onto you. Tap one to be reminded what they're like. */
function renderCastStrip() {
  const s = el.castStrip; if (!s) return;
  if (s.childElementCount !== state.cast.length) {
    s.innerHTML = "";
    for (const m of state.cast) {
      const b = document.createElement("button");
      b.className = "face"; b.dataset.name = m;
      b.innerHTML = `<span class="face-emoji">${CAST[m].emoji}</span>`;
      b.addEventListener("pointerdown", (e) => { e.stopPropagation(); showWhoTip(m); });
      s.appendChild(b);
    }
  }
  for (const b of s.children) {
    const t = state.trust[b.dataset.name] ?? 50;
    b.className = "face " + trustTone(t);
  }
}
let tipTimer = 0;
function showWhoTip(m) {
  const t = state.trust[m] ?? 50, tone = trustTone(t);
  const feel = tone === "warm" ? "likes you" : tone === "mid" ? "not sure about you" : "onto you";
  el.whoTip.innerHTML = `<b>${CAST[m].emoji} ${m}</b> · ${CAST[m].tag} <span class="tip-${tone}">— ${feel}</span>`;
  el.whoTip.classList.remove("hidden");
  clearTimeout(tipTimer); tipTimer = setTimeout(() => el.whoTip.classList.add("hidden"), 2200);
}

function startGame() {
  initAudio();
  if (!document.fullscreenElement && el.frame.requestFullscreen) el.frame.requestFullscreen().catch(() => {});
  state.realName = readName();
  rollProfile();
  state.running = true; state.paused = false;
  state.sus = 0; state.likes = 0; state.streak = 0; state.bestStreak = 0; state.elapsed = 0;
  state.pending = null; state.finaleStarted = false; state.seq = 0;
  state.act3 = null; state.realHere = false;
  state.probesLeft = TUNING.probes; state.reacted = {}; state.grilledBy = {};
  initTrust();
  state.stats = freshStats(); state.stats.members = state.membersN;

  const now = performance.now();
  state.lastFrame = now; state.lastSecondTick = now; state.nextSpawn = now + 900;

  el.chat.innerHTML = ""; el.youPanel.innerHTML = "";
  el.gcName.textContent = state.group;
  el.startScreen.classList.add("hidden"); el.resultScreen.classList.add("hidden");
  $("gallery-screen").classList.add("hidden"); el.pauseOverlay.classList.add("hidden");
  el.hud.classList.remove("hidden"); el.chat.classList.remove("hidden"); el.youPanel.classList.remove("hidden");
  el.castStrip.classList.remove("hidden"); el.whoTip.classList.add("hidden");
  el.castStrip.innerHTML = ""; closePicker();
  buildReplyBar();
  el.replyBar.classList.remove("hidden");
  renderYouPanel(); renderCastStrip();
  updateMeters();
  if (el.timer) el.timer.textContent = `party in ${TUNING.act3AtSec}s`;
  // opening beat
  sysMsg(`${who()} added ${state.assumedName} to ${state.group}`, "join");
  setTimeout(() => { if (state.running) chatMsg(who(), `finally added you @${state.assumedName}!! 🎉`); }, 600);
  startLoop();
  track("run_start", { challenged: !!state.challenger });
}

/* ===================== MAIN LOOP ===================== */

function gameLoop(now) {
  if (!state.running) return;
  updateClock(now);
  if (!state.running) return;

  // third act — but never mid-question (let a pending reply resolve first)
  if (!state.act3 && !state.pending) {
    // the REAL one can turn up EARLY if the room has already soured on you
    if (state.elapsed >= TUNING.act3AtSec || (state.elapsed > 26 && avgTrust() < 30)) { startAct3(); return; }
  }

  // the chat keeps flowing whether or not you've replied. spawnMessage()
  // decides: escalate an ignored question, drop a clue, ask something, or chatter.
  if (!state.act3 && now >= state.nextSpawn) {
    spawnMessage();
    const gap = Math.max(TUNING.spawnGapMin, TUNING.spawnGapStart - state.elapsed * 12);
    state.nextSpawn = now + gap * rand(0.85, 1.2);
  }
}
function updateClock(now) {
  if (now - state.lastSecondTick >= 1000) { state.lastSecondTick += 1000; state.elapsed++;
    if (!el.timer) return;
    const left = Math.max(0, TUNING.act3AtSec - state.elapsed);
    el.timer.textContent = state.finaleStarted ? "🎉 party time" : `party in ${left}s`;
  }
}

/* ===================== METERS ===================== */

function addLikes(n) { state.likes = Math.max(0, state.likes + n); updateMeters(); }
function updateMeters() {
  const pct = Math.round(state.sus);
  el.susBar.style.width = pct + "%";
  el.susBar.classList.toggle("high", pct >= 60);
  el.susPct.textContent = pct + "% sus";
  el.likes.textContent = state.likes;
}

/* ===================== CHAT ===================== */

function trim() { while (el.chat.children.length > TUNING.maxRows) el.chat.firstChild.remove(); }
function sysMsg(text, kind) { const r = document.createElement("div"); r.className = "msg-row sys"; r.innerHTML = `<span class="sys-pill ${kind || ""}">${text}</span>`; el.chat.appendChild(r); trim(); }
function chatMsg(who, text) { const r = document.createElement("div"); r.className = "msg-row them"; r.innerHTML = `<span class="who">${who}</span><span class="bubble">${text}</span>`; el.chat.appendChild(r); trim(); sfx.pop(); makeReactable(r, who); return r; }
function youMsg(text) { const r = document.createElement("div"); r.className = "msg-row you"; r.innerHTML = `<span class="bubble">${text}</span>`; el.chat.appendChild(r); trim(); return r; }

/* How the group tells you you're doing — emoji reactions on YOUR message,
   exactly like a real chat. This replaces screen-shake / vibration juice:
   if it's feedback, it belongs in the conversation. */
function addReactions(row, emojis, delay = 420) {
  if (!row || !emojis || !emojis.length) return;
  setTimeout(() => {
    if (!state.running || !row.isConnected) return;
    const r = document.createElement("span");
    r.className = "reactions"; r.textContent = emojis.join(" ");
    row.appendChild(r); sfx.pop();
  }, delay);
}

/* "Bea is typing…" — the diegetic version of a countdown bar. Someone is
   visibly composing a reply to you, which is pressure without a clock.
   guard() lets a nag cancel itself if you answered in the meantime. */
function typingThen(name, text, ms = 750, guard = null) {
  const row = document.createElement("div");
  row.className = "msg-row them";
  row.innerHTML = `<span class="who">${name}</span><span class="bubble typing"><i></i><i></i><i></i></span>`;
  el.chat.appendChild(row); trim();
  setTimeout(() => {
    row.remove();
    if (!state.running) return;
    if (guard && !guard()) return;
    chatMsg(name, text);
  }, ms);
}

function renderYouPanel() {
  const p = el.youPanel;
  const learnedKeys = Object.keys(state.learned);
  let html = `<span class="you-label">YOU (@${state.assumedName}):</span>`;
  if (!learnedKeys.length) html += `<span class="you-chip unknown">figuring it out… 🕵️</span>`;
  else for (const k of learnedKeys) html += `<span class="you-chip">${TRAITS[k][state.profile[k]].chip}</span>`;
  p.innerHTML = html;
}

/* ===================== MESSAGE SPAWN ===================== */

/* The beat picker. NOT a fixed script — what happens next depends on the
   state of the room: who's cold, what you still don't know, how you're doing. */
function spawnMessage() {
  // a question aimed at YOU is still hanging → the group reacts to your silence
  if (state.pending) return advancePending();
  if (state.act3) return;                      // the third act runs its own script

  // someone has soured on you enough to start digging — fires because of how
  // you've played, not because the clock said so
  const cold = coldest();
  if (cold && (state.trust[cold] ?? 50) <= TUNING.interrogateBelow &&
      !state.grilledBy[cold] && state.elapsed > 12) return startInterrogation(cold);

  // breathing room: some pure ambient chatter between the real beats
  if (Object.keys(state.learned).length >= 2 && Math.random() < 0.26) { chatMsg(who(), pick(AMBIENT)); return; }
  // early game leans on clues so the profile fills before the pointed questions
  const wantClue = state.cluesLeft.length && (Math.random() < TUNING.clueChance || Object.keys(state.learned).length < 2);
  if (wantClue) return spawnClue();
  if (state.testsLeft.length) return spawnPrompt();
  if (state.cluesLeft.length) return spawnClue();
  chatMsg(who(), pick(AMBIENT));   // filler
}

function spawnClue() { revealTrait(state.cluesLeft.shift()); }

// someone says something that gives away who you're supposed to be
function revealTrait(key, from) {
  if (!key || state.learned[key]) return;
  const t = TRAITS[key][state.profile[key]];
  chatMsg(from || who(), t.clue.replace("{name}", state.assumedName));
  setTimeout(() => {
    if (!state.running || state.learned[key]) return;
    state.learned[key] = true; state.stats.learned++;
    renderYouPanel();
    floatText(`💡 ${t.chip}`, "#4cc79a");
    sfx.learn();
  }, 700);
}

/* A member who's gone cold stops chatting and starts testing you. Higher
   stakes both ways — this is where a bad run spirals or you claw it back. */
function startInterrogation(m) {
  state.grilledBy[m] = true;
  state.stats.grills++;
  chatMsg(m, pick([`ok ${state.assumedName} quick question`, `hold on. ${state.assumedName}.`,
                   `@${state.assumedName} settle something for us`, `humor me ${state.assumedName} 🙂`]));
  setTimeout(() => { if (state.running && !state.pending && !state.act3) spawnPrompt(m, true); }, 950);
}

/* A pointed question aimed at "you". NO countdown — it sits in the feed,
   highlighted, and its replies show up in the bar. Ignore it and the group
   escalates (advancePending). Some are tagged @you, some aren't — part of the
   game is NOTICING it's about you. */
function spawnPrompt(forceAsker, grill) {
  const key = state.testsLeft.length ? state.testsLeft.shift() : pick(TRAIT_KEYS);
  const val = state.profile[key];
  const t = TRAITS[key][val];
  const seq = ++state.seq;
  const isReact = !!t.react;
  const asker = forceAsker || (Math.random() < 0.55 ? (state.nosy || who()) : who());
  const tagged = isReact || grill || Math.random() < 0.5;
  const q = (tagged ? `@${state.assumedName} ` : "") + t.q.replace("{name}", state.assumedName);

  const row = document.createElement("div");
  row.className = "msg-row them actionable" + (grill ? " grill" : "");
  row.innerHTML = `<span class="who">${asker}</span><span class="bubble">${q}</span>`;
  el.chat.appendChild(row); trim(); sfx.pop(); buzz(15);

  const choices = shuffle([
    { label: t.right, kind: "right" },
    { label: t.wrong, kind: "wrong" },
    { label: isReact ? "👍" : pick(DEFLECTS), kind: "deflect" },
  ]);
  state.pending = { el: row, key, seq, choices, asker, isReact, grill: !!grill,
                    weight: grill ? 1.6 : 1, age: 0, escLevel: 0, resolved: false };
  showReplyContext();
}

// resolve the pending question with the reply you tapped (index into choices)
function resolvePrompt(choiceIdx) {
  const a = state.pending; if (!a || a.resolved) return;
  a.resolved = true;
  a.el.classList.remove("actionable");
  state.pending = null;
  hideReplyContext();

  const c = a.choices[choiceIdx];
  const mine = youMsg(c.label);   // YOUR reply shows up in the chat, like a real message

  /* All feedback is diegetic: reactions land on your own message and the
     person who asked replies. No screen shake, no big vibration — you read
     how it went the same way you would in a real group chat. */
  const w = a.weight || 1;   // interrogations swing trust harder, both ways
  if (c.kind === "right") {
    state.stats.rights++;
    state.streak++; state.bestStreak = Math.max(state.bestStreak, state.streak);
    addTrust(a.asker, TUNING.trustRight * w); addTrustAll(TUNING.trustRightOthers, a.asker);
    addLikes(1); sfx.right(); buzz(12);
    addReactions(mine, pick([["❤️"], ["😂"], ["🔥"], ["❤️", "😂"], ["💯"]]));
    typingThen(a.asker, pick(["😂 same", "iconic", "lmaooo", "classic you", "knew it 😌", "never change ❤️"]), 700);
    syncSus(false);
  } else if (c.kind === "deflect") {
    state.stats.deflects++;
    addTrust(a.asker, TUNING.trustDeflect); addTrustAll(-1, a.asker);
    addReactions(mine, [pick(["👍", "🙂", "😐"])]);
    syncSus(false);
  } else {
    state.stats.wrongs++; state.streak = 0;
    addTrust(a.asker, TUNING.trustWrong * w); addTrustAll(TUNING.trustWrongOthers, a.asker);
    addLikes(-1); sfx.wrong(); buzz(30);
    addReactions(mine, pick([["🤨"], ["😳"], ["🤨", "😳"], ["❓"]]));
    typingThen(a.asker, pick([`wait that's not like you @${state.assumedName} 🤨`, `since when?? 😅`, `u ok? that's weird`, `who are you and what did you do w ${state.assumedName} 😂`]), 750);
    syncSus(true);
  }
  updateMeters();
}

/* You haven't answered a question aimed at you. No timer bar — the group just
   notices your silence and gets louder, then suspicious. */
function advancePending() {
  const a = state.pending; if (!a) return;
  a.age++;
  const steps = TUNING.escalate;
  const step = steps.find((e) => e.age === a.age);
  const sting = (t) => { addTrust(a.asker, t); addTrustAll(t * 0.25, a.asker); syncSus(t < 0); };
  if (step) { a.escLevel++; calloutFor(a.escLevel); sting(step.trust); return; }
  if (a.age > steps[steps.length - 1].age) { a.escLevel++; calloutFor(a.escLevel); sting(TUNING.ignorePerMsg); return; }
  chatMsg(who(), pick(AMBIENT));   // in-between beats keep the room alive
}

/* The escalation ladder — impatient one nags, then the sharp one gets
   suspicious. Each arrives behind a "typing…" indicator so you can SEE
   someone composing at you. If you reply first, the nag never lands. */
function calloutFor(level) {
  const n = state.assumedName;
  const seq = state.pending ? state.pending.seq : -1;
  const stillIgnored = () => state.pending && state.pending.seq === seq;
  if (level >= 4) {
    typingThen(state.sharp, pick([`ok who IS this 🚨`, `${n} answer. right now.`, `someone call the real ${n} 📞`]), 700, stillIgnored);
  } else if (level === 3) {
    typingThen(state.sharp, pick([`wait… is this even the real ${n}? 🤨`, `${n} would've replied by now… who is this 👀`, `guys. something's off.`]), 800, stillIgnored);
  } else if (level === 2) {
    typingThen(state.impatient, pick([`i can literally see you're online ${n} 😐`, `${n} you're right there tho`, `left on read?? by ${n}?? 😭`]), 750, stillIgnored);
  } else {
    typingThen(state.impatient, pick([`@${n}?`, `helloooo ${n} 👀`, `${n}?? 👀`, `you there ${n}`]), 650, stillIgnored);
  }
}

/* ===================== REPLY BAR (your always-available voice) ===================== */

function buildReplyBar() {
  const f = el.replyFillers; f.innerHTML = "";
  // the probe chip: go FISHING for what you don't know instead of waiting
  const p = document.createElement("button");
  p.className = "reply-chip probe"; p.id = "probe-chip";
  p.addEventListener("pointerdown", useProbe);
  f.appendChild(p);
  for (const label of shuffle(FILLERS).slice(0, 5)) {
    const b = document.createElement("button");
    b.className = "reply-chip filler"; b.textContent = label;
    b.addEventListener("pointerdown", () => sendFiller(label));
    f.appendChild(b);
  }
  renderProbeChip();
  hideReplyContext();
}
function renderProbeChip() {
  const p = $("probe-chip"); if (!p) return;
  p.textContent = `🎣 ask ${state.probesLeft}`;
  p.disabled = state.probesLeft <= 0;
  p.classList.toggle("spent", state.probesLeft <= 0);
}

/* PROBE — you're not just waiting to be fed clues any more. Fish for one.
   The catch: asking what "you" should already know makes the sharp one look
   twice, so information has a price. */
function useProbe() {
  if (!state.running || state.finaleStarted || state.act3 || state.probesLeft <= 0) return;
  state.probesLeft--; state.stats.probes++;
  renderProbeChip();
  const pr = pick(PROBES);
  youMsg(pr.say);
  const responder = who();
  const unlearned = TRAIT_KEYS.filter((k) => !state.learned[k]);
  addTrust(state.sharp, TUNING.trustProbe); syncSus(true);
  setTimeout(() => {
    if (!state.running) return;
    chatMsg(responder, pr.back);
    if (unlearned.length) setTimeout(() => revealTrait(pick(unlearned), responder), 700);
  }, 800);
}

function showReplyContext() {
  const a = state.pending; if (!a) return;
  renderChoices(a.isReact ? "react 👆" : (a.grill ? "careful 👆" : "reply 👆"),
                a.choices.map((ch) => ({ label: ch.label, emoji: a.isReact })),
                (_it, i) => resolvePrompt(i));
}
// generic chooser used by both normal prompts and the third act
function renderChoices(label, items, onPick) {
  const c = el.replyCtx; c.innerHTML = "";
  const lbl = document.createElement("span"); lbl.className = "reply-label"; lbl.textContent = label; c.appendChild(lbl);
  items.forEach((it, i) => {
    const b = document.createElement("button");
    b.className = "reply-chip answer" + (it.emoji ? " emoji" : "");
    b.textContent = it.label;
    b.addEventListener("pointerdown", () => onPick(it, i));
    c.appendChild(b);
  });
  c.classList.remove("hidden");
  el.replyBar.classList.add("has-ctx");
}

/* REACT TO ANYTHING — tap any message in the feed to react to it. Warms
   that specific person. This is the always-available social verb: you can
   work the room instead of only answering when spoken to. */
let pickerFor = null;
const REACT_EMOJIS = ["❤️", "😂", "🔥", "😭"];
function makeReactable(row, name) {
  if (!state.trust[name]) { /* still fine — non-members just won't move trust */ }
  row.classList.add("reactable");
  row.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    e.stopPropagation();
    openPicker(row, name);
  });
}
function openPicker(row, name) {
  if (!state.running || row.dataset.reacted) return;
  pickerFor = { row, name };
  const p = el.picker;
  p.classList.remove("hidden");
  const r = row.getBoundingClientRect(), f = el.frame.getBoundingClientRect();
  p.style.left = Math.max(6, Math.min(f.width - p.offsetWidth - 6, r.left - f.left + 8)) + "px";
  p.style.top = Math.max(6, r.top - f.top - 46) + "px";
}
function closePicker() { if (el.picker) el.picker.classList.add("hidden"); pickerFor = null; }
function applyReaction(emo) {
  if (!pickerFor || !state.running) return closePicker();
  const { row, name } = pickerFor;
  row.dataset.reacted = "1";
  const span = document.createElement("span");
  span.className = "reactions mine"; span.textContent = emo;
  row.appendChild(span);
  state.stats.reacts++;
  // diminishing returns so you can't just spam-heart your way in
  const n = state.reacted[name] || 0;
  state.reacted[name] = n + 1;
  addTrust(name, Math.max(2, TUNING.trustReact - n * 2));
  syncSus(false); sfx.pop(); buzz(10);
  closePicker();
  if (Math.random() < 0.22) typingThen(name, pick(["😂", "❤️", "hahaha", "🫶", "😭 stop"]), 650);
}
function hideReplyContext() {
  el.replyCtx.innerHTML = ""; el.replyCtx.classList.add("hidden");
  el.replyBar.classList.remove("has-ctx");
}
// filler = staying present. shows as your bubble but does NOT answer a pointed
// question (that still needs a real reply) — it just keeps you visibly here.
let fillerCool = 0;
function sendFiller(label) {
  const now = performance.now();
  if (now < fillerCool || !state.running || state.finaleStarted) return;
  fillerCool = now + 750;
  youMsg(label);
  if (Math.random() < 0.28) setTimeout(() => { if (state.running) chatMsg(state.ally || who(), pick(["😂", "❤️", "lmaooo", "🫶", "same"])); }, 450);
}

/* ===================== EXPOSED ===================== */

function exposeYou(by) {
  if (!state.running) return;
  state.running = false; stopLoop();
  state.stats.exposed = true; state.stats.exposedBy = by;
  shake();
  el.replyBar.classList.add("hidden");
  el.frame.classList.remove("flash-bad"); void el.frame.offsetWidth; el.frame.classList.add("flash-bad");
  sfx.exposed();
  chatMsg(state.sharp, pick(["wait… who IS this?? 🚨", "yo this isn't the real " + state.assumedName + " 😳", "GUYS we added the wrong person 💀"]));
  showBanner("🚨 EXPOSED!");
  buzz([120, 80, 200]);
  track("exposed", { by, sus: Math.round(state.sus), likes: state.likes, sec: state.elapsed });
  setTimeout(() => endRun(), 1400);
}

/* ===================== FINALE: address drop → plus-one vote ===================== */

/* THE FORK. You don't always get the party invite scene — you have to have
   earned the room. Lose it and the third act is the real one showing up. */
function startAct3() {
  const avg = avgTrust();
  state.act3 = avg >= TUNING.act3NeedsAvg ? "vote" : "real";
  track("act3", { branch: state.act3, avgTrust: Math.round(avg), sec: state.elapsed });
  if (state.act3 === "vote") startFinale(); else startRealPerson();
}

/* ---- Act 3B: the person you've been pretending to be turns up ---- */
function startRealPerson() {
  state.finaleStarted = true; state.realHere = true;
  el.replyBar.classList.add("hidden");
  hideReplyContext(); closePicker();
  if (el.timer) el.timer.textContent = "😳 uh oh";
  const n = state.assumedName;
  chatMsg(state.sharp, pick([`hold on. i just texted ${n}.`, `something's not right. calling ${n} now.`, `guys i'm adding the real ${n}.`]));
  setTimeout(() => { if (state.running) sysMsg(`${state.sharp} added ${n} (the real one)`, "leave"); }, 1300);
  setTimeout(() => { if (state.running) { sfx.exposed(); chatMsg(n, pick([`uh… who is in my chat 😐`, `guys why is there another me??`, `i just woke up. who IS that`, `that's not me. i don't even have this number`])); } }, 2400);
  setTimeout(() => { if (state.running) runConfrontation(); }, 3600);
}

function runConfrontation() {
  if (!state.running) return;
  el.replyBar.classList.remove("hidden");
  renderChoices("last words 👆", [
    { label: "😤 no YOU'RE fake" },
    { label: "🙃 ok you got me 😭" },
    { label: "🫥 leave quietly" },
  ], (_it, i) => resolveConfrontation(["double", "confess", "bail"][i]));
}

function resolveConfrontation(kind) {
  hideReplyContext(); el.replyBar.classList.add("hidden");
  state.stats.confront = kind;
  const n = state.assumedName;
  const believers = state.cast.filter((m) => (state.trust[m] ?? 50) >= 55).length;
  const allyT = state.trust[state.ally] ?? 50;

  if (kind === "bail") {
    youMsg("👋");
    setTimeout(() => { if (!state.running) return; sysMsg(`${state.realName} left the chat`, "leave"); sfx.no(); }, 700);
    setTimeout(() => { if (!state.running) return; chatMsg(who(), pick(["…who was that", "wait come back 😭", "did we just get catfished 💀"])); }, 1500);
    state.stats.ending = "slipped"; state.stats.yes = 0;
    setTimeout(() => endRun(), 2600);
    return;
  }

  if (kind === "double") {
    youMsg(`excuse me?? I'M ${n}. block this impostor 😤`);
    const won = believers >= Math.ceil(state.membersN / 2);
    setTimeout(() => { if (!state.running) return;
      if (won) { chatMsg(state.ally, pick([`honestly… you DO sound like ${n} 😭`, `wait i believe them`])); sfx.yes(); showBanner("👑 THEY BELIEVED YOU"); }
      else { chatMsg(state.sharp, pick([`nice try 💀`, `we've known ${n} for 10 years bestie`])); sfx.exposed(); showBanner("💀 BUSTED"); }
    }, 900);
    state.stats.ending = won ? "usurper" : "busted";
    state.stats.exposed = !won; state.stats.exposedBy = won ? null : "real";
    state.stats.yes = believers;
    setTimeout(() => endRun(), 2400);
    return;
  }

  // confess — throw yourself on the mercy of the room you spent 60s building
  youMsg(`ok ok 😭 i'm ${state.realName}. wrong number. but i've been here the whole time…`);
  const forgiven = allyT >= 58 || believers >= Math.ceil(state.membersN / 2);
  setTimeout(() => { if (!state.running) return;
    if (forgiven) { chatMsg(state.ally, pick([`LMAO honestly? come anyway 😭`, `no bc i'm attached now. come.`])); sfx.party(); showBanner("🥹 COME ANYWAY"); }
    else { chatMsg(state.sharp, pick([`yeah no. bye 👋`, `that's so weird actually`])); sfx.no(); showBanner("😬 removed"); }
  }, 900);
  state.stats.ending = forgiven ? "adopted" : "busted";
  state.stats.exposed = !forgiven; state.stats.exposedBy = forgiven ? null : "real";
  state.stats.yes = forgiven ? believers : 0;
  setTimeout(() => endRun(), 2400);
}

/* ---- Act 3A: you kept the room, so you get the invite scene ---- */
function startFinale() {
  state.finaleStarted = true;
  el.replyBar.classList.add("hidden");
  if (el.timer) el.timer.textContent = "🎉 party time";
  const addr = pick(["14 Mango St", `${state.ally}'s place`, "the beach house", "Unit 12F", "Lolo's backyard"]);
  sysMsg("📍 the address just dropped", "join");
  chatMsg(state.hype || who(), `OK EVERYONE — party's at ${addr}, 8PM tn!! 🎉🎉`);
  track("address_dropped", { sus: Math.round(state.sus), likes: state.likes });
  // you make your move
  setTimeout(() => { if (state.running) youMsg(`omg wait 🥺 can I bring a +1? my friend <b>${state.realName}</b> 👉👈`); }, 1100);
  setTimeout(() => runVote(), 2200);
}

// each member votes in character: the ally leans yes, the sharp one leans no.
function runVote() {
  if (!state.running) return;
  const voters = shuffle([...state.cast]);
  let yes = 0, i = 0;
  const step = () => {
    if (i >= voters.length) return finishVote(yes);
    const m = voters[i++];
    // no generic formula any more — each person votes their own opinion of you
    const t = state.trust[m] ?? 50;
    const p = Math.max(0.04, Math.min(0.96, (t - 22) / 62 + state.likes * 0.02));
    const ok = Math.random() < p;
    if (ok) { yes++; chatMsg(m, pick(["yesss bring them! 🎉", "the more the merrier 🥰", "ofc!! 👍", "sure sure 😎", "any friend of yours ❤️"])); sfx.yes(); }
    else { chatMsg(m, pick(["hmm idk them tho 🤨", "kinda tight on space 😅", "who is that again?", "maybe not this time 👎"])); sfx.no(); }
    setTimeout(step, 650);
  };
  step();
}

function finishVote(yes) {
  state.stats.yes = yes; state.stats.likes = state.likes;
  const N = state.membersN;
  if (yes >= Math.ceil(N / 2)) { sysMsg(`🎟️ you're in! ${yes}/${N} said yes`, "join"); sfx.party(); showBanner("🎟️ YOU'RE GOING!"); }
  else { sysMsg(`😬 only ${yes}/${N} said yes…`, "leave"); sfx.no(); showBanner("😬 awkward…"); }
  buzz([80, 50, 120]);
  setTimeout(() => endRun(), 1400);
}

/* ===================== END / RESULT ===================== */

function endRun() {
  state.running = false; stopLoop();
  el.replyBar.classList.add("hidden"); closePicker(); el.whoTip.classList.add("hidden");
  state.stats.survived = state.elapsed;
  showResult();
}

let lastPersona = null, cardBlob = null;
function showResult() {
  const s = state.stats;
  const best = loadBest();
  const isNew = !s.exposed && s.yes > best.yes;
  if (!s.exposed) { best.yes = Math.max(best.yes, s.yes); saveBest(best); }
  $("new-best").classList.toggle("hidden", !isNew);
  $("result-best-line").textContent = `🏆 Best invite: ${best.yes} yes`;
  renderBestLine();

  lastPersona = pickPersona(s);
  const qualified = PERSONAS.filter((p) => p.id === lastPersona.id || (p.id !== "wallflower" && p.match(s))).map((p) => p.id);
  const newly = []; for (const id of qualified) if (collect(id)) { newly.push(id); track("persona_new", { persona: id }); }
  $("new-persona").classList.toggle("hidden", newly.length === 0);
  if (newly.length) { const names = newly.map((id) => { const p = PERSONAS.find((x) => x.id === id); return `${p.emoji} ${personaText(id).t}`; }).join(" · "); $("new-persona").textContent = `✨ ${newly.length > 1 ? newly.length + " NEW YOUS:" : "NEW YOU:"} ${names}`; }
  $("result-coll-line").textContent = `You've been: ${Object.keys(loadColl()).length}/${PERSONAS.length}`;
  renderCollLine();

  renderCard(lastPersona, false);
  const stampFor = lastPersona;
  setTimeout(() => { if (lastPersona !== stampFor) return; renderCard(stampFor, true); sfx.pop(); shake(); buzz([60, 40, 120]); const img = $("card-preview"); img.classList.remove("slam"); void img.offsetWidth; img.classList.add("slam"); }, 700);

  const vs = $("versus-result"); let beat = null;
  if (state.challenger) { const them = state.challenger; beat = s.yes > them.yes; const verdict = s.yes > them.yes ? "You got more yeses! 🎉" : s.yes === them.yes ? "Same votes?! 😤" : "They got in bigger… rematch?"; vs.textContent = `🥊 ${s.yes} — ${them.yes} "${them.title}" · ${verdict}`; vs.classList.remove("hidden"); }
  else vs.classList.add("hidden");

  track("run_end", { exposed: s.exposed, exposedBy: s.exposedBy, yes: s.yes, likes: s.likes, sus: Math.round(state.sus), learned: s.learned, deflects: s.deflects, wrongs: s.wrongs, survived: s.survived, persona: lastPersona.id, newBest: isNew, challenged: !!state.challenger, beatChallenger: beat });
  el.resultScreen.classList.remove("hidden");
}

function pickPersona(s) {
  const p = PERSONAS.find((x) => x.match(s));
  const t = personaText(p.id);
  return { id: p.id, emoji: p.emoji, stamp: p.stamp, by: p.by, title: t.t, line: t.l };
}

// The share card: a screenshot of your run.
function renderCard(p, withStamp = true) {
  const cv = $("card-canvas"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, F = "'Comic Sans MS','Chalkboard SE',sans-serif";
  const s = state.stats;
  ctx.fillStyle = "#0c0d12"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#15171e"; ctx.fillRect(20, 20, W - 40, H - 40);
  ctx.strokeStyle = "#2b2f3d"; ctx.lineWidth = 3; ctx.strokeRect(20, 20, W - 40, H - 40);
  ctx.fillStyle = "#f7476b"; ctx.fillRect(20, 20, W - 40, 54);
  ctx.fillStyle = "#fff"; ctx.font = `bold 28px ${F}`; ctx.textAlign = "center";
  ctx.fillText("💬 WRONG CHAT · THE VERDICT", W / 2, 57);

  ctx.fillStyle = "#22242e"; ctx.beginPath(); ctx.arc(110, 150, 48, 0, 7); ctx.fill();
  ctx.strokeStyle = "#f7476b"; ctx.lineWidth = 4; ctx.stroke();
  ctx.font = "54px serif"; ctx.fillText(p.emoji, 110, 170);
  ctx.textAlign = "left"; ctx.fillStyle = "#eceaf0"; ctx.font = `bold 32px ${F}`;
  ctx.fillText(`@${state.realName}`, 180, 138);
  ctx.fillStyle = "#8b90a0"; ctx.font = `24px ${F}`;
  ctx.fillText(`pretended to be ${state.assumedName} · ${state.group.replace(/[^\x00-\x7F]/g, "").trim()}`, 180, 174);

  ctx.fillStyle = "#8b90a0"; ctx.font = `28px ${F}`; ctx.fillText("turns out I'm:", 60, 250);
  ctx.fillStyle = "#eceaf0"; ctx.font = `bold 50px ${F}`; wrap(ctx, p.title, 60, 306, 780, 56);

  // big outcome
  ctx.fillStyle = "#22242e"; ctx.fillRect(60, 400, 780, 230); ctx.strokeStyle = "#2b2f3d"; ctx.lineWidth = 3; ctx.strokeRect(60, 400, 780, 230);
  ctx.textAlign = "center";
  if (s.exposed) { ctx.font = "120px serif"; ctx.fillText("🚨", 300, 545); ctx.fillStyle = "#ff5a76"; ctx.font = `bold 60px ${F}`; ctx.fillText("EXPOSED", 610, 515); ctx.fillStyle = "#8b90a0"; ctx.font = `24px ${F}`; ctx.fillText(`at ${fmt(s.survived)}`, 610, 560); }
  else if (s.ending === "slipped") { ctx.font = "110px serif"; ctx.fillText("🫥", 300, 545); ctx.fillStyle = "#8f7bff"; ctx.font = `bold 54px ${F}`; ctx.fillText("VANISHED", 610, 520); ctx.fillStyle = "#8b90a0"; ctx.font = `24px ${F}`; ctx.fillText(`at ${fmt(s.survived)}`, 610, 562); }
  else {
    const bigLabel = s.ending === "usurper" ? "TOOK YOUR SIDE" : s.ending === "adopted" ? "STILL WANTED YOU" : "SAID YES";
    ctx.font = "110px serif"; ctx.fillText(p.emoji, 260, 545); ctx.fillStyle = "#4cc79a"; ctx.font = `bold 92px ${F}`; ctx.fillText(`${s.yes}/${s.members}`, 600, 525);
    ctx.fillStyle = "#8b90a0"; ctx.font = `${bigLabel.length > 12 ? 20 : 24}px ${F}`; ctx.fillText(bigLabel, 600, 568);
  }

  ctx.textAlign = "left"; ctx.fillStyle = "#eceaf0"; ctx.font = `26px ${F}`;
  ctx.fillText(`✅ ${s.rights} in-character   🤨 ${s.wrongs} slips   🌫️ ${s.deflects} dodges`, 60, 690);
  ctx.fillText(`🕵️ ${s.learned}/5 figured out · 🎣 ${s.probes} asks · ❤️ ${s.reacts} reacts`, 60, 730);

  const bub = (y, h) => { ctx.fillStyle = "#22242e"; if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(60, y, 780, h, 18); ctx.fill(); } else ctx.fillRect(60, y, 780, h); };
  bub(770, 120);
  ctx.fillStyle = "#8f7bff"; ctx.font = `bold 28px ${F}`; ctx.fillText(p.by, 84, 812);
  ctx.fillStyle = "#eceaf0"; ctx.font = `28px ${F}`; wrap(ctx, p.line, 84, 848, 700, 34);

  if (withStamp) {
    ctx.save(); ctx.translate(640, 440); ctx.rotate(-0.14); const col = STAMPS[p.stamp]; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 7; ctx.globalAlpha = 0.92; ctx.textAlign = "center";
    ctx.font = `bold 20px ${F}`; ctx.fillText("STATUS:", 0, -50); ctx.strokeRect(-190, -38, 380, 80); ctx.font = `bold 40px ${F}`; ctx.fillText(p.stamp, 0, 16); ctx.restore(); ctx.globalAlpha = 1;
  }
  const collN = Object.keys(loadColl()).length;
  ctx.textAlign = "center"; ctx.fillStyle = "#8b90a0"; ctx.font = `26px ${F}`; ctx.fillText(`🎭 you've been ${collN}/${PERSONAS.length}`, W / 2, 1030);
  ctx.font = `24px ${F}`; ctx.fillText("play: " + (location.host + location.pathname).replace(/\/$/, "") + "  ·  #wrongchat", W / 2, 1072);

  $("card-preview").src = cv.toDataURL("image/png");
  cardBlob = null; if (withStamp) cv.toBlob((b) => { cardBlob = b; }, "image/png");
}
function wrap(ctx, text, x, y, maxW, lh) { const words = String(text).split(" "); let line = "", cy = y; for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, cy); line = w; cy += lh; } else line = t; } ctx.fillText(line, x, cy); }

/* ===================== SHARE / VERSUS ===================== */

function shareText(p) { const s = state.stats; return s.exposed
  ? `I got EXPOSED pretending to be ${state.assumedName} in a group chat 💀 "${p.title}". Can you blend in? Wrong Chat:`
  : `I talked my way into a party as an impostor — ${s.yes}/${s.members} said yes 🎟️ "${p.title}". Can you? Wrong Chat:`; }
function challengeUrl(p) { const pl = btoa(JSON.stringify({ y: state.stats.yes, t: p.title })); return `${location.origin}${location.pathname}?vs=${encodeURIComponent(pl)}`; }
function parseChallenge() { try { const raw = new URLSearchParams(location.search).get("vs"); if (!raw) return null; const c = JSON.parse(atob(raw)); if (typeof c.y !== "number" || typeof c.t !== "string") return null; return { yes: c.y, title: c.t.slice(0, 40) }; } catch { return null; } }
function renderVersusBanner() { state.challenger = parseChallenge(); if (!state.challenger) return; track("challenge_open", { theirYes: state.challenger.yes }); $("versus-text").textContent = `"${state.challenger.title}" got ${state.challenger.yes} yeses. Beat that?`; $("versus-banner").classList.remove("hidden"); }

async function shareCard() {
  if (!lastPersona) return; const text = shareText(lastPersona) + " " + challengeUrl(lastPersona);
  const file = cardBlob && new File([cardBlob], "wrong-chat.png", { type: "image/png" });
  try { if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); track("share_card", { method: "native-image", persona: lastPersona.id }); return; }
    if (navigator.share) { await navigator.share({ text }); track("share_card", { method: "native-text", persona: lastPersona.id }); return; } } catch { track("share_cancel", {}); return; }
  if (cardBlob) { const a = document.createElement("a"); a.href = URL.createObjectURL(cardBlob); a.download = "wrong-chat.png"; a.click(); URL.revokeObjectURL(a.href); }
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
  track("share_card", { method: "download", persona: lastPersona.id });
  const b = $("share-card-btn"); b.textContent = "✅ Saved + copied!"; setTimeout(() => (b.textContent = "📤 Share the verdict"), 2000);
}
function copyChallenge() { if (!lastPersona) return; const text = shareText(lastPersona) + " " + challengeUrl(lastPersona); if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {}); track("copy_challenge", {}); const b = $("copy-share-btn"); b.textContent = "✅ Copied!"; setTimeout(() => (b.textContent = "🔗 Copy Challenge Link"), 1500); }
function showMenu() { el.resultScreen.classList.add("hidden"); $("gallery-screen").classList.add("hidden"); el.hud.classList.add("hidden"); el.chat.classList.add("hidden"); el.youPanel.classList.add("hidden"); el.replyBar.classList.add("hidden"); el.castStrip.classList.add("hidden"); el.whoTip.classList.add("hidden"); closePicker(); renderBestLine(); renderCollLine(); el.startScreen.classList.remove("hidden"); track("menu_open"); }

/* ===================== FX ===================== */

let msTimer = 0;
function showMilestone(t) { el.milestone.textContent = t; el.milestone.classList.remove("hidden"); void el.milestone.offsetWidth; clearTimeout(msTimer); msTimer = setTimeout(() => el.milestone.classList.add("hidden"), 1200); }
let banTimer = 0;
function showBanner(t) { el.banner.textContent = t; el.banner.classList.remove("hidden"); void el.banner.offsetWidth; clearTimeout(banTimer); banTimer = setTimeout(() => el.banner.classList.add("hidden"), 1200); }
function floatText(text, color) { const s = document.createElement("span"); s.className = "fx-float"; s.textContent = text; s.style.color = color; s.style.left = (28 + Math.random() * 40) + "%"; s.style.top = "42%"; el.fx.appendChild(s); setTimeout(() => s.remove(), 900); }

/* ===================== HELPERS ===================== */
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function rand(a, b) { return a + Math.random() * (b - a); }
function shuffle(a) { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function fmt(s) { return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
function readName() {
  let h = ($("handle-input").value || "").replace(/[^a-zA-Z0-9_ ]/g, "").slice(0, 16).trim();
  if (!h) { try { h = localStorage.getItem("wcName") || ""; } catch { /* ok */ } }
  if (!h) h = pick(["me", "totally_kai", "a friend", "notme", "deadass"]);
  try { localStorage.setItem("wcName", h); } catch { /* ok */ }
  $("handle-input").value = h; return h;
}

/* ===================== PAUSE ===================== */
function onVisibility() {
  if (document.hidden) { if (!state.running || state.paused) return; state.paused = true; state.pausedAt = performance.now(); stopLoop(); el.pauseOverlay.classList.remove("hidden"); }
  else { if (!state.paused) return; state.paused = false; const now = performance.now(), d = now - state.pausedAt; state.nextSpawn += d; state.lastFrame = now; state.lastSecondTick = now; el.pauseOverlay.classList.add("hidden"); startLoop(); }
}
document.addEventListener("visibilitychange", onVisibility);

/* ===================== WIRE UP ===================== */

initPostHog();
renderBestLine(); renderVersusBanner(); renderCollLine();
$("share-card-btn").textContent = "📤 Share the verdict";
$("mute-btn").textContent = muted ? "🔇" : "🔊";
try { $("handle-input").value = localStorage.getItem("wcName") || ""; } catch { /* ok */ }
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});

// reaction picker: tap a message -> pick an emoji
if (el.picker) {
  for (const emo of REACT_EMOJIS) {
    const b = document.createElement("button");
    b.className = "pick-emo"; b.textContent = emo;
    b.addEventListener("pointerdown", (e) => { e.stopPropagation(); applyReaction(emo); });
    el.picker.appendChild(b);
  }
}
el.chat.addEventListener("pointerdown", () => closePicker());

$("start-btn").addEventListener("click", startGame);
$("play-again-btn").addEventListener("click", startGame);
$("share-card-btn").addEventListener("click", shareCard);
$("copy-share-btn").addEventListener("click", copyChallenge);
$("menu-btn").addEventListener("click", showMenu);
$("mute-btn").addEventListener("click", toggleMute);
const openGallery = () => { track("gallery_open", {}); renderGallery(); $("gallery-screen").classList.remove("hidden"); };
$("gallery-btn").addEventListener("click", openGallery);
$("result-coll-line").addEventListener("click", openGallery);
$("gallery-close-btn").addEventListener("click", () => $("gallery-screen").classList.add("hidden"));
