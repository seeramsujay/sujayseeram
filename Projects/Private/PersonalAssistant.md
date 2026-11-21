# PersonalAssistant
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/PersonalAssistant
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# Personal assistant 
Excellent. With those constraints clarified—**100% offline, no storage, local-only processing, experimental proof-of-concept**, and **intelligent assistant capabilities over raw speed or usability**—we can design a far more focused and feasible roadmap.

---

## 🧠 Offline EDITH-Like Assistant – Realistic Roadmap (Educational, Privacy-Preserving, Intelligent)

---

### 🎯 Project Goal

Design and build a **fully offline**, **real-time AI assistant** for mobile phones that:

- Listens and sees the world only live (no data retention),
- Makes context-aware decisions locally using fused audio+vision,
- Delegates tasks via **Android app intents**,
- Uses lightweight LLM reasoning with fallback logic,
- Respects privacy and power constraints,
- Operates as a technical proof-of-concept (not end-user ready).

---

### ⚙️ Hardware & System Requirements

|Component|Specification|
|---|---|
|Phone|8+ GB RAM, modern CPU (Snapdragon 865+), Android 11+|
|Bluetooth Audio|TWS earbuds with low-latency codec (aptX/LDAC)|
|OS Permissions|Camera, Microphone, Accessibility, App Control|
|Battery Use|External power or short-term use (dev-mode acceptable)|

---

## 🧱 Architecture Overview

**Modules**:

- **Vision**: OCR + object detection (frame-by-frame, no video saving)
- **Audio**: Real-time STT (Whisper.cpp) + VAD
- **Context Fusion Engine**: Rules + embeddings
- **Local LLM**: Tiny LLM (Phi-2, LLaVA-Mini) for intent/prompt generation
- **App Intenter**: Sends output to apps via Android intents
- **TTS Output**: Local TTS engine, piped to Bluetooth
- **Runtime Controller**: Adaptive loop management for battery and load

---

## 🔄 Data Flow

1. **Camera frame / Audio chunk → Preprocessing**
2. **→ OCR / STT / Object Detection (live only)**
3. **→ Fused into Context Snapshot**
4. **→ LLM processes snapshot → prompt + action**
5. **→ Action: Respond via TTS OR trigger App Intent**

---

## 🧪 Phase-by-Phase Roadmap

### ✅ **Phase 1: Infrastructure Setup (Week 1)**

#### Goals:

- Live camera and mic input
- Bluetooth audio output routing
- Whisper.cpp STT
- OCR with Google MLKit (or Tesseract)
- App Intent handler scaffold

#### Deliverables:

- `camera_service.kt` → captures and feeds image every 2–3 sec
- `audio_service.kt` → low-latency STT pipeline
- `intent_router.kt` → dummy app triggers (`open maps`, `send message`)
- TTS pipeline → route to Bluetooth only

---

### ✅ **Phase 2: Core AI Modules (Week 2-3)**

#### Goals:

- Integrate local LLM (e.g., **Phi-2**, **Gemma 2B**, or **LLaVA mini** if vision-fused)
- Build a **prompt engine** for scenario templating
- Develop **context fusion engine** with:
    - Recent OCR texts
    - Detected objects
    - Recognized speech
    - Light rule-based enhancements (keywords)

#### Deliverables:

- Prompt formatter (context → natural prompt)
- Local LLM runner (Kotlin wrapper using ONNX or GGUF)
- Action classifier: [respond | trigger_app | ignore]

---

### ✅ **Phase 3: App Intent Engine (Week 4)**

#### Goals:

- Configure app-specific intent triggers
- Match user expressions or OCR with available apps
- Examples:
    - “Go to that shop” → Extract name → Maps intent
    - “Remind me tomorrow” → Calendar intent
    - “That medicine is fake” → Alert via TTS

#### Deliverables:

- `intent_matcher.json`: simple intent-to-app database
- `intent_launcher.kt`: securely trigger intents
- Add user-configurable bindings (terminal YAML is fine)

---

### ✅ **Phase 4: Interaction Layer (Week 5)**

#### Goals:

- Context-aware TTS output
- Volume modulation via ambient audio + VAD
- Implement whisper, pause, or haptic fallback logic

#### Deliverables:

- `tts_manager.kt` with mode: [LOUD, WHISPER, SILENT]
- Use accelerometer/light sensor for "active use" detection
- Implement context rules: “someone speaking to me” → whisper

---

### ✅ **Phase 5: Optimization & Polishing (Week 6)**

#### Goals:

- Reduce compute load with model quantization (INT8)
- Add visual toggles for live debugging
- Improve fallback strategies
- Implement `App Override Mode` – e.g., always use Maps for place names

---

## 🧠 Intelligence Blueprint (Local LLM Usage)

|Input Type|Transforms|LLM Usage|
|---|---|---|
|OCR (shop signs)|Named entity extraction|Location-based prompt|
|STT (commands)|Intent recognition, clarification|Action decision / fallback handling|
|Object detection|Scene awareness, contextual biasing|Prompt enhancer for reasoning|
|Temporal context|Recent actions summary|Memory simulation (non-persistent)|

---

## 🔐 Privacy & Power Notes

|Concern|Mitigation|
|---|---|
|Audio storage|Only raw stream to VAD + Whisper, no logs|
|Video storage|None – frames dropped after inference|
|Cloud|None used – offline LLM, OCR, STT only|
|Power drain|Adaptive sampling, model sleep strategy|
|Fallback|Hard-off switch or UI toggle|

---

## 🔧 Tools You’ll Likely Use

- **Android NDK + Termux** for Whisper.cpp
- **ONNX Runtime Mobile / GGUF loader** for LLMs
- **TFLite or OpenCV Lite** for object detection
- **Local TTS**: RHVoice, Flite, or Coqui TTS (on-device)
- **Simple UI** (optional): Toggle switch, logs, error alerts

---

## Example Use Case Flow

🧠 **Situation**: You're walking past a pharmacy, and a voice mentions a medicine.

1. Assistant captures the **OCR**: “Astrazeneca Covishield”
2. **STT**: “Does this still work against new variants?”
3. Local LLM:
    - Generates prompt: “Is Covishield effective against new variants?”
    - Can't answer? → Triggers health app with query pre-filled.
4. Whisper-level TTS: “Check official site. I’ve opened it for you.”
5. Assistant returns to passive listening.

---

## 🚀 Closing Thoughts

This version is:

- **Self-contained** ✅
- **Respectful of privacy** ✅
- **Hardware-efficient for modern devices** ✅
- **Truly experimental and educational** ✅

If you want, I can generate a full code skeleton or directory structure for Week 1. Or start with the `camera + STT + TTS + app intent` baseline module?

