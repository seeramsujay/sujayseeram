# Portfolio v2: "Technical Pastel Extreme Economic Engineering"

> **Design Archetype:** Scandinavian Daylight Studio / Technical Pastel / Tangible Physical Hardware  
> **Status:** Iteration 2.0  
> **Stack:** Vite, Three.js (WebGL), GSAP + ScrollTrigger, Lenis, Marked.js, pnpm  
> **Runtime / Build:** Modern ESM modular build pipeline  

---

## 1. Architectural Overview & Design Philosophy

Portfolio v2 represents a radical departure from dark-mode hacker tropes, introducing **"Technical Pastel Extreme Economic Engineering"**. Inspired by physical engineering workbenches, Scandinavian industrial design, and daylight studios:

- **Pastel Stage Transition Palette:**
  - **Stage 1 (Hero):** Clean Daylight Studio (`#fafafa`)
  - **Stage 2 (Physical Layer):** Soft Pastel Mint (`#e6f4ea`)
  - **Stage 3 (Logic Layer):** Soft Slate Blue (`#e8f0fe`)
  - **Stage 4 (Optimization Layer):** Soft Lavender (`#f3e8fd`)
  - **Stage 5 (Human Element):** Soft Butter Amber (`#fef7e0`)
- **Tangible Physical Materials:** Matte clay, brushed aluminum, satin silicon, and crisp neutral typography (`Inter` + `JetBrains Mono`).

---

## 2. Core Modules & Engine Breakdown

### A. Three.js Story-Driven WebGL Narrative Scene (`src/three/narrativeScene.js`)
- **Stage 1 — Oversized ESP32 Microcontroller:** Procedural circuit board with dual-core silicon, USB-C port, tactile reset buttons, and pins.
- **Stage 2 — FFT Acoustic Waveform:** Harmonic sine curve array visualizing real-time vibration analysis.
- **Stage 3 — Distributed Node Graph:** Multi-agent constellation interconnected by dynamic line segments.
- **Stage 4 — Minimalist Edge Core & Orbiting Rings:** Concentric gyroscope rings rotating around a floating processor.
- **Stage 5 — Volumetric Particle Field:** Ambient depth particles drifting as the user reaches the project archive.
- **Inertia Parallax:** Pointer tracking smoothly tilts the 3D scene with damping.

### B. Inertia Scroll Coordination (`src/main.js`)
- **Lenis Smooth Scroll:** Provides native momentum scrolling across desktop and mobile.
- **GSAP ScrollTrigger:** Links the scroll position directly to Three.js camera coordinates, lighting intensity, and background color interpolation.

### C. Sovereign Procedural Web Audio Engine (`src/audio/synth.js`)
- **Zero Asset Footprint:** Loads zero `.mp3` or `.wav` files. 100% generated in real-time via the Web Audio API.
- **Acoustic Feedback:** Sub-bass stage transitions, high-frequency tactile clicks, and filtered drawer sweeps. Includes persistent mute control saved to `localStorage`.

### D. Architectural Slide-Over Dossier Drawer (`src/components/modal.js`)
- **Full Markdown Parsing:** Uses `marked` to render in-depth project documentation.
- **Telemetry Badges:** Renders SIH / Hackathon / Award badges and one-click markdown clipboard copying.

### E. 76-Project Showcase & Instant Filter (`src/components/showcase.js`)
- **Real-Time Search & Category Filters:** Instantly filters hardware, AI, web3, and robotics projects with reactive card count feedback.

---

## 3. Tech Stack & Dependencies

```json
{
  "dependencies": {
    "gsap": "^3.15.0",
    "lenis": "^1.3.26",
    "lucide": "^0.344.0",
    "marked": "^18.0.14",
    "three": "^0.162.0"
  },
  "devDependencies": {
    "vite": "^5.1.4"
  }
}
```

> **Package Manager Rule:** Always use `pnpm` exclusively. Never run `npm install`.

---

## 4. File Layout

```
v2/
├── index.html                   # Vite HTML entrypoint with semantic sections & modal drawer
├── vite.config.js               # Bundler configuration with Three/Marked manual chunking
├── package.json                 # v2 dependencies and npm scripts
├── pnpm-lock.yaml               # Deterministic pnpm dependency lockfile
├── pnpm-workspace.yaml          # pnpm workspace isolation configuration
├── public/                      # Static assets (textures, workbench photography)
└── src/
    ├── main.js                  # Application bootstrapper and scroll orchestrator
    ├── audio/
    │   └── synth.js             # Procedural Web Audio synthesizer
    ├── components/
    │   ├── modal.js             # Slide-over Markdown drawer controller
    │   └── showcase.js          # 76-project archive grid and instant filter
    ├── data/
    │   ├── projects_db.json     # Comprehensive project records database
    │   └── projectsData.js      # Data normalizer and sorting bridge
    ├── styles/
    │   ├── tokens.css           # Pastel design system variables and typography
    │   └── main.css             # Layout styling, studio stages, and drawer CSS
    └── three/
        └── narrativeScene.js    # Three.js 3D procedural story scene
```

---

## 5. Running & Building with pnpm

```bash
# Enter version directory
cd v2

# Install dependencies via pnpm (shared global store, minimal disk usage)
pnpm install

# Start local dev server
pnpm dev

# Build production bundle
pnpm build
```

---

## 6. Performance Profile & Architectural Lessons

- **Strengths:**
  - High artistic distinction: fresh, professional light-mode aesthetic that stands out from typical portfolios.
  - Tangible 3D storytelling: hardware-inspired procedural models directly convey embedded systems expertise.
  - Modular clean code: separation of concerns between Three.js, Audio, Components, and Data.
- **Trade-offs / Bottlenecks:**
  - Bundle weight: includes `marked.js` bundle chunk purely for rendering modal text.
  - Full-screen slide-over drawer can feel visually heavy compared to a nimble card modal.
