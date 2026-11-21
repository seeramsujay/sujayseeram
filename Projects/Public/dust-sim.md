# dust-sim
- **Visibility**: Public
- **Repository URL**: https://github.com/seeramsujay/dust-sim
- **Status**: `Released (RecordingVersion)`
- **Latest Release Tag**: `RecordingVersion`

## 🚦 Releases & Release Notes
```text
RecordingVersion	Latest	v1.0.0	2026-01-02T06:31:23Z
```

---

## 📖 README Content

# 🌪️ DustVision AI: Tri-Modal Particulate Transport Simulator & Predictive Mitigation Engine

> Local-first 3D physical particle simulation and proactive mist-suppression autopilot.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-5.x-blueviolet.svg?style=flat-square)](https://vitejs.dev/)
[![React Three Fiber](https://img.shields.io/badge/R3F-8.x-blue.svg?style=flat-square)](https://docs.pmnd.rs/react-three-fiber)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-cyan.svg?style=flat-square)](https://tailwindcss.com/)

DustVision AI is a high-fidelity, edge-native 3D physics simulator and active mitigation engine designed to minimize particulate pollution on industrial construction sites. By fusing real-time wind vectors, humidity data, and spatial particulate concentration metrics (PM2.5 and PM10), the simulator runs a proactive autopilot that pre-wets target sectors with high-pressure water mist sprinklers to intercept and suppress incoming dust plumes *before* air quality breaches critical thresholds.

---

## 🏗️ Physical & Analytical Architecture

DustVision AI couples a high-performance 3D WebGL particle simulator with a rule-based predictive actuation loop:

```mermaid
flowchart TD
    subgraph Env [Atmospheric Physics Engine]
        A["Wind Vectors (Angle, Speed)"] -->|Brownian Motion Drift| B["Particulate Transport Loop"]
        C["Humidity Levels"] -->|Evaporation/Settling Rate| B
    end
    
    subgraph Visualizer [3D WebGL Render Core]
        B -->|THREE.Points Particles| D["React Three Fiber Canvas"]
        E["Physical Sprinklers (SprayDroplets)"] -->|Fluid Dynamics Mist| D
        F["Deployed Sensor Node Pins"] -->|Visual Health Badges| D
    end
    
    subgraph Brain [System Autopilot Core]
        D -->|Real-Time Telemetry Poll| G["Predictive Actuation Controller"]
        G -->|30-Min Wind-Adjusted Forecast| H["Autopilot Sprinkler Dispatch"]
        H -->|Mitigation State (0% - 100%)| E
    end
```

---

## ⚡ Core Engineering Pillars

*   **Tri-Modal Physics Simulation:** Simulates floating dust particles using custom WebGL shaders (`THREE.Points`) drifted dynamically by real-time variable wind angles and speed vectors.
*   **Proactive Pre-Wetting Autopilot:** Rather than waiting for a full particulate breach, the system runs a predictive forecast. If PM levels are projected to spike, the autopilot triggers pre-wetting at 60% mist capacity to suppress rising dust in advance.
*   **High-Fidelity Fluid Mist Spray:** Renders realistic high-pressure water spray particles (`SprayDroplets`) that arc gracefully under simulated gravity and splash onto active construction sectors.
*   **Live Spatial Telemetry Dashboard:** A gorgeous, glassmorphic UI styled for modern control centers, featuring active node feeds, real-time variance charts, and automated historical CSV logging.

---

## 📊 Mitigation States & Actuation Loops

```text
  Air Quality Metrics (PM2.5 + PM10 + Wind Speed)
       │
       ├──► [PM2.5 <= 40]                                ==► NORMAL State (Standby mode)
       ├──► [PM2.5 > 40]   + [30m Forecast <= 75]        ==► MONITOR State (Elevated polling)
       ├──► [PM2.5 <= 90]  + [30m Forecast > 75]         ==► PREDICTIVE ACTUATION State (60% Mist output)
       └──► [PM2.5 > 90]                                 ==► FULL MITIGATION State (100% Mist output)
```

---

## ⚙️ Specifications & Local Constraints

*   **Low Computational Footprint:** Renders thousands of particles smoothly on low-power hardware (e.g., dual-core MacBook Air 2017 i5, 8GB RAM) with zero dedicated GPU requirements.
*   **Memory Efficiency:** Average memory usage is under **40MB RAM** during full particle spray operations.
*   **Zero-Lag WebGL Pipeline:** Combines canvas texture pooling and buffer attribute updates to maintain a solid **60 FPS** in-browser.

---

## 🚀 Quick Start (Under 60 Seconds)

### 1. Install Project Dependencies
Clone the repository and install all Node packages via npm:

```bash
git clone https://github.com/seeramsujay/dust-sim.git
cd dust-sim
npm install
```

### 2. Run Vite Development Server
Start the client application locally:

```bash
npm run dev
```

### 3. Deploy & Monitor
Open the browser to `http://localhost:5173/` (or your active Vite port) to operate the live dashboard:
*   **Deploy Sensor:** Dynamically provision and pin a new mock node anywhere on the spatial 3D grid.
*   **Interactive Orbit Controls:** Left-click and drag to rotate the factory floor, right-click to pan, and scroll to zoom.
*   **Export Analytics:** Instantly download the active run's sensor history as a CSV spreadsheet.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
