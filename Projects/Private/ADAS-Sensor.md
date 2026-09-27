# ADAS-Sensor
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/ADAS-Sensor
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# Cross-Modal Denoising via Reciprocal Radar-Camera Gating for Zero-Lux ADAS Perception

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c.svg)](https://pytorch.org/)
[![Kaggle GPU Ready](https://img.shields.io/badge/Kaggle-GPU--Ready-blue.svg)](notebooks/kaggle_adas_early_fusion.ipynb)
[![CARLA Simulator](https://img.shields.io/badge/CARLA-Testbed--Ready-green.svg)](src/carla_bridge/carla_eval.py)

State-of-the-Art signal-level early fusion perception system combining **4D millimeter-wave radar** with **optical camera** feeds for zero-lux (total darkness) and adverse weather (fog, rain) autonomous driving perception. Trained on real-world **nuScenes v1.0** via Kaggle GPU Notebooks and benchmarked on **CARLA Simulator** streams.

## Overview & SOTA Architecture

In adverse driving conditions (zero-lux night, fog, rain), optical vision fails while radar point clouds provide accurate depth and velocity despite spatial sparsity. This framework implements:

1. **Radar → Camera Spatial Attention Gating:** Uses 4D radar spatial locations as an oracle mask to amplify trusted visual pixels and suppress noise.
2. **Camera → Radar Clutter Rejection:** Vision structural edge maps eliminate radar multipath ghost returns.
3. **5-Channel Early Fusion Backbone:** Combines `[RGB (3 ch) + Depth (1 ch) + Doppler Velocity (1 ch)]` into a unified tensor feeding a SOTA anchor-free object detector with Complete IoU (CIoU) box loss and Focal BCE class loss.

```
[Camera Image] ──→ Radar-Gated Spatial Attention ──→ Denoised RGB ──┐
                         ↑                                         │
                   Radar points                               [Edge Filter]
                         │                                         │
[Radar Point Cloud] ──→ Spatial Grid Projection ←── Multipath Rejection
                         │                                         │
                         └──────────┬──────────────────────────────┘
                                    ▼
                          ┌────────────────────────┐
                          │  Fused Tensor (5‑ch.)   │
                          │  [R, G, B, depth, vel]  │
                          └────────┬───────────────┘
                                   ▼
                          ┌────────────────────────┐
                          │ SOTA 5-Channel Backbone│
                          │  FPN + Anchor-Free Head│
                          └────────┬───────────────┘
                                   ▼
                          ┌────────────────────────┐
                          │  CIoU + BCE Loss Head  │
                          └────────────────────────┘
```

## Dataset & Evaluation Setup

- **Model Training:** Trained on real-world **nuScenes v1.0 keyframes** (`sahangunasekara92/nuscenes-v1-0-full-keyframes`) using Kaggle GPU Notebooks (`notebooks/kaggle_adas_early_fusion.ipynb`).
- **Adverse Weather Testing:** Tested on **CARLA Autonomous Driving Simulator** (`src/carla_bridge/carla_eval.py`) under simulated Zero-Lux Night, Heavy Fog, and Torrential Rain scenarios.

## Repository Structure

```
├── src/
│   ├── main.py                       # Pipeline demonstration script
│   ├── train.py                      # PyTorch model training script (CIoU + BCE loss)
│   ├── carla_bridge/
│   │   └── carla_eval.py             # CARLA simulator adverse weather evaluation bridge
│   ├── data/
│   │   ├── loader.py                 # nuScenes, CARLA, and EarlyFusion PyTorch dataloaders
│   │   └── data_retriever.py         # Kaggle API dataset downloader (nuScenes, CARLA)
│   ├── models/
│   │   ├── spatial_filtering.py      # Radar-gated spatial attention
│   │   ├── edge_detection.py         # Visual structural edge extraction
│   │   ├── clutter_rejection.py      # Multipath ghost clutter rejection
│   │   ├── early_fusion.py           # SOTA 5-channel backbone detector
│   │   └── detection_loss.py         # SOTA CIoU box regression & Focal BCE loss
│   └── utils/
│       ├── calibration.py            # Pinhole projection & sensor extrinsics
│       └── plotting.py               # Publication figure generation
├── notebooks/
│   └── kaggle_adas_early_fusion.ipynb# Kaggle GPU Training & Validation Notebook
├── tests/
│   └── test_pipeline.py              # PyTorch pipeline unit tests
├── Results/                          # Evaluation metrics and figures
├── requirements.txt
└── LICENSE
```

## Quick Start

### 1. Run Pipeline Unit Tests
```bash
python3 -m py_compile src/data/loader.py src/models/early_fusion.py src/models/detection_loss.py src/carla_bridge/carla_eval.py
```

### 2. Kaggle GPU Training
Open [`notebooks/kaggle_adas_early_fusion.ipynb`](notebooks/kaggle_adas_early_fusion.ipynb) on Kaggle, attach the `nuscenes-v1-0-full-keyframes` dataset, and run all cells to train the model.

### 3. CARLA Simulator Testing
Run the off-device CARLA evaluation client:
```bash
python3 -m src.carla_bridge.carla_eval --host 127.0.0.1 --port 2000 --weather zero_lux_night
```
