# louder-voice
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/louder-voice
- **Status**: `Released (First release before testing anything)`
- **Latest Release Tag**: `First release before testing anything`

## 🚦 Releases & Release Notes
```text
First release before testing anything	Pre-release	v0.0.1	2026-08-13T09:42:15Z
```

---

## 📖 README Content

# 🏛️ LouderVoice - Civic Synthesis Engine

> **AI-powered legislative middleware transforming raw citizen feedback into structured, actionable policy trees for Parliamentary debate.**

[![Netlify Status](https://api.netlify.com/api/v1/badges/f954b79b-4825-42b5-a51e-2fe578b72be5/deploy-status)](https://app.netlify.com/sites/louder-voice/deploys)
[![Live Site](https://img.shields.io/badge/Netlify-louder--voice.netlify.app-00C7B7?style=flat&logo=netlify)](https://louder-voice.netlify.app)
[![API Status](https://img.shields.io/badge/FastAPI-v2.0.0-009688?style=flat&logo=fastapi)](http://localhost:8000/docs)

---

## 🛠️ System Architecture

```
                           ┌───────────────────────────┐
                           │   Citizen Web / Voice API │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │  WAF / Cloudflare Turnstile│
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │  FastAPI Ingestion Gateway│
                           └─────────────┬─────────────┘
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
      [ Speech-to-Text Pipeline ]                  [ Text Processing Queue ]
      (Web Audio API / Web Speech)                 (Celery + Redis / RabbitMQ)
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │     SLM Parsing Engine    │
                           │  (Qwen-2.5-7B / Llama-3)  │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │ Vector Embedding Pipeline │
                           │   (BAAI/bge-m3 / MiniLM)  │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │   Graph / Vector Storage  │
                           │  (PostgreSQL + pgvector)  │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │   Legislative Dashboard   │
                           │  (reui.io + D3 Claim Tree)│
                           └───────────────────────────┘
```

---

## ✨ Key Features

- 🎙️ **Local Device Microphone Recording:** Captures hardware mic audio with Web Audio API `AnalyserNode` frequency spectrum visualization and real-time Web Speech API transcription (**Hindi**, **English**, **Tamil**, **Telugu**, **Marathi**).
- 🎨 **reui.io Styled Authentication:** Glassmorphic login portal with ambient radial glows, Civil Servant TOTP 2FA (`123456`), DigiLocker/Google OAuth, and API Keycard modes.
- ⚡ **0-LLM Fast-Path Vector Cosine Clustering:** Deduplicates incoming citizen feedback via `pgvector` HNSW index, skipping redundant LLM parsing and incrementing existing policy claim support counts instantly.
- 💻 **Console-Injectable Simulation Engine:** Run high-throughput simulation benchmarks directly from the browser Developer Console without UI button dependencies (`runCivicSimulation(20)`).
- 🗳️ **Interactive Citizen Voting:** Upvote civic proposals with persistent `localStorage` tracking, optimistic UI increments, and toast notifications.
- 🌳 **Policy Claim Tree Visualizer:** Interactive D3.js hierarchical claim graph displaying core root solutions and extension variants for parliamentary review.

---

## ⚡ Quick Startup & Local Development

### 1. Prerequisites
- Python 3.11+
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)

---

### 2. Infrastructure Setup (PostgreSQL + pgvector, Redis, Ollama)

Spin up the local containerized services using Docker Compose:

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL 16** with `pgvector` extension on port `5432`
- **Redis 7** cache/queue on port `6380`
- **Ollama** LLM runner on port `11434`

To pull the recommended local parsing model (optional):
```bash
docker exec -it civic_ollama ollama pull qwen2.5:7b
```

---

### 3. Virtual Environment & Dependency Installation

```bash
# Create Python virtual environment
python3 -m venv .venv

# Activate the virtual environment
# On Linux / macOS:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Upgrade pip and install requirements
pip install --upgrade pip
pip install -r requirements.txt
```

---

### 4. Application Environment Configuration (`.env`)

Create or update the `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/civic_db
REDIS_URL=redis://localhost:6379/0
OLLAMA_HOST=http://localhost:11434
EMBEDDING_MODEL_NAME=BAAI/bge-m3
TURNSTILE_SECRET_KEY=your_turnstile_secret_here
```

---

### 5. Running the Backend Server

Start the FastAPI application with Uvicorn:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Once started, open your browser:
- 👤 **Citizen User Portal:** [http://localhost:8000/](http://localhost:8000/)
- 🔒 **reui.io Login Portal:** [http://localhost:8000/login](http://localhost:8000/login)
- 📊 **Parliamentary Admin Command Center:** [http://localhost:8000/admin](http://localhost:8000/admin) *(Demo TOTP: `123456`)*
- 📖 **Interactive API Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 💻 Console-Injectable Simulation Engine

You can simulate high-throughput citizen feedback traffic directly from your browser's **Developer Console** (`F12` ➔ **Console**):

```javascript
// Ingest 10 synthetic citizen proposals
runCivicSimulation(10)

// Ingest 50 proposals at 300ms intervals
LouderVoiceSim.start({ count: 50, speedMs: 300 })

// Stop active simulation loop
LouderVoiceSim.stop()
```

---

## 🌐 Netlify Deployment Guide

The static frontend (`app/static`) is pre-configured for deployment to **Netlify** at **[louder-voice.netlify.app](https://louder-voice.netlify.app)**.

### Configuration (`netlify.toml`)

```toml
[build]
  publish = "app/static"

[[redirects]]
  from = "/user"
  to = "/user.html"
  status = 200

[[redirects]]
  from = "/admin"
  to = "/admin.html"
  status = 200

[[redirects]]
  from = "/login"
  to = "/login.html"
  status = 200

# Proxy API calls to your hosted FastAPI backend service
[[redirects]]
  from = "/api/*"
  to = "https://your-fastapi-backend.onrender.com/api/:splat"
  status = 200
```

### Deployment Commands (Netlify CLI)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy draft preview
netlify login
netlify deploy

# Deploy directly to production
netlify deploy --prod
```

---

## 📋 Data Schemas & Core API Endpoints

### 1. Submit Proposal (`POST /api/v1/proposals`)
```json
{
  "client_token": "cf_turnstile_response_token",
  "language_code": "hi",
  "raw_input_type": "text",
  "raw_content": "गांवों में दूध खराब न हो इसके लिए सौर ऊर्जा से चलने वाले छोटे कोल्ड स्टोरेज बनाए जाएं और किसान UPI से इस्तेमाल के हिसाब से भुगतान कर सकें।",
  "metadata": {
    "district": "Varanasi",
    "state": "Uttar Pradesh"
  }
}
```

### 2. Upvote Proposal (`POST /api/v1/proposals/{proposal_id}/vote`)
Increments the support count of connected claim nodes and returns the updated vote count.

### 3. Track Idea Lifecycle (`GET /api/v1/proposals/track/{tracking_code}`)
Returns current 6-stage lifecycle progress (Ingested ➔ Structured ➔ Clustered ➔ Upvoted ➔ Ministry Review ➔ Parliamentary Brief Note).

### 4. Database Schema (SQL / `pgvector`)
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_content TEXT NOT NULL,
    language_code VARCHAR(10) DEFAULT 'en',
    problem_domain VARCHAR(255) NOT NULL,
    core_solution TEXT NOT NULL,
    target_beneficiaries TEXT,
    resource_requirements TEXT,
    created_at TIMESTAMP WITH TIMEZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE claim_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_node_id UUID REFERENCES claim_nodes(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
    node_type VARCHAR(20) CHECK (node_type IN ('ROOT', 'EXTENSION_ARM')),
    claim_text TEXT NOT NULL,
    embedding vector(1024),
    support_count INT DEFAULT 1,
    created_at TIMESTAMP WITH TIMEZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX claim_embedding_hnsw_idx 
ON claim_nodes 
USING hnsw (embedding vector_cosine_ops);
```

---

## 📜 Synthesis Report Example
When **500 citizens** submit ideas on rural milk transportation, the engine synthesizes:
* **Core Consensus (80% Support):** High demand for localized, temperature-controlled transport.
* **Primary Variant A (300 votes):** Fleet deployment of refrigerated mini-trucks on arterial routes.
* **Extended Arm B (150 votes):** Solar-insulated containers fitted to two-wheelers for rural tracks.
* **Add-on Feature (50 votes):** IoT temperature sensors for real-time milk quality tracking.
