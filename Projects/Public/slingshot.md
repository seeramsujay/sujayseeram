# slingshot
- **Visibility**: Public
- **Repository URL**: https://github.com/seeramsujay/slingshot
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# 🎯 Slingshot (DustVision): Adaptive Urban Dust Mitigation Framework

Slingshot is a high-agency, adaptive system engineered to forecast, analyze, and mitigate particulate matter (PM2.5/PM10) in dense urban environments. By fusing sensor intelligence with real-time forecasting pipelines, it dynamically triggers mitigation systems to protect public health before AQI thresholds are breached.

---

## 🏗️ Core Architecture & Cognitive Flow

The system employs a closed-loop cyber-physical architecture to continuously sense, predict, and adaptively control urban dust mitigation:

```
     [ Sensors & Fused Events ] 
                 │
                 ▼
     [ ml/pm_forecast_pipeline.py ] ──► (Scikit-Learn Forecasts)
                 │
                 ▼
    [ control/aq_severity_engine.py ] ──► (Dynamic AQI Classification)
                 │
                 ▼
 [ control/action_mapping_system.py ] ──► (Mitigation Trigger Mapping)
                 │
                 ▼
     [ control/orchestrator.py ] ──► (Simulated Mitigation Loop)
                 │
                 ▼
           [ control/api.py ] ──► (High-Contrast FastAPI UI Dashboard)
```

---

## ⚡ Key Persuasion Points & Features

- **Predictive PM Forecasting**: Trains highly calibrated scikit-learn models on historical weather and sensor inputs to predict PM2.5 and PM10 surges with precise regression metrics.
- **Cyber-Physical Severity Engine**: Classifies air quality severity dynamically, establishing a layered scanning pattern for safe physical interventions.
- **Closed-Loop Action Dispatcher**: Maps severity indices to automated physical control actions (e.g. urban sprinklers, clean air filtration, and traffic speed reduction) to damp particulate spreads.
- **Developer-First REST API**: A structured FastAPI gateway to programmatically query forecast matrices, historical event logs, and active mitigation states.
- **Zero-Lux Plot Visualization**: Automatically renders and saves dual-regression forecasts (`prediction_plots.png`) and real-world simulation impact plots (`impact_simulation.png`).

---

## 🛠️ Environmental Constraints & ML Policy

Aligned with the sovereign **ANTIGRAVITY Protocol**, Slingshot is mathematically optimized for resource-constrained environments:
- **ML Engine**: Explicitly operates without local PyTorch or heavy deep-learning frameworks. All models use scikit-learn estimators to run comfortably on dual-core hardware (Mac Air 2017 i5, 8GB RAM).
- **Data Persistence**: Uses low-overhead JSON/parquet structured formats for fast localized updates.

---

## 🚀 Quick Start (60-Second Onboarding)

### 1. Set Up Environment & Dependencies
Ensure Python 3.10+ is installed:
```bash
pip install -r requirements.txt
```

### 2. Run the Machine Learning Pipeline
Train the particulate forecasting model and generate performance plots:
```bash
python ml/pm_forecast.py
```

### 3. Start the Simulation Orchestrator
Launch the real-time simulation and mitigation loop:
```bash
python control/orchestrator.py
```

### 4. Deploy the Developer API
Start the FastAPI server to access the mitigation variables and REST endpoints:
```bash
uvicorn control.api:app --reload
```
Once active, visit the interactive Swagger UI at `http://127.0.0.1:8000/docs`.

---

## 🔬 System Verification

To verify that all components are connected and the regression models are working flawlessly, run:
```bash
# Verify the metrics output is created
cat metrics_table.json

# Check that visual outputs are rendered
ls -la prediction_plots.png impact_simulation.png
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.


---

## 🛡️ Licensing & Privacy Protection

Because this repository contains personal code, portfolios, or intellectual property, **strict privacy protections are in place**.

### ⚠️ Prohibitions on AI Training & Scraping
This repository is published for direct human viewing only. Automated data scraping, harvesting, and crawling are strictly prohibited under the author's personal copyright terms.

**By accessing this repository or its contents, you agree to the following terms:**
*   **NO AI/LLM Ingestion:** Any ingestion of code, text, layouts, designs, or assets for training, validation, testing, or tuning of machine learning models, neural networks, or artificial intelligence systems (such as Large Language Models) is strictly prohibited.
*   **NO Automated Data Scraping:** Any automated extraction, parsing, harvesting, or scraping of content by bots, crawlers, scripts, or spiders is prohibited.
*   **Personal Use Only:** Human viewing for personal or educational review is permitted. No duplication, modification, adaptation, or commercial distribution of this work is allowed without express written permission.
