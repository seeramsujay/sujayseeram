# Portfolio v3: "Technical Pastel & WebGL Fluid Dynamics"

> **Design Archetype:** Technical Pastel / GPU Navier-Stokes Fluid Dynamics / Punchy Floating Glass Modal  
> **Status:** Iteration 3.0 (Active Cutting-Edge Experiment)  
> **Stack:** Vite, Three.js (WebGL), Custom GLSL Fluid Physics, GSAP, Lenis, pnpm  
> **Runtime / Build:** High-performance ESM modular build pipeline (zero Markdown parser bloat)  

---

## 1. Architectural Overview & Key Evolutions over v2

Portfolio v3 takes the foundational strengths of v2 (the Scandinavian daylight aesthetic and Three.js narrative camera choreography) and introduces two major evolutionary breakthroughs:

1. **Interactive WebGL Navier-Stokes Fluid Dynamics (`src/effects/fluid.js`):**
   - When any project card is clicked, the modal backdrop comes alive with a real-time GPU fluid physics simulation.
   - Pointer motion injects velocity impulses and colorful dye splats with curl-based vorticity confinement and pressure Poisson solving.
2. **Lean, Punchy Floating Glass Modal (Eliminating `marked`):**
   - Replaces the heavy text-dense slide-over drawer with a modern floating glass card modal.
   - All 76 project descriptions were rewritten into concise, high-impact engineering summaries.
   - Completely removes the `marked.js` dependency, slashing bundle size and eliminating DOM string-parsing overhead.

---

## 2. Core Modules & Engine Breakdown

### A. GPU Navier-Stokes Fluid Simulation Engine (`src/effects/fluid.js`)
- **Physics Equations:** Implements discrete advection, divergence computation, Jacobi iteration for pressure solving, and vorticity confinement entirely on the GPU via custom GLSL shaders.
- **Dynamic Downscaling:** Adjusts dye and simulation resolution automatically based on device viewport (`64` sim / `512` dye on mobile, `128` sim / `1024` dye on desktop) for 60/120 FPS performance.
- **Organic Aesthetics:** Soft gaussian splat radius, dye dissipation, velocity damping, and subtle lighting shading.

### B. Floating Glass Project Card Modal (`src/components/modal.js`)
- **Structure:** Translucent frosted card floating directly above the fluid canvas.
- **Telemetry Specs Grid:** Dynamically generates structured hardware/software metrics (`Latency`, `Throughput`, `Power`, `Accuracy`).
- **Interactive Controls:** Quick summary copying, repository links, keyboard `Escape` dismiss, and smooth GSAP entrance/exit animations.

### C. Three.js Story-Driven WebGL Narrative Scene (`src/three/narrativeScene.js`)
- **Five Story Stages:** Retains the ESP32 silicon board, FFT acoustic wave, distributed multi-agent graph, core processor, and ambient particle field from v2.
- **Camera Synchronization:** Tied directly to Lenis inertia scroll and GSAP ScrollTrigger.

### D. 76-Project Showcase & Instant Filter (`src/components/showcase.js`)
- **Instant Search & Category Switcher:** Filter by `Embedded`, `AI Infrastructure`, `Autonomous Systems`, or `Sovereign Tools`.

### E. Sovereign Web Audio Engine (`src/audio/synth.js`)
- Real-time procedural audio synthesis for clicks, stage transitions, and fluid modal activations.

---

## 3. Tech Stack & Dependencies

```json
{
  "dependencies": {
    "gsap": "^3.15.0",
    "lenis": "^1.3.26",
    "lucide": "^0.344.0",
    "three": "^0.162.0"
  },
  "devDependencies": {
    "vite": "^5.1.4"
  }
}
```

> **Zero `marked.js` Dependency:** v3 saves memory and bundle size by utilizing structured JSON properties instead of heavy Markdown string parsing.  
> **Package Manager Rule:** Always use `pnpm` exclusively. Never run `npm install`.

---

## 4. File Layout

```
v3/
├── index.html                   # Vite entrypoint with fluid canvas & floating glass modal DOM
├── vite.config.js               # Optimized Vite bundler configuration (minimal chunk footprint)
├── package.json                 # v3 dependencies and build scripts
├── pnpm-lock.yaml               # Deterministic pnpm dependency lockfile
├── pnpm-workspace.yaml          # pnpm workspace isolation configuration
├── public/                      # Static textures and workbench imagery
└── src/
    ├── main.js                  # Application bootstrapper and animation coordinator
    ├── audio/
    │   └── synth.js             # Procedural Web Audio synthesizer
    ├── components/
    │   ├── modal.js             # Floating glass card modal controller
    │   └── showcase.js          # 76-project archive grid and instant filter
    ├── effects/
    │   └── fluid.js             # GPU Navier-Stokes WebGL fluid simulation engine
    ├── data/
    │   ├── projects_db.json     # Streamlined 76-project database with punchy summaries
    │   └── projectsData.js      # Data normalizer and sorting bridge
    ├── styles/
    │   ├── tokens.css           # Pastel design system variables and fluid modal styling
    │   └── main.css             # Layout styling, fluid canvas rules, and card CSS
    └── three/
        └── narrativeScene.js    # Three.js 3D procedural story scene
```

---

## 5. Running & Building with pnpm

```bash
# Enter version directory
cd v3

# Install dependencies via pnpm (hardlinks from global store, saving disk space)
pnpm install

# Start local dev server
pnpm dev

# Build production bundle
pnpm build
```

---

## 6. Performance Profile & Architectural Lessons

- **Strengths:**
  - Exceptional tactile delight: moving the cursor inside the project modal produces a captivating, fluid organic light show.
  - Leaner bundle: removing `marked` shaved significant client-side JavaScript.
  - High reading velocity: punchy, 1-2 sentence engineering summaries allow visitors to scan projects in seconds instead of reading long walls of text.
- **Trade-offs / Bottlenecks:**
  - Running both Three.js narrative scene and WebGL fluid simulation requires disciplined GPU context management to ensure mobile devices maintain 60 FPS without overheating.
