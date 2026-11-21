# oneWheel
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/oneWheel
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

Okay, acknowledging the budget constraint and the decision to proceed with the DIY 6-step ESC approach using your existing code structure is important. This path is significantly more challenging for achieving smooth balance compared to using a VESC, but let's outline the steps and required components.

Disclaimer: This remains a complex and potentially dangerous project. Building and testing high-power electronics carries risks of component failure, fire, and injury from falls. Proceed with extreme caution and prioritize safety at every step. This is not a beginner project.

Step-by-Step Plan:

Phase 1: Hardware Procurement and Assembly

Shopping: Purchase all necessary components from the list below. Double-check ratings, especially for voltage and current.

Power Stage PCB Design (Highly Recommended): Design and order a custom PCB for the MOSFETs, gate drivers, current sensor, decoupling capacitors, and connectors. Proper layout is crucial for high-power switching to minimize noise and inductance. Using perfboard/stripboard for this power stage is strongly discouraged due to safety and performance risks.

Assemble Power Stage: Carefully solder the components onto your PCB (or attempt assembly on a very robust perfboard if you absolutely must, but be aware of the risks). Pay close attention to MOSFET orientation, gate driver connections, and ensuring good solder joints for high-current paths. Add heatsinks to the MOSFETs.

Assemble Sensor Circuits: Build the voltage divider for battery sensing and the FSR circuits for footpads on a separate, low-power section of your PCB or on a separate perfboard.

Mount Components: Securely mount the ESP32, IMU (MPU6500), the assembled Power Stage PCB, battery, BMS, and motor within your frame. Ensure good electrical isolation between high-power and low-power sections.

Wiring:

Use appropriately thick gauge wire (e.g., 12-14 AWG) for all high-power connections (Battery -> BMS -> Power Stage -> Motor Phase Wires). Keep these wires as short as possible.

Use standard jumper wires or thinner gauge wire for signal connections (ESP32 -> Gate Drivers, ESP32 -> IMU, ESP32 -> Hall Sensors, ESP32 -> FSRs, ESP32 -> Battery Sense). Route signal wires away from high-power wires.

Use high-current connectors (XT60/XT90) for battery and motor connections.

Ensure Hall sensor wires from the motor are correctly connected to the ESP32 input pins (hall_isr.c).

Connect the MPU6500 (SCL, SDA, VCC, GND) to the ESP32 I2C pins (imu_driver.c).

Connect the FSRs to ESP32 ADC pins.

Connect the battery voltage divider output to the ESP32 ADC pin (main_c.txt).

Connect the Power Stage PCB's phase outputs (A, B, C) to the motor phase wires.

Connect the ESP32 PWM output pins (motor_driver_h.txt - PHASE_A_HI/LO etc.) to the input pins of your gate driver ICs on the Power Stage PCB.

Connect the current sensor output from the Power Stage PCB to the ESP32 ADC pin (motor_driver_h.txt - CURRENT_SENSE_PIN).

Phase 2: Software Implementation (Fill the Gaps)

Develop Missing Modules: Write the C code for the modules referenced in main_c.txt but not provided:

sensor_fusion.c/.h: Implement a Complementary filter (simpler) or Kalman filter (more complex) using data from imu_data_queue to calculate pitch/roll angles and rates, sending results to attitude_queue.

control_loop.c/.h: Implement a PID controller reading from attitude_queue, calculating the required motor duty_cycle and direction based on pitch angle error, and sending motor_command_t structs to esc_command_queue.

safety.c/.h: Implement logic to read FSRs (rider detection), read battery voltage (ADC), check pitch/roll limits against attitude_data_t, and manage the overall system state (e.g., IDLE, BALANCING, FAULT). Only allow motor commands if rider detected and system is safe.

telemetry.c/.h: (Optional but Recommended) Implement basic BLE or Serial output to send telemetry_data_t for debugging.

config.c/.h: Implement basic NVS loading/saving for PID gains and calibration data if needed.

overcurrent_isr.c/.h: Complete the current sensing ADC reading and implement the overcurrent check logic based on your chosen sensor/circuit. Decide on the action (set fault flag vs. hardware trip).

Refine Existing Modules: Make necessary adjustments identified previously (MPU6500 WHO_AM_I, LiFePO4 voltage thresholds, Hall sensor pole pairs/logic, current sensor scaling).

Phase 3: Incremental Testing (CRITICAL)

Power Stage Basic Test (Low Voltage!): Before connecting the 24V battery, power the ESP32 via USB. Test basic communication: Can the ESP32 read the IMU? Can it read the Hall sensors (by manually turning the motor)? Can it read ADC values from the (unconnected) FSR inputs and battery voltage input?

Gate Driver Test (Low Voltage!): Still without the 24V connected, use an oscilloscope to check the output signals from the ESP32 PWM pins and the output signals from the gate driver ICs going to the MOSFET gates. Ensure they are switching correctly, have the right voltage levels, and that the dead time is present.

Motor Spin Test (CAUTION!):

Secure the motor firmly. Keep hands and objects clear. Wear safety glasses.

Connect the 24V LiFePO4 battery through a fuse (e.g., 20A) for initial testing.

Write simple test code (or modify task_esc_pwm_loop) to bypass the PID control and manually set a very low duty cycle (e.g., 0.1) using motor_set_duty.

Power on. Does the motor attempt to spin or hum? Check Hall sensor readings and the motor_update_commutation function. Does it commutate correctly as you slowly turn the motor by hand?

Carefully try increasing the duty cycle slightly. Monitor motor temperature and current (if sensing is working). Do NOT run unloaded at high speed for long.

Test both forward and reverse directions.

Troubleshooting: If it doesn't spin, check wiring, Hall sequence, gate signals, MOSFETs. This is a common point of failure.

IMU & Fusion Test: Run the ESP32 with the IMU. Use Serial Plotter or basic telemetry to view the calculated pitch/roll angles from your sensor_fusion task. Tilt the board. Are the angles stable, responsive, and reasonably accurate? Calibrate IMU offsets (imu_set_offsets).

PID Logic Test (No Motor): Feed simulated angle data into your pid_control task. Monitor the output motor_command_t sent to the esc_command_queue. Does the output make sense (e.g., positive duty cycle for forward tilt, negative for backward)?

Safety Logic Test: Test the FSR rider detection. Test the tilt angle limits. Test battery voltage cutoffs (by simulating low voltage if necessary). Test the emergency stop.

Phase 4: Integration and Balancing Test (EXTREME CAUTION!)

Initial Integration: Combine all software modules.

Build a Test Rig: Construct a stable rig that holds the board upright but allows it to pivot freely along the pitch axis. This prevents it from falling over completely during initial tuning.

PID Tuning (The Hard Part):

Enable the full system on the test rig.

Start with very low PID gains (Kp, Ki, Kd). Set Ki and Kd to zero initially.

Gradually increase Kp until the board starts to oscillate or react noticeably to tilt.

Introduce Kd to dampen oscillations and improve responsiveness.

Carefully introduce Ki to eliminate steady-state error (drift).

This requires patience and many iterations. The 6-step control will likely make tuning harder and the result less smooth than FOC. Aim for basic stability first.

First Free Balancing Attempts: Only attempt this when reasonably confident from the test rig, in a clear open area, wearing full protective gear (helmet, wrist guards, knee/elbow pads). Start with very short durations. Have a spotter if possible. Expect falls.

Refinement: Adjust PID gains, safety thresholds, and potentially motor control parameters based on ride testing.

Shopping List (Based on DIY 6-Step ESC Approach):

Power Stage Components:

MOSFETs (6x): N-Channel MOSFETs. Rating: >40V (60V recommended for margin on 24V system), >30A continuous current (higher is better, e.g., 50A+), Low Rds(on). Logic Level Gate is NOT sufficient here due to high-side driving. (e.g., IRFB4110, IRF3205 - check datasheets carefully).

MOSFET Gate Drivers (3x): Half-bridge drivers capable of driving N-channel high-side and low-side MOSFETs from logic-level inputs. Must handle >24V supply. (e.g., IR2104, IR2110, DRV8301/DRV8302 - DRV series are more integrated but complex).

Bootstrap Diodes (3x): Fast switching diodes for the gate driver bootstrap circuit (often integrated in drivers like IR2104, check datasheet). (e.g., UF4007).

Bootstrap Capacitors (3x): Capacitors for the gate driver bootstrap circuit (e.g., 0.1uF - 1uF ceramic, check gate driver datasheet).

Gate Resistors (6x): Small resistors (e.g., 10-47 Ohm) placed close to each MOSFET gate (check gate driver datasheet recommendations).

Pull-Down Resistors (6x - optional but good practice): Resistors (e.g., 10k Ohm) from MOSFET gate to source to ensure they stay off if the driver signal is floating.

Bulk Capacitor (1x): Large electrolytic capacitor across the main 24V input. Rating: >35V (50V recommended), Low ESR, high capacitance (e.g., 1000uF or more).

Bypass Capacitors (Several): Ceramic capacitors (e.g., 0.1uF, 1uF) placed near gate driver VCC pins and across the main 24V input.

Heatsinks (At least 3x, maybe 6x): Suitable heatsinks for your chosen MOSFET package (e.g., TO-220). Thermal compound needed.

Sensing Components:

Current Sensor (1x):

Option 1 (Recommended): Low-value Shunt Resistor (e.g., 1-5 milliOhm, rated for high power) + Operational Amplifier (e.g., INA240, or build a difference amplifier with a standard op-amp like LM358/MCP6002 - needs careful design).

Option 2 (Easier but slower/less accurate for control): Hall Effect Sensor Module (e.g., ACS712-20A or 30A - Verify output voltage range is compatible with ESP32 ADC or use a voltage divider).

Voltage Divider Resistors (2x): Resistors to create a voltage divider to safely measure battery voltage (~30V max) with the ESP32's 3.3V ADC. (e.g., 10k and 1k Ohm would give a ~1/11 ratio - calculate carefully).

Force Sensitive Resistors (FSRs) (2x): Suitable size/shape for footpads. (e.g., Square FSRs).

Pull-down Resistors for FSRs (2x): Resistors (e.g., 10k Ohm) to form a voltage divider with the FSRs for reading with ADC.

Microcontroller & IMU:

ESP32 Development Board (1x): If you don't have one already (e.g., ESP32-DevKitC).

MPU6500 Module (1x): Breakout board with the MPU6500 chip.

Connectors & Wiring:

High Current Connectors (2-3 pairs): XT60 or XT90 connectors for Battery and Motor.

High Power Wire: 12 AWG or 14 AWG wire (Silicone insulation recommended) in Red and Black.

Signal Wire: Assorted colors of jumper wires or 22-26 AWG wire.

Fuse Holder & Fuse (1x): In-line fuse holder and appropriate fuse (e.g., 20A or 25A ATO/ATC fuse) for initial testing and protection.

Power Switch (1x): High-current rated switch or an Anti-Spark connector (e.g., XT90-S) if your BMS doesn't handle pre-charge.

Mechanical & Miscellaneous:

Frame/Chassis Materials: Wood, Aluminum, etc.

Wheel/Tire: Compatible with your 350W Hub Motor.

Hub Motor (1x): 24V, 350W Brushless Hub Motor with Hall Sensors.

LiFePO4 Battery Pack (1x): 8S (~24V) LiFePO4 pack with suitable capacity and discharge C-rating (>15A continuous, >30A peak recommended).

BMS (1x): 8S LiFePO4 BMS rated for your battery and required discharge current. With balancing function.

LiFePO4 Charger (1x): Charger specifically for 8S LiFePO4.

PCB (Optional but Recommended): Blank copper clad board if etching, or PCB manufacturing service.

Perfboard/Stripboard: If not using a custom PCB (use high-current rated versions if possible).

Hardware: Screws, nuts, bolts, standoffs.

Tools: Soldering iron, solder, multimeter, oscilloscope (highly recommended), wire strippers/cutters, safety glasses.

Protective Gear: Helmet, wrist guards, knee/elbow pads.

This list covers the essentials to bridge the gap between your code and a functioning (but challenging to balance) device. Good luck, and please prioritize safety above all else.
