# AI-based-PID-tuning-controller
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/AI-based-PID-tuning-controller
- **Status**: `Released (Paper Draft Before Final Test)`
- **Latest Release Tag**: `Paper Draft Before Final Test`

## 🚦 Releases & Release Notes
```text
Paper Draft Before Final Test	Latest	v1.1.1	2026-07-02T18:44:24Z
First Paper Draft		v1.1.0	2026-07-02T04:16:51Z
First Release with working 1-DOF AIR Rig.		v1.0.0	2026-07-01T12:43:58Z
```

---

## 📖 README Content

# AI-Based PID Tuning Controller

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

> **Autonomous Parameter Optimization for Industrial Control Loops.**

The AI-Based PID Tuning Controller is a hybrid hardware-software system designed to automate the complex process of tuning Proportional-Integral-Derivative (PID) controllers. By utilizing reinforcement learning and heuristic optimization algorithms, the system dynamically adjusts Kp, Ki, and Kd parameters to minimize settling time, overshoot, and steady-state error in real-time.

## 🎛️ The Vision: Set and Forget
Manual PID tuning is time-consuming and often leads to sub-optimal results in non-linear systems. Our AI-driven approach treats the system as a black box, learning its dynamics through interaction and providing a plug-and-play solution for stable and efficient control.

## 🛠️ Key Features
- **Intelligent Tuning Engine**: Python-based RL agent (PPO/DQN) or genetic algorithms for multi-objective parameter optimization.
- **Embedded Firmware**: Optimized C++/Arduino code for high-speed control loop execution on microcontrollers (ESP32/STM32).
- **Real-Time Telemetry**: Visualization tools to monitor setpoints, process variables, and control outputs during the tuning phase.
- **Hardware Agnostic**: Designed to interface with various actuators and sensors via standard PWM and ADC interfaces.

---

## 🏗️ Technical Architecture

- **Firmware/**: Low-latency control loop implementation and serial communication protocol.
- **Python/**: The brain of the system, responsible for analyzing performance metrics and suggesting parameter updates.
- **Optimization Pipeline**: Uses simulated environments for pre-training before deploying to physical hardware.

---

## 📂 Project Structure

- `firmware/`: MCU source code and hardware abstraction layer.
- `python/`: Tuning agents, data logging, and visualization scripts.
- `Archives/`: Historical performance tests, training logs, and legacy controller drafts.
- `requirements.txt`: Minimal dependencies for the Python tuning engine.

## 🚦 Quick Start

### Running in Simulation (Digital Twin Prototyping & SIL)
To run the optimization pipeline and generate the step-response validation plots without physical hardware:
```bash
# Clone the repository
git clone https://github.com/user/AI-based-PID-tuning-controller
cd AI-based-PID-tuning-controller

# Install dependencies (numpy, pandas, matplotlib)
pip install -r requirements.txt

# Run the Digital Twin simulation & generate paper plots
python python/generate_paper_plots.py
```
The figures (`ga_convergence.png` and `step_response_comparison.png`) will be exported to the `docs/` directory.

### Deploying to Physical Hardware
1. Connect your MCU to the target 2-DOF see-saw rig (L298N driver and MPU6050 IMU).
2. Flash the firmware from the `firmware/` directory to the microcontroller.
3. Run the host-side tuner specifying the UART port:
```bash
cd python
python tuner_v2.py --port /dev/ttyUSB0
```

## 📜 License
This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for details.