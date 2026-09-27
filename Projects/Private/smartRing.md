# smartRing
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/smartRing
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# 💍 smartRing: Asynchronous Rust-Powered Wearable Biometric & Gesture Interface

smartRing is a wearable gesture and biometric interface powered by an ultra-low-power, asynchronous Rust firmware built with the **Embassy** framework on nRF52 series silicon. By using cooperative async scheduling and hardware edge interrupts, it provides real-time finger rotation tracking and gesture dispatch inside a zero-overhead, highly legible `no_std` runtime.

---

## 🏗️ Hardware Architecture & Cognitive Flow

The ring captures mechanical rotations using high-sensitivity Hall Effect sensors and asynchronously processes the states via edge interrupts:

```
    [ Physical Ring Rotation ] ──► (Dual Magnetic Gaskets)
                │
                ▼
   [ Dual Hall Sensors (P0.02 / P0.03) ]
                │
                ▼ (Hardware Edge Interrupts)
   [ Embassy GPIO Input Channels ]
                │
                ▼
   [ Asynchronous Decelerator Loop ] ──► (Decodes CW / CCW Rotations)
                │
                ▼
   [ Ultra-Low Power BLE Dispatch ] ──► (Gesture Events) / [ defmt RTT Logs ]
```

---

## ⚡ Key Persuasion Points & Features

- **Asynchronous Rust Firmware**: Built entirely in a `no_std`, `no_main` environment using the **Embassy** executor, guaranteeing compile-time memory safety, thread safety, and zero-allocation runtime.
- **Hardware-Driven Rotation Decoders**: Utilizes dual Hall Effect sensors mapped to hardware edge interrupts (`wait_for_any_edge().await`), immediately detecting clockwise vs. counter-clockwise finger gestures with zero polling overhead.
- **Cooperative Sleep Scheduling**: The Embassy executor suspends execution blocks automatically when waiting for hardware pins, placing the Cortex-M4 CPU into an ultra-low-power sleep state to maximize battery life on tiny LiPo wearable cells.
- **High-Bandwidth Defmt Debugging**: Replaces heavy formatting string blocks with `defmt` and `panic_probe` over RTT, enabling ultra-fast, zero-overhead debug telemetry without blocking time-sensitive execution frames.
- **Open Hardware Blueprint**: Fits within a multi-layer flexible PCB layout designed to sit in a castable resin or 3D-printed biocompatible ring enclosure.

---

## 🛠️ Environmental Constraints & Protocol Alignment

Aligned with the **ANTIGRAVITY Protocol**, the codebase is optimized for absolute token-efficiency and clean architectures:
- **Rust Toolchain**: Fully relies on target-specific embedded compilation and local flashing interfaces, avoiding bloated cloud compilation steps.
- **Optimized Compilation**: Uses `probe-rs` configuration keys in `.cargo/config.toml` to compile, flash, and monitor hardware logs synchronously with a single command.

---

## 🚀 Quick Start (60-Second Hardware Setup)

### 1. Install the Rust Embedded Toolchain
Add the appropriate target for the nRF52 Cortex-M4 CPU:
```bash
rustup target add thumbv7em-none-eabihf
```

### 2. Install probe-rs Flashing Utility
```bash
cargo install probe-rs --features cli
```

### 3. Build, Flash, and Monitor
Ensure your programmer (J-Link or DAPLink) is connected to the ring's debug pads, then execute:
```bash
cd firmware
cargo run --release
```
This single command compiles the binary, flashes it to the nRF52 chip, and opens an interactive low-overhead `defmt` logging console.

---

## 📄 License
This project is licensed under the GPL-3.0 License. See the `LICENSE` file for details.


---

## 🛡️ Licensing & Privacy Protection

Because this repository contains personal code, portfolios, or intellectual property, **strict privacy protections are in place**.

### ⚠️ Prohibitions on AI Training & Scraping
This repository is published for direct human viewing only. Automated data scraping, harvesting, and crawling are strictly prohibited under the author's personal copyright terms.

**By accessing this repository or its contents, you agree to the following terms:**
*   **NO AI/LLM Ingestion:** Any ingestion of code, text, layouts, designs, or assets for training, validation, testing, or tuning of machine learning models, neural networks, or artificial intelligence systems (such as Large Language Models) is strictly prohibited.
*   **NO Automated Data Scraping:** Any automated extraction, parsing, harvesting, or scraping of content by bots, crawlers, scripts, or spiders is prohibited.
*   **Personal Use Only:** Human viewing for personal or educational review is permitted. No duplication, modification, adaptation, or commercial distribution of this work is allowed without express written permission.
