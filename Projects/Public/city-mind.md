# city-mind
- **Visibility**: Public
- **Repository URL**: https://github.com/seeramsujay/city-mind
- **Status**: `Released (First Stable Release)`
- **Latest Release Tag**: `First Stable Release`

## 🚦 Releases & Release Notes
```text
First Stable Release	Latest	v1.0.0	2026-08-16T09:15:16Z
CityMind OS v0.1.0 Prerelease	Pre-release	v0.1.0	2026-08-08T15:15:39Z
```

---

## 📖 README Content

<div align="center">

# 🌆 CityMind

### *A Git-Inspired AI Memory Operating System for Smart Cities*

[![CockroachDB](https://img.shields.io/badge/CockroachDB-Vector_Indexing-6933FF?style=for-the-badge&logo=cockroachlabs&logoColor=white)](https://cockroachlabs.com)
[![AWS Forever Free](https://img.shields.io/badge/AWS-Forever_Free_Tier-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/free/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Free_Tier-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)
[![Python Version](https://img.shields.io/badge/python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io)

[Architecture](#-system-architecture) • [CockroachDB & AWS Tooling](#-cockroachdb--aws-forever-free-integrations) • [Key Innovations](#-the-paradigm-shift) • [Tech Stack](#-tech-stack) • [Quickstart](#-getting-started)

---

</div>

## 💡 Overview

**CityMind** transforms continuous, overwhelming IoT telemetry streams into a **persistent, version-controlled AI memory operating system**. 

Instead of dumping millions of unindexed time-series sensor values into a storage black hole, CityMind records **event-driven state diffs**—termed **City Commits**. Every significant state change (threshold crossings, environmental anomalies, citizen feedback, or agent observations) creates an immutable SHA-256 commit.

This enables autonomous AI agents to query historical context, perform root-cause analysis over past incidents, and make **explainable, evidence-backed urban decisions**.

---

## 🛠️ CockroachDB & AWS Forever Free Integrations

CityMind integrates distributed enterprise cloud infrastructure using **CockroachDB Free Tier** and **AWS Forever Free Services**:

### 🪳 CockroachDB Ecosystem
1. **CockroachDB Distributed Vector Indexing**:
   - Stores and retrieves high-dimensional vector embeddings using native `VECTOR(384)` data types and `VECTOR INDEX` with cosine distance (`<=>`).
   - Ensures zero consistency gap between operational state diffs and vector data.
2. **CockroachDB Cloud Managed MCP Server (`https://cockroachlabs.cloud/mcp`)**:
   - Enables AI agents to directly inspect, query, and optimize cluster database schemas via Model Context Protocol.
3. **ccloud CLI & CockroachDB Agent Skills**:
   - Executable agent skills (`.agents/skills/cockroachdb-management/SKILL.md`) for automated schema migrations and `ccloud` control plane administration.

### ☁️ AWS Forever Free Services (100% Zero Cost Always Free)
1. **Amazon DynamoDB (25 GB Storage, 25 WCU / 25 RCU Free Forever)**:
   - High-throughput, zero-cost persistent archive for City Commit state diffs, incident hashes, and telemetry anomaly snapshots (handles up to 200M requests/month free).
2. **Amazon SNS (1,000,000 Push Notifications / Month Free Forever)**:
   - Publishes critical threshold alerts, flood warnings, and cross-sector mitigation directives to emergency responders.
3. **Amazon S3 Object Archive & AWS Lambda**:
   - Immutable snapshot storage and serverless webhook triggers under AWS Always Free limits.
4. **Google Gemini Free Tier**:
   - Zero-cost generative RAG insight synthesis and 384-dim semantic embeddings via Google AI Studio.

---

## ⚡ The Paradigm Shift

| Feature | Traditional Smart City Systems | 🌆 CityMind Memory OS |
| :--- | :--- | :--- |
| **Data Strategy** | Continuous 24/7 raw sensor stream logging | **Event-Driven State Diffs** (*City Commits*) |
| **Vector Indexing** | Isolated vector database silos | **CockroachDB Distributed Vector Indexing** |
| **AI Reasoning** | Isolated, reactive single-event rules | **Google Gemini Free Tier RAG Engine** |
| **Historical Context** | Hard-to-query time-series databases | **Hierarchical AI Memory** (*Hot / Warm / Cold*) |
| **Event Archiving** | Static local file dumps | **Amazon DynamoDB & S3 Forever Free Archive** |
| **Emergency Alerts**| Manual dispatcher emails | **Amazon SNS Always Free Topic Dispatch** |

---

## 🧠 System Architecture

```
                  ┌─────────────────────────────────────────┐
                  │   IoT Sensors & Environmental Data      │
                  └────────────────────┬────────────────────┘
                                       │ Raw Telemetry Stream
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │    Hot Memory (Telemetry Buffer)        │
                  └────────────────────┬────────────────────┘
                                       │ Threshold Crossings & Anomalies
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │    City Commit Generator (State Diffs)  │
                  └────────────────────┬────────────────────┘
                                       │ Immutable SHA-256 Commits
                                       ▼
      ┌────────────────────────────────┼─────────────────────────────────┐
      ▼                                ▼                                 ▼
┌───────────┐                    ┌───────────┐                     ┌───────────┐
│Amazon     │                    │ Amazon SNS│                     │CockroachDB│
│DynamoDB   │                    │ (1M Alert │                     │ (Vector   │
│(25GB Free)│                    │  Dispatch)│                     │  Index)   │
└─────┬─────┘                    └─────┬─────┘                     └─────┬─────┘
      │                                │                                 │
      └────────────────────────────────┼─────────────────────────────────┘
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │ Autonomous Multi-Agent Mesh & Gemini    │
                  │ (Google Gemini Free Tier RAG Engine)    │
                  └────────────────────┬────────────────────┘
                                       │ Explainable Decisions & Actions
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │     City Control Dashboard & APIs       │
                  └─────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/seeramsujay/city-mind.git
cd city-mind

# Install backend dependencies with uv (or pip)
uv venv
source .venv/bin/activate
uv pip install -e ".[dev]"

# Install frontend dependencies
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and provide your Google Gemini Free Tier API Key (from Google AI Studio) and optional AWS credentials.

```bash
cp .env.example .env
```

### 3. Run Development Servers

```bash
# Start FastAPI backend (Port 8000)
uv run uvicorn src.city_mind.main:app --reload --port 8000

# In a separate terminal, start Vite frontend (Port 5173)
pnpm run dev
```

---

## 🧪 Testing

Run comprehensive integration and unit tests:

```bash
uv run pytest
```
