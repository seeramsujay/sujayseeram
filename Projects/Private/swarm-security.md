# swarm-security
- **Visibility**: Private
- **Repository URL**: https://github.com/seeramsujay/swarm-security
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# VisionGuard AI

Autonomous surveillance robot for Indian warehouses and industrial sites.
Two independent perception pipelines, plus the training, deployment and
archive material that supports them.

Restructured 29 August 2026. If a path in an older note or chat log does not
resolve, look under `perception/` — that is where both modules moved to.

---

## Where everything is

| Path | What it is | Safe to delete? |
|---|---|---|
| `perception/` | **The source code.** Both pipelines. | No |
| `runs/` | Training run outputs. Regenerable, GB-scale. | Yes, but read `runs/README.md` first |
| `deploy/` | Packaged bundles for running elsewhere (cloud GPU) | Yes once the run is done |
| `archive/` | Cold storage of superseded large files | Ask first |
| `models/` | Pretrained base weights | Yes, re-downloadable |
| `docs/` | Project documentation and operational notes | No |
| `CLAUDE.md` | Instructions for Claude Code and Codex CLI | No |

Every folder above has its own README explaining its contents in detail.

---

## The two perception modules

They share **no code and no dependencies**. Each has its own entrypoint and
its own configuration. Verified by grep — the only cross-references between
them are comments.

**`perception/object_detection_stage1/`** — what and who is present.
Custom 29-class YOLOv8m detector: weapons, tools, warehouse objects,
vehicles, bags, people. Actively developed. This is the commercial core.

**`perception/face_detection_stage1/`** — who it is.
YOLOv8-face detection plus DeepFace/Facenet recognition against an enrolled
reference set. **Paused.** Working but imperfect; do not modify while paused.

---

## Current state, verified 9 September 2026

The 29-class model finished training on a rented A100 on 29 August.

    best.pt   epoch 119   P 0.871  R 0.824  mAP50 0.873  mAP50-95 0.679

Weapons validated for the first time: knife 0.923, shotgun 0.897,
handgun 0.867, rifle 0.818 mAP50.

### Done — do not re-report these as broken

- **The inference path runs our 29-class model.** Rewired 29 August (`4635f5e`);
  `config.py` loads `models/production/visionguard_29class_v1.pt` and
  `detector.py` asserts the checkpoint's class names at startup. There is no
  COCO class ID left in the inference path. *An earlier version of this README
  said the opposite for eleven days and sent a contributor hunting for a bug
  that no longer existed. If you read that version, it was wrong.*
- **Per-class confidence thresholds are calibrated**, applied 30 August
  (`b3fa7c6`). 29 swept values live in `config.py`. They are not placeholders.
- **19 tests pass** on the inference path.

### Actually blocking

1. **The `person` class is broken.** Recall 0.368 — it misses about 63% of
   people, and every alert tier depends on person detection. The cause is
   sparse annotation in the source datasets, not the model. This is the only
   real defect in the perception module.

2. **The test split has never been evaluated.** Every figure above is
   validation-split, and the validation split also calibrated the thresholds —
   so the numbers are measured on data that tuned them.
   `perception/object_detection_stage1/held_out_object_data/` exists to fix
   this and is empty (`{"samples": []}` as of 9 Sep 2026).

3. **Nothing has ever been tested on real warehouse footage.**

**Who is working on what:** see `docs/ASSIGNMENTS.md`, which points at the
`VisionGuard Working Brief` §19 — the authoritative track list. Do not go
searching through folders for your task.

Full detail in `docs/` and in `CLAUDE.md`.

---

## Backup

A verified master backup lives **outside this folder**, at
`~/Documents/VisionGuard_MASTER_BACKUP/` — deliberately separate, so that
anything happening to this directory does not take the backup with it.
It holds the model, the dataset archive, the manifests and the documents,
with SHA-256 checksums.

That backup is still on the same physical drive. It is not protection
against drive failure. Keep an off-machine copy as well.
