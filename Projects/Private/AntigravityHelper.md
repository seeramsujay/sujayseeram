# AntigravityHelper
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/AntigravityHelper
- **Status**: `Released (v1.1.0)`
- **Latest Release Tag**: `v1.1.0`

## 🚦 Releases & Release Notes
```text
v1.1.0	Latest	v1.1.0	2026-05-19T12:09:35Z
First Main Release		v1.0.0	2026-05-06T18:10:52Z
```

### Latest Release Details:
title:	v1.1.0
tag:	v1.1.0
draft:	false
prerelease:	false
author:	seeramsujay
created:	2026-05-19T12:08:38Z
published:	2026-05-19T12:09:35Z
url:	https://github.com/seeramsujay/AntigravityHelper/releases/tag/v1.1.0
asset:	app-release.apk
--
Release v1.1.0: Add Android release APK, configure local headless Gradle compilation, update README setup instructions.

---

## 📖 README Content

<div align="center">
  <h1>🌌 Antigravity Helper</h1>
  <p><b>High-Performance Agentic Orchestration & "Git Tinder" Review Framework</b></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Rust](https://img.shields.io/badge/backend-Rust--Actix-orange.svg)](https://www.rust-lang.org/)
  [![TypeScript](https://img.shields.io/badge/CLI-TypeScript-blue.svg)](https://www.typescriptlang.org/)
  [![React Native](https://img.shields.io/badge/UI-React--Native-61dafb.svg)](https://reactnative.dev/)
</div>

---

## 🚀 The Vision: "Git Tinder"

**Antigravity** reimagines the developer workflow for the autonomous age. Built upon the rock-solid PTY and WebSocket foundations of **Lunel**, we've stripped away the "heavy" legacy UI to focus on a hyper-fast, swipeable **"Git Tinder"** experience for mobile.

Imagine reviewing PRs, triaging issues, and executing agentic workflows with the same kinetic ease as a social app—all backed by a high-performance Rust core.

---

## 🏗️ Technical Architecture

Antigravity leverages a hybrid stack optimized for **Mac Air 2017** baseline hardware:

### 1. The Compute Engine (`backend_actix`)
- **Lunel-Core Heritage**: Utilizing the high-performance PTY orchestration and WebSocket streaming patterns from the Lunel open-source project.
- **Zero-Cost Abstractions**: Rust-driven `portable-pty` integration for millisecond-latency terminal interactions.
- **Cell-Grid Protocol**: Streams raw terminal state diffs to the mobile UI at 24fps.

### 2. The I/O Gateway (`backend_fastapi`)
- **FastAPI Gateway**: Orchestrates asynchronous telemetry ingestion and local edge inference.
- **Local Edge AI**: Integrated **Whisper.cpp** for hardware-accelerated voice-to-code operations.

### 3. The Kinetic UI (`app_ui`)
- **Optimistic Rendering**: React Native + Reanimated for 60fps swipe gestures.
- **Lightweight Terminal**: A streamlined, performance-first terminal view that connects directly to the Actix PTY stream.
- **Tailscale Mesh**: Secure, direct connectivity bypassing the public internet.

---

## 📊 Documentation (HADS 1.0.0)

**Version 1.1.0** · Antigravity Core · 2026

## AI READING INSTRUCTION
Read `[SPEC]` and `[BUG]` blocks for authoritative technical facts.
Read `[NOTE]` for context and developer intent.

---

### 1. System Requirements
**[SPEC]**
- **Hardware Profile**: Optimized for Dual-core CPU, 8GB RAM.
- **OS**: Linux / macOS.
- **Network**: Tailscale account for secure remote bridging.
- **Runtime**: Node.js 18+, Rust 1.75+.

**[NOTE]**
The system is designed to be "agentic first"—it doesn't just display code; it's designed to be navigated and manipulated by autonomous agents through the CLI bridge.

---

### 2. Networking Protocol
**[SPEC]**
- **WebSocket**: `ws://localhost:8081/pty`
- **Gateway**: `http://localhost:8000`
- **Security**: eBPF-driven sandboxing and Tailscale encrypted tunnels.

**[BUG] Port Collision**
- **Symptom**: Actix-Web fails to bind to port 8080.
- **Cause**: Local `whisper.cpp` server defaults to 8080.
- **Fix**: Actix re-mapped to `8081`.

---

## 🛠️ Getting Started

### Local Setup
```bash
# 1. Start the Hybrid Backend
./start.sh

# 2. Bridge the Filesystem (CLI)
npx -y lunel-cli start

# 3. Launch the Mobile Swipe-UI (Development)
cd app_ui && npm install && npm start
```

### Mobile APK & Tailscale Setup
**[SPEC]**
1. **Download Pre-built APK:** Download the release APK from the [v1.1.0 Releases](https://github.com/seeramsujay/AntigravityHelper/releases/tag/v1.1.0) page.
2. **Local Build (Headless Gradle):** If you prefer compiling it locally from source:
   - Configure Expo config (`app.json`) and run prebuild:
     ```bash
     cd app_ui
     npx expo prebuild --platform android --clean --no-install
     ```
   - Compile using Java 17 and Gradle headless:
     ```bash
     cd android
     JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ANDROID_HOME=~/android-sdk ./gradlew assembleRelease
     ```
   - Find the output APK at: `app_ui/android/app/build/outputs/apk/release/app-release.apk`
3. **Transfer:** Transfer the `app-release.apk` to your Android device and install it.
4. **Tailscale VPN Setup:** 
   - Install and launch Tailscale on your host machine.
   - Install and launch Tailscale on your Android device.
   - Authenticate both devices to the same Tailnet.
5. **Connect:** The app is configured with a default fallback to Tailscale IP `100.69.123.108:8081`. You can enter this or your host's Tailscale IP in the app to establish a secure, low-latency connection bypassing public internet routing.

---

## 🗺️ Roadmap

- [x] **Phase 1**: Port rock-solid Lunel PTY/WS backend to Actix.
- [x] **Phase 2**: Implement lightweight React Native terminal component.
- [x] **Phase 3**: **Git Tinder** — Swipeable Diff/PR review interface.
- [x] **Phase 4**: Local voice-to-code agentic dispatch (Whisper.cpp + FastAPI integration).
- [x] **Phase 5**: Kernel-level resource isolation (zram/eBPF).

---

<div align="center">
  <p><i>Professional grade. Industrial strength. Built on 🌌 Antigravity Principles.</i></p>
</div>


---

## 🛡️ Licensing & Privacy Protection

Because this repository contains personal code, portfolios, or intellectual property, **strict privacy protections are in place**.

### ⚠️ Prohibitions on AI Training & Scraping
This repository is published for direct human viewing only. Automated data scraping, harvesting, and crawling are strictly prohibited under the author's personal copyright terms.

**By accessing this repository or its contents, you agree to the following terms:**
*   **NO AI/LLM Ingestion:** Any ingestion of code, text, layouts, designs, or assets for training, validation, testing, or tuning of machine learning models, neural networks, or artificial intelligence systems (such as Large Language Models) is strictly prohibited.
*   **NO Automated Data Scraping:** Any automated extraction, parsing, harvesting, or scraping of content by bots, crawlers, scripts, or spiders is prohibited.
*   **Personal Use Only:** Human viewing for personal or educational review is permitted. No duplication, modification, adaptation, or commercial distribution of this work is allowed without express written permission.
