#!/usr/bin/env node
/**
 * perf-check.mjs — repeatable smoothness benchmark for the portfolio.
 *
 * Serves the site folder, loads index.html in headless Chromium under a
 * desktop profile and a throttled phone profile, scrolls the whole page,
 * and reports load cost + frame-time jank. Also flags elements that
 * overflow the phone viewport horizontally and saves phone screenshots.
 *
 * Usage:
 *   node tools/perf-check.mjs [--root <dir>] [--out <dir>] [--label <name>]
 *   (--root defaults to site/; point it at a v2/v3 build to compare)
 *
 * Needs playwright-core (`npm i -g playwright-core` or any npx cache) and a
 * Chromium from `npx playwright install chromium`. Set CHROME_PATH to
 * override the browser binary.
 */
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1]]);
    return acc;
  }, [])
);
const ROOT = resolve(args.root || join(REPO, 'site'));
const OUT = resolve(args.out || join(REPO, '.perf'));
const LABEL = args.label || 'run';

// ── locate playwright-core ────────────────────────────────────────────────
function loadPlaywright() {
  const require = createRequire(import.meta.url);
  try { return require('playwright-core'); } catch {}
  const npx = join(homedir(), '.npm', '_npx');
  if (existsSync(npx)) {
    for (const d of readdirSync(npx)) {
      const p = join(npx, d, 'node_modules', 'playwright-core');
      if (existsSync(p)) return require(p);
    }
  }
  throw new Error('playwright-core not found. Run: npm i -g playwright-core');
}

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cache = join(homedir(), 'Library', 'Caches', 'ms-playwright');
  const linux = join(homedir(), '.cache', 'ms-playwright');
  for (const base of [cache, linux]) {
    if (!existsSync(base)) continue;
    const dirs = readdirSync(base).filter(d => /^chromium-\d+$/.test(d)).sort().reverse();
    for (const d of dirs) {
      const cands = [
        join(base, d, 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
        join(base, d, 'chrome-mac', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'),
        join(base, d, 'chrome-linux', 'chrome'),
        join(base, d, 'chrome-linux64', 'chrome'),
      ];
      const hit = cands.find(existsSync);
      if (hit) return hit;
    }
  }
  return undefined; // let playwright try its default
}

// ── static server ─────────────────────────────────────────────────────────
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain' };

function serve() {
  return new Promise(res => {
    const srv = createServer(async (req, reply) => {
      const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = join(ROOT, url === '/' ? 'index.html' : url);
      if (!file.startsWith(ROOT)) { reply.writeHead(403).end(); return; }
      try {
        const body = await readFile(file);
        reply.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
        reply.end(body);
      } catch { reply.writeHead(404).end(); }
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

// ── profiles ──────────────────────────────────────────────────────────────
const PROFILES = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, dpr: 1, mobile: false, cpu: 4 },
  { name: 'phone', viewport: { width: 390, height: 844 }, dpr: 3, mobile: true, cpu: 6 },
];

async function measure(browser, base, prof) {
  const ctx = await browser.newContext({
    viewport: prof.viewport, deviceScaleFactor: prof.dpr,
    isMobile: prof.mobile, hasTouch: prof.mobile,
    colorScheme: 'dark', reducedMotion: 'no-preference',
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: prof.cpu });
  await cdp.send('Performance.enable');

  await page.addInitScript(() => {
    window.__lcp = 0; window.__longTasks = [];
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__longTasks.push(e.duration); })
      .observe({ type: 'longtask', buffered: true });
  });

  const t0 = Date.now();
  await page.goto(base + '/index.html', { waitUntil: 'load' });
  const loadWall = Date.now() - t0;
  await page.waitForTimeout(1500);

  const load = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      htmlKB: Math.round((nav.encodedBodySize || nav.transferSize) / 1024),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      lcp: Math.round(window.__lcp),
      longTasks: window.__longTasks.length,
      longTaskMs: Math.round(window.__longTasks.reduce((a, b) => a + b, 0)),
      domNodes: document.getElementsByTagName('*').length,
      resources: performance.getEntriesByType('resource').reduce((a, r) => a + (r.encodedBodySize || 0), 0) / 1024 | 0,
    };
  });

  // Overflow audit (phone only matters, but cheap everywhere)
  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const out = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (el.closest('.fullscreen-overlay, .terminal-overlay, #mobile-nav-drawer, .mobile-odyssey-tabs, .project-tags')) continue;
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > vw + 1 || r.left < -1)) {
        out.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''} [${Math.round(r.left)}→${Math.round(r.right)}]`);
      }
    }
    return { pageScrollWidth: document.documentElement.scrollWidth, viewport: vw, offenders: out.slice(0, 15), count: out.length };
  });

  // Scroll jank: drive scroll from rAF, record frame deltas.
  const scroll = await page.evaluate(async () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const step = Math.max(24, Math.round(innerHeight / 18));
    const deltas = []; let last = performance.now();
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 300));
    await new Promise(done => {
      const f = (t) => {
        deltas.push(t - last); last = t;
        if (window.scrollY >= max - 2 || deltas.length > 1500) return done();
        window.scrollBy(0, step);
        requestAnimationFrame(f);
      };
      requestAnimationFrame(t => { last = t; requestAnimationFrame(f); });
    });
    deltas.shift();
    const s = [...deltas].sort((a, b) => a - b);
    const pct = p => s[Math.min(s.length - 1, Math.floor(s.length * p))];
    return {
      frames: deltas.length,
      avgFps: Math.round(1000 / (deltas.reduce((a, b) => a + b, 0) / deltas.length)),
      p50: +pct(0.5).toFixed(1), p95: +pct(0.95).toFixed(1), worst: +s[s.length - 1].toFixed(1),
      jankyFrames: deltas.filter(d => d > 33.4).length,
      jankPct: +(100 * deltas.filter(d => d > 33.4).length / deltas.length).toFixed(1),
      pageHeight: document.documentElement.scrollHeight,
    };
  });

  const perf = await cdp.send('Performance.getMetrics');
  const m = Object.fromEntries(perf.metrics.map(x => [x.name, x.value]));
  const main = {
    layoutCount: m.LayoutCount, recalcStyleCount: m.RecalcStyleCount,
    layoutMs: Math.round(m.LayoutDuration * 1000), styleMs: Math.round(m.RecalcStyleDuration * 1000),
    scriptMs: Math.round(m.ScriptDuration * 1000), heapMB: +(m.JSHeapUsedSize / 1048576).toFixed(1),
  };

  if (prof.mobile) {
    await mkdir(OUT, { recursive: true });
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    for (const [i, frac] of [0, 0.15, 0.35, 0.6, 0.98].entries()) {
      await page.evaluate(f => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), frac);
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(OUT, `${LABEL}-phone-${i}.png`) });
    }
  }

  await ctx.close();
  return { profile: prof.name, cpuThrottle: prof.cpu + 'x', loadWall, load, scroll, main, overflow };
}

const pw = loadPlaywright();
const srv = await serve();
const base = `http://127.0.0.1:${srv.address().port}`;
const browser = await pw.chromium.launch({ executablePath: findChrome() });
const results = [];
try {
  for (const p of PROFILES) results.push(await measure(browser, base, p));
} finally {
  await browser.close(); srv.close();
}
await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, `${LABEL}.json`), JSON.stringify(results, null, 2));
for (const r of results) {
  console.log(`\n── ${r.profile} (CPU ${r.cpuThrottle}) ──`);
  console.log(`load    html ${r.load.htmlKB}KB · DOM ${r.load.domNodes} nodes · DCL ${r.load.domContentLoaded}ms · LCP ${r.load.lcp}ms · long tasks ${r.load.longTasks} (${r.load.longTaskMs}ms)`);
  console.log(`scroll  ${r.scroll.avgFps}fps avg · p50 ${r.scroll.p50}ms · p95 ${r.scroll.p95}ms · worst ${r.scroll.worst}ms · janky ${r.scroll.jankyFrames}/${r.scroll.frames} (${r.scroll.jankPct}%) · page ${r.scroll.pageHeight}px`);
  console.log(`thread  script ${r.main.scriptMs}ms · style ${r.main.styleMs}ms (${r.main.recalcStyleCount}x) · layout ${r.main.layoutMs}ms (${r.main.layoutCount}x) · heap ${r.main.heapMB}MB`);
  console.log(`overflow scrollWidth ${r.overflow.pageScrollWidth} vs ${r.overflow.viewport} · ${r.overflow.count} offenders${r.overflow.offenders.length ? '\n  ' + r.overflow.offenders.join('\n  ') : ''}`);
}
console.log(`\nSaved → ${OUT}`);
