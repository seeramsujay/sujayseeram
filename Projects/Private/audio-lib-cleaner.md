# audio-lib-cleaner
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/audio-lib-cleaner
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# Audio Library Cleaner

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

> **Near-Zero Storage Music Library: Automated Metadata Transformation & Streaming Architecture.**

Audio Library Cleaner is a tool for Linux that transforms your heavy, cluttered local music collection into an ultra-lightweight, self-resolving streaming library. Instead of storing multi-gigabyte audio files, the system generates tiny `.song` metadata files that act as high-precision queries for dynamic streaming.

## 🌟 The Vision: Zero Storage, High Quality
Turn a 100GB physical library into a few Megabytes of metadata without losing the "local" feel of your collection. By resolving streams at playback time, your library becomes "self-healing," automatically avoiding dead links or low-quality mirrors.

## 🛠️ Key Features
- **Metadata Indexing**: Generates `.song` files containing Artist, Album, and Title signatures.
- **Hybrid Storage**: Automatically keeps untaggable or rare tracks in their original format to ensure no music is lost.
- **CLI Streaming Engine**: Includes `music.sh`, a high-speed wrapper for `yt-dlp` and `mpv` that streams metadata queries instantly.
- **Folder Preservation**: Mirrors your existing directory structure perfectly in the new lightweight index.

---

## 🏗️ How It Works

1. **Scan**: The system reads the ID3/Vorbis tags of your source library.
2. **Transform**: For every matched song, it writes a tiny text-based `.song` tracker.
3. **Stream**: When you "play" a `.song` file, the engine searches YouTube/Music sources and pipes the high-bitrate stream to `mpv`.

---

## 📂 Project Structure

- `generate_library.py`: Core Python engine for library transformation.
- `music.sh`: The playback and search CLI utility.
- `restore_music.sh`: Utility for reversing the process or managed backups.
- `Archives/`: Project summaries, roadmaps, and historical logs.

## 🚦 Quick Start

### Installation
```bash
git clone https://github.com/user/audio-lib-cleaner
cd audio-lib-cleaner
pip install -r requirements.txt
```
*Dependencies: `yt-dlp`, `mpv`, and `ffmpeg` must be in your PATH.*

### Generate Library
```bash
./generate_library.py /path/to/old/library /path/to/new/metadata/library
```

### Playback
```bash
./music.sh play "/path/to/new/library/Artist/Album/Song.song"
# Or search directly
./music.sh search "Pink Floyd Time"
```

### Restore Library
```bash
./restore_music.sh /path/to/new/metadata/library /path/to/restored/library --format mp3
```

## 📜 License
This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for details.


---

## 🛡️ Licensing & Privacy Protection

Because this repository contains personal code, portfolios, or intellectual property, **strict privacy protections are in place**.

### ⚠️ Prohibitions on AI Training & Scraping
This repository is published for direct human viewing only. Automated data scraping, harvesting, and crawling are strictly prohibited under the author's personal copyright terms.

**By accessing this repository or its contents, you agree to the following terms:**
*   **NO AI/LLM Ingestion:** Any ingestion of code, text, layouts, designs, or assets for training, validation, testing, or tuning of machine learning models, neural networks, or artificial intelligence systems (such as Large Language Models) is strictly prohibited.
*   **NO Automated Data Scraping:** Any automated extraction, parsing, harvesting, or scraping of content by bots, crawlers, scripts, or spiders is prohibited.
*   **Personal Use Only:** Human viewing for personal or educational review is permitted. No duplication, modification, adaptation, or commercial distribution of this work is allowed without express written permission.
