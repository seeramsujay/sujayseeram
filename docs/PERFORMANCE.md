# Performance: what was fixed and the rules going forward

Measured with `node tools/perf-check.mjs` (headless Chromium, desktop at 4× CPU
throttle, phone 390×844 at 6× CPU throttle). Headless Chrome under-reports GPU
cost, so the trustworthy signals are **forced layouts**, **style/script time** and
**long tasks**, not the FPS figure.

## Before → after (current site)

| Metric | Desktop before | Desktop after | Phone before | Phone after |
| :--- | ---: | ---: | ---: | ---: |
| HTML transferred | 567 KB | 162 KB | 567 KB | 162 KB |
| DOM nodes | 2,881 | 1,999 | 2,881 | 1,999 |
| Largest Contentful Paint | 2,664 ms | ~500 ms | 588 ms | ~450 ms |
| Long tasks at load | 1 (62 ms) | 0 | 2 (165 ms) | 0 |
| Forced layouts while scrolling | 1,577 | ~10 | 1,503 | ~15 |
| Script time | 591 ms | ~130 ms | 520 ms | ~110 ms |
| Style recalculation time | 509 ms | ~200 ms | 664 ms | ~200 ms |

## What was causing the lag

1. **Scroll loop doing layout every frame.** The timeline read `getBoundingClientRect()`
   after writing styles (layout thrash), and a lerp kept the loop running long after the
   finger stopped. Now: one rAF per scroll event, bound to `scrollY`, geometry cached and
   measured in one batch, styles written only when values change.
2. **Phone URL bar = resize storm.** Every show/hide of the mobile URL bar fired `resize`,
   which re-measured all ~45 cards (2 forced layouts each) and rebuilt an observer.
   Now only a *width* change triggers re-measurement.
3. **~140 `backdrop-filter: blur()` layers.** Every card re-blurred the background on
   every frame. Cards sat on a flat background, so the blur was invisible. Removed from cards
   and from 98%-opaque overlays; kept only where content scrolls beneath (desktop nav,
   overlay header).
4. **256 KB of README markdown parsed on every load.** Moved to `data/readmes.json`, fetched
   on first project open (and prefetched when idle). `marked` is loaded the same way, pinned.
5. **Reading Room duplicated.** The whole posts section existed twice (in-page and overlay),
   with duplicate IDs. The in-page copy is now a header that opens the overlay.
6. **Hero gradient animated forever.** `background-position` animation on clipped text
   repainted every frame, even when idle. Now static.
7. **Full Material Symbols variable font.** Now subset to the 19 icons used.
8. `transition: all`, `left`-based shimmer, `width`/`height` progress bars → explicit
   properties and transforms.

## Mobile fixes

- Removed `scroll-snap` (it fought the user's scroll).
- Cards get a proper 20 px gutter; descriptions are visible on touch screens (they were hover-only).
- The filter bar actually sticks under the nav (`overflow-x: hidden` on html/body broke sticky → now `clip`).
- Removed global `word-break: anywhere !important`.
- Light-theme mobile rules targeted `[data-theme="light"]`, which the site never sets; now `.light-theme`.
- About section had zero side padding on phones.
- `prefers-reduced-motion` is respected.

## Budgets for every version (v1 now, v2/v3 later)

A change, or a version promotion, should not ship if the **phone** profile breaks these:

| Budget | Limit |
| :--- | :--- |
| HTML + CSS + JS needed for first paint | ≤ 250 KB uncompressed |
| Long tasks during load | 0 over 100 ms |
| Forced layouts during a full scroll | ≤ 30 |
| Janky frames (> 33 ms) during scroll | ≤ 1 % |
| Horizontal overflow offenders | 0 |
| LCP (6× throttle, local) | ≤ 1.5 s |

## Rules of thumb

- Animate only `transform` and `opacity`. Never `width`, `height`, `top`, `left`, `background-position`.
- No `backdrop-filter` on repeated elements. At most one or two on screen, never on things that scroll.
- Never read layout (`offsetTop`, `getBoundingClientRect`) inside a scroll handler. Measure once, cache it, re-measure on width change.
- No infinite CSS animations outside an element the user is actively looking at.
- Anything not needed for first paint (READMEs, markdown parser, three.js scenes) loads on demand.
- v2/v3 specifics: start WebGL after first paint, pause the render loop when the tab is hidden or the canvas is off-screen, cap `devicePixelRatio` at 2 on phones, and offer a static fallback when `prefers-reduced-motion` is set.
