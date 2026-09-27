# maildigest
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/maildigest
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# 📬 MailDigest: Vector-Driven Email Intelligence Pipeline

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-brightgreen.svg)](https://www.python.org/)
[![Vector Filter Engine](https://img.shields.io/badge/Engine-mbsync--vector--filter-orange.svg)](DOCS_EMAIL_VECTOR.md)

**MailDigest** is a privacy-first, zero-daemon, ultra-lightweight local AI email filter, multi-provider synchronization engine, and daily briefing system for Linux. It directly connects to popular email providers (Gmail, Outlook, Fastmail, Yahoo, iCloud, IMAP), fetches messages into local Maildirs, segregates emails into intelligent category folders using sub-millisecond $L_2$-normalized vector dot-products ($S = \mathbf{M} \cdot \mathbf{q}$), and generates battery-included **NeoMutt** configurations with interactive sidebars and automation macros.

---

## 🏗️ System Architecture & Pipeline

```
  [ Mail Providers ]  --->  (Gmail, Outlook, Fastmail, Yahoo, iCloud, IMAP)
          |
          v  Direct IMAP/SSL Sync or mbsync (~/.mail/<account>/)
  [ Maildir Folders ] --->  INBOX / Results / Internships / Hackathons / Orders / 2FA / Noise
          |
          v  (maildigest segregate / hooks)
  [ Maildir Extractor ]---> Isolates From, Subject, & first 300 body chars (<5ms)
          |
          v
  [ Vector Engine ]   --->  ONNX CPU Execution (BAAI/bge-small-en-v1.5, <50MB RAM)
          |                 Generates 384-dim unit-normalized vector q
          v
  [ Matrix Matcher ]  --->  Sub-millisecond Dot Product: S = M @ q
          |
          +---> Score >= 0.70 (Critical) ---> notify-send -u critical "🚨 [Priority Email]"
          +---> Score >= 0.58 (Normal)   ---> notify-send -u normal   "📧 [Email]"
          +---> Score < 0.45  (Noise)    ---> Move to Newsletters/, Promotions/, or Spam/
          |
          v
  [ NeoMutt Setup ]   --->  Auto-generated Sidebar, Dynamic Mailboxes, Multi-Account Hooks & Macros
```

---

## ✨ Key Features

- **⚡ Sub-Millisecond Similarity Engine**: Computes vector dot-products ($S = \mathbf{M} \cdot \mathbf{q}$) in $<0.1\text{ms}$ per email against pre-compiled `.npy` matrices cached in `/dev/shm/email_processing/`.
- **💻 Ultra-Lightweight ONNX CPU Runner**: Uses FastEmbed with `BAAI/bge-small-en-v1.5` strictly under **50 MB RAM** on standard CPUs without requiring PyTorch, CUDA, or NVIDIA GPUs.
- **🔄 Multi-Provider Mail Sync**: Built-in direct IMAP/SSL client with presets for **Gmail**, **Outlook/Office365**, **Fastmail**, **Yahoo**, **iCloud**, and custom IMAP servers.
- **📁 Folder Management**: Query local Maildirs or remote IMAP mailboxes, inspect message/unread counts, and create new folders locally and on remote servers.
- **🏷️ Intelligent Email Segregation**: Automatically sorts incoming emails into 11 distinct intent profiles:
  - 🎓 **Results & Certificates** (`Results_and_Certificates`)
  - 💼 **Potential Internships** (`Potential_Internships`)
  - 🏆 **Hackathon Requests** (`Hackathon_Requests`)
  - 💻 **Hackathons & Submissions** (`Hackathons_and_Submissions`)
  - 📚 **Academics & University** (`Academics`)
  - 💬 **Personal Correspondence** (`Personal`)
  - 🔐 **Sign-Ups & Passwords (2FA)** (`Sign_Ups_and_Passwords`)
  - 🧾 **Orders & Receipts** (`Orders_and_Receipts`)
  - 📰 **Newsletters** (`Newsletters`)
  - 🏷️ **Promotions** (`Promotions`)
  - 🚫 **Spam Requests** (`Spam_Requests`)
- **🦆 NeoMutt Support**: Auto-generates complete NeoMutt configuration with a modern sidebar, dynamic `named-mailboxes`, account hooks, and built-in hotkey macros (`S` to sync/segregate, `D` for daily digest).
- **📝 Automated mbsyncrc Exporter**: Generates compliant `~/.mbsyncrc` configurations for external `mbsync`/`isync` users.

---

## 🛠️ Setup & Installation

### Prerequisites
- **Python 3.9+**
- **uv** (recommended package manager)
- **libnotify-bin** (optional, for `notify-send` desktop alerts)
- **neomutt** (optional, for terminal email client)

---

### Installation Instructions

```bash
# Clone repository
git clone https://github.com/seeramsujay/maildigest.git
cd maildigest

# Setup virtual environment and editable installation with uv
uv venv
uv pip install -e .
```

---

## 🚀 Usage & CLI Commands

### 1. Account Configuration & Multi-Provider Sync
Register accounts using provider presets (`gmail`, `outlook`, `fastmail`, `yahoo`, `icloud`, `generic`):

```bash
# Add accounts
maildigest accounts add personal --email me@gmail.com --provider gmail --password env:GMAIL_APP_PASS
maildigest accounts add work --email dev@company.com --provider outlook --password env:WORK_PASS

# List configured accounts
maildigest accounts list

# Sync all accounts (or specific account)
maildigest sync
maildigest sync personal --limit 50 --unread-only
```

### 2. Folder Discovery & Creation
Get folder statistics and create new folders locally or remotely:

```bash
# List local Maildir folders and unread counts
maildigest folders list --maildir ~/.mail/personal

# Query remote IMAP folders from server
maildigest folders list --account personal --remote

# Create a new folder locally
maildigest folders create Projects/AI --maildir ~/.mail/personal

# Create a new folder on remote IMAP server (and local Maildir)
maildigest folders create Hackathon2026 --account personal --remote
```

### 3. Intelligent Email Segregation
Automatically classify unsegregated emails in your `INBOX` and sort them into category folders:

```bash
# Dry run: preview classification and destination folders without moving files
maildigest segregate --maildir ~/.mail/personal --dry-run

# Run segregation: safely move emails into category folders
maildigest segregate --maildir ~/.mail/personal

# Segregate only suppressed noise/spam emails
maildigest segregate --maildir ~/.mail/personal --move-noise-only
```

### 4. NeoMutt Support & Configuration Generator
Generate a fully functional NeoMutt setup tailored for multi-account Maildir and AI segregation:

```bash
# Preview generated configuration and mailboxes
maildigest neomutt show

# Write complete setup to ~/.config/neomutt/
maildigest neomutt setup

# Launch NeoMutt with generated configuration
neomutt -F ~/.config/neomutt/neomuttrc
```

#### NeoMutt Shortcuts Included:
- `Ctrl+P` / `Ctrl+N` / `<Up>` / `<Down>`: Navigate folder sidebar
- `Ctrl+O` / `<Right>`: Open selected folder from sidebar
- `Ctrl+B`: Toggle sidebar visibility
- `S`: Sync mail from provider, run AI segregation, and refresh mailbox
- `D`: Generate and display today's Daily AI Digest report
- `F`: Run AI vector segregation on current folder

### 5. Generate Daily Email Digest
Generate structured Markdown summary reports:

```bash
# Generate today's Markdown daily digest report
maildigest digest

# Generate digest for specific Maildir
maildigest digest --maildir ~/.mail/personal
```
*Reports are saved to `output/daily_digest_YYYY-MM-DD.md` and `output/daily_digest.md`.*

### 6. Export `mbsync` Configuration
Generate an `isync`/`mbsync` configuration file:

```bash
maildigest mbsync --output ~/.mbsyncrc
```

---

## 🧪 Testing & Verification

Run the automated test suite with `uv`:

```bash
uv run pytest
```

Output:
```
============================= 15 passed in 10.43s ==============================
```

---

## 📂 Project Structure

- **`maildigest.py`**: Unified CLI supporting `sync`, `accounts`, `folders`, `segregate`, `neomutt`, `digest`, `run`, `parse`, `compile`, and `mbsync`.
- **`imap_sync.py`**: IMAP/SSL synchronization client with provider presets (Gmail, Outlook, Fastmail, Yahoo, iCloud).
- **`folder_manager.py`**: Local and remote folder manager (listing, message counting, creation).
- **`segregator.py`**: Vector-driven email sorter and Maildir organizer.
- **`neomutt_config.py`**: NeoMutt configuration and sidebar generator.
- **`sync_manager.py`**: Multi-account manager and `.mbsyncrc` exporter.
- **`vector_engine.py`**: ONNX FastEmbed CPU vector embedding engine (`BAAI/bge-small-en-v1.5`).
- **`matrix_matcher.py`**: Sub-millisecond matrix-vector dot product similarity matcher.
- **`digest_generator.py`**: Daily email digest markdown briefing generator.
- **`init_maildir_folders.py`**: Synchronizer for category folder hierarchies.
- **`tests/`**: Complete unit and integration test suite (15 tests).

---

## ⚖️ License
This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE](LICENSE) file for details.
