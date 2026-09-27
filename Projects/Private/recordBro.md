# recordBro
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/recordBro
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# Cerebellum - Voice Recording & Transcription App

An Android application that provides local AI-powered voice transcription using whisper.cpp, with Obsidian vault integration for note management.

## Features

- 🎤 **Voice Recording**: Record audio directly in the app
- 🤖 **Local AI Transcription**: Uses whisper.cpp for on-device speech-to-text (no internet required)
- 📝 **Obsidian Integration**: Index and search your Obsidian vault markdown files
- 🏷️ **Smart Tagging**: Automatically tag and organize voice notes
- 🔍 **Full-Text Search**: Fast FTS4-powered search across vault content
- 💾 **Room Database**: Persistent storage for voice notes and vault index

## Technical Stack

- **Language**: Kotlin
- **UI**: Jetpack Compose with Material Design 3
- **Database**: Room with FTS4 support
- **AI Engine**: whisper.cpp (C++ native library)
- **Background Tasks**: WorkManager
- **Min SDK**: 26 (Android 8.0)
- **Target SDK**: 34 (Android 14)

## Project Structure

```
recordBro/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── cpp/                    # Native C++ code
│   │       │   ├── whisper.cpp/        # Whisper.cpp submodule
│   │       │   ├── native-lib.cpp      # JNI bridge
│   │       │   └── CMakeLists.txt      # CMake build config
│   │       ├── java/com/example/cerebellum/
│   │       │   ├── MainActivity.kt     # Main UI
│   │       │   ├── ModelManager.kt     # Model download manager
│   │       │   ├── NativeLib.kt        # JNI wrapper
│   │       │   ├── data/               # Database entities & DAOs
│   │       │   └── workers/            # Background workers
│   │       ├── res/                    # Android resources
│   │       └── AndroidManifest.xml
│   └── build.gradle.kts
├── build.gradle.kts
└── settings.gradle.kts
```

## Building the Project

### Prerequisites

1. **Android Studio**: Arctic Fox or newer
2. **Android SDK**: API 34
3. **NDK**: r25 or newer
4. **CMake**: 3.22.1 or newer

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd recordBro
   ```

2. Initialize submodules:
   ```bash
   git submodule update --init --recursive
   ```

3. Open in Android Studio and sync Gradle

4. Build the project:
   ```bash
   ./gradlew build
   ```

## Native Library (JNI)

The app uses three native methods for whisper.cpp integration:

### `loadModel(modelPath: String): Boolean`
Loads a Whisper GGML model file into memory.

**Parameters:**
- `modelPath`: Absolute path to the `.bin` model file

**Returns:** `true` if successful, `false` otherwise

### `transcribeBuffer(samples: FloatArray): String`
Transcribes audio from a float array (for real-time/streaming use).

**Parameters:**
- `samples`: Normalized float audio samples (-1.0 to 1.0)

**Returns:** Transcribed text

### `transcribeFile(wavPath: String): String`
Transcribes audio from a WAV file.

**Parameters:**
- `wavPath`: Absolute path to the WAV file

**Returns:** Transcribed text

**Supported formats:**
- 16-bit or 32-bit PCM WAV
- Mono or stereo (automatically converted to mono)
- Any sample rate (whisper.cpp handles resampling)

## Database Schema

### VoiceNote
```kotlin
@Entity(tableName = "voice_notes")
data class VoiceNote(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val localPath: String,           // Path to audio file
    val transcript: String = "",     // Transcribed text
    val status: String = "PENDING",  // PENDING, PROCESSING, COMPLETED
    val tags: String = "",           // Comma-separated tags
    val createdAt: Long = System.currentTimeMillis()
)
```

### VaultIndex
```kotlin
@Fts4
@Entity(tableName = "vault_index")
data class VaultIndex(
    @PrimaryKey(autoGenerate = true) val rowid: Int = 0,
    val filename: String,
    val headers: String,          // Extracted markdown headers
    val existingTags: String,     // Tags found in the file
    val contentSnippet: String    // First 200 characters
)
```

## Whisper Models

The app supports downloading models from HuggingFace:

- **Tiny Model** (~75 MB): Fast, lower accuracy
  - URL: `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.en.bin`
  
- **Small Model** (~466 MB): Slower, higher accuracy
  - URL: `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.en.bin`

Models are downloaded to the app's external files directory.

## Permissions

Required permissions in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
```

## Development Status

✅ **Completed:**
- Native whisper.cpp integration
- WAV file transcription implementation
- Room database setup with KSP
- Model download manager
- Vault crawler worker
- Basic UI structure
- All resource files and icons

🚧 **In Progress / TODO:**
- Complete Compose UI implementation
- Audio recording functionality
- Transcription result display
- Tag management UI
- Search interface
- Settings screen

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license here]

## Acknowledgments

- [whisper.cpp](https://github.com/ggerganov/whisper.cpp) - High-performance inference of OpenAI's Whisper model
- [OpenAI Whisper](https://github.com/openai/whisper) - Original Whisper model
- [Obsidian](https://obsidian.md) - Knowledge base inspiration

## Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for the Obsidian community**
