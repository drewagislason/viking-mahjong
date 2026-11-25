/* Copyright (c) 2026 Drew Gislason */
(function () {
  "use strict";

  /* ---------- the 36 symbols: 24 runes + 5 sets + 7 gods, four tiles each = 144 ---------- */
  /* Runes: glyphs and names exactly as in Viking Sudoku. Each rune and each god has 4 identical tiles. */
  const RUNES = RUNE_DEFS.map((r, i) => ({
    id: "rune" + i, kind: "rune", match: "rune" + i, name: r.name, label: r.name, glyph: r.glyph, rune: r
  }));

  /* Sets: 4 different tiles, any two of the same set match (like Flowers and Seasons in Mahjong). */
  const SETS = [
    { key: "season", name: "Seasons", kind: "season", tiles: [
      ["spring", "Spring", "spring"], ["summer", "Summer", "summer"], ["autumn", "Autumn", "autumn"], ["winter", "Winter", "winter"]] },
    { key: "norn", name: "Norns", kind: "norn", tiles: [
      ["urd", "Urd", "urd"], ["verdandi", "Verdandi", "verdandi"], ["skuld", "Skuld", "skuld"], ["wyrd", "Wyrd", "wyrd"]] },
    { key: "dragon", name: "Dragons", kind: "dragon", tiles: [
      ["dragonRed", "Red", "dragonSolid", "#a3201c"], ["dragonGreen", "Green", "dragonSolid", "#1f6b34"],
      ["dragonBlue", "Blue", "dragonSolid", "#1d4f91"], ["dragonWhite", "White", "dragonHollow"]] },
    { key: "dir", name: "Directions", kind: "dir", tiles: [
      ["north", "North", "north"], ["south", "South", "south"], ["east", "East", "east"], ["west", "West", "west"]] },
    { key: "ship", name: "Longships", kind: "ship", tiles: [
      ["shipA", "Oseberg", "shipSolid"], ["shipB", "Gokstad", "shipHollow"],
      ["shipC", "Ormen", "shipStripes"], ["shipD", "Skuldelev", "shipCross"]] }
  ];
  const SET_TILES = SETS.map((s) => s.tiles.map((t) => ({
    id: t[0], kind: s.kind, match: s.key, name: t[1], label: t[1], icon: t[2], ink: t[3] || null, setName: s.name
  })));

  /* Gods: 4 identical tiles each. */
  const GODS = [
    ["odin", "Odin"], ["thor", "Thor"], ["frigg", "Frigg"], ["freyr", "Freyr"],
    ["tyr", "Tyr"], ["loki", "Loki"], ["hel", "Hel"]
  ].map((g) => ({ id: g[0], kind: "god", match: g[0], name: g[1], label: g[1], icon: g[0] }));

  const SYM = {};
  RUNES.forEach((s) => (SYM[s.id] = s));
  SET_TILES.forEach((arr) => arr.forEach((s) => (SYM[s.id] = s)));
  GODS.forEach((s) => (SYM[s.id] = s));

  /* "Groups" are the 36 symbols. Each has four tiles; faces[] lists the four faces. */
  function makeGroups(rnd) {
    const groups = [];
    RUNES.forEach((s) => groups.push({ key: s.match, faces: [s.id, s.id, s.id, s.id] }));
    GODS.forEach((s) => groups.push({ key: s.match, faces: [s.id, s.id, s.id, s.id] }));
    SET_TILES.forEach((arr) => groups.push({ key: arr[0].match, faces: shuffle(arr.map((t) => t.id), rnd) }));
    return groups;
  }

  /* ---------- seeded RNG ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rnd) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* ---------- geometry and the free-tile rule ---------- */
  /* A tile at (x, y) covers [x, x+2) by [y, y+2) in half-tile units. */
  function overlap(a, b, axis) { return a[axis] < b[axis] + 2 && b[axis] < a[axis] + 2; }
  function covers(upper, lower) {
    return upper.z === lower.z + 1 && overlap(upper, lower, "x") && overlap(upper, lower, "y");
  }
  function sideBlocked(n, t, dir) {
    if (n.z !== t.z || !overlap(n, t, "y")) return false;
    return dir > 0 ? (n.x >= t.x + 2 && n.x < t.x + 4) : (n.x <= t.x - 2 && n.x > t.x - 4);
  }
  /* Free = nothing on top, and the left side OR the right side is open. */
  function isFree(t, tiles) {
    if (!t.alive) return false;
    let left = false, right = false;
    for (let k = 0; k < tiles.length; k++) {
      const o = tiles[k];
      if (o === t || !o.alive) continue;
      if (covers(o, t)) return false;
      if (sideBlocked(o, t, -1)) left = true;
      if (sideBlocked(o, t, 1)) right = true;
    }
    return !(left && right);
  }
  function freeTiles(tiles) { return tiles.filter((t) => isFree(t, tiles)); }
  function matches(a, b) { return a !== b && SYM[a.face].match === SYM[b.face].match; }

  /* ---------- solvable deal: play the game forward on blank seats ---------- */
  /* Repeatedly pick two seats that are free right now, hand them a matching pair, take them off.
     That sequence is itself a legal game, so every deal has at least one solution. */
  function deal(positions, rnd) {
    if (positions.length !== 144) throw new Error("Layouts must have 144 tiles");
    for (let attempt = 0; attempt < 200; attempt++) {
      const pairs = [];
      makeGroups(rnd).forEach((g) => { pairs.push([g.faces[0], g.faces[1]], [g.faces[2], g.faces[3]]); });
      const pool = shuffle(pairs, rnd);
      const tiles = positions.map((p, i) => ({ i: i, x: p[0], y: p[1], z: p[2], alive: true, face: null }));
      const solution = [];
      let ok = true;
      for (let n = 0; n < pool.length; n++) {
        const free = freeTiles(tiles);
        if (free.length < 2) { ok = false; break; }
        const ai = Math.floor(rnd() * free.length);
        let bi = Math.floor(rnd() * (free.length - 1));
        if (bi >= ai) bi++;
        const a = free[ai], b = free[bi];
        const flip = rnd() < 0.5;
        a.face = pool[n][flip ? 1 : 0];
        b.face = pool[n][flip ? 0 : 1];
        a.alive = false; b.alive = false;
        solution.push([a.i, b.i]);
      }
      if (ok) {
        tiles.forEach((t) => { t.alive = true; });
        return { tiles: tiles, solution: solution };
      }
    }
    throw new Error("Could not build a solvable deal");
  }

  /* ---------- drawing ---------- */
  const boardEl = document.getElementById("board");
  const wrapEl = document.getElementById("board-wrap");
  const statusEl = document.getElementById("status");
  const appEl = document.getElementById("app");
  const frameEl = appEl.querySelector(".frame");
  const titleEl = appEl.querySelector(".title");
  const controlsEl = appEl.querySelector(".controls");

  function runeSVG(r) {
    return '<svg viewBox="0 0 32 40" aria-hidden="true"><path fill="none" stroke="currentColor" ' +
      'stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter" stroke-miterlimit="2.2" d="' + r.d + '"/></svg>';
  }
  function faceHTML(sym, showName) {
    const art = sym.rune ? runeSVG(sym.rune) : ICONS[sym.icon];
    const ink = sym.ink ? ' style="color:' + sym.ink + '"' : "";
    return '<span class="mj-icon"' + ink + ">" + art + "</span>" + (showName ? '<span class="mj-name">' + sym.label + "</span>" : "");
  }

  /* Each tile gets its own patch of the wood-grain image so no two tiles look alike. */
  function grainVars(n, tex) {
    let h = Math.imul(n + 1, 2654435761) >>> 0;
    h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13;
    const bx = ((h % 1000) / 1000) * tex, by = (((h >>> 10) % 1000) / 1000) * tex;
    return "--tex:" + tex + "px;--bx:" + (-bx).toFixed(0) + "px;--by:" + (-by).toFixed(0) + "px;";
  }

  const state = { index: 0, tiles: [], solution: [], seed: 1, selected: null, undo: [] };

  function bounds(tiles) {
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9, maxZ = 0;
    tiles.forEach((t) => {
      minX = Math.min(minX, t.x); minY = Math.min(minY, t.y);
      maxX = Math.max(maxX, t.x + 2); maxY = Math.max(maxY, t.y + 2); maxZ = Math.max(maxZ, t.z);
    });
    return { minX: minX, minY: minY, w: maxX - minX, h: maxY - minY, maxZ: maxZ };
  }

  /* Every size is a whole, even number of pixels, so faces in a row share one top edge
     and faces in a column share one left edge. Height is shown with shadow and light, not a shift. */
  function viewSize() {
    let w = window.innerWidth, h = window.innerHeight;
    const vv = window.visualViewport;
    if (vv && vv.height) { w = vv.width; h = vv.height; }
    return { w: Math.round(w), h: Math.round(h) };
  }
  function edgesFor(tw, maxZ) {
    /* Match the close-up rune tiles: edge ~6px and drop shadow ~6px at 64px wide. */
    const e = Math.min(6, Math.max(3, Math.round(tw * 6 / 64)));
    const baseLift = Math.min(6, Math.max(3, Math.round(tw * 6 / 64)));
    const liftStep = Math.max(1, Math.round(tw * 0.04));
    const liftMax = Math.min(10, baseLift + maxZ * liftStep);
    return { e: e, baseLift: baseLift, liftStep: liftStep, liftMax: liftMax };
  }
  function metrics(b, availW, availH) {
    const cols = b.w / 2, rows = b.h / 2;
    const cap = window.innerWidth >= 800 ? 64 : 56;
    let tw = cap, e = 3, baseLift = 3, liftStep = 1, liftMax = 6, th = Math.round((cap * 1.4) / 2) * 2;
    for (; tw >= 12; tw -= 2) {
      const ed = edgesFor(tw, b.maxZ);
      e = ed.e; baseLift = ed.baseLift; liftStep = ed.liftStep; liftMax = ed.liftMax;
      th = Math.round((tw * 1.4) / 2) * 2;
      const boardW = cols * tw + e + liftMax + 4;
      const boardH = rows * th + e + liftMax + 4;
      if (boardW <= availW && boardH <= availH) break;
    }
    return { tw: tw, th: th, e: e, baseLift: baseLift, liftStep: liftStep, liftMax: liftMax };
  }
  /* How much vertical space the title, frame chrome, buttons (and maybe the status line) use. */
  function chromeBudget(includeStatus) {
    const appCS = getComputedStyle(appEl);
    const frameCS = getComputedStyle(frameEl);
    const padTop = parseFloat(appCS.paddingTop) || 0;
    const gap = parseFloat(appCS.rowGap || appCS.gap) || 0;
    const framePadY = (parseFloat(frameCS.paddingTop) || 0) + (parseFloat(frameCS.paddingBottom) || 0)
      + (parseFloat(frameCS.borderTopWidth) || 0) + (parseFloat(frameCS.borderBottomWidth) || 0);
    const slack = 6;
    let used = padTop + titleEl.offsetHeight + framePadY + gap + controlsEl.offsetHeight + slack;
    if (includeStatus) used += gap + statusEl.offsetHeight;
    return used;
  }

  function layerLift(z, m) { return Math.min(10, m.baseLift + z * m.liftStep); }

  function renderBoard() {
    const tiles = state.tiles;
    const b = bounds(tiles);
    const vp = viewSize();
    const availW = wrapEl.clientWidth || Math.max(80, vp.w - 24);
    /* Compact the title only when a width-fitting board would overflow the viewport height. */
    appEl.classList.remove("compact");
    const widthOnly = metrics(b, availW, 1e9);
    const boardHAtWidth = (b.h / 2) * widthOnly.th + widthOnly.e + widthOnly.liftMax + 4;
    const needCompact = chromeBudget(true) + boardHAtWidth > vp.h - 6;
    if (needCompact) appEl.classList.add("compact");
    const availHStatus = Math.max(80, vp.h - chromeBudget(true));
    const availHNoStatus = Math.max(80, vp.h - chromeBudget(false));
    const withStatus = metrics(b, availW, availHStatus);
    const noStatus = metrics(b, availW, availHNoStatus);
    /* Keep the status line on screen when it costs no (or very little) tile size. */
    const useStatus = (withStatus.tw === noStatus.tw)
      || (withStatus.tw >= 22 && (noStatus.tw - withStatus.tw) <= 6);
    const m = useStatus ? withStatus : noStatus;
    const boardW = (b.w / 2) * m.tw + m.e + m.liftMax + 4;
    const boardH = (b.h / 2) * m.th + m.e + m.liftMax + 4;
    wrapEl.style.height = boardH + "px";
    boardEl.style.width = boardW + "px";
    boardEl.style.height = boardH + "px";
    state.fit = { tw: m.tw, th: m.th, availW: availW, availH: useStatus ? availHStatus : availHNoStatus,
      statusFitted: useStatus, compact: appEl.classList.contains("compact"), vp: vp, boardW: boardW, boardH: boardH };
    /* Names when tiles are large enough; small tiles stay symbol-only (including a wide but short phone). */
    const showName = m.tw >= 40;
    const glyph = showName ? Math.round(m.tw * 0.58) : Math.round(m.tw * (m.tw < 30 ? 0.8 : 0.7));
    const namePx = Math.max(6, Math.min(Math.round(m.tw * 0.145), Math.floor((m.tw - 4) / 5.6)));
    const html = [];
    tiles.slice().sort((p, q) => p.z - q.z || p.y - q.y || p.x - q.x).forEach((t) => {
      /* Faces sit on the grid only. No per-layer x/y offset, so a row is one straight line. */
      const left = ((t.x - b.minX) / 2) * m.tw;
      const top = ((t.y - b.minY) / 2) * m.th;
      const lift = layerLift(t.z, m);
      const box = m.tw + Math.max(m.e, lift);
      const boy = m.th + Math.max(m.e, lift);
      const sym = SYM[t.face];
      html.push(
        '<button type="button" class="mj z' + t.z + " kind-" + sym.kind + (showName ? " named" : "") +
        (state.selected === t ? " sel" : "") + (t.alive ? "" : " gone") + '" data-i="' + t.i + '" aria-label="' + sym.name + '" ' +
        'style="left:' + left + "px;top:" + top + "px;width:" + box + "px;height:" + boy + "px;" +
        "--tw:" + m.tw + "px;--th:" + m.th + "px;--e:" + m.e + "px;--lift:" + lift + "px;--icon:" + glyph + "px;--name:" + namePx + "px;" +
        grainVars(t.i * 7 + t.z, 400) +
        /* Bottom-right on top, so a same-layer neighbour (including a half-offset one)
           covers this tile's east/south 3D edge and drop shadow. Higher layers still win. */
        "z-index:" + (t.z * 10000 + (t.x + t.y) * 100 + t.x) + '">' +
        '<span class="mj-shadow"></span><span class="mj-east"></span><span class="mj-south"></span>' +
        '<span class="mj-face">' + faceHTML(sym, showName) + "</span></button>"
      );
    });
    boardEl.innerHTML = html.join("");
  }

  function layoutDef() { return LAYOUTS[LAYOUT_ORDER[state.index]]; }
  function setStatus(msg, win) { statusEl.textContent = msg; statusEl.classList.toggle("win", !!win); }
  function syncUndo() { document.getElementById("undo").disabled = state.undo.length === 0; }

  function updateStatus(note) {
    const left = state.tiles.filter((t) => t.alive).length;
    const head = layoutDef().name + " (" + (state.index + 1) + " of " + LAYOUT_ORDER.length + ")";
    if (left === 0) { setStatus(head + " · The board is clear. Well fought.", true); return; }
    if (note) { setStatus(head + " · " + note); return; }
    const counts = {};
    freeTiles(state.tiles).forEach((t) => { const k = SYM[t.face].match; counts[k] = (counts[k] || 0) + 1; });
    const anyPair = Object.keys(counts).some((k) => counts[k] >= 2);
    const base = head + " · " + left + " tiles left";
    if (!anyPair) setStatus(base + " · No free matches right now. Try Restart or New Game.");
    else if (state.selected) setStatus(base + " · " + SYM[state.selected.face].name + " selected. Now pick its match.");
    else setStatus(base + " · Select a free tile, then select its match.");
    syncUndo();
  }

  function onTile(t) {
    if (!t.alive) return;
    if (!isFree(t, state.tiles)) { updateStatus("That tile is blocked. Pick one with nothing on top and a free left or right side."); return; }
    const sel = state.selected;
    if (!sel) { state.selected = t; }
    else if (sel === t) { state.selected = null; }
    else if (matches(sel, t)) { sel.alive = false; t.alive = false; state.selected = null; state.undo.push([sel.i, t.i]); }
    else { state.selected = t; }               /* a non-match simply becomes the new selection */
    renderBoard();
    updateStatus();
  }
  boardEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".mj");
    if (btn) onTile(state.tiles[+btn.dataset.i]);
  });

  function newDeal(seed, index) {
    if (index !== undefined) state.index = index;
    state.seed = seed >>> 0;
    state.selected = null;
    state.undo = [];
    const d = deal(layoutDef().positions, mulberry32(state.seed));
    state.tiles = d.tiles; state.solution = d.solution;
    renderBoard();
    updateStatus();
  }
  function restart() {
    state.tiles.forEach((t) => { t.alive = true; });
    state.selected = null;
    state.undo = [];
    renderBoard();
    updateStatus();
  }
  function undo() {
    const pair = state.undo.pop();
    if (!pair) return;
    state.tiles[pair[0]].alive = true;
    state.tiles[pair[1]].alive = true;
    state.selected = null;
    renderBoard();
    updateStatus();
  }
  function randomSeed() { return (Math.random() * 0xffffffff) >>> 0; }

  document.getElementById("newgame").addEventListener("click", () => newDeal(randomSeed()));
  document.getElementById("restart").addEventListener("click", restart);
  document.getElementById("undo").addEventListener("click", undo);
  /* Choose Layout steps through the six layouts in order and deals a new game on each. */
  document.getElementById("choosegame").addEventListener("click", () => {
    newDeal(randomSeed(), (state.index + 1) % LAYOUT_ORDER.length);
  });
  function scheduleRender() {
    if (state._fitRaf) return;
    state._fitRaf = requestAnimationFrame(() => {
      state._fitRaf = 0;
      if (state.tiles.length) renderBoard();
    });
  }
  window.addEventListener("resize", scheduleRender);
  window.addEventListener("orientationchange", scheduleRender);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", scheduleRender);

  /* ---------- close-up pages used for the approval thumbnails (?view=sets or ?view=runes) ---------- */
  function showTile(sym, tw, th, e, z, n) {
    const icon = Math.round(tw * 0.6);
    const lift = z ? 6 : 3;
    return '<div class="mj kind-' + sym.kind + ' z' + (z ? "1" : "0") + '" style="position:relative;width:' + (tw + Math.max(e, lift)) + "px;height:" + (th + Math.max(e, lift)) + "px;" +
      "--tw:" + tw + "px;--th:" + th + "px;--e:" + e + "px;--lift:" + lift + "px;--icon:" + icon + "px;--name:" + Math.round(tw * 0.15) + "px;" + grainVars(n, 400) + '">' +
      '<span class="mj-shadow"></span><span class="mj-east"></span><span class="mj-south"></span>' +
      '<span class="mj-face">' + faceHTML(sym, true) + "</span></div>";
  }
  function renderCloseup(view) {
    document.body.classList.add("closeup-mode");
    document.getElementById("closeup").hidden = false;
    const host = document.getElementById("closeup-body");
    const out = [];
    let n = 3;
    if (view === "compare") {
      document.getElementById("closeup-sub").textContent = "REFERENCE UNICODE GLYPHS (TOP) AND OUR STRAIGHT-CUT TILES (BOTTOM)";
      out.push('<p class="closeup-note">Top row: the 24 runes rendered in Noto Sans Runic, the same Unicode characters Drew sent. Bottom row: our carved straight-line tiles, with the Viking Sudoku names.</p>');
      out.push('<div class="compare-grid">' + RUNES.map((s, i) => {
        const slug = "images/ref-runes/" + String(i).padStart(2, "0") + "-" + s.name.replace("Æ", "Ae") + ".png";
        return '<div class="compare-cell"><img class="compare-ref-img" src="' + slug + '" alt="' + s.glyph + '" width="96" height="125">' +
          showTile(s, 64, 90, 6, true, n += 5) +
          '<span class="compare-name">' + s.name + "</span></div>";
      }).join("") + "</div>");
    } else if (view === "runes") {
      document.getElementById("closeup-sub").textContent = "THE 24 RUNES — NAMES FROM VIKING SUDOKU";
      out.push('<div class="set-tiles runes24">' + RUNES.map((s) => showTile(s, 64, 90, 6, true, n += 5)).join("") + "</div>");
      out.push('<p class="closeup-note">Four tiles of each rune. Same glyphs and names as the Runes button in Viking Sudoku. Marks are straight cuts only, traced from the canonical Unicode shapes.</p>');
    } else if (view === "norns") {
      document.getElementById("closeup-sub").textContent = "THE FOUR NORNS — ANY TWO MATCH";
      const norns = SET_TILES[SETS.findIndex((s) => s.key === "norn")];
      out.push('<div class="set-tiles norns-close">' + norns.map((s) => showTile(s, 200, 280, 12, true, n += 5)).join("") + "</div>");
      out.push('<p class="closeup-note">Urd with her well-bucket, Verdandi with a spindle, Skuld with shears, and Wyrd with a knot of thread. Any two Norns match.</p>');
    } else {
      document.getElementById("closeup-sub").textContent = "SETS (ANY TWO OF A SET MATCH) AND THE SEVEN GODS";
      SETS.forEach((s, si) => {
        out.push('<div class="set-row"><div class="set-label">' + s.name + ' <span>any two match</span></div><div class="set-tiles">' +
          SET_TILES[si].map((t) => showTile(t, 84, 118, 8, true, n += 5)).join("") + "</div></div>");
      });
      out.push('<div class="set-row"><div class="set-label">Gods <span>four identical tiles each</span></div><div class="set-tiles">' +
        GODS.map((t) => showTile(t, 84, 118, 8, true, n += 5)).join("") + "</div></div>");
    }
    host.innerHTML = out.join("");
  }

  /* ---------- test hook (used by the automated checks) ---------- */
  window.__vmj = { deal: deal, isFree: isFree, matches: matches, mulberry32: mulberry32, SYM: SYM, LAYOUTS: LAYOUTS, LAYOUT_ORDER: LAYOUT_ORDER,
    state: state, onTile: onTile, renderBoard: renderBoard, undo: undo, viewSize: viewSize };

  /* ---------- start ---------- */
  const params = new URLSearchParams(location.search);
  if (params.get("view") === "sets" || params.get("view") === "runes" || params.get("view") === "compare" || params.get("view") === "norns") { renderCloseup(params.get("view")); return; }
  let idx = LAYOUT_ORDER.indexOf((params.get("layout") || "turtle").toLowerCase());
  if (idx < 0) idx = 0;
  newDeal(params.get("seed") ? Number(params.get("seed")) : 0xA5E1D01, idx);
})();
