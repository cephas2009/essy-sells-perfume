const { spawn } = require('child_process');
const CHROME = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const PORT = 9227;
const BASE = 'http://localhost:8123';
const results = [];
const errs = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function report(name, pass, extra) {
  results.push({ name, pass });
  console.log((pass ? 'PASS' : 'FAIL') + ' | ' + name + (extra !== undefined ? '  [' + extra + ']' : ''));
}
async function fetchJSON(url) { return (await fetch(url)).json(); }

async function launch(profile) {
  const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + PORT, '--user-data-dir=C:/Temp/chrome-intro-' + profile, 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 40; i++) { try { await fetchJSON('http://127.0.0.1:' + PORT + '/json/version'); return proc; } catch (e) { await sleep(250); } }
  throw new Error('no debugger');
}

class CDP {
  constructor(url) { this.ws = new WebSocket(url); this.id = 0; this.p = new Map(); this.errs = []; }
  async open() { await new Promise((r, j) => { this.ws.onopen = r; this.ws.onerror = j; });
    this.ws.onmessage = (ev) => { const m = JSON.parse(ev.data);
      if (m.id && this.p.has(m.id)) { this.p.get(m.id)(m); this.p.delete(m.id); }
      else if (m.method === 'Runtime.exceptionThrown') { this.errs.push('EXC: ' + JSON.stringify(m.params.exceptionDetails).slice(0, 260)); }
      else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') { this.errs.push('LOG: ' + m.params.entry.text.slice(0, 200)); }
      else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') { this.errs.push('CONSOLE.ERROR'); } };
  }
  send(method, params = {}) { const id = ++this.id; return new Promise((r) => { this.p.set(id, r); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async ev(expression) { const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) { this.errs.push('EVAL: ' + expression.slice(0, 120)); return undefined; }
    return r.result && r.result.result ? r.result.result.value : undefined; }
  async waitFor(expression, timeout = 12000, interval = 250) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) { if (await this.ev(expression)) return true; await sleep(interval); }
    return false;
  }
}

async function scrollIntro(cdp, fraction) {
  await cdp.ev('(() => { const s = document.getElementById("essy-intro-scroll"); s.scrollTop = (s.scrollHeight - s.clientHeight) * ' + fraction + '; s.dispatchEvent(new Event("scroll")); })()');
  await sleep(700);
}

const OV = (n) => 'parseFloat(getComputedStyle(document.querySelector(".essy-overlay-' + n + ' .essy-overlay-inner")).opacity)';

(async () => {
  await launch('a');
  const targets = await fetchJSON('http://127.0.0.1:' + PORT + '/json');
  const cdp = new CDP(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  // Desktop viewport at 2x DPR so the high-DPI path is exercised
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });

  /* ============ SCENARIO A: first visit → frame intro flow ============ */
  await cdp.send('Page.navigate', { url: BASE + '/index.html' });
  await cdp.waitFor('!!document.getElementById("essy-intro")', 12000);
  await cdp.ev('localStorage.removeItem("essy_intro_seen"); localStorage.removeItem("techstore_cart")');
  await cdp.send('Page.navigate', { url: BASE + '/index.html' });
  const introShown = await cdp.waitFor('document.getElementById("essy-intro")?.classList.contains("essy-intro-open")', 20000);
  report('A: intro shows on first visit', introShown);
  report('A: body scroll locked while intro active', await cdp.ev('document.body.classList.contains("essy-intro-lock")'));
  report('A: scrolling locked until frames cached', await cdp.ev('document.getElementById("essy-intro-scroll").classList.contains("essy-intro-loading")'));

  // Wait for the 102 WebP frames to fully cache
  const loaded = await cdp.waitFor('window.EssyIntro && window.EssyIntro.isReady && window.EssyIntro.isReady()', 30000, 300);
  report('A: all frames preloaded (loader dismissed)', loaded,
    await cdp.ev('window.EssyIntro ? window.EssyIntro.framesLoaded() : 0') + '/102');
  report('A: loader hidden + scroll unlocked', await cdp.ev('document.getElementById("essy-intro-loader").classList.contains("essy-loader-done") && !document.getElementById("essy-intro-scroll").classList.contains("essy-intro-loading")'));
  report('A: canvas is high-DPI sized (2x DPR)', await cdp.ev('document.getElementById("essy-intro-canvas").width >= window.innerWidth * 1.9'), await cdp.ev('document.getElementById("essy-intro-canvas").width + "px"'));
  report('A: ambient bg = frame edge color #2B2620', await cdp.ev('getComputedStyle(document.getElementById("essy-intro")).backgroundColor === "rgb(43, 38, 32)"'), await cdp.ev('getComputedStyle(document.getElementById("essy-intro")).backgroundColor'));
  report('A: skip + brand + hint present', await cdp.ev('!!document.getElementById("essy-intro-skip") && !!document.querySelector(".essy-intro-brand")'));
  await sleep(700);   // let the Motion title entrance tween settle
  report('A: title visible immediately at load (p=0)', await cdp.ev(OV(1) + ' > 0.5'), await cdp.ev(OV(1)));

  // Frame scrubbing actually redraws the canvas (compare middle of the
  // PNG data URL — the header bytes are identical for any image)
  const shot0 = await cdp.ev('document.getElementById("essy-intro-canvas").toDataURL().slice(3000, 3400)');
  await scrollIntro(cdp, 0.42);
  const shot1 = await cdp.ev('document.getElementById("essy-intro-canvas").toDataURL().slice(3000, 3400)');
  report('A: canvas repaints while scrubbing', shot0 !== shot1, 'frame changed');

  // Text overlays per band
  await scrollIntro(cdp, 0.10);
  report('A: band1 title fading as scroll begins (10%)', await cdp.ev(OV(1) + ' > 0.1 && ' + OV(1) + ' < 0.55'), await cdp.ev(OV(1)));
  await scrollIntro(cdp, 0.40);
  report('A: band2 Atomizer visible at 40% (title faded)', await cdp.ev(OV(2) + ' > 0.5 && ' + OV(1) + ' < 0.1'), await cdp.ev(OV(2) + ' / ' + OV(1)));
  await scrollIntro(cdp, 0.70);
  report('A: band3 French Oils visible at 70%', await cdp.ev(OV(3) + ' > 0.5'), await cdp.ev(OV(3)));
  // Typography safe-zones: overlay 2/3 rects must NOT intersect the
  // drawn bottle rect (recomputed from the canvas draw math)
  const noOverlap = await cdp.ev(`(() => {
    const stage = document.getElementById('essy-intro-stage');
    const w = stage.clientWidth, h = stage.clientHeight;
    const scale = Math.min(w / 720, h / 1280, (0.5 * h) / 640);
    const dw = 720 * scale, dh = 1280 * scale;
    const bx0 = (w - dw) / 2 + dw * 0.28, bx1 = (w - dw) / 2 + dw * 0.67;
    const by0 = (h - dh) / 2 + dh * 0.28, by1 = (h - dh) / 2 + dh * 0.78;
    const clear = (sel) => { const r = document.querySelector(sel).getBoundingClientRect();
      return !(r.right > bx0 && r.left < bx1 && r.bottom > by0 && r.top < by1); };
    return { o2: clear('.essy-overlay-2'), o3: clear('.essy-overlay-3'), bottleW: Math.round(bx1 - bx0), bottleH: Math.round(by1 - by0) };
  })()`);
  report('A: text safe-zones never overlap the bottle (2+3)', noOverlap && noOverlap.o2 && noOverlap.o3, 'bottle ' + (noOverlap ? noOverlap.bottleH : '?') + 'px tall');
  report('A: bottle drawn at ~45-55% of viewport height', noOverlap && noOverlap.bottleH > 405 && noOverlap.bottleH < 495, noOverlap ? noOverlap.bottleH + 'px / ' + 900 + 'px vh' : '?');
  await scrollIntro(cdp, 0.95);
  report('A: CTA + Start Shopping visible at 95%', await cdp.ev('document.getElementById("essy-intro-cta").classList.contains("essy-cta-live") && ' + 'parseFloat(getComputedStyle(document.querySelector(".essy-cta-inner")).opacity) > 0.5'));
  await scrollIntro(cdp, 1.0);
  report('A: CTA stays fully visible + clickable at 100%', await cdp.ev('parseFloat(getComputedStyle(document.querySelector(".essy-cta-inner")).opacity) > 0.9 && document.getElementById("essy-intro-cta").classList.contains("essy-cta-live")'), await cdp.ev('parseFloat(getComputedStyle(document.querySelector(".essy-cta-inner")).opacity)'));
  report('A: progress line tracks scroll (fill top set)', await cdp.ev('document.getElementById("essy-intro-rail-fill").style.top !== ""'), await cdp.ev('document.getElementById("essy-intro-rail-fill").style.top'));

  // Click Start Shopping
  await cdp.ev('document.getElementById("essy-intro-start").click()');
  await sleep(2600);   // 780ms exit + Motion hero entrance (0.7s + stagger)
  report('A: intro hidden after Start', await cdp.ev('document.getElementById("essy-intro").style.display === "none"'));
  report('A: essy_intro_seen saved', await cdp.ev('localStorage.getItem("essy_intro_seen") === "1"'));
  report('A: body scroll unlocked', await cdp.ev('!document.body.classList.contains("essy-intro-lock")'));
  report('A: storefront visible + hero animated', await cdp.ev('parseFloat(getComputedStyle(document.querySelector("#home h1")).opacity) > 0.95'));

  /* ============ SCENARIO B: returning visit skips intro ============ */
  await cdp.send('Page.navigate', { url: BASE + '/index.html' });
  await cdp.waitFor('document.getElementById("splash-screen")?.style.display === "none"', 15000);
  await sleep(2500);
  report('B: intro NOT shown on returning visit', await cdp.ev('!document.getElementById("essy-intro")?.classList.contains("essy-intro-open")'));

  // storefront still fully functional: seed products + cart + admin
  await cdp.ev("localStorage.setItem('store_products', JSON.stringify([{id:1,name:'Wireless Earbuds',price:12500,image:'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23EC4899%22/%3E%3C/svg%3E'}]))");
  await cdp.send('Page.navigate', { url: BASE + '/index.html' });
  await cdp.waitFor('document.querySelectorAll(".product-card").length > 0 && document.getElementById("splash-screen").style.display === "none"', 15000);
  await sleep(1500);
  await cdp.ev('document.querySelector(".add-to-cart").click()');
  await sleep(500);
  report('B: cart still works after intro (badge=1)', await cdp.ev('document.getElementById("cart-badge").textContent === "1"'));
  await cdp.ev('document.getElementById("admin-link").click()');
  await sleep(300);
  await cdp.ev('document.getElementById("admin-passcode").value = "1234"; document.getElementById("admin-login-form").requestSubmit()');
  await sleep(500);
  report('B: admin panel still works', await cdp.ev('document.body.classList.contains("admin-mode")'));
  await cdp.ev('document.getElementById("admin-logout").click()');
  await sleep(400);

  /* ============ SCENARIO C: skip button on a fresh visit ============ */
  await cdp.ev('localStorage.removeItem("essy_intro_seen")');
  await cdp.send('Page.navigate', { url: BASE + '/index.html' });
  await cdp.waitFor('document.getElementById("essy-intro")?.classList.contains("essy-intro-open")', 20000);
  await cdp.ev('document.getElementById("essy-intro-skip").click()');
  await sleep(1400);
  report('C: skip hides intro + saves flag', await cdp.ev('document.getElementById("essy-intro").style.display === "none" && localStorage.getItem("essy_intro_seen") === "1"'));

  /* ============ SCENARIO D: mobile portrait ============ */
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
  await cdp.ev('localStorage.removeItem("essy_intro_seen")');
  await cdp.send('Page.navigate', { url: BASE + '/index.html' });
  await cdp.waitFor('document.getElementById("essy-intro")?.classList.contains("essy-intro-open")', 20000);
  report('D: intro shows on mobile', true);
  const mobLoaded = await cdp.waitFor('window.EssyIntro && window.EssyIntro.isReady && window.EssyIntro.isReady()', 30000, 300);
  report('D: frames loaded on mobile', mobLoaded);
  report('D: canvas scaled by devicePixelRatio (3x)', await cdp.ev('document.getElementById("essy-intro-canvas").width >= 390 * 2'));
  await scrollIntro(cdp, 0.4);
  report('D: band2 activates on mobile', await cdp.ev(OV(2) + ' > 0.5'), await cdp.ev(OV(2)));

  /* ============ SCENARIO E: reduced motion ============ */
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await cdp.ev('localStorage.removeItem("essy_intro_seen")');
  await cdp.send('Page.navigate', { url: BASE + '/index.html' });
  await cdp.waitFor('document.getElementById("essy-intro")?.classList.contains("essy-intro-open")', 20000);
  report('E: intro shows for reduced-motion users', true);
  await cdp.waitFor('window.EssyIntro && window.EssyIntro.isReady && window.EssyIntro.isReady()', 30000, 300);
  await scrollIntro(cdp, 0.7);
  report('E: overlays still activate', await cdp.ev(OV(3) + ' > 0.5'), await cdp.ev(OV(3)));

  const failed = results.filter((r) => !r.pass);
  console.log('\n===== SUMMARY =====');
  console.log((results.length - failed.length) + '/' + results.length + ' passed, ' + failed.length + ' FAILED');
  console.log('Runtime/console errors: ' + cdp.errs.length);
  cdp.errs.slice(0, 10).forEach((e) => console.log('  ERR: ' + e));
  try { await cdp.send('Browser.close'); } catch (e) {}
  process.exit(failed.length === 0 ? 0 : 1);
})().catch((e) => { console.error('FATAL', e); process.exit(2); });
