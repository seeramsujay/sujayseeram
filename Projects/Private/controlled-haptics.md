# controlled-haptics
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/controlled-haptics
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# Controlled Haptics: High-Fidelity Haptic Synthesis & Passivity Control

Research, simulation, and embedded implementation repository for high-fidelity direct-drive kinesthetic haptic rendering, discrete Zero-Order Hold (ZOH) energy leakage analysis, and Time-Domain Passivity Control (TDPA).

---

## 🚀 Quick Navigation for New Team Members

> [!IMPORTANT]
> **Taking over or joining the project?**
> Start with the **[Developer Handover Guide (`docs/HANDOVER.md`)](docs/HANDOVER.md)** for a complete architectural walkthrough, execution commands, and immediate action items.
>
> 📄 **Academic Report**: A publication-format PDF report is available at **[`docs/report/haptic_passivity_report.pdf`](docs/report/haptic_passivity_report.pdf)**.

---

## ⚡ Fast Start: Unified Test Harness

Run all tests and verification suites across **C++17**, **Python**, and **MATLAB / GNU Octave** with a single command:

```bash
# Run all unit tests across C++, Python, and Octave/MATLAB:
make test

# Run the primary MATLAB/Octave simulation harness:
make test-matlab

# Run the Colgate-Schenkel frequency-domain passivity boundary analysis:
make test-bode

# Recompile the LaTeX handover report PDF:
make report
```

---

## 📁 Repository Structure

```
controlled-haptics/
├── Makefile                        # Unified build, test, and report automation
├── platformio.ini                  # Embedded configuration for RP2040 Pico, ESP32, Teensy 4.1
├── pyproject.toml                  # Python package configuration (uv / pytest)
│
├── simulation/                     # Physics simulation and dynamic modeling
│   ├── models/                     # MATLAB (classdef) & Python RK4 plant models & TDPA
│   │   ├── CoupledPlant.m          # Continuous plant + human arm dynamics (RK4)
│   │   ├── VirtualWall.m           # Discrete unilateral contact wall
│   │   └── PassivityController.m   # Time-Domain Passivity Approach (PO + PC)
│   └── scripts/                    # Simulation runners and frequency analysis
│       ├── main.m                  # Academic MATLAB entry point (Octave compatible)
│       └── bode_delay_analysis.m   # Colgate-Schenkel passivity proof
│
├── firmware/                       # Embedded C++17 microcontroller firmware
│   ├── include/
│   │   ├── control/tdpa.hpp        # Zero-allocation real-time C++17 TDPA class
│   │   └── drivers/encoder_pio.hpp # RP2040 PIO optical encoder C++ interface
│   └── src/
│       ├── drivers/quadrature_encoder.pio # Hardware PIO assembly decoder (0% CPU)
│       └── main.cpp                # Dual-core multi-rate firmware (Core 0: 1kHz, Core 1: 10kHz)
│
├── tests/                          # Automated unit tests
│   └── unit/
│       ├── test_tdpa.cpp           # C++17 standalone unit tests
│       ├── test_tdpa.py            # Python pytest unit tests
│       └── test_coupled_plant.py   # Python pytest plant dynamics tests
│
├── docs/                           # Documentation & Academic Reports
│   ├── HANDOVER.md                 # 📖 Primary Developer Handover & Architecture Guide
│   ├── roadmap.md                  # Project milestones and roadmap
│   ├── report/                     # LaTeX report source, figures, and compiled PDF
│   │   ├── haptic_passivity_report.pdf # 3-page academic report for team/instructors
│   │   └── haptic_passivity_report.tex # LaTeX source
│   ├── blueprint/                  # High-fidelity synthesis technical blueprint
│   └── research/                   # Academic papers and literature review
│
└── data/telemetry/                 # Exported simulation figures (.png) and datasets (.mat)
```

---

## 📖 Key Documentation Links

- **[Developer Handover Guide](docs/HANDOVER.md)**: Full architecture guide, math cheat sheet, and onboarding instructions.
- **[Academic Report (PDF)](docs/report/haptic_passivity_report.pdf)**: Complete 3-page summary report with formulas, tables, and benchmark plots.
- **[Project Roadmap](docs/roadmap.md)**: Multi-phase timeline and milestones.
- **[System Blueprint](docs/blueprint/High-Fidelity%20Haptic%20Synthesis%20Blueprint.md)**: Comprehensive DSP blueprint.
