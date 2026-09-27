# spice-ai
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/spice-ai
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# ⚡ AI-to-SPICE Compiler & HRM Governor

**The professional bridge between Large Language Models, Electronic Design Automation, and Closed-Loop Verification.**

AI-to-SPICE is a local-first EDA intelligence suite that translates natural-language circuit requirements into production-ready simulation files and executes **dual-loop closed verification** using the **HRM (Hierarchical Reasoning & Reflection Mirror)** architecture.

Whether you need a passive filter, a high-gain BJT stage, or an active power regulator, AI-to-SPICE synthesizes the logic, projects the physical `.asc` into an **Imaginary Canvas** that AI can visualize, executes headless **LTspice XVII** (via Wine) or **Ngspice**, and fuses simulation telemetry directly back into the canvas for autonomous governance.

---

## 🚀 Key Features

- **🧠 HRM Dual-Loop Governor**: Solves the open-loop hallucination problem. The Actor/Builder creates `.asc` schematics and `.cir` netlists; the Mirror reconstructs 2D spatial ground truth, executes headless simulation, and grades the design with an electrical health score (0–100%).
- **🖼️ 2D Imaginary Canvas**: A high-fidelity cognitive mirror that parses `.asc` schematics into:
  - 2D orthogonal Unicode box-drawing character planes for terminal/ASCII review.
  - Semantic AI JSON vector mirror with reconstructed netlist topology and geometric DRC.
  - Standalone SVG vector schematics.
- **🔌 Multi-SPICE Simulation Engine ("Caveman" Robustness)**: Headless batch simulation runner supporting classic **LTspice XVII** (via Wine with automatic `H:` drive virtualization) and native **Ngspice**.
- **📊 Telemetry Harvester & Canvas Overlay**: Extracts operating point voltages ($V_{\text{node}}$) and device currents ($I_{\text{branch}}$) directly from SPICE logs and overlays them onto schematic nodes and components.
- **⚡ One-Line Automated Installer**: Sets up Wine, classic LTspice XVII, dosdevice mappings, symbol libraries (over 4,100 indexed components), and Python dependencies with a single command.
- **📦 Modern Toolchain**: Full support for `uv` (lightning-fast Python environment manager) and `pnpm` (cross-platform runner).

---

## 🛠️ The HRM Architecture

```
       [ Natural Language / Requirement / Prompt ]
                            │
                            ▼
    ┌──────────────────────────────────────────────────┐
    │  1. THE BUILDER (Actor Loop)                     │
    │  • LLM Logic Ingestion (Pydantic CircuitSchema)  │
    │  • A* Manhattan Wire Router                      │
    │  • Emits Physical Files (.asc / .cir)            │
    └──────────────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
    ┌───────────────────┐       ┌───────────────────┐
    │ 2. THE MIRROR     │       │ 3. PHYSICAL WORLD │
    │ Imaginary Canvas  │       │ Multi-SPICE Engine│
    │ • 2D Grid Matrix  │       │ • LTspice (Wine)  │
    │ • Visual DRC Scan │       │ • Ngspice Batch   │
    │ • Net Topology    │       │ • Log Harvester   │
    └───────────────────┘       └───────────────────┘
              │                           │
              └─────────────┬─────────────┘
                            ▼
    ┌──────────────────────────────────────────────────┐
    │ 4. TELEMETRY FUSION & HRM GOVERNOR               │
    │ • Overlays V(node) and I(comp) onto 2D Canvas    │
    │ • Independent Verification & Health Scoring      │
    │ • Status: [PASS] / [WARN] / [FAIL]               │
    │ • Closed-Loop Diagnostic Feedback for AI Engine  │
    └──────────────────────────────────────────────────┘
```

Detailed architectural documentation: [docs/HRM_GOVERNOR_CANVAS.md](docs/HRM_GOVERNOR_CANVAS.md).

---

## ⚡ Quick Start

### 1. One-Line Environment Setup
Run the automated installer to set up Wine, LTspice XVII, component symbols, and Python dependencies:
```bash
./install.sh
```

### 2. Configure API Keys
```bash
cp .env.example .env
# Edit .env with your OpenAI or Anthropic API keys (or use local Ollama)
```

### 3. Launch the Interactive TUI
Using `uv`:
```bash
uv run python run.py
```
Or using `pnpm`:
```bash
pnpm start
```

---

## 💻 Command Line Tools

### 🧠 HRM Governor (`governor.py`)
Run the closed-loop audit and headless SPICE simulation on any schematic or JSON specification:
```bash
# Audit an existing schematic
python3 governor.py --asc examples/test_circuit.asc

# Audit from JSON spec (Synthesizes .asc -> Simulates -> Mirrors -> Grades)
python3 governor.py --json examples/test_circuit.json

# Output AI-ready JSON report
python3 governor.py --asc examples/test_circuit.asc --format json

# Export annotated SVG
python3 governor.py --asc examples/test_circuit.asc --format svg -o examples/audit.svg
```

### 🖼️ Imaginary Canvas CLI (`tools/asc_canvas.py`)
Visualize and mirror `.asc` files in the terminal or export to SVG/JSON:
```bash
# 2D ASCII Terminal Canvas
python3 tools/asc_canvas.py examples/test_circuit.asc

# Semantic Vector Mirror JSON
python3 tools/asc_canvas.py examples/test_circuit.asc --format json

# High-definition SVG export
python3 tools/asc_canvas.py examples/test_circuit.asc --format svg -o schematic.svg

# Overlay custom node voltages and device currents
python3 tools/asc_canvas.py examples/test_circuit.asc --voltages '{"N001": 5.0, "N002": 2.5}'
```

---

## 🧪 Automated Test Suite

Run the comprehensive unit test suite:
```bash
uv run python -m unittest discover -s tests -v
```

---

## 📦 `pnpm` Scripts Reference

```bash
pnpm run start          # Launch interactive TUI compiler
pnpm run governor       # Run HRM Governor audit
pnpm run canvas         # Render Imaginary Canvas for test circuit
pnpm run install:spice  # Run full multi-SPICE installer
```

---

## ⚖️ License

Distributed under the **GPL-3.0 License**. See `LICENSE` for more information.

---

**Built with ⚡ by an AI-Human Pair-Programming Team.**  
*"If you can describe it, you can simulate it."*
