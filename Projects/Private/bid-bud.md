# bid-bud
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/bid-bud
- **Status**: `Released (gem-bud)`
- **Latest Release Tag**: `gem-bud`

## 🚦 Releases & Release Notes
```text
gem-bud	Pre-release	v0.1.0	2026-05-23T18:19:22Z
```

---

## 📖 README Content

# Bid-Bud V1: Autonomous Bidding Intelligence Engine for GeM Portal

**Bid-Bud** is an asynchronous, highly concurrent bidding intelligence engine for the Indian Government e-Marketplace (GeM). It combines structured PDF/JSON data extraction, real-time bill-of-materials (BOM) pricing, macro-economic commodity sentiment trends, and advanced probability calibration to optimize bid prices for maximum expected profits.

---

## 🚀 Key Features

*   **Decoupled Micro-Worker Architecture:** High-throughput async Rust scraper enqueues payloads to Redis, buffering requests to avoid WAF IP bans and gateway rate limits.
*   **Dual-ML Bidding Core:**
    *   **Calibrated XGBoost Model:** Generates Platt-scaled (sigmoid calibrated) win probabilities across 100 price candidates.
    *   **Contextual Tobit Bandit (Thompson Sampling):** Learns clearing price distributions under left-censorship (lost bids) with a robust multi-stage MLE solver.
*   **Real-time Feature Pipelines:** Calculates real-time spot margins, Cyclical Indian fiscal seasonality index ("March Rush"), and Buyer Department Aggression Scores.
*   **Cloud-to-Local Orchestration:** Seamless sync with Google Drive via `rclone` to train models on free Google Colab runtimes, returning trained artifacts (`.joblib`) locally.
*   **Interactive Rich TUI:** High-fidelity Terminal User Interface with broker health meters, real-time bid activity streams, and an interactive bidding strategy simulator.

---

## 📂 Project Structure

```text
.
├── Cargo.toml          # Rust packaging
├── src/main.rs         # Rust async ingestion engine (Tokio/Reqwest)
├── tasks.py            # Celery workers (LLM parse & XGBoost optimizer)
├── main.py             # Python Rich TUI, CLI & Local training entry point
├── train.sh            # Ingestion, deduplication & Google Drive sync orchestrator
├── generate_notebook.py# Google Colab Notebook auto-generator
├── Colab_Bidding_Model_Training.ipynb # Self-contained Google Colab pipeline
├── src/
│   ├── database/       # SQLite schema manager & seeder
│   ├── scraper/        # Deduplicated Playwright & curl scrapers
│   ├── models/         # Data engineering, XGBoost training, Tobit & RL bandit
│   ├── integration/    # DigiKey, Mouser, Nexar & real-time market trends feeds
│   └── ui/             # Rich terminal user interface
├── tests/              # Pytest test suite (100% green test coverage)
└── docker-compose.yml  # Redis broker infrastructure configuration
```

---

## ⚡ Quick Start

### 1. Initial Setup

Clone the repository and install the requirements:
```bash
pip install -r requirements.txt
npm install -g playwright  # For Playwright integration
python -m playwright install chromium
```

Configure your environment variables in `.env`:
```env
REDIS_URL=redis://localhost:6379/0
NEWS_API_KEY=your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
```

### 2. Start Message Broker

Launch Redis local container:
```bash
docker compose up -d redis
```

### 3. Local Model Seeding & Training

To seed a baseline database (1,000 historical tenders) and train local models:
```bash
python main.py --train
```

### 4. Run Worker Fleet

Launch Celery processing workers:
```bash
PYTHONPATH=. celery -A tasks worker --loglevel=info -Q queue:tender_pdfs,queue:calculate_bid
```

### 5. Launch Ingestion Engine

Run the concurrent Rust scraper:
```bash
cargo run --release
```

### 6. Interactive Dashboard (TUI)

Launch the Bid-Bud Rich Terminal Dashboard:
```bash
python main.py
```

### 7. Run Unit Tests

Verify everything is correct:
```bash
PYTHONPATH=. pytest
```

---

## ☁️ Google Colab Cloud Training Workflow

To offload ML training to Google Colab CPU/GPU runtimes:
1.  Configure `rclone` to point to a Google Drive remote named `drive:`.
2.  Run `bash train.sh`. This seeds your database, scrapes new tenders, filters out duplicates, exports `data/gem_bids.csv`, and syncs it to Drive (`drive:bid-bud/data/`).
3.  Open `Colab_Bidding_Model_Training.ipynb` in Google Colab.
4.  Run all cells. The notebook mounts Google Drive, pre-processes features, trains the calibrated models, and saves the outputs directly to your Drive (`drive:bid-bud/models/`).
5.  Copy model files back to your local repository:
    ```bash
    rclone copy drive:bid-bud/models/ models/
    ```
