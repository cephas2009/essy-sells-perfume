const { spawn } = require('child_process');
const CHROME = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
const PORT = 9228;
const BASE = 'http://localhost:8123';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function fetchJSON(url) { return (await fetch(url)).json(); }
async function launch() {
  const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + PORT, '--user-data-dir=C:/Temp/chrome-callout-profile', 'about:blank'], { stdio: 'ignore' });
  for (let i = 0; i < 40; i++) { try { await fetchJSON('http://127.0.0.1:' + PORT + '/json/version'); return proc; } catch (e) { await sleep(250); } }
  throw new Error('no debugger');
}
class CDP {
  constructor(url) { this.ws = new WebSocket(url); this.id = 0; this.p = new Map(); this.errs = []; }
  async open() { await new Promise((r, j) => { this.ws.onopen = r; this.ws.onerror = j; });
    this.ws.onmessage = (ev) => { const m = JSON.parse(ev.data);
      if (m.id && this.p.has(m.id)) { this.p.get(m.id)(m); this.p.delete(m.id); }
      else if (m.method === 'Runtime.exceptionThrown') { this.errs.push('EXC: ' + JSON.stringify(m.params.exceptionDetails).slice(0, 200)); } };
  }
  send(method, params = {}) { const id = ++this.id; return new Promise((r) => { this.p.set(id, r); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async ev(expression) { const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) { this.errs.push('EVAL: ' + expression.slice(0, 120)); return undefined; }
    return r.result && r.result.result ? r.result.result.value : undefined; }
}
(async () => {
  await launch();
  const targets = await fetchJSON('http://127.0.0.1:' + PORT + '/json');
  const cdp = new CDP(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url: BASE + '/index.html' });
  await cdp.ev('localStorage.removeItem("essy_intro_seen")');
  await cdp.send('Page.navigate', { url: BASE + '/index.html' });
  for (let i = 0; i < 60; i++) { if (await cdp.ev('document.getElementById("essy-intro")?.classList.contains("essy-intro-open")')) break; await sleep(250); }
  await cdp.waitFor && null;
  for (let i = 0; i < 120; i++) { if (await cdp.ev('window.EssyIntro && window.EssyIntro.isReady && window.EssyIntro.isReady()')) break; await sleep(250); }
  await sleep(800);

  for (const frac of [0.1, 0.2, 0.4, 0.6, 0.7, 0.9, 1.0]) {
    await cdp.ev('(() => { const s = document.getElementById("essy-intro-scroll"); s.scrollTop = (s.scrollHeight - s.clientHeight) * ' + frac + '; s.dispatchEvent(new Event("scroll")); })()');
    await sleep(750);
    const state2 = await cdp.ev('(() => { const s = document.getElementById("essy-intro-scroll"); const max = s.scrollHeight - s.clientHeight; const op = (sel) => { const el = document.querySelector(sel); return el ? parseFloat(getComputedStyle(el).opacity) : -1; }; return { p: max > 0 ? s.scrollTop / max : 0,      rail: document.getElementById("essy-intro-rail-fill").style.top, o1: op(".essy-overlay-1 .essy-overlay-inner"), o2: op(".essy-overlay-2 .essy-overlay-inner"), o3: op(".essy-overlay-3 .essy-overlay-inner"), cta: op(".essy-cta-inner"), ctaLive: document.getElementById("essy-intro-cta").classList.contains("essy-cta-live"), frames: window.EssyIntro.framesLoaded(), canvasW: document.getElementById("essy-intro-canvas").width }; })()');
    console.log('frac=' + frac + ' →', JSON.stringify(state2));
  }
  console.log('errors:', cdp.errs.length ? cdp.errs.slice(0, 4) : 'none');
  try { await cdp.send('Browser.close'); } catch (e) {}
  process.exit(0);
})().catch((e) => { console.error('FATAL', e); process.exit(2); });
