# mopper
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/mopper
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# Mopper: Autonomous Semantic Mopping Robot (big.LITTLE Architecture)

Mopper is an autonomous home mopping robot built on a **big.LITTLE distributed robotics architecture**:
- **"big" Tier (The Brain)**: An Android smartphone running native Kotlin, Jetpack Compose, CameraX, and Google ML Kit. It handles high-level computer vision, Inverse Perspective Mapping (IPM), multi-layer semantic grid mapping, autonomous Frontier Exploration floor mapping, Space-Filling Spiral coverage, Room Summoning ("call to room"), collision-free A* path planning with obstacle avoidance, Hierarchical Reasoning Model (HRM) obstacle navigation, Home Assistant MQTT integration, and telemetry UI.
- **"LITTLE" Tier (The Real-Time Actuator)**: A Raspberry Pi Pico (RP2040) running **FreeRTOS Kernel** in dual-core Symmetric Multi-Processing (SMP) mode. It handles microsecond-deterministic wheel encoder pulse counting, forward-facing ultrasonic distance sensing aligned with the camera, dual-wheel closed-loop velocity PID control, cliff/bumper emergency stops, and water pump PWM dispensing.
- **Inter-tier Communication**: Low-latency, CRC16-validated binary packet protocol over a wired USB-OTG connection.

---

## System Architecture

```
   +----------------------------------------------------------------+
   |                     "big" Tier: Android Phone                  |
   |                                                                |
   |   [ CameraX 30 FPS ] ---> [ Google ML Kit Object Detection ]   |
   |                                      |                         |
   |                                      v                         |
   |   [ Phone IMU / Gyro ] ---> [ Inverse Perspective Mapping ]    |
   |                                      |                         |
   |   [ Ultrasonic Telemetry ] --------->+                         |
   |                                      v                         |
   |                         [ Multi-Layer Semantic Costmap ]       |
   |                                      |                         |
   |       +------------------------------+--------------------+    |
   |       v                              v                    v    |
   | [ Frontier Exploration ]    [ A* Path Planner ]    [ Spiral &  |
   |   (Auto-Map Whole Floor)    (Room Summoning)       Sweep Cover]|
   |       |                              |                    |    |
   |       +------------------------------+--------------------+    |
   |                                      v                         |
   |                      [ Hierarchical Reasoning Model ]          |
   |                      (Tactical Obstacle Behaviors / TFLite)    |
   |                                      |                         |
   |   [ Home Assistant MQTT ] <----------+                         |
   |   (Summon & Arrival Event)           |                         |
   |   [ Jetpack Compose UI  ] <----------+                         |
   |                                      v                         |
   |                                   v, omega                     |
   +--------------------------------------|-------------------------+
                                          | USB-OTG (CDC-ACM Serial)
                                          | Binary Protocol (0xAA 0x55)
   +--------------------------------------v-------------------------+
   |             "LITTLE" Tier: Raspberry Pi Pico (FreeRTOS SMP)    |
   |                                                                |
   |   Core 1: [ Serial RX Task ] ---> [ xTwistQueue / xPumpQueue ] |
   |                  |                               |             |
   |   Core 0: [ Safety Task (50Hz) ]                 v             |
   |             - Ultrasonic Sensor (GP16/17) [ Motor PID (100Hz) ]|
   |                  |                               |             |
   |                  v                               |             |
   |           [ xSafetyEvents ] --------------------->             |
   |                  |                               |             |
   |                  +----------------------> [ xStateMutex ]      |
   |                                                  |             |
   |   Core 1: [ Telemetry TX Task (20Hz) ] <---------+             |
   |                  |                                             |
   |                  +---> USB CDC-ACM Feedback to Android         |
   +----------------------------------------------------------------+
```

---

## Key Features

1. **Room Summoning & Home Assistant Dispatch**:
   - Call the robot to any designated room (e.g. `Kitchen`, `Living Room`, `Bedroom`, `Office`, `Hallway`) via Home Assistant or the operator UI.
   - Plans a collision-free route with $15\text{cm}$ safety obstacle inflation using global A* path planning.
   - Smoothly circumvents dynamic obstacles using local reactive potential fields and the Hierarchical Reasoning Model (HRM).
   - Shuts off water pump during transit. Upon arrival ($<0.25\text{m}$), stops motors, enters `AWAITING_COMMAND` state, and fires arrival event notifications to Home Assistant (`mopper/event` and `mopper/status`).
2. **Space-Filling Spiral Coverage**:
   - Continuous Archimedean spiral coverage pattern ($r(\theta) = \frac{w}{2\pi}\theta$) expanding outwards up to the room boundary.
   - Provides smooth, continuous mopping for spot cleans and room coverage without sharp stop-and-turn lane transitions.
3. **Autonomous Frontier Floor Mapping**:
   - Detects frontier cells between cleanable and unknown space, clusters candidates, and systematically navigates unknown terrain until the entire floor plan is discovered.
4. **Forward Ultrasonic Sensor on RP2040**:
   - HC-SR04 microsecond driver running at 50 Hz on Core 0 co-axial with the phone camera.
   - Eliminates camera blind spots, transparent glass boundaries, and darkness.
5. **Hierarchical Reasoning Model (HRM)**:
   - 12D observation tensor evaluating obstacle clearances and category; triggers discrete tactical behaviors (`CRUISE_PROGRESS`, `DECELERATE_PROBE`, `DYNAMIC_YIELD_WAIT`, `LATERAL_CIRCUMVENT_LEFT/RIGHT`, `REVERSE_AND_TURN`, `GLOBAL_REPLAN`).
6. **Dual-Core FreeRTOS Pico Firmware**:
   - Core 0 runs real-time 100 Hz PID motor loops and 50 Hz safety supervision. Core 1 handles non-blocking USB CDC packet communication.
