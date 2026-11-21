# intuitive-os
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/intuitive-os
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# Intuitive-OS

[![Project Status](https://img.shields.io/badge/Status-Development-orange.svg)](#)
[![Python Version](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#)

> **Zero-Hardware Spatial Accessibility** — A Python computer vision application that transforms any standard webcam into a spatial interface, allowing hands-free navigation of your operating system.

---

## 🌟 Features

*   **Zero Hardware Cost:** Works with any standard built-in or USB webcam. No Leap Motion or eye-trackers required.
*   **Multi-Threaded Architecture:** Prevents UI blocking and maintains high framerates by decoupling video capture, landmark detection, and OS cursor movement into separate threads.
*   **Precision Smoothing:** Utilizes a One Euro Filter / Exponential Moving Average to eliminate tracking noise and provide a liquid-smooth cursor experience.
*   **Intuitive Gesture Language:** Relies on Euclidean distance thresholds between hand nodes for mouse tracking, click simulation, double-clicks, and scrolling.
*   **Dynamic Calibration:** Adaptively scales gesture sensitivity based on hand size and distance from the camera.

---

## 🛠️ Project Architecture

```
                       +-------------------+
                       |   Webcam Feed     |
                       +---------+---------+
                                 | (Camera Thread)
                                 v
                       +---------+---------+
                       | OpenCV & MediaPipe|
                       +---------+---------+
                                 | (Landmark Coordinates)
                                 v
                       +---------+---------+
                       |  Signal Filter   | (Noise & Jitter Removal)
                       +---------+---------+
                                 | (Smoothed Screen Coordinates)
                                 v
                       +---------+---------+
                       |   Gesture Engine  | (Euclidean Distance & Clicks)
                       +---------+---------+
                                 | (OS Instructions)
                                 v
                       +---------+---------+
                       | OS Native Inputs  | (Cursor, Clicks, Scrolls)
                       +-------------------+
```

For a detailed walkthrough of the implementation details, see [idea.md](file:///home/suzaykid/Projects/intuitive-os/idea.md).

---

## 🚀 Getting Started

### Prerequisites

*   Python 3.8 or higher
*   A functional built-in or external webcam
*   OS-level permissions for webcam access and accessibility controls

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/suzaykid/intuitive-os.git
    cd intuitive-os
    ```

2.  **Create a Virtual Environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

---

## 🎮 How to Use & Gestures

Once the application is running, the following gestures mapped by node-to-node Euclidean distance control your cursor and clicks:

| Gesture | Finger Nodes Involved | Action |
| :--- | :--- | :--- |
| **Move Cursor** | Index Finger Tip (Node 8) | Cursor tracks movement |
| **Left Click** | Thumb (Node 4) + Index Tip (Node 8) pinch | Left Mouse Click |
| **Double Click** | Thumb (Node 4) + Index Tip (Node 8) double pinch | Left Double Click |
| **Right Click** | Thumb (Node 4) + Middle Tip (Node 12) pinch | Right Mouse Click |
| **Scroll Mode** | Thumb (Node 4) + Pinky Tip (Node 20) pinch | Move hand up/down to scroll |

*For development milestones, check out the [ROADMAP.md](file:///home/suzaykid/Projects/intuitive-os/ROADMAP.md).*

---

## 🔒 Platform Specific Permissions

*   **Linux:** Depending on your desktop environment, you might need to run the application with privileges to write to `/dev/uinput` or ensure package support for libraries simulating X11 / Wayland clicks.
*   **macOS:** Requires granting the terminal/application access to camera feeds under **Privacy & Security > Camera**, as well as controls under **Accessibility**.
*   **Windows:** Ensure the command terminal has administrative execution privileges if you plan to navigate apps run as Administrator.

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
