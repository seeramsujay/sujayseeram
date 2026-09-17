# 🎙️ Sujay Seeram: Cyber-Physical Systems & Physics-Informed Design

👋 Hi, I am **Sujay Seeram** (Suzaykid). I am an Electronics and Communication Engineering student at Amrita Vishwa Vidyapeetham, specializing in resource-constrained cyber-physical systems, embedded hardware design, and physics-informed computing.

---

## ⚡ The Philosophy: Extreme Economic Engineering

I apply physics first principles to build highly economical, hardware-optimized devices and algorithms. I believe in maximizing system capabilities while minimizing physical component counts and computational overhead.

```
       [ Mathematical Theory & Physics First Principles ]
                             │
                             ▼
     [ Economical Hardware: Minimalist Component Budgets ]
                             │
                             ▼
    [ Sovereign Intelligence: Low-Compute Local Frameworks ]
```

---

## 🎯 Primary Focus Areas

- **Physics-Informed Computing**: Embedding dynamical physical models directly into neural network structures, generative VAE models, and local control loops.
- **Embedded Hardware & Microcontrollers**: Constructing sensor integrations, biometric rings, automatic spot welders, and Esp32-based voice satellites.
- **Sovereign Local Systems**: Architecting local document retrieval engines (RAG) and API gates designed to execute on lightweight, non-GPU host machines.

---

## 🛠️ Selected Space Repositories

| Repository | Scope | Core Stack |
| :--- | :--- | :--- |
| **[Slingshot](https://github.com/seeramsujay/slingshot)** | Adaptive Urban Dust Mitigation Framework | Python, Scikit-Learn, FastAPI |
| **[EVolvAI](https://github.com/seeramsujay/EVolvAI)** | Physics-Informed Generative EV Demand Pipeline | PyTorch, Streamlit, Genetic GA |
| **[specRAG](https://github.com/seeramsujay/specRAG)** | Zero-Hallucination Firmware Auditing Gateway | SQLite, local-rag, Python |
| **[smartRing](https://github.com/seeramsujay/smartRing)** | Open-Source Biometric Hardware Interface | ESP32, Low-Power C++, I2C |
| **[healthcare-android-ai](https://github.com/seeramsujay/healthcare-android-ai)** | Unified Medical Screening Architecture | FastAPI, TFLite, Flutter |

---

## 🚀 Quickstart & Project Automation

This repository includes an automated portfolio management pipeline ([`manage_projects.py`](file:///home/suzaykid/Projects/sujayseeram/manage_projects.py)) that reconciles GitHub repositories, generates AI descriptions with Gemini, and synchronizes [`projects_db.json`](file:///home/suzaykid/Projects/sujayseeram/projects_db.json) and [`index.html`](file:///home/suzaykid/Projects/sujayseeram/index.html).

### 📦 Setup & Dependency Management

The project uses modern, reproducible packaging supporting both [**uv**](https://github.com/astral-sh/uv) and standard **pip**:

- **[`pyproject.toml`](file:///home/suzaykid/Projects/sujayseeram/pyproject.toml)**: Standard PEP 517/621 project specification with `google-genai` and `google-generativeai`.
- **[`uv.lock`](file:///home/suzaykid/Projects/sujayseeram/uv.lock)**: Deterministic, pinned lockfile for instantaneous environment reproduction.
- **[`requirements.txt`](file:///home/suzaykid/Projects/sujayseeram/requirements.txt)**: Fallback compatibility for traditional pip virtual environments.
- **[`.env.example`](file:///home/suzaykid/Projects/sujayseeram/.env.example)**: Starter configuration template for environment variables.

#### Option A: Using `uv` (Recommended)
```bash
# Clone the repository
git clone https://github.com/seeramsujay/sujayseeram.git
cd sujayseeram

# Sync virtual environment directly from lockfile
uv sync
```

#### Option B: Using Standard `pip`
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

### ⚙️ Configuration (Optional)

Copy the template environment file:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | *(Optional)* Used for AI analysis of repository READMEs and auto-tagging. If not provided, repository defaults are used. | `None` |
| `GITHUB_USERNAME` | *(Optional)* GitHub account handle to query public repositories from. | `seeramsujay` |

---

### 🛠️ Portfolio Manager Pipeline (`manage_projects.py`)

Launch the interactive Terminal UI (TUI):
```bash
# With uv
uv run manage_projects.py

# Or with activated venv
python3 manage_projects.py
```

#### Key Capabilities & Fault Tolerance:
- **No Startup Crash**: Operates smoothly without a `GEMINI_API_KEY` for browsing, reviewing, and toggling visibility of existing projects.
- **Dual SDK Support**: Uses modern `google-genai` with fallback to `google-generativeai` and multi-model fallbacks (`gemini-3.1-flash-lite`, `gemini-2.5-flash`, `gemini-2.0-flash`).
- **Graceful GitHub CLI Fallback**: If `gh` is missing, unauthenticated, or offline, the tool warns gracefully and continues using existing records in [`projects_db.json`](file:///home/suzaykid/Projects/sujayseeram/projects_db.json).
- **Self-Contained DB Recovery**: If `projects_db.json` is missing, it automatically extracts and reconstructs the database directly from [`index.html`](file:///home/suzaykid/Projects/sujayseeram/index.html).

#### TUI Keyboard Controls:
- `Up` / `Down` or `k` / `j`: Navigate repository list
- `[p]`: Set to **Public** (displayed on main timeline with GitHub link)
- `[v]`: Set to **Private** (displayed on main timeline without GitHub link)
- `[a]`: Set to **Archive** (moved to the Vault section)
- `[d]`: Set to **Nuked** (opted-out / hidden completely)
- `[s]`: Save changes, commit to `projects_db.json`, and inject into `index.html`
- `[q]`: Quit without saving

---

### 🧪 Verifying Gemini API (`test_gemini_api.py`)

Test your Google Gemini connection and key validity:
```bash
uv run test_gemini_api.py
# Or pass key directly:
uv run test_gemini_api.py YOUR_API_KEY
```

---

## 🛡️ Licensing & Privacy Safeguards

This repository, its layouts, and all associated personal portfolio contents operate under strict digital sovereignty covenants.

> [!CAUTION]
> **Prohibitions on AI Training & Scraping**
> All original materials in this repository are licensed under the **Personal Content and Privacy Protection License (PCPPL)**.
> - **NO Ingestion**: Ingestion of these layouts, text, code, or assets to train, fine-tune, or validate machine learning models (including LLMs) is strictly prohibited.
> - **NO Scrapers**: Automated crawling, harvesting, scraping, or indexing by scripts, spiders, or bots is banned.
> - **Portfolio Use Only**: Human review for recruiter or portfolio evaluation purposes is welcome.

---

## 📬 Connection Coordinates
- **Email**: `sujayat2007@gmail.com`
- **Identity**: Suzay / Tubelight / Professional Larper
