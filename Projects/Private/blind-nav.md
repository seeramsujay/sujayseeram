# blind-nav
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/blind-nav
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# BlindNav 🦯 📱

[![Kotlin](https://img.shields.io/badge/Kotlin-1.9.23-purple.svg)](https://kotlinlang.org)
[![Android](https://img.shields.io/badge/Android-API%2026%2B-green.svg)](https://developer.android.com)
[![Engine](https://img.shields.io/badge/Semantic--Mapping--Engine-v0.1.0-blue.svg)](../Semantic-Mapping-Engine)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)

**BlindNav** is an offline, privacy-first assistive navigation application designed specifically for visually impaired individuals. It integrates visual perception, 3D spatial modeling, 6-DoF indoor localization, and tactile/audio feedback to provide autonomous navigation guidance without relying on GPS or cloud connectivity.

BlindNav is powered by the **[Semantic Mapping Engine](../Semantic-Mapping-Engine)**—a high-performance, zero-allocation Kotlin & Android perception SDK located in the parent directory (`../Semantic-Mapping-Engine`).

---

## 🌟 Key Features

- **Semantic Spatial Intelligence**: Continuously tracks 3D entities (doors, chairs, obstacles, hazards) and builds an on-device topological world model.
- **Hardware-Accelerated YOLO Perception**: Integrated with ONNX Runtime Android for zero-allocation neural object detection and tracking.
- **6-DoF Indoor Localization & Anchors**: Visual and fiducial anchor recognition paired with sensor fusion (IMU + camera) for drift-free indoor positioning.
- **Haptic & Directional Feedback**: Real-time steering guidance via servo-actuated tactile interface (USB Serial/Arduino) and natural clock-face directions (e.g., *"Door at 12 o'clock, 2.5 meters ahead"*).
- **Natural Language Spatial Queries**: Ask natural questions about the surrounding environment (e.g., *"Where is the closest chair?"*) and receive contextual answers.
- **100% Offline & Private**: All ML inference, tracking, and mapping happen locally on the device; no network connectivity required.

---

## 🏗️ Architecture & Semantic-Mapping Engine Integration

```
BlindNav Application (Android / Jetpack Compose)
       │
       ├──► CameraX Frame Stream (RGBA / NV21)
       ├──► IMU Sensors (Orientation / Accelerometer)
       │
       ▼
[ com.semanticengine:semantic-mapping-sdk:0.1.0 ]  ◄── (Engine / SDK)
       │
       ├──► Zero-Allocation AndroidFrameAdapter
       ├──► ONNX Runtime YOLOv8 / Kalman Filter Object Tracker
       ├──► AnchorRegistry & 6-DoF PoseEstimator
       ├──► 3D Semantic Scene Graph & Room Topology
       └──► ContextNavigator & Spatial Query Engine
       │
       ▼
BlindNav NavigationCoordinator
       │
       ├──► Haptic Feedback (USB Serial / Arduino)
       ├──► Text-to-Speech Guidance
       └──► Jetpack Compose Accessibility UI
```

### Importing the Semantic Mapping Engine

The application references the Kotlin SDK via **composite build** and local Maven:

1. **Gradle Composite Build (`settings.gradle.kts`)**:
   Automatically detects and links the engine source code if present at `../Semantic-Mapping-Engine/Engine`:
   ```kotlin
   val engineDir = file("../Semantic-Mapping-Engine/Engine")
   if (engineDir.exists()) {
       includeBuild("../Semantic-Mapping-Engine/Engine") {
           dependencySubstitution {
               substitute(module("com.semanticengine:semantic-mapping-sdk"))
                   .using(project(":"))
           }
       }
   }
   ```

2. **App Dependencies (`app/build.gradle.kts`)**:
   ```kotlin
   dependencies {
       // Kotlin Semantic Mapping Engine Android SDK (< 300 KB)
       implementation("com.semanticengine:semantic-mapping-sdk:0.1.0")

       // ONNX Runtime Android Native AAR
       implementation("com.microsoft.onnxruntime:onnxruntime-android:1.17.1")

       // Coroutines & Android Jetpack
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")
       ...
   }
   ```

---

## 🚀 Getting Started

### Prerequisites

- **Java Development Kit (JDK)**: Java 17+
- **Android Studio**: Hedgehog (2023.1.1) or newer
- **Android SDK**: API 26 (Android 8.0) or higher
- **Semantic Mapping Engine**: Located at `../Semantic-Mapping-Engine`

### Build & Setup

1. **Publish or Verify the Semantic Mapping SDK**:
   If modifying the engine directly, publish the latest SDK artifact to your local Maven cache:
   ```bash
   cd ../Semantic-Mapping-Engine/Engine
   ./gradlew test
   ./gradlew publishToMavenLocal
   ```

2. **Open & Build BlindNav**:
   ```bash
   cd ../blind-nav
   ./gradlew build
   ```

3. **Run on Device / Emulator**:
   Connect an Android device via USB (with Developer Mode & USB Debugging enabled):
   ```bash
   ./gradlew installDebug
   ```

---

## 💻 SDK Usage in BlindNav

### 1. Dependency Injection (`SemanticEngineModule.kt`)

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object SemanticEngineModule {

    @Provides
    @Singleton
    fun provideSemanticEngineSdk(@ApplicationContext context: Context): SemanticEngineSdk {
        val onnxFile = File(context.filesDir, "yolov8n.onnx")
        return if (onnxFile.exists()) {
            SemanticEngineSdk.builder()
                .withConfig(SdkConfig(obstacleSafetyDistance = 1.8f))
                .withOnnxModel(onnxFile.absolutePath)
                .build()
        } else {
            // Mock engine fallback for testing/preview
            SemanticEngineSdk.builder().build()
        }
    }
}
```

### 2. Processing Camera Frames & Obstacle Navigation (`NavigationCoordinator.kt`)

```kotlin
@Singleton
class NavigationCoordinator @Inject constructor(
    private val engineSdk: SemanticEngineSdk
) {
    // Ingest CameraX image analysis buffer directly
    suspend fun onCameraFrame(buffer: ByteBuffer, width: Int, height: Int) {
        val result = engineSdk.processRgbaBuffer(buffer, width, height)
        
        // Immediate collision prevention
        if (result.collisionThreats.isNotEmpty()) {
            val nearestThreat = result.collisionThreats.minByOrNull { it.distance }
            triggerHapticAlert(nearestThreat)
        }
    }

    // Natural spatial query
    fun locateNearestObject(label: String): GuidanceCue? {
        return engineSdk.findNearest(label)
    }
}
```

---

## 📁 Repository Structure

```
blind-nav/
├── app/
│   ├── build.gradle.kts               # Android application configuration & SDK dependencies
│   ├── proguard-rules.pro             # Proguard obfuscation & keep rules
│   └── src/main/
│       ├── AndroidManifest.xml        # Permissions: Camera, USB Host, Audio
│       ├── java/com/suzaykid/blindnav/
│       │   ├── BlindNavApplication.kt # Hilt Application class
│       │   ├── MainActivity.kt        # Main Compose UI entrypoint
│       │   ├── di/
│       │   │   └── SemanticEngineModule.kt # Hilt DI provider for SemanticEngineSdk
│       │   └── domain/navigation/
│       │       └── NavigationCoordinator.kt # Bridges perception SDK with haptic/audio guidance
│       └── res/                       # App resources and USB device filters
├── gradle/wrapper/                    # Gradle wrapper binaries
├── build.gradle.kts                   # Root build script defining plugin versions
├── settings.gradle.kts                # Repositories & composite build linkage to Semantic Engine
└── README.md                          # Project documentation
```

---

## 🗺️ Roadmap & Milestones

- [x] Integrate Kotlin Semantic Mapping Engine SDK (`com.semanticengine:semantic-mapping-sdk:0.1.0`)
- [x] Project scaffolding with Hilt, CameraX, Compose, and Java 17 toolchain
- [x] Real-time ONNX Runtime YOLOv8 inference adapter
- [ ] Hardware Interface: USB Serial Arduino driver with tactile servo steering
- [ ] Voice Interface: Offline on-device Text-to-Speech and speech recognition
- [ ] Spatial Room Anchoring: QR code and visual landmark room mapping UI

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
