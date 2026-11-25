/* ASCII // STUDIO — app.js (vanilla, no build) */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const CATS = window.ASCII_CATEGORIES || [];
  const VAULT = window.ASCII_ART_VAULT || [];

  /* ---------- toast + clipboard ---------- */
  const toastEl = $("#toast");
  let toastTimer = 0;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add("is-visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-visible");
      setTimeout(() => { toastEl.hidden = true; }, 250);
    }, 1800);
  }
  const discordToggle = $("#globalDiscordToggle");
  function wrapForCopy(text) {
    const clean = text.replace(/[ \t]+$/gm, "");
    return discordToggle && discordToggle.checked ? "```\n" + clean + "\n```" : clean;
  }
  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  async function copyText(text, btn) {
    const payload = wrapForCopy(text);
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(payload);
        ok = true;
      }
    } catch (e) { ok = false; }
    if (!ok) ok = fallbackCopy(payload);
    toast(ok ? (discordToggle && discordToggle.checked ? "Copied for Discord ✓" : "Copied! ✓") : "Select the art and copy manually");
    if (btn && ok) {
      const old = btn.textContent;
      btn.classList.add("is-copied");
      btn.textContent = "Copied!";
      setTimeout(() => { btn.classList.remove("is-copied"); btn.textContent = old; }, 1300);
    }
    return ok;
  }
  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function downloadText(text, name) {
    downloadBlob(new Blob([text.replace(/[ \t]+$/gm, "") + "\n"], { type: "text/plain;charset=utf-8" }), name);
    toast("Downloaded " + name);
  }
  function downloadPng(text, name) {
    const lines = text.split("\n");
    const fs = 16, lh = Math.round(fs * 1.12), pad = 24;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    const font = fs + "px ui-monospace, 'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace";
    ctx.font = font;
    const w = Math.max(...lines.map((l) => ctx.measureText(l).width), 10);
    c.width = Math.ceil(w + pad * 2);
    c.height = Math.ceil(lines.length * lh + pad * 2);
    ctx.fillStyle = "#07090d"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = font; ctx.fillStyle = "#e2e8f0"; ctx.textBaseline = "top";
    lines.forEach((l, i) => ctx.fillText(l, pad, pad + i * lh));
    c.toBlob((b) => { if (b) { downloadBlob(b, name); toast("Downloaded " + name); } }, "image/png");
  }
  function fitPre(pre, maxFs, minFs) {
    if (!pre || !pre.parentElement || !pre.offsetParent) return;
    const stage = pre.parentElement;
    const cs = getComputedStyle(stage);
    const avail = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 2;
    pre.style.fontSize = "20px";
    const w = pre.scrollWidth || 1;
    const fs = Math.max(minFs || 4, Math.min(maxFs || 13, (20 * avail) / w));
    pre.style.fontSize = fs.toFixed(2) + "px";
  }
  window.__asciiUtil = { copyText, downloadText, downloadPng, toast, fitPre };

  /* ---------- primary tabs + studio sub-tabs ---------- */
  function activateTab(name) {
    $$(".tab-btn").forEach((b) => {
      const on = b.dataset.tab === name;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$(".tab-panel").forEach((p) => {
      const on = p.id === "panel-" + name;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
    if (name === "studio") document.dispatchEvent(new CustomEvent("studio:shown"));
  }
  function activateSubtab(name) {
    $$(".subtab-btn").forEach((b) => {
      const on = b.dataset.subtab === name;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$(".studio-pane").forEach((p) => {
      const on = p.id === "studio-" + name;
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
  }
  $$(".tab-btn").forEach((b) => b.addEventListener("click", () => activateTab(b.dataset.tab)));
  $$(".subtab-btn").forEach((b) => b.addEventListener("click", () => activateSubtab(b.dataset.subtab)));
  const brand = $("#brandHome");
  if (brand) brand.addEventListener("click", (e) => { e.preventDefault(); activateTab("vault"); window.scrollTo({ top: 0, behavior: "smooth" }); });
  window.__asciiNav = { activateTab, activateSubtab };

  /* ---------- Art Vault gallery ---------- */
  const grid = $("#artGrid"), bar = $("#categoryBar"), search = $("#vaultSearch");
  const clearBtn = $("#clearSearchBtn"), countLabel = $("#vaultCountLabel"), empty = $("#vaultEmpty");
  const catLabel = Object.fromEntries(CATS.map((c) => [c.id, c.label]));
  let activeCat = "all";

  function esc(s) { return String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch])); }
  function dims(art) {
    const lines = art.split("\n");
    return { cols: Math.max(...lines.map((l) => Array.from(l.replace(/\s+$/, "")).length)), rows: lines.length };
  }
  function renderBar() {
    if (!bar) return;
    bar.innerHTML = CATS.map((c) => {
      const n = c.id === "all" ? VAULT.length : VAULT.filter((a) => a.category === c.id).length;
      return '<button type="button" class="cat-pill' + (c.id === activeCat ? " is-active" : "") + '" data-cat="' + c.id + '" aria-pressed="' + (c.id === activeCat) + '">' +
        '<span aria-hidden="true">' + esc(c.icon) + "</span> " + esc(c.label) + ' <span class="cat-count">' + n + "</span></button>";
    }).join("");
  }
  function matches(item, q) {
    if (!q) return true;
    const hay = (item.title + " " + item.category + " " + (catLabel[item.category] || "") + " " + (item.tags || []).join(" ")).toLowerCase();
    return q.split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
  }
  function renderGrid() {
    const q = (search && search.value || "").trim().toLowerCase();
    const items = VAULT.filter((a) => (activeCat === "all" || a.category === activeCat) && matches(a, q));
    if (clearBtn) clearBtn.hidden = !q;
    if (countLabel) countLabel.textContent = items.length + (items.length === 1 ? " piece" : " pieces");
    if (empty) empty.hidden = items.length > 0;
    grid.innerHTML = items.map((a) => {
      const d = dims(a.art);
      return '<article class="art-card" data-id="' + esc(a.id) + '">' +
        '<header class="art-card-head"><h3 class="art-card-title">' + esc(a.title) + "</h3>" +
        '<div class="art-badges"><span class="badge-cat">' + esc(catLabel[a.category] || a.category) + "</span></div></header>" +
        '<div class="art-stage"><pre class="art-pre" style="--cols:' + d.cols + '">' + esc(a.art) + "</pre></div>" +
        '<footer class="art-card-foot"><span class="badge-dim">' + d.cols + "×" + d.rows + " · " + esc((a.tags || []).slice(0, 3).join(" · ")) + "</span>" +
        '<button type="button" class="btn btn-primary btn-sm copy-art-btn" data-id="' + esc(a.id) + '">Copy</button></footer></article>';
    }).join("");
  }
  if (bar) bar.addEventListener("click", (e) => {
    const b = e.target.closest(".cat-pill");
    if (!b) return;
    activeCat = b.dataset.cat;
    renderBar(); renderGrid();
  });
  if (search) search.addEventListener("input", renderGrid);
  if (clearBtn) clearBtn.addEventListener("click", () => { search.value = ""; renderGrid(); search.focus(); });
  const resetBtn = $("#emptyResetBtn");
  if (resetBtn) resetBtn.addEventListener("click", () => { search.value = ""; activeCat = "all"; renderBar(); renderGrid(); });
  if (grid) grid.addEventListener("click", (e) => {
    const b = e.target.closest(".copy-art-btn");
    if (!b) return;
    const item = VAULT.find((a) => a.id === b.dataset.id);
    if (item) copyText(item.art, b);
  });
  if (grid) { renderBar(); renderGrid(); }
})();

/* ---------- Image → ASCII / Braille converter ---------- */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const U = window.__asciiUtil;
  const out = $("#imageAsciiOutput");
  if (!out) return;
  const preview = $("#sourcePreviewCanvas"), pctx = preview.getContext("2d");
  const widthSlider = $("#widthSlider"), contrastSlider = $("#contrastSlider"), invert = $("#invertToggle");
  const widthVal = $("#widthValue"), contrastVal = $("#contrastValue"), stats = $("#imageMetaStats");
  const RAMPS = {
    classic: " .:-=+*#%@",
    dense: " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
    blocks: " ░▒▓█"
  };
  const MODE_NAME = { braille: "Braille 2×4", classic: "Classic ASCII", dense: "Dense Shaded", blocks: "Block Art" };
  let mode = "braille";
  let source = document.createElement("canvas");
  source.width = source.height = 240;

  /* procedural samples: bright subject on black so the subject renders dense */
  function blank(w, h) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const x = c.getContext("2d"); x.fillStyle = "#000"; x.fillRect(0, 0, w, h); return [c, x];
  }
  const SAMPLES = {
    rose() {
      const [c, x] = blank(240, 280);
      x.strokeStyle = "#cfcfcf"; x.lineWidth = 9; x.lineCap = "round";
      x.beginPath(); x.moveTo(120, 135); x.bezierCurveTo(112, 190, 132, 220, 120, 275); x.stroke();
      x.fillStyle = "#bdbdbd";
      x.beginPath(); x.ellipse(88, 205, 30, 12, -0.6, 0, Math.PI * 2); x.fill();
      x.beginPath(); x.ellipse(152, 232, 30, 12, 0.6, 0, Math.PI * 2); x.fill();
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2, r = 46;
        x.fillStyle = i % 2 ? "#e8e8e8" : "#ffffff";
        x.beginPath(); x.ellipse(120 + Math.cos(a) * 26, 90 + Math.sin(a) * 22, r * 0.62, r * 0.48, a, 0, Math.PI * 2); x.fill();
      }
      x.strokeStyle = "#555"; x.lineWidth = 5;
      x.beginPath();
      for (let t = 0; t < 4.2 * Math.PI; t += 0.08) { const r = 3 + t * 3.2; x.lineTo(120 + Math.cos(t) * r, 90 + Math.sin(t) * r * 0.85); }
      x.stroke();
      return c;
    },
    eye() {
      const [c, x] = blank(300, 200);
      x.save(); x.beginPath(); x.moveTo(20, 100); x.quadraticCurveTo(150, -10, 280, 100); x.quadraticCurveTo(150, 210, 20, 100); x.closePath();
      x.fillStyle = "#f2f2f2"; x.fill(); x.clip();
      const g = x.createRadialGradient(150, 100, 8, 150, 100, 52);
      g.addColorStop(0, "#202020"); g.addColorStop(0.45, "#8a8a8a"); g.addColorStop(1, "#3a3a3a");
      x.fillStyle = g; x.beginPath(); x.arc(150, 100, 52, 0, Math.PI * 2); x.fill();
      x.strokeStyle = "#b0b0b0"; x.lineWidth = 2;
      for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; x.beginPath(); x.moveTo(150 + Math.cos(a) * 24, 100 + Math.sin(a) * 24); x.lineTo(150 + Math.cos(a) * 48, 100 + Math.sin(a) * 48); x.stroke(); }
      x.fillStyle = "#000"; x.beginPath(); x.arc(150, 100, 22, 0, Math.PI * 2); x.fill();
      x.fillStyle = "#fff"; x.beginPath(); x.arc(166, 84, 9, 0, Math.PI * 2); x.fill();
      x.restore();
      x.strokeStyle = "#fff"; x.lineWidth = 6; x.lineCap = "round";
      x.beginPath(); x.moveTo(20, 100); x.quadraticCurveTo(150, -10, 280, 100); x.stroke();
      for (let i = 0; i < 9; i++) { const t = 0.15 + i * 0.0875, px = 20 + 260 * t, py = 100 - 220 * t * (1 - t) * 1.0; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (t - 0.5) * 30, py - 22); x.stroke(); }
      return c;
    },
    bear() {
      const [c, x] = blank(260, 260);
      const C = (cx, cy, r, col) => { x.fillStyle = col; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill(); };
      C(62, 62, 36, "#d8d8d8"); C(198, 62, 36, "#d8d8d8"); C(62, 62, 18, "#808080"); C(198, 62, 18, "#808080");
      C(130, 140, 96, "#e6e6e6");
      x.fillStyle = "#ffffff"; x.beginPath(); x.ellipse(130, 175, 46, 36, 0, 0, Math.PI * 2); x.fill();
      C(94, 122, 12, "#000"); C(166, 122, 12, "#000"); C(98, 118, 4, "#fff"); C(170, 118, 4, "#fff");
      x.fillStyle = "#000"; x.beginPath(); x.ellipse(130, 160, 16, 11, 0, 0, Math.PI * 2); x.fill();
      x.strokeStyle = "#000"; x.lineWidth = 5; x.lineCap = "round";
      x.beginPath(); x.moveTo(130, 170); x.lineTo(130, 186); x.arc(118, 186, 12, 0, Math.PI, false); x.moveTo(130, 186); x.arc(142, 186, 12, Math.PI, 0, true); x.stroke();
      return c;
    },
    knight() {
      const [c, x] = blank(240, 280);
      x.fillStyle = "#ececec";
      x.beginPath();
      [[60,250],[180,250],[180,232],[165,222],[160,190],[175,150],[178,110],[160,70],[128,40],[118,22],[108,40],[90,48],[70,78],[48,118],[56,138],[80,134],[100,120],[112,126],[86,170],[72,222],[60,232]].forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]));
      x.closePath(); x.fill();
      x.fillStyle = "#000"; x.beginPath(); x.arc(112, 74, 7, 0, Math.PI * 2); x.fill();
      x.strokeStyle = "#7a7a7a"; x.lineWidth = 6; x.lineCap = "round";
      x.beginPath(); x.moveTo(140, 56); x.quadraticCurveTo(172, 100, 162, 160); x.stroke();
      x.fillStyle = "#bdbdbd"; x.fillRect(50, 250, 140, 18);
      return c;
    },
    moon() {
      const [c, x] = blank(260, 240);
      const g = x.createRadialGradient(110, 110, 10, 110, 120, 90);
      g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#bcbcbc");
      x.fillStyle = g; x.beginPath(); x.arc(110, 120, 88, 0, Math.PI * 2); x.fill();
      x.fillStyle = "#000"; x.beginPath(); x.arc(150, 98, 80, 0, Math.PI * 2); x.fill();
      x.fillStyle = "#fff";
      const star = (cx, cy, r) => { x.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.42 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); };
      star(200, 60, 22); star(222, 150, 14); star(170, 196, 10); star(150, 30, 8);
      return c;
    }
  };

  function setSource(img) {
    const maxSide = 360;
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    const s = Math.min(1, maxSide / Math.max(w, h));
    source = document.createElement("canvas");
    source.width = Math.max(1, Math.round(w * s)); source.height = Math.max(1, Math.round(h * s));
    source.getContext("2d").drawImage(img, 0, 0, source.width, source.height);
    drawPreview(); render();
  }
  function drawPreview() {
    pctx.fillStyle = "#07090d"; pctx.fillRect(0, 0, preview.width, preview.height);
    const s = Math.min(preview.width / source.width, preview.height / source.height);
    const w = source.width * s, h = source.height * s;
    pctx.drawImage(source, (preview.width - w) / 2, (preview.height - h) / 2, w, h);
  }
  function luminanceGrid(pw, ph) {
    const c = document.createElement("canvas"); c.width = pw; c.height = ph;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.fillStyle = "#000"; x.fillRect(0, 0, pw, ph);
    x.imageSmoothingQuality = "high";
    x.drawImage(source, 0, 0, pw, ph);
    const d = x.getImageData(0, 0, pw, ph).data;
    const k = Number(contrastSlider.value) * 2.2;
    const f = (259 * (k + 255)) / (255 * (259 - k));
    const inv = invert.checked;
    const g = new Float32Array(pw * ph);
    for (let i = 0; i < pw * ph; i++) {
      let v = 0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2];
      v = f * (v - 128) + 128;
      v = Math.max(0, Math.min(255, v)) / 255;
      g[i] = inv ? 1 - v : v;
    }
    return g;
  }
  function convert() {
    const cols = Number(widthSlider.value);
    const aspect = source.height / source.width;
    if (mode === "braille") {
      const pw = cols * 2, rows = Math.max(1, Math.round((pw * aspect) / 4)), ph = rows * 4;
      const g = luminanceGrid(pw, ph);
      // Floyd–Steinberg dither to 1-bit for smooth tonal dots
      for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
        const i = y * pw + x, o = g[i], n = o >= 0.5 ? 1 : 0, e = o - n; g[i] = n;
        if (x + 1 < pw) g[i + 1] += e * 7 / 16;
        if (y + 1 < ph) { if (x > 0) g[i + pw - 1] += e * 3 / 16; g[i + pw] += e * 5 / 16; if (x + 1 < pw) g[i + pw + 1] += e / 16; }
      }
      const BITS = [[0x01, 0x08], [0x02, 0x10], [0x04, 0x20], [0x40, 0x80]];
      const lines = [];
      for (let r = 0; r < rows; r++) {
        let line = "";
        for (let cx = 0; cx < cols; cx++) {
          let code = 0;
          for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 2; dx++) if (g[(r * 4 + dy) * pw + cx * 2 + dx] > 0.5) code |= BITS[dy][dx];
          line += String.fromCharCode(0x2800 + code);
        }
        lines.push(line);
      }
      return { text: lines.join("\n"), cols, rows };
    }
    const ramp = Array.from(RAMPS[mode]);
    const rows = Math.max(1, Math.round(cols * aspect * 0.5));
    const g = luminanceGrid(cols, rows);
    const lines = [];
    for (let r = 0; r < rows; r++) {
      let line = "";
      for (let cx = 0; cx < cols; cx++) line += ramp[Math.min(ramp.length - 1, Math.floor(g[r * cols + cx] * ramp.length))];
      lines.push(line);
    }
    return { text: lines.join("\n"), cols, rows };
  }
  let last = { text: "" };
  function render() {
    widthVal.textContent = widthSlider.value;
    const cv = Number(contrastSlider.value);
    contrastVal.textContent = (cv > 0 ? "+" : "") + cv;
    last = convert();
    out.textContent = last.text;
    stats.textContent = last.cols + " cols × " + last.rows + " rows · " + MODE_NAME[mode];
    U.fitPre(out, 14, 4);
  }
  window.addEventListener("resize", () => U.fitPre(out, 14, 4));
  document.addEventListener("studio:shown", () => U.fitPre(out, 14, 4));
  document.getElementById("subtab-image").addEventListener("click", () => U.fitPre(out, 14, 4));

  /* controls */
  document.querySelectorAll("#charsetModes .mode-btn").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.mode;
    document.querySelectorAll("#charsetModes .mode-btn").forEach((o) => o.classList.toggle("is-active", o === b));
    render();
  }));
  function loadSample(name) {
    const fn = SAMPLES[name] || SAMPLES.rose;
    source = fn();
    document.querySelectorAll("#samplePills .pill-btn").forEach((o) => o.classList.toggle("is-active", o.dataset.sample === name));
    drawPreview(); render();
  }
  document.querySelectorAll("#samplePills .pill-btn").forEach((b) => b.addEventListener("click", () => loadSample(b.dataset.sample)));
  [widthSlider, contrastSlider].forEach((s) => s.addEventListener("input", render));
  invert.addEventListener("change", render);

  const drop = $("#dropzone"), file = $("#imageFileInput");
  function readFile(f) {
    if (!f || !/^image\//.test(f.type)) { U.toast("That file isn't an image"); return; }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setSource(img); URL.revokeObjectURL(url);
      document.querySelectorAll("#samplePills .pill-btn").forEach((o) => o.classList.remove("is-active"));
      U.toast("Converted " + (f.name || "image"));
    };
    img.onerror = () => { URL.revokeObjectURL(url); U.toast("Couldn't read that image"); };
    img.src = url;
  }
  drop.addEventListener("click", () => file.click());
  drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.click(); } });
  file.addEventListener("change", () => { readFile(file.files[0]); file.value = ""; });
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("is-dragover"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("is-dragover"); }));
  drop.addEventListener("drop", (e) => readFile(e.dataTransfer && e.dataTransfer.files[0]));
  document.addEventListener("paste", (e) => {
    const it = Array.from((e.clipboardData && e.clipboardData.items) || []).find((i) => i.type.startsWith("image/"));
    if (it) readFile(it.getAsFile());
  });

  $("#copyImageAsciiBtn").addEventListener("click", (e) => U.copyText(last.text, e.currentTarget));
  $("#downloadImageTxtBtn").addEventListener("click", () => U.downloadText(last.text, "ascii-" + mode + ".txt"));
  $("#downloadImagePngBtn").addEventListener("click", () => U.downloadPng(last.text, "ascii-" + mode + ".png"));

  loadSample("rose");
})();

/* ---------- Text Banner Maker ---------- */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const U = window.__asciiUtil;
  const out = $("#bannerOutput");
  if (!out) return;
  // 5-row bitmap font: each glyph is 5 strings, '#' = filled pixel
  const F = {
    A: [" ### ", "#   #", "#####", "#   #", "#   #"], B: ["#### ", "#   #", "#### ", "#   #", "#### "],
    C: [" ####", "#    ", "#    ", "#    ", " ####"], D: ["#### ", "#   #", "#   #", "#   #", "#### "],
    E: ["#####", "#    ", "#### ", "#    ", "#####"], F: ["#####", "#    ", "#### ", "#    ", "#    "],
    G: [" ####", "#    ", "#  ##", "#   #", " ### "], H: ["#   #", "#   #", "#####", "#   #", "#   #"],
    I: ["###", " # ", " # ", " # ", "###"], J: ["  ###", "    #", "    #", "#   #", " ### "],
    K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"], L: ["#    ", "#    ", "#    ", "#    ", "#####"],
    M: ["#   #", "## ##", "# # #", "#   #", "#   #"], N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
    O: [" ### ", "#   #", "#   #", "#   #", " ### "], P: ["#### ", "#   #", "#### ", "#    ", "#    "],
    Q: [" ### ", "#   #", "# # #", "#  # ", " ## #"], R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
    S: [" ####", "#    ", " ### ", "    #", "#### "], T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
    U: ["#   #", "#   #", "#   #", "#   #", " ### "], V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
    W: ["#   #", "#   #", "# # #", "## ##", "#   #"], X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
    Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "], Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
    0: [" ### ", "#  ##", "# # #", "##  #", " ### "], 1: [" ## ", "# # ", "  # ", "  # ", "####"],
    2: [" ### ", "#   #", "  ## ", " #   ", "#####"], 3: ["#### ", "    #", " ### ", "    #", "#### "],
    4: ["#  # ", "#  # ", "#####", "   # ", "   # "], 5: ["#####", "#    ", "#### ", "    #", "#### "],
    6: [" ### ", "#    ", "#### ", "#   #", " ### "], 7: ["#####", "   # ", "  #  ", " #   ", " #   "],
    8: [" ### ", "#   #", " ### ", "#   #", " ### "], 9: [" ### ", "#   #", " ####", "    #", " ### "],
    " ": ["   ", "   ", "   ", "   ", "   "], "!": ["#", "#", "#", " ", "#"], "?": [" ### ", "#   #", "  ## ", "     ", "  #  "],
    ".": [" ", " ", " ", " ", "#"], ",": ["  ", "  ", "  ", " #", "# "], ":": [" ", "#", " ", "#", " "],
    ";": ["  ", " #", "  ", " #", "# "], "'": ["#", "#", " ", " ", " "], '"': ["# #", "# #", "   ", "   ", "   "],
    "-": ["    ", "    ", "####", "    ", "    "], "_": ["    ", "    ", "    ", "    ", "####"], "+": ["   ", " # ", "###", " # ", "   "],
    "=": ["    ", "####", "    ", "####", "    "], "/": ["    #", "   # ", "  #  ", " #   ", "#    "], "\\": ["#    ", " #   ", "  #  ", "   # ", "    #"],
    "(": [" #", "# ", "# ", "# ", " #"], ")": ["# ", " #", " #", " #", "# "], "[": ["##", "# ", "# ", "# ", "##"], "]": ["##", " #", " #", " #", "##"],
    "<": ["   #", "  # ", " #  ", "  # ", "   #"], ">": ["#   ", " #  ", "  # ", " #  ", "#   "], "*": ["     ", "# # #", " ### ", "# # #", "     "],
    "#": [" # # ", "#####", " # # ", "#####", " # # "], "@": [" ### ", "# ###", "# # #", "# ###", " ### "], "&": [" ##  ", "#  # ", " ##  ", "#  # ", " ## #"],
    "$": [" ####", "# #  ", " ### ", "  # #", "#### "], "%": ["##  #", "## # ", "  #  ", " # ##", "#  ##"], "^": [" # ", "# #", "   ", "   ", "   "],
    "~": ["     ", " #  #", "# ## ", "     ", "     "], "|": ["#", "#", "#", "#", "#"], "♡": [" # # ", "#####", "#####", " ### ", "  #  "]
  };
  const UNKNOWN = F["?"];
  let font = "shadow", frame = "none", lastText = "";
  const FONT_NAME = { shadow: "ANSI Shadow", block: "Solid Block", hash: "Retro ASCII" };

  function bitmapLine(text) {
    const chars = Array.from(text.toUpperCase());
    const rows = ["", "", "", "", ""];
    chars.forEach((ch, i) => {
      const g = F[ch] || UNKNOWN;
      const w = Math.max(...g.map((r) => r.length));
      for (let r = 0; r < 5; r++) rows[r] += g[r].padEnd(w, " ") + (i < chars.length - 1 ? " " : "");
    });
    return rows;
  }
  function styleRows(rows) {
    const W = Math.max(...rows.map((r) => r.length));
    const on = (r, c) => r >= 0 && r < rows.length && c >= 0 && c < W && rows[r][c] === "#";
    if (font === "hash") return rows.map((r) => r.replace(/#/g, "#"));
    if (font === "block") return rows.map((r) => Array.from(r).map((ch) => (ch === "#" ? "██" : "  ")).join(""));
    // shadow: solid pixels with a ░ drop shadow offset down-right
    const out = [];
    for (let r = 0; r <= rows.length; r++) {
      let line = "";
      for (let c = 0; c <= W; c++) line += on(r, c) ? "██" : on(r - 1, c - 1) ? "░░" : "  ";
      out.push(line);
    }
    return out;
  }
  function applyFrame(lines) {
    lines = lines.map((l) => l.replace(/\s+$/, ""));
    const W = Math.max(0, ...lines.map((l) => Array.from(l).length));
    const pad = (l) => l + " ".repeat(W - Array.from(l).length);
    if (frame === "box") {
      const top = "╔" + "═".repeat(W + 4) + "╗", bot = "╚" + "═".repeat(W + 4) + "╝";
      return [top, "║" + " ".repeat(W + 4) + "║"].concat(lines.map((l) => "║  " + pad(l) + "  ║"), ["║" + " ".repeat(W + 4) + "║", bot]);
    }
    if (frame === "stars") {
      const deco = (n) => { let s = ""; const p = "✦ · ✧ · "; while (s.length < n) s += p; return s.slice(0, n); };
      return [deco(W + 4), ""].concat(lines.map((l) => "  " + l), ["", deco(W + 4)]);
    }
    return lines;
  }
  function render() {
    const raw = $("#bannerTextInput").value || " ";
    const stage = out.parentElement;
    const avail = (stage && stage.clientWidth ? stage.clientWidth - 34 : window.innerWidth - 80);
    const maxCols = Math.max(24, Math.floor(avail / 3.9));
    const widthOf = (s) => Math.max(...styleRows(bitmapLine(s)).map((r) => r.replace(/\s+$/, "").length));
    const wrapped = [];
    raw.split(/\n/).slice(0, 4).forEach((line) => {
      let cur = "";
      line.split(/ +/).forEach((word) => {
        const next = cur ? cur + " " + word : word;
        if (cur && widthOf(next) > maxCols) { wrapped.push(cur); cur = word; } else cur = next;
      });
      wrapped.push(cur);
    });
    const blocks = wrapped.slice(0, 6).map((line) => styleRows(bitmapLine(line || " ")));
    let lines = [];
    blocks.forEach((b, i) => { lines = lines.concat(b); if (i < blocks.length - 1) lines.push(""); });
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    lastText = applyFrame(lines).map((l) => l.replace(/\s+$/, "")).join("\n");
    out.textContent = lastText;
    const w = Math.max(...lastText.split("\n").map((l) => Array.from(l).length));
    $("#bannerMetaStats").textContent = FONT_NAME[font] + " · " + w + " cols";
    U.fitPre(out, 14, 3.5);
  }
  let rz = 0;
  window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(render, 120); });
  $("#subtab-banner").addEventListener("click", () => requestAnimationFrame(render));
  $("#bannerTextInput").addEventListener("input", render);
  document.querySelectorAll("#bannerFontGroup .pill-btn").forEach((b) => b.addEventListener("click", () => {
    font = b.dataset.font;
    document.querySelectorAll("#bannerFontGroup .pill-btn").forEach((o) => o.classList.toggle("is-active", o === b));
    render();
  }));
  document.querySelectorAll("#bannerFrameGroup .pill-btn").forEach((b) => b.addEventListener("click", () => {
    frame = b.dataset.frame;
    document.querySelectorAll("#bannerFrameGroup .pill-btn").forEach((o) => o.classList.toggle("is-active", o === b));
    render();
  }));
  $("#copyBannerBtn").addEventListener("click", (e) => U.copyText(lastText, e.currentTarget));
  $("#downloadBannerTxtBtn").addEventListener("click", () => U.downloadText(lastText, "banner.txt"));
  $("#sendBannerToCanvasBtn").addEventListener("click", () => {
    if (window.__asciiDraw) window.__asciiDraw.loadText(lastText);
    window.__asciiNav.activateSubtab("draw");
    U.toast("Banner loaded onto the canvas");
  });
  window.__asciiBanner = { render, get text() { return lastText; } };
  render();
})();

/* ---------- Draw Canvas ---------- */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const U = window.__asciiUtil;
  const gridEl = $("#drawGrid");
  if (!gridEl) return;
  const BRUSHES = ["#", "*", "@", "♡", "░", "▒", "█", ".", "o", "/", "\\", "|", "-", "_", "(", ")"];
  const ERASER = "⌫";
  const MIRROR = { "/": "\\", "\\": "/", "(": ")", ")": "(", "<": ">", ">": "<", "[": "]", "]": "[", "{": "}", "}": "{", "╱": "╲", "╲": "╱" };
  let cols = 40, rows = 18, brush = "#", data = [], cells = [], undo = [], painting = false, lastKey = "";
  const mirror = $("#mirrorXToggle"), palette = $("#brushPalette"), custom = $("#customBrushInput"), activeDisp = $("#activeBrushDisplay");

  function blankData() { return Array.from({ length: rows }, () => Array(cols).fill(" ")); }
  function fitCells() {
    const wrap = gridEl.parentElement;
    const cs = getComputedStyle(wrap);
    let avail = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 4;
    if (!(avail > 0)) avail = Math.min(window.innerWidth - 60, 900);
    const cw = Math.max(8, Math.min(16, Math.floor(avail / cols)));
    gridEl.style.setProperty("--cell-w", cw + "px");
    gridEl.style.setProperty("--cell-h", Math.round(cw * 1.25) + "px");
    gridEl.style.setProperty("--cell-fs", Math.max(7, Math.round(cw * 0.82)) + "px");
  }
  window.addEventListener("resize", fitCells);
  document.getElementById("subtab-draw").addEventListener("click", () => requestAnimationFrame(fitCells));
  function build() {
    gridEl.style.setProperty("--grid-cols", cols);
    fitCells();
    gridEl.innerHTML = "";
    cells = [];
    const frag = document.createDocumentFragment();
    for (let r = 0; r < rows; r++) {
      cells.push([]);
      for (let c = 0; c < cols; c++) {
        const d = document.createElement("div");
        d.className = "draw-cell";
        d.dataset.r = r; d.dataset.c = c;
        frag.appendChild(d); cells[r].push(d);
      }
    }
    gridEl.appendChild(frag);
    paintAll();
  }
  function setCell(r, c, ch) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    data[r][c] = ch;
    const el = cells[r][c];
    el.textContent = ch === " " ? "" : ch;
    el.classList.toggle("has-char", ch !== " ");
  }
  function paintAll() { for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) setCell(r, c, data[r][c]); }
  function snapshot() { undo.push(data.map((row) => row.slice())); if (undo.length > 60) undo.shift(); }
  function stamp(r, c) {
    const key = r + ":" + c;
    if (key === lastKey) return;
    lastKey = key;
    const ch = brush === ERASER ? " " : brush;
    setCell(r, c, ch);
    if (mirror.checked) {
      const mc = cols - 1 - c;
      if (mc !== c) setCell(r, mc, MIRROR[ch] || ch);
    }
  }
  function cellFromEvent(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    return el && el.classList.contains("draw-cell") && gridEl.contains(el) ? el : null;
  }
  gridEl.addEventListener("pointerdown", (e) => {
    const el = cellFromEvent(e);
    if (!el) return;
    e.preventDefault();
    snapshot();
    painting = true; lastKey = "";
    try { gridEl.setPointerCapture(e.pointerId); } catch (_) {}
    stamp(+el.dataset.r, +el.dataset.c);
  });
  gridEl.addEventListener("pointermove", (e) => {
    if (!painting) return;
    const el = cellFromEvent(e);
    if (el) stamp(+el.dataset.r, +el.dataset.c);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach((ev) => gridEl.addEventListener(ev, () => { painting = false; lastKey = ""; }));

  function setBrush(ch) {
    brush = ch;
    activeDisp.textContent = ch === ERASER ? "eraser" : ch;
    palette.querySelectorAll(".brush-btn").forEach((b) => {
      const on = b.dataset.brush === ch;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  palette.innerHTML = BRUSHES.concat([ERASER]).map((b) =>
    '<button type="button" class="brush-btn" data-brush="' + (b === '"' ? "&quot;" : b) + '" aria-label="' + (b === ERASER ? "Eraser" : "Brush " + b) + '">' + (b === ERASER ? "⌫" : b) + "</button>").join("");
  palette.addEventListener("click", (e) => { const b = e.target.closest(".brush-btn"); if (b) { custom.value = ""; setBrush(b.dataset.brush); } });
  custom.addEventListener("input", () => { const ch = Array.from(custom.value.trim())[0]; if (ch) setBrush(ch); });

  mirror.addEventListener("change", () => gridEl.classList.toggle("is-mirrored", mirror.checked));
  document.querySelectorAll("#canvasSizeGroup .pill-btn").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll("#canvasSizeGroup .pill-btn").forEach((o) => o.classList.toggle("is-active", o === b));
    const [nc, nr] = b.dataset.size.split("x").map(Number);
    resize(nc, nr);
  }));
  function resize(nc, nr) {
    snapshot();
    const old = data, oc = cols, or = rows;
    cols = nc; rows = nr; data = blankData();
    const offC = Math.floor((nc - oc) / 2), offR = Math.floor((nr - or) / 2);
    for (let r = 0; r < or; r++) for (let c = 0; c < oc; c++) {
      const R = r + offR, C = c + offC;
      if (R >= 0 && R < nr && C >= 0 && C < nc) data[R][C] = old[r][c];
    }
    undo = []; build();
  }
  function toText() {
    const lines = data.map((row) => row.join("").replace(/\s+$/, ""));
    while (lines.length && !lines[0]) lines.shift();
    while (lines.length && !lines[lines.length - 1]) lines.pop();
    const ind = Math.min(...lines.filter(Boolean).map((l) => l.match(/^ */)[0].length));
    return lines.map((l) => l.slice(isFinite(ind) ? ind : 0)).join("\n");
  }
  function loadText(text) {
    snapshot();
    const lines = text.split("\n").map((l) => Array.from(l));
    const needC = Math.max(...lines.map((l) => l.length)), needR = lines.length;
    if (needC > cols || needR > rows) {
      const sizes = [[32, 16], [40, 18], [52, 22]];
      const fit = sizes.find(([c, r]) => c >= needC && r >= needR) || sizes[2];
      cols = fit[0]; rows = fit[1];
      document.querySelectorAll("#canvasSizeGroup .pill-btn").forEach((o) => o.classList.toggle("is-active", o.dataset.size === cols + "x" + rows));
    }
    data = blankData();
    const offR = Math.max(0, Math.floor((rows - needR) / 2)), offC = Math.max(0, Math.floor((cols - needC) / 2));
    lines.forEach((l, r) => l.forEach((ch, c) => { if (r + offR < rows && c + offC < cols) data[r + offR][c + offC] = ch; }));
    build();
  }
  const HEART = [
    "   .:::.   .:::.   ",
    "  :::::::.:::::::  ",
    "  :::::::::::::::  ",
    "  ':::::::::::::'  ",
    "    ':::::::::'    ",
    "      ':::::'      ",
    "        ':'        "
  ].join("\n");
  $("#undoDrawBtn").addEventListener("click", () => {
    const prev = undo.pop();
    if (!prev) { U.toast("Nothing to undo"); return; }
    if (prev.length !== rows || prev[0].length !== cols) { rows = prev.length; cols = prev[0].length; data = prev; build(); }
    else { data = prev; paintAll(); }
  });
  $("#stampHeartBtn").addEventListener("click", () => { loadText(HEART.replace(/:/g, brush === ERASER || brush === " " ? "#" : brush === "." ? ":" : brush).replace(/'/g, "'")); U.toast("Starter heart stamped ♡"); });
  $("#clearDrawBtn").addEventListener("click", () => { snapshot(); data = blankData(); paintAll(); });
  $("#copyDrawBtn").addEventListener("click", (e) => {
    const t = toText();
    if (!t.trim()) { U.toast("Canvas is empty — draw something first"); return; }
    U.copyText(t, e.currentTarget);
  });
  $("#downloadDrawTxtBtn").addEventListener("click", () => U.downloadText(toText() || " ", "sketch.txt"));

  window.__asciiDraw = { loadText, toText, setBrush, get data() { return data; } };
  if (window.innerWidth < 600) {
    cols = 32; rows = 16;
    document.querySelectorAll("#canvasSizeGroup .pill-btn").forEach((o) => o.classList.toggle("is-active", o.dataset.size === "32x16"));
  }
  data = blankData();
  setBrush("#");
  build();
})();
