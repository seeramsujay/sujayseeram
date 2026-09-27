# magic-touch
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/magic-touch
- **Status**: `Released (v1.0.0)`
- **Latest Release Tag**: `v1.0.0`

## 🚦 Releases & Release Notes
```text
v1.0.0	Latest	v1.0.0	2026-06-02T16:58:45Z
```

### Latest Release Details:
title:	v1.0.0
tag:	v1.0.0
draft:	false
prerelease:	false
author:	seeramsujay
created:	2026-06-02T16:57:41Z
published:	2026-06-02T16:58:45Z
url:	https://github.com/seeramsujay/magic-touch/releases/tag/v1.0.0
--
**Full Changelog**: https://github.com/seeramsujay/magic-touch/commits/v1.0.0

---

## 📖 README Content

# Magic Touch 🖐️✨

> **Transform any passive display into a high-fidelity touchscreen using a commodity smartphone camera via `scrcpy` / V4L2 input.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)

Magic Touch is a decoupled, monocular virtual touchscreen system. By pointing your smartphone camera (streamed via `scrcpy` over `/dev/video1`) at your laptop screen, you can interact with your OS using bare hands (MediaPipe Touch Mode) or a color-tracked stylus (Pen Mode with interactive HSV color dropper)—no expensive hardware or screen modifications required.

---

## ✨ Key Features

*   **`scrcpy` V4L2 Camera Stream:** Directly consumes camera feeds via `./scrcpy --v4l2-sink=/dev/video1 --video-source=camera --camera-size=1280x720 --camera-id=0`.
*   **Printable Corner Positioners:** Generates 4 AprilTag corner markers (`top_left_id0.png`, `top_right_id1.png`, `bottom_right_id2.png`, `bottom_left_id3.png`) and a printable grid sheet (`printable_sheet.png`) saved into `printable_positioners/`.
*   **Dual Input Modes:**
    *   **Touch Mode:** Index-finger tracking & pinch-to-click gesture recognition using Google MediaPipe CPU Lite model.
    *   **Pen Mode:** HSV color segmentation with an interactive mouse color-dropper tool to click and select any pen tip color.
*   **Interactive TUI & Global `F7` Hotkey:** Rich terminal dashboard before starting, featuring an autoclicker-style global `F7` hotkey to toggle active tracking on/off dynamically.
*   **Linux Native Integration:** Uses `evdev` and `uinput` to inject touch events into the Linux kernel with Exponential Moving Average (EMA) smoothing.
*   **CPU Optimized & Light Weight:** Zero PyTorch / CUDA requirements, tailored for laptop processors.

---

## 🛠️ Quick Start

### 1. Installation

Using `uv` (recommended):
```bash
uv venv .venv --prompt "mt"
source .venv/bin/activate
uv pip install -e .
```

Using standard `pip`:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Generate Printable Corner Positioners

To print physical markers for your screen corners:
```bash
uv run python main.py --generate-positioners
```
The PNG files will be saved in `printable_positioners/`. Print `printable_sheet.png` and stick the markers on your screen corners.

### 3. Launch TUI Control Center

Run the main application:
```bash
sudo uv run python main.py
```
*(Note: `sudo` is required to write to `/dev/uinput`)*

From the TUI Dashboard, you can:
*   Press **[1]** or **`F7`** to Start/Stop tracking on the fly.
*   Press **[2]** to switch between **Touch Mode** and **Pen Mode**.
*   Press **[3]** to open the **Interactive Color Dropper** for Pen Mode (click any object in the live camera window to sample its HSV color).
*   Press **[4]** to launch `scrcpy` camera stream (`./scrcpy --v4l2-sink=/dev/video1 --video-source=camera --camera-size=1280x720 --camera-id=0`).
*   Press **[5]** to calibrate screen homography matrix.
*   Press **[6]** to generate printable positioner PNGs.

---

## 🧪 Testing

Run the comprehensive unit test suite:
```bash
PYTHONPATH=. uv run pytest
```

---

## 📂 Project Structure

*   `main.py`: Primary application entrypoint and CLI wrapper.
*   `printable_positioners/`: Generated printable AprilTag corner markers and sheet.
*   `src/core/`: Homography math and Linux `uinput` touch event injection.
*   `src/trackers/`: Touch Mode (MediaPipe) and Pen Mode (HSV Color Dropper).
*   `src/utils/`: `scrcpy` manager, positioner generator, and `F7` hotkey listener.
*   `src/tui/`: Rich interactive terminal dashboard application.
*   `tests/`: Comprehensive unit test suite.
*   `backend/`: Legacy backend kept updated for backwards compatibility.

---

## ⚖️ License

Distributed under the **GNU General Public License v3.0**. See `LICENSE` for more information.
