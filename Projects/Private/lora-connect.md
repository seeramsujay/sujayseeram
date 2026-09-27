# lora-connect
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/lora-connect
- **Status**: `Released (v0.1.0-pre: Checkpoint State Before Clean Rebuild)`
- **Latest Release Tag**: `v0.1.0-pre: Checkpoint State Before Clean Rebuild`

## 🚦 Releases & Release Notes
```text
v0.1.0-pre: Checkpoint State Before Clean Rebuild	Pre-release	v0.1.0-pre	2026-08-18T19:11:40Z
```

---

## 📖 README Content

# LoRa Vehicle Telemetry System
A completely offline, subscription-free Point-to-Point LoRa telemetry link between a smartphone and a vehicle. 

Cellular IoT modules fail in underground garages and trap users in monthly fees. This system utilizes a custom USB-C RP2040 dongle to establish an encrypted, direct 915MHz link to an ESP32 integrated into the vehicle's CAN bus, achieving sub-mA standby current and bypassing Apple's MFi restrictions via CDC-NCM.

## Prototyping Phase (Phase 0 MVP)
To establish fast proof-of-concept validation, the system initiates with maker-friendly components:
- **Mobile Node (Proxy):** ESP32 DevKit V1 + Ai-Thinker RA-01 (SX1278 433MHz) with a Bluetooth Low Energy (BLE) interface for the smartphone app.
- **Vehicle Node (MVP):** ESP32 DevKit V1 + Ai-Thinker RA-01 (SX1278 433MHz) acting as the receiver and controlling direct GPIOs (such as an LED indicating lock/unlock state).

## Install
```bash
git clone https://github.com/user/lora-telemetry
cd lora-telemetry
# Flash the ESP32 Mobile Node (MVP BLE Proxy)
pio run -e mobile_esp32_mvp -t upload
# Flash the ESP32 Vehicle Node (MVP)
pio run -e vehicle_esp32_mvp -t upload
```

## Usage (Phase 0 BLE)
Connect your mobile app to the Mobile Node's BLE interface, then dispatch command payloads to trigger LoRa broadcasts.

## How It Works

### MVP Prototype Architecture (Phase 0)
```text
[ iOS/Android App ]
       │ (Bluetooth Low Energy)
[ ESP32 Mobile Proxy + RA-01 ]
       │ (433MHz LoRa P2P)
[ ESP32 Vehicle Node + RA-01 ]
       │ (GPIO Dummy Triggers / LED)
[ Status Indicators ]
```

### Production Architecture
```text
[ iOS/Android App ]
       │ (USB-C CDC-NCM / TCP Sockets)
[ RP2040 Dongle + SX1262 ]
       │ (915MHz LoRa + ASCON AEAD)
[ ESP32 + SX1262 (CAD Sleep) ]
       │ (TWAI Listen-Only)
[ Vehicle CAN Bus ]
```

## Status
Active development. Phase 0 MVP using ESP32 DevKit V1 and Ai-Thinker RA-01 (SX1278) is defined for immediate physical and software logic prototyping.
