# ytp
- **Visibility**: Public
- **Repository URL**: https://github.com/seeramsujay/ytp
- **Status**: `Released (v1.2.0 - Video Title Listing (--list-videos))`
- **Latest Release Tag**: `v1.2.0 - Video Title Listing (--list-videos)`

## 🚦 Releases & Release Notes
```text
v1.2.0 - Video Title Listing (--list-videos)	Latest	v1.2.0	2026-08-08T14:52:30Z
```

---

## 📖 README Content

# ytp — YouTube Playlist Downloader CLI

`ytp` is a lightweight, user-friendly wrapper script for [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) designed to simplify downloading YouTube playlists and videos by index range, shortcut aliases, or custom format codes.

---

## ✨ Features

- **Stream-friendly `aria2c` Integration**: Automatically leverages `aria2c` with `--no-part` so it pre-allocates the complete target media file directly (with a temporary `.aria2` control file), allowing media players to stream and play the file while downloading.
- **Playlist Alias Saving**: Save long playlist URLs under custom shortcut names (`ytp --save <url> <name>`) so you never have to search for or copy-paste playlist links again.
- **Video Title Listing**: Quickly list video titles in a playlist without downloading using `ytp --list-videos <url_or_alias> [range]`.
- **Format Inspection**: Quickly list available video and audio format codes for any playlist or video using `ytp -F <url_or_alias>`.
- **Flexible Index Ranges**: Download single items (`7`), sub-ranges (`3-6`), custom lists (`1,3,5`), or entire playlists (`all` or `1-`).
- **Clean Naming Convention**: Automatically formats downloaded files with padded index numbers (e.g., `01 - Video Title.mp4`).
- **Built-in Help Screen**: Interactive colored help page available via `ytp --help` or `ytp -h`.

---

## 🛠️ Prerequisites

Make sure you have [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) installed and available in your `PATH` or environment:

```bash
# Install via pip
pip install -r requirements.txt
# or: pip install yt-dlp

# Or install via package manager (Ubuntu/Debian/Linux Mint)
sudo apt update && sudo apt install yt-dlp
```

> **Note**: `ytp` automatically detects and uses `uv run yt-dlp` if `uv` is available, seamlessly passing `--cookies-from-browser=chrome` and `--remote-components ejs:github` to handle modern YouTube JS challenges and bot restrictions.

### ⚡ Recommended (For Stream-like Playback While Downloading)

Install `aria2` to enable sequential streaming playback while downloading:

```bash
sudo apt install aria2
```

---

## 🚀 Quick Start & Installation

1. **Clone or navigate to the project directory:**
   ```bash
   git clone https://github.com/your-username/ytp.git
   cd ytp
   ```

2. **Make the script executable:**
   ```bash
   chmod +x ytp
   ```

3. *(Optional)* **Add `ytp` to your system PATH for global access:**
   ```bash
   mkdir -p ~/.local/bin
   ln -s "$(pwd)/ytp" ~/.local/bin/ytp
   ```
   *(Ensure `~/.local/bin` is in your `$PATH`)*

---

## 📖 Usage Syntax

```bash
ytp <url_or_alias> [range] [format]
```

### Options & Subcommands

| Command / Flag | Description |
| :--- | :--- |
| `ytp <url_or_alias> [range] [format]` | Download playlist items (default format: `18`, automatically uses `aria2c` if available). |
| `ytp --no-aria2` \| `ytp --native` | Bypass `aria2c` and use `yt-dlp` native downloader. |
| `ytp --aria2` | Force using `aria2c` downloader (exits with error if missing). |
| `ytp --cookies <browser>` | Specify browser for cookies (e.g. `--cookies chrome` or `--cookies firefox`). |
| `ytp --no-cookies` | Disable browser cookie extraction. |
| `ytp --save <link> <alias_name>` | Save a playlist URL under a shortcut alias name. |
| `ytp --list-saved` | Display all saved playlist aliases and their stored URLs. |
| `ytp --remove <alias_name>` | Delete a saved playlist alias. |
| `ytp -V` \| `ytp --list-videos <url_or_alias> [range]` | List titles of videos in a playlist without downloading. |
| `ytp -F` \| `ytp --list-formats <url_or_alias>` | List all available format codes for the target playlist/video. |
| `ytp -h` \| `ytp --help` | Show the interactive help page. |
| `ytp -v` \| `ytp --version` | Display version information. |

---

## 💡 Examples

### 1. Save a Playlist for Easy Access

Instead of finding and pasting the URL every time:
```bash
ytp --save "https://www.youtube.com/playlist?list=PLabc123456789" mysongs
```

List your saved playlists anytime:
```bash
ytp --list-saved
```

### 2. Download Items Using a Saved Alias

Download items 1 through 5 from your saved playlist (default format `18` / 360p MP4, accelerated with `aria2c` if present):
```bash
ytp mysongs 1-5
```

Download a single item using the native downloader explicitly:
```bash
ytp --no-aria2 mysongs 7
```

Download all remaining items from item #5 onwards:
```bash
ytp mysongs 5-
```

### 3. List Video Titles in a Playlist

Print video titles without downloading (all or range):
```bash
ytp --list-videos mysongs
```
or for a specific range:
```bash
ytp --list-videos "https://www.youtube.com/playlist?list=PLabc123456789" 1-10
```

### 4. List Available Format Codes

Inspect available qualities and codecs (e.g. 720p, 1080p, audio-only):
```bash
ytp -F mysongs
```
or with a direct URL:
```bash
ytp -F "https://www.youtube.com/playlist?list=PLabc123456789"
```

### 5. Download with a Custom Format Code

Pass a custom format code (e.g. `22` for 720p MP4 or `bestvideo+bestaudio/best`):
```bash
ytp mysongs 1-5 22
```

---

## 📁 Storage Location

Saved playlist aliases are stored in `$XDG_CONFIG_HOME/ytp/playlists` (defaults to `~/.config/ytp/playlists`).

---

## 📄 License

Distributed under the MIT License. Feel free to modify and use!

