# Portfolio v1: "Cyberpunk Kinetic HUD & Odyssey Conveyor"

> **Design Archetype:** Cyberpunk Kinetic HUD / Neon Terminal / Industrial Monolith  
> **Status:** Legacy Archive (Version 1.0)  
> **Stack:** Vanilla HTML5, Custom CSS3, ES6+ JavaScript, `marked.js` CDN  
> **Runtime / Build:** Zero-build static web application  

---

## 1. Architectural Overview & Design Philosophy

Portfolio v1 is a monolithic, single-file architectural artifact designed around high-density engineering data, dark-mode cyberpunk glassmorphism, and physical hardware telemetry.

- **Color Palette & Visuals:** Deep space void (`#020204`), surface elevation (`#07080d`), and high-energy neon emissions:
  - **Electric Cyan (`#00f3ff`)** — Logic, conduits, and borders
  - **Luminous Mint (`#00ff87`)** — Active states, hardware badges, and telemetry
  - **Horizon Blue (`#3b82f6`)** — Secondary highlights and gradient anchors
- **Atmosphere:** Fixed noise texture, glowing gradients, JetBrains Mono and Space Grotesk typography, and translucent frosted glass cards.

---

## 2. Core Modules & Interaction Mechanics

### A. The 3D Odyssey Timeline Conveyor
- **Mechanism:** Vertical sticky conveyor where timeline cards pin at `25vh` from the viewport top.
- **Physics:** An inertia lerp loop (`lerp(lerpedScroll, sy, 0.085)`) smoothly computes translateZ, rotateX, and scale for approaching and departing cards.
- **Conduit Progress:** A vertical illuminated conduit line (`#timeline-progress-fill`) reflects real-time scroll completion through the historical archive.

### B. The Secret Vault Archive
- **Filter Matrix:** Category buttons (`Embedded`, `Agentic AI`, `Autonomous`, `Web3/Tools`) filter all public and confidential project cards.
- **Card Expansion:** Clicking any card opens the detailed project dossier overlay.

### C. Reading Room & Engineering Logs
- **Accordion Dossiers:** Foldable technical whitepapers and field reports (`#posts-wrapper`).
- **Clipboard Utility:** Direct code/text snippet copying with feedback indicator (`Copied ✓`).

### D. The Retro Cyber Terminal (Easter Egg)
- **Trigger:** Type the keyword `build` anywhere on the keyboard, or trigger via HUD button.
- **Telemetry Boot Sequence:** Simulates a hardware bootloader (`KAVACH_THREAT_INTERCEPTOR`, `SYNTHSCOPE_LOGIC_SIMULATOR`, `whoami`, `cat system/archive`).

### E. Mobile Responsive Engine
- **Touch Adaptations:** Touch drawers, sticky mobile filter tabs, scroll-snap centering, and touch swipe gestures to dismiss or cycle modal dossiers.

---

## 3. Tech Stack & Dependencies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Markup** | HTML5 Semantic DOM | Self-contained single-page structure |
| **Styling** | Vanilla CSS3 (`index.css`) | Custom properties, glassmorphism, CRT scanlines |
| **Typography** | Google Fonts | `JetBrains Mono`, `Space Grotesk`, `Plus Jakarta Sans` |
| **Icons** | Material Symbols Outlined | System HUD iconography |
| **Markdown** | `marked.min.js` (CDN) | Client-side parsing of inline project READMEs |
| **Package Tooling** | None (Zero Build) | Opens directly in any browser |

---

## 4. File Layout

```
v1/
├── index.html        # Monolithic entrypoint containing DOM, styles, inline database, and runtime JS
├── index.css         # Complete cyberpunk HUD stylesheet and animations
├── robots.txt        # Scraper and AI indexing restrictions
└── README.md         # Version documentation (this file)
```

---

## 5. Performance Profile & Architectural Lessons

- **Strengths:**
  - Instant deployment: zero build setup, zero bundler dependencies, pure web standards.
  - Complete data inclusion: holds the full database of 76+ projects and markdown documents inline.
  - Rich narrative atmosphere: unmistakable hacker/engineer identity.
- **Trade-offs / Bottlenecks:**
  - Massive HTML payload (~600 KB) due to embedded project readmes.
  - CPU-heavy DOM animations (e.g. earlier character-scramble timers and fullscreen SVG filters) caused layout thrashing before removal.
  - Monolithic architecture makes isolated testing or modular component reuse difficult.
