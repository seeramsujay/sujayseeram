# auto-worker
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/auto-worker
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# 📐 Pentaract Agent: Low-Latency Anti-Bot GUI Automation Engine

**Pentaract** is a hybrid, low-latency Graphical User Interface (GUI) automation framework designed to run complex desktop/browser workflows at **sub-30ms execution loops** while bypassing modern software-level anti-bot mechanisms.

By decoupling deterministic element targeting (**Fast Path**) from heavy visual-semantic reasoning (**VLM Fallback Engine**) and delegating physical cursor movements to an external microcontroller (**Raspberry Pi Pico RP2040 or ESP32 USB HID**), Pentaract eliminates the speed/intelligence trade-off in GUI robotics.

---

## 🏗️ Architectural Blueprint

```
                      ┌──────────────────────────┐
                      │   Screen Capture Frame   │
                      └─────────────┬────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌───────────────────────────┐                       ┌─────────────────────────────┐
│  YOLOv8 / RapidOCR Pipeline│                       │ Single-Pass Vision Backbone │
└────────────┬──────────────┘                       └──────────────┬──────────────┘
             │                                                     │
             └──────────────────────────┬──────────────────────────┘
                                        ▼
                     ┌─────────────────────────────────────┐
                     │ Pentaract Vector Extraction & Fusion│
                     │  v = [v_spatial || v_visual || v_text]
                     └──────────────────┬──────────────────┘
                                        │
                                        ▼
                     ┌─────────────────────────────────────┐
                     │  Microsecond Matrix Cosine Ranking  │
                     │     (with Trap Penalty Masking)     │
                     └──────────────────┬──────────────────┘
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             │                                                     │
    [ Confidence >= 0.72 ]                                [ Confidence < 0.72 ]
             │                                                     │
             ▼                                                     ▼
┌──────────────────────────────┐                         ┌──────────────────────────────────┐
│ Fast Path Actuation Dispatch │                         │ Asynchronous VLM Fallback Worker │
└──────────────┬───────────────┘                         │  (Qwen2.5-VL / UI-TARS-2 via     │
               │                                         │   vLLM PagedAttention)           │
               │                                         └────────────────┬─────────────────┘
               │                                                          │
               └────────────────────────┬─────────────────────────────────┘
                                        │
                                        ▼
                         ┌───────────────────────────────┐
                         │   SLIP Serial Command Frame   │
                         └───────────────┬───────────────┘
                                         │
                                         ▼
                         ┌───────────────────────────────┐
                         │ Hardware USB HID Device       │
                         │ (Raspberry Pi Pico / ESP32-S3)│
                         │ - Custom VID/PID Registration │
                         │ - Fitts' Law + Bézier Curves  │
                         │ - 8-12 Hz Gaussian Tremor     │
                         └───────────────┬───────────────┘
                                         │ Native USB HID
                                         ▼
                         ┌───────────────────────────────┐
                         │ Target Machine OS Kernel      │
                         │ (Zero Agent Software Hooks)   │
                         └───────────────────────────────┘
```

---

## 🛡️ Two-Computer "Zero-Suspicion" Physical Air Gap

For maximum evasion against anti-bot behavioural profiling (Akamai, Cloudflare Turnstile, DataDome) and enterprise EDR monitors:

```
   ┌─────────────────────────────────────────┐
   │         Machine A: Agent Host           │
   │  - Screen grabber (HDMI Capture / RTSP) │
   │  - Pentaract Fast-Path RoI Pipeline     │
   │  - Asynchronous VLM Fallback            │
   │  - SLIP Serial Dispatcher               │
   └────────────────────┬────────────────────┘
                        │
                        │ USB-to-UART Cable (or CDC Serial)
                        ▼
   ┌─────────────────────────────────────────┐
   │     Raspberry Pi Pico (RP2040)          │
   │  - Pin 1 (GP0 TX) & Pin 2 (GP1 RX)      │
   │  - SLIP Protocol State Machine          │
   │  - On-chip 4th-Order Bézier & Fitts' Law│
   │  - 8-12 Hz Gaussian Micro-Tremor        │
   │  - Custom HID Descriptors (VID/PID)     │
   └────────────────────┬────────────────────┘
                        │
                        │ Micro-USB Native Cable
                        ▼
   ┌─────────────────────────────────────────┐
   │         Machine B: Target PC            │
   │  - Zero agent software installed        │
   │  - No virtual driver hooks or debuggers │
   │  - Native USB HID: Dell/Logitech Mouse  │
   │  - OS processes genuine hardware inputs │
   └─────────────────────────────────────────┘
```

1. **Host Isolation:** Machine B runs **zero** automation code, Python binaries, or synthetic browser hooks (`Input.dispatchMouseEvent`).
2. **Authentic Device Registration:** The RP2040 registers genuine Vendor ID / Product ID and manufacturer strings (e.g. Dell Inc. `0x413C`/`0x2113` KB216 Multimedia Keyboard & Optical Mouse), matching physical off-the-shelf peripherals.
3. **Interrupt-Level Timing:** Keystrokes and mouse movements generate hardware USB interrupt packets (`bInterval = 8ms` for 125Hz report rates), ensuring physical authenticity.

---

## ⚡ Core Innovations & Features

1. **Pentaract Spatial-Semantic Embeddings:** A hybrid vector space combining normalized $5\text{D}$ bounding geometry $[x_c, y_c, w, h, \text{area}]$, pooled visual RoI features, and dense text embeddings projected via learned isotropic matrices.
2. **Single-Pass RoI-Align Feature Slicing:** Eliminates isolated CPU image crops by passing screenshots through a single vision backbone and slicing features directly via `torchvision.ops.roi_align` (or high-speed vectorized bilinear interpolation in ultra-lightweight environments), keeping batch latencies under $15\text{ ms}$ for over 100 bounding boxes.
3. **Hardware USB HID Actuation (RP2040 / ESP32-S3):** Converts host agent target coordinates into hardware-level USB mouse signals. Movements follow 4th-order Bézier curves shaped by Fitts' Law velocity profiles and 8–12 Hz micro-jitter to pass behavioural anti-bot checks.
4. **Zero-Cold-Start VLM Fallback Loop:** Keeps a quantized local VLM (UI-TARS-2 / Qwen2.5-VL) resident in VRAM using vLLM PagedAttention and static KV-cache pools, enabling sub-250ms asynchronous disambiguation without blocking the fast control loop.
5. **Anti-Trap & Security Guardrails:** Applies Layout-derived Interaction Priors (LIP) and temporal variance filtering to penalize dark patterns and deceptive click targets while triggering an automatic Human-in-the-Loop (HITL) fallback on visual CAPTCHA detection.
6. **Real-time Diagnostics Dashboard:** Built-in FastAPI/WebSocket observability dashboard with live visual overlays, RoI ranking inspectability, and millisecond-level telemetry tracking.

---

## 📦 System Requirements

* **OS:** Linux (Debian/Ubuntu/Mint recommended for real-time serial execution)
* **GPU:** NVIDIA GPU with $\ge 8\text{ GB}$ VRAM for local 4-bit/FP8 VLM execution (or CPU/Remote API mode for lightweight edge devices)
* **Hardware Device:** Raspberry Pi Pico (RP2040) or ESP32-S2/S3 connected via USB (acting as native USB HID Mouse/Keyboard)
* **Software Stack:**
  * Python 3.10+ & `uv` (for ultra-fast, space-efficient dependency management)
  * PyTorch 2.x (optional for accelerated GPU RoI operations; pure vectorized CPU fallback included)
  * Arduino CLI or PlatformIO (for Pico / ESP32 firmware compilation)

---

## 🚀 Quickstart

### 1. Hardware Microcontroller Deployment

#### Raspberry Pi Pico (RP2040)
```bash
cd firmware/rpi_pico_hid
# Using Arduino CLI with Earle Philhower core:
arduino-cli compile --fqbn rp2040:rp2040:rpipico:usbstack=adafruit_tinyusb rpi_pico_hid.ino
arduino-cli upload -p /dev/ttyACM0 --fqbn rp2040:rp2040:rpipico:usbstack=adafruit_tinyusb rpi_pico_hid.ino
```

#### ESP32-S3
```bash
cd firmware/esp32_hid
arduino-cli compile --fqbn esp32:esp32:esp32s3 esp32_hid.ino
arduino-cli upload -p /dev/ttyACM0 --fqbn esp32:esp32:esp32s3 esp32_hid.ino
```

### 2. Python Core Setup & Installation

Using `uv` for minimal disk footprint and sub-second dependency resolution:

```bash
git clone https://github.com/seeramsujay/pentaract-agent.git
cd pentaract-agent

# Create ultra-fast virtual environment
uv venv .venv
source .venv/bin/activate

# Install core runtime
uv pip install -e .
```

### 3. Execution Example

```python
import asyncio
from pentaract.orchestrator import GUIOrchestrator

# Launch agent loop listening on hardware USB serial port
async def main():
    agent = GUIOrchestrator(
        serial_port="/dev/ttyACM0",
        confidence_threshold=0.72,
        vlm_model_path="Qwen/Qwen2.5-VL-7B-Instruct-AWQ",
        mock_serial=False  # Set True for headless testing without hardware
    )
    await agent.run_loop(task="Click the checkout button")

if __name__ == "__main__":
    asyncio.run(main())
```

### 4. Running the Lightweight GTK Desktop GUI & CLI

```bash
# Launch the GTK 3 Stealth Desktop GUI (Linux)
./run_gui.sh

# Launch the GTK 3 Stealth Desktop GUI (Windows)
run_gui.bat

# Or via CLI directly:
pentaract gui

# Run CLI agent workflow
./run_agent.sh --task "Submit Order"

# Run micro-benchmark
pentaract bench

# Run CLI test of hardware HID connection & trajectory
pentaract test-hid --port /dev/ttyACM0

# Start web diagnostics dashboard
pentaract dashboard --port 8088
```

#### ⌨️ Global Shortcut & Emergency Audit Kill Switch: `Ctrl + Shift + F7`
- **When Idle:** Instantly begins automation loop for the configured workflow goal.
- **When Running (Audit Panic):** Instantly halts all agent loops, transmits hardware `SLIPOpcode.RESET` to microcontrollers (releasing all mouse buttons/keys), wipes in-memory frame buffers, and forces a zero-RAM footprint audit purge.
- **Stealth Mode:** Toggleable disguise titles (`System Monitor`, `Audio Subsystem`, `Calculator`) and customizable ghost HUD opacity.


---

## 🗓️ Development Roadmap

### Phase 1: Core Perception & Spatial Vector Pipeline (Completed)

* [x] Mathematical specification for the Pentaract hybrid vector model.
* [x] Single-pass RoI-Align implementation with dual PyTorch and vectorized fallback.
* [x] Microsecond matrix dot-product cosine ranker with trap penalty multipliers.

### Phase 2: Physical Hardware Actuation & Anti-Bot Evasion (Completed)

* [x] Fixed 8-byte binary SLIP serial protocol over UART/CDC.
* [x] ESP32-S3 and Raspberry Pi Pico (RP2040) firmware implementing 4th-order Bézier curves and Fitts' Law scaling.
* [x] Sub-pixel Gaussian noise injection for 8–12 Hz micro-tremor emulation.
* [x] Custom USB HID descriptor registration (VID/PID spoofing matching Dell/Logitech hardware).
* [x] Mock HID serial emulator for CI/CD and hardware-free simulation.

### Phase 3: Zero-Cold-Start VLM Integration & Fallback Engine (In Progress)

* [x] Non-blocking `asyncio` event loop architecture for fast/slow path routing.
* [x] Speculative async fallback queue with confidence threshold dispatching.
* [x] Shared-backbone integration hooks and prompt grounding templates for Qwen2.5-VL / UI-TARS.
* [ ] **vLLM Fine-Tuning:** Evaluate AWQ and FP8 quantizations of UI-TARS-2 and Qwen2.5-VL on desktop GUI grounding benchmarks.

### Phase 4: Production Hardening & Security Guardrails (Planned)

* [x] **Adversarial Dark Pattern & Trap Classifier:** Dynamic Layout-derived Interaction Priors (LIP) and temporal variance masking.
* [x] **Automated HITL Notification Bridge:** Native OS desktop alerts (`libnotify`) and event dispatch when encountering CAPTCHAs.
* [ ] **Dual-Stream Accessibility Layer:** Inject native Linux `AT-SPI` / Windows UI Automation API streams to complement vision bounding boxes.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
