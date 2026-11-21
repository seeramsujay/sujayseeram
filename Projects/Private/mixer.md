# mixer
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/mixer
- **Status**: `Released (New Improved Mixing)`
- **Latest Release Tag**: `New Improved Mixing`

## 🚦 Releases & Release Notes
```text
New Improved Mixing	Latest	v2.0.1	2026-04-05T17:11:31Z
Official Release	Pre-release	v2.0.0	2026-04-05T06:16:29Z
First Stable Release		v1.0.0	2026-03-25T17:49:51Z
```

---

## 📖 README Content

# Mixer: Intelligent Psychoacoustic Auto-DJ

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-yellow.svg)](https://python.org)

> **A terminal-native, spectral-aware transition engine for seamless music streaming.**

Mixer is a high-performance audio daemon that transforms a simple folder of music into a professional-grade continuous mix. Unlike basic crossfaders, Mixer uses a psychoacoustic decision engine to analyze track pairs in real-time, selecting from 8 unique transition styles (Rise, Bass Swap, Filter Wash, Melt, etc.) to ensure energy levels remain constant and transitions feel intentional.

## 🎧 Why Mixer?
Most "auto-mixers" use linear fades that cause a 3dB volume dip, breaking the listener's flow. Mixer solves this using:
- **Equal-Power Sinusoidal Fades**: Mathematically guaranteed flat power response across transitions.
- **Spectral Analysis**: Real-time extraction of RMS energy, sub-bass profiles, and treble variance.
- **Zero-Latency Baking**: A background thread pre-processes the next transition in RAM (`/dev/shm`), ensuring gapless playback even on high-latency storage.

---

## 🛠️ The 8 Smart Transitions

| Style | Trigger | Audio Effect |
|:---:|---|---|
| **Bass Swap** | Heavy sub-bass in both tracks | Exponential HP sweep + sub-bass crossover. |
| **Filter Wash** | Treble-heavy outgoing track | Resonant HP wash (80Hz → 2kHz) for a clean dissolve. |
| **Melt** | High energy variance | Multi-tap echo (200/400ms) with a 3kHz low-pass melt. |
| **Tape Stop** | Clashing genres/energy | Psychoacoustic tape-warp speed ramp at the crossover. |
| *...and 4 more modes based on progressive energy swells and hard-cuts.* |

---

## 🏗️ Technical Architecture

- **Decision Engine**: Priority-waterfall rule system based on MIR (Music Information Retrieval) literature.
- **Streaming Pipeline**: Pipes perfectly baked WAV chunks to `mpv` via IPC/Unix Sockets.
- **Minimal Footprint**: Operates with a microscopic ~15MB RAM baseline, scaling slightly with chunk sizes.

---

## 📂 Project Structure

- `mixer`: The primary intelligent auto-DJ script (V2).
- `lightMixer`: A lightweight reference implementation (V1) using baseline equal-power fades.
- `Archives/`: Deep-dive research reports, spectral analysis papers, and historical changelogs.
- `requirements.txt`: Minimal dependencies (`pydub`, `mpv`, `ffmpeg`).

## 🚦 Quick Start

### Installation
```bash
sudo apt install mpv ffmpeg
pip install pydub
git clone https://github.com/user/mixer
cd mixer
```

### Usage
```bash
# Simply navigate to your music and run
cd ~/Music && /path/to/mixer
```

## 📜 License
This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for details.

---

## 🎓 Research Basis
The transition logic in Mixer is grounded in academic DSP research, including Terhardt's sensory consonance model and ITU-R BS.1770 loudness standards. Detailed analysis is available in the `Archives/Research_Report.md`.


---

## 🛡️ Licensing & Privacy Protection

Because this repository contains personal code, portfolios, or intellectual property, **strict privacy protections are in place**.

### ⚠️ Prohibitions on AI Training & Scraping
This repository is published for direct human viewing only. Automated data scraping, harvesting, and crawling are strictly prohibited under the author's personal copyright terms.

**By accessing this repository or its contents, you agree to the following terms:**
*   **NO AI/LLM Ingestion:** Any ingestion of code, text, layouts, designs, or assets for training, validation, testing, or tuning of machine learning models, neural networks, or artificial intelligence systems (such as Large Language Models) is strictly prohibited.
*   **NO Automated Data Scraping:** Any automated extraction, parsing, harvesting, or scraping of content by bots, crawlers, scripts, or spiders is prohibited.
*   **Personal Use Only:** Human viewing for personal or educational review is permitted. No duplication, modification, adaptation, or commercial distribution of this work is allowed without express written permission.
