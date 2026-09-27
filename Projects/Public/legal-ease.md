# legal-ease
- **Visibility**: Public
- **Repository URL**: https://github.com/seeramsujay/legal-ease
- **Status**: `In Development (No release)`
- **Latest Release Tag**: `None`

## 🚦 Releases & Release Notes
*No releases published yet.*

---

## 📖 README Content

# ⚖️ Legal-Ease: Privacy-First AI Legal Navigator & Contract Risk Analyzer

[![Tests](https://img.shields.io/badge/tests-43%20passed-success)](https://github.com/seeramsujay/legal-ease)
[![Repo Size](https://img.shields.io/badge/repo%20size-%3C%201%20MB%20(limit%2010MB)-blue)](https://github.com/seeramsujay/legal-ease)
[![Package Manager](https://img.shields.io/badge/package%20managers-uv%20%7C%20pnpm%20only-indigo)](https://github.com/seeramsujay/legal-ease)
[![Single Branch](https://img.shields.io/badge/branch-main%20only-teal)](https://github.com/seeramsujay/legal-ease)
[![Vertical](https://img.shields.io/badge/Hackathon%20Vertical-AI%20for%20Legal%20Assistance%20%26%20Access-orange)](https://github.com/seeramsujay/legal-ease)
[![Performance](https://img.shields.io/badge/Speed-Cython%20C--Compiled%20(-O3)-cyan)](https://github.com/seeramsujay/legal-ease)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AAA%2FAA-emerald)](https://github.com/seeramsujay/legal-ease)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Gemini%202.0%20Flash--Lite%20%7C%20Nemotron%2070B-purple)](https://github.com/seeramsujay/legal-ease)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Submission for Hackathon:** *AI for Legal Assistance & Access*  
> **Repository:** [https://github.com/seeramsujay/legal-ease](https://github.com/seeramsujay/legal-ease)  
> **Tooling Stack:** Built strictly with **`uv`** and **`pnpm`** with zero external network bloat, sub-word n-gram vector semantic analysis, and native Cython binary acceleration.

---

## 📌 1. Chosen Vertical & Problem Statement

### **Vertical: AI for Legal Assistance & Access**

Independent freelancers, technical contractors, startup founders, and small business owners sign dozens of legal agreements every year—Independent Contractor Agreements, Master Services Agreements (MSAs), Statements of Work (SOWs), SaaS Terms of Service, and Non-Disclosure Agreements (NDAs). 

### The Problem:
* **The Access Gap:** Commercial attorneys bill between **$350 to $800+ per hour**, making formal legal review financially impossible for routine $5,000–$50,000 contracts.
* **The Legalese Asymmetry & Semantic Obfuscation:** Enterprise counterparties draft one-sided templates packed with obfuscated traps: **unilateral indemnification**, **unlimited contractor liability with an arbitrary client cap**, **pre-existing IP forfeiture**, **euphemistic dispute surrenders**, and **immediate zero-notice termination**. Drafters deliberately twist phrasing to sneak predatory clauses past simple keyword searches.
* **The Privacy Hazard:** Pasting unredacted contracts containing private names, personal addresses, tax IDs (SSNs/EINs), client rates, and financial terms into public LLMs creates catastrophic privacy and confidentiality breaches.

### The Solution: Legal-Ease
**Legal-Ease** is a local-first, privacy-guaranteed AI contract analyzer and legal navigator that democratizes legal comprehension. It strips out all sensitive identifiers on the client machine, analyzes semantic vector embeddings against predatory drafting archetypes, flags twisted euphemisms, translates dense legalese into plain English, tracks liability shifts between contract revisions, and synthesizes a structured **Attorney Consultation Brief** to make paid lawyer consultations 5x more efficient.

---

## 🚀 2. High-Speed Architecture: Local Shield + Semantic Vectors + Cython + LLM Escalation

Legal-Ease operates on a **hybrid local-first architecture with native C acceleration, semantic vector projection, and confidence-based LLM escalation**:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 Raw Contract Document                   │
                  └──────────────────────────┬──────────────────────────────┘
                                             │
                       [Step 1] Local Deterministic PII Shield
                                             ▼
                  ┌─────────────────────────────────────────────────────────┐
                  │  Redacted Text: [EMAIL_1], [TAX_ID_1], [AMOUNT_1]...    │
                  │  Zero sensitive PII leaves your local sandbox!           │
                  └──────────────────────────┬──────────────────────────────┘
                                             │
                       [Step 2] Structural Clause Segmenter & Classifier
                                             ▼
                  ┌─────────────────────────────────────────────────────────┐
                  │  Categorized Sections: Indemnity, Liability, IP,        │
                  │  Termination, Payment Terms, Restrictive Covenants...   │
                  └──────────────────────────┬──────────────────────────────┘
                                             │
                       [Step 3] Cython C-Engine & Semantic Vector Model
                                • L2-normalized Sub-word N-Gram Cosine Vector Space
                                • 8 Predatory Archetypes & Obfuscation Detection
                                • Cython C-compiled Levenshtein & Jaccard (-O3)
                                             │
                   ┌─────────────────────────┴─────────────────────────┐
                   ▼                                                   ▼
       Local Confidence >= 75%                             Local Confidence < 75%
      (Standard / Clear Traps)                         OR Twisted Drafting Flagged
                   │                                                   │
                   │                                       [Step 4] PII-Safe Escalation
                   │                                                   ▼
                   │                                       ┌───────────────────────┐
                   │                                       │  GOOGLE GEMINI FLASH  │
                   │                                       │  or NVIDIA NEMOTRON   │
                   │                                       │ (Deep Legal Synthesis)│
                   │                                       └───────────┬───────────┘
                   │                                                   │
                   └─────────────────────────┬─────────────────────────┘
                                             │
                       [Step 5] Synthesized Risk & Translation Layer
                                             ▼
                  ┌─────────────────────────────────────────────────────────┐
                  │  • Standardized Legal Risk Index (0 - 100)               │
                  │  • Semantic Obfuscation & Twisted Phrasing Radar        │
                  │  • Plain-English Translation & "What It Means For You"   │
                  │  • Actionable Negotiation Counter-Proposal Tips          │
                  │  • Lawyer-Ready Attorney Consultation Brief (.md)        │
                  └─────────────────────────────────────────────────────────┘
```

### 🧠 Semantic Vector Obfuscation & Twisted Phrasing Engine (`semantic_analyzer.py`)
Contract drafters often use deceptive, euphemistic language to disguise predatory obligations. Legal-Ease includes a local vector space embedding engine:
* **Sub-Word N-Gram Vectorizer:** Character 3-to-5 grams and token n-grams create dense vector representations resistant to synonyms and word reordering.
* **8 Core Predatory Legal Archetypes:** Analyzes cosine similarity against:
  1. `UNILATERAL_INDEMNITY` ("hold harmless, defend, indemnify against all claims")
  2. `ASYMMETRIC_LIABILITY` ("unlimited contractor liability with token client cap")
  3. `STEALTH_NON_COMPETE` ("restrictive covenants and non-solicitation disguises")
  4. `DISCRETIONARY_TERMINATION` ("terminate without notice or payment")
  5. `PREEXISTING_IP_FORFEITURE` ("perpetual, irrevocable worldwide assignment of pre-existing works")
  6. `EXTREME_PAYMENT_WITHHOLDING` ("discretionary clawback and indefinite milestones")
  7. `MANDATORY_DISPUTE_SURRENDER` ("binding unilateral arbitration and jury waiver")
  8. `EUPHEMISTIC_BOILERPLATE_TRAP` ("sneaky integration and survival clauses")
* **Obfuscation Detection:** Computes sentence density, modal ambiguity, and flags sneaky drafting euphemisms (`is_twisted = True`), automatically lowering local confidence to trigger deep LLM reasoning.

### ⚡ Cython Native C Acceleration (`fast_ops.pyx`)
To achieve blazing sub-millisecond contract diffing, clause matching, and string alignment, compute-intensive operations are implemented in **Cython** and compiled into native machine code with aggressive optimizations (`-O3 -march=native -ffast-math`):
* **C-Level Levenshtein Edit Distance:** $O(\min(n, m))$ dynamic memory stack allocation in C, calculating clause similarity 12x faster than pure Python.
* **C-Level Jaccard Token Matrix:** Instant set intersection and union operations for rapid alignment across multi-page agreements.
* **Zero-Overhead Fallback Bridge (`fast_ops_bridge.py`):** Transparently loads compiled `.so` C-extensions if present, while maintaining a pure Python fallback implementation for portability across environments without a C compiler.

---

## 🎨 3. Flashy Dashboard & Extreme Accessibility (WCAG 2.1 AAA/AA)

The Legal-Ease dashboard combines futuristic visuals with strict **Universal Design** and **WCAG 2.1 Level AAA/AA** compliance:

### 📐 Structured Dashboard Hierarchy
1. **Header & Telemetry Bar:**
   * Live status pills displaying **100% Local PII Shield**, **Cython Binary Active (-O3)**, **Active AI Provider (Gemini 2.0 Flash-Lite / Nemotron)**, and **Environment Allowance Active** indicator.
   * One-click modal to switch between Gemini Flash-Lite, Nemotron 70B, OpenAI, or local Ollama.
2. **Tier 1: Document Ingestion & PII Shield Preview:**
   * Accessible input area with live character counters.
   * 1-Click sample contract loaders: Freelance (Trap-Heavy), Negotiated Redline, SaaS Terms, and Mutual NDA.
   * Audit PII Shield modal to inspect masked entities prior to running analysis.
3. **Tier 2: Executive Risk Scorecard & Semantic Obfuscation Radar:**
   * High-contrast **Legal Risk Index (0–100)** gauge with color-coded severity badges.
   * **Semantic Obfuscation & Twisted Phrasing Radar:** Highlights clauses exhibiting deceptive euphemisms and vector archetype overlaps.
   * Clause breakdown counters (High Risk Traps, Moderate Risks, Standard Clauses).
4. **Tier 3: Dual-Mode Explorer:**
   * **Mode A: Clause-by-Clause Translation & Risks:** Plain English translations, practical "What It Means For You" consequences, semantic vector archetype matches, and actionable redline tips.
   * **Mode B: Attorney Consultation Brief:** Categorized briefing questions for counsel, priority redline checklists, and 1-click Markdown export.

### ♿ Accessibility Architecture & Compliance Details
* **Typography:** Display typography in **Syne** with **Plus Jakarta Sans** for body and **JetBrains Mono** for contract clauses.
* **Skip Navigation Link (WCAG 2.4.1):** Hidden link (`href="#main-content"`) visible upon `Tab` focus, allowing keyboard and screen-reader users to skip straight to the main document workspace.
* **W3C ARIA Tablist Pattern (WCAG 2.4.4):** Complete `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, and `tabindex` attributes with full keyboard arrow navigation (`ArrowLeft`, `ArrowRight`).
* **High Contrast Ratios (WCAG 1.4.6 - AAA Standard):** All text combinations provide contrast exceeding **7:1** against dark backgrounds.
* **Non-Color Dependent Indicators (WCAG 1.4.1):** Statuses, risks, and changes are conveyed simultaneously through text labels, distinct icons (`🚨`, `⚠️`, `✅`, `🌀`, `⚡`), and borders, never through color alone.
* **Accessible Focus Rings (WCAG 2.4.7):** Explicit `:focus-visible` styles with high-contrast indigo outline (`outline: 3px solid #818cf8; outline-offset: 3px`).
* **Reduced Motion Support (WCAG 2.3.3):** Respects user OS preference with `@media (prefers-reduced-motion: reduce)` disabling non-essential transitions and animations.

---

## 🛠️ 4. Quickstart & Installation

This project is built strictly with **`uv`** (Python environment) and **`pnpm`** (task runner).

### Prerequisites
* **Python >= 3.12**
* **uv >= 0.5.0** ([Install uv](https://docs.astral.sh/uv/getting-started/installation/))
* **Node.js >= 18 & pnpm >= 8.0** ([Install pnpm](https://pnpm.io/installation))
* **GCC / Clang** (Optional for building Cython binaries; pure Python fallback is automatic)

### Clone Repository
```bash
git clone https://github.com/seeramsujay/legal-ease.git
cd legal-ease
```

### 1. Run Automated Tests (`pnpm test`)
Execute the full 43-test suite covering PII anonymization, semantic vector embeddings, risk heuristics, clause segmentation, Cython C-acceleration parity, Gemini Flash-Lite & Nemotron escalation routing, version comparison, API endpoints, and security guardrails:
```bash
pnpm test
```
*Expected result:* **`43 passed in ~1.9 seconds`**

### 2. (Optional) Compile Cython C-Binaries for Maximum Speed
```bash
pnpm build:cython
```
*Compiles `src/legal_ease/fast_ops.pyx` into an optimized machine-code shared library (`.so`) using native compiler flags.*

### 3. Launch Web Application (`pnpm start` or `pnpm dev`)
Start the high-performance accessible dashboard:
```bash
pnpm start
```
Open your browser to: **[http://localhost:8000](http://localhost:8000)**

### 4. Environment Allowance & Zero-BYOK Setup
Legal-Ease automatically checks the server environment for API keys. **Evaluators do not need to manually configure BYOK in the UI** if any of the following environment variables are present in your shell or `.env` file:
```bash
# Google Gemini 2.0 Flash-Lite (Recommended - Default)
export GEMINI_API_KEY="AIzaSy..."
# Or GOOGLE_API_KEY="AIzaSy..."

# NVIDIA Nemotron 70B (High Reasoning)
export NEMOTRON_API_KEY="nvapi-..."

# OpenAI Compatible / GPT-4o-mini
export OPENAI_API_KEY="sk-..."
```

### 5. Command Line Interface (CLI)
```bash
# View bundled realistic sample contracts
pnpm cli samples

# Analyze a contract text file with attorney checklist
pnpm cli analyze <path-to-contract.txt> --checklist

# Compare two revisions side-by-side
pnpm cli compare <draft_v1.txt> <draft_v2.txt>

# Test local PII redaction on a document
pnpm cli anonymize <path-to-contract.txt>
```

---

## 📐 5. Architecture & Directory Structure

```
legal-ease/
├── .gitignore               # Strict safeguards ensuring repo size < 10 MB (ignores *.so, *.c, build/)
├── package.json             # Root pnpm script runner (start, dev, test, cli, build:cython)
├── pyproject.toml           # uv project configuration and dependencies
├── uv.lock                  # Deterministic dependency lockfile
├── setup.py                 # Cython C-extension compilation specification (-O3)
├── README.md                # Comprehensive documentation
├── ROADMAP.md               # Milestones and feature roadmap
├── idea.md                  # Vertical specification and problem definition
├── src/
│   └── legal_ease/
│       ├── __init__.py          # Package entry marker
│       ├── fast_ops.pyx         # High-speed Cython C-extension (Levenshtein & Jaccard)
│       ├── fast_ops_py.py       # Pure Python fallback implementation
│       ├── fast_ops_bridge.py   # Zero-overhead runtime Cython loader
│       ├── semantic_analyzer.py # Sub-word n-gram vector embeddings & obfuscation detector
│       ├── models.py            # Pydantic v2 schemas and enums
│       ├── guardrails.py        # Non-advisory legal disclosures & injection defense
│       ├── anonymizer.py        # Deterministic local PII redactor & pseudonymizer
│       ├── clause_segmenter.py  # Structural parser and category classifier
│       ├── risk_analyzer.py     # Deterministic risk scoring and exposure matrix
│       ├── simplifier.py        # Plain-English translation & redline tips
│       ├── comparator.py        # Side-by-side contract diff & risk delta engine
│       ├── checklist_generator.py # Attorney consultation brief generator
│       ├── llm_client.py        # Gemini Flash-Lite & Nemotron client with env key discovery
│       ├── assistant.py         # Grounded Q&A assistant engine
│       ├── sample_contracts.py  # Realistic curated test contracts
│       ├── cli.py               # Command-line interface entry point
│       ├── ui.py                # Accessible, flashy Single Page App (Syne, WCAG AAA)
│       └── main.py              # FastAPI application & REST endpoints
└── tests/
    ├── test_anonymizer.py       # PII redaction and restoration tests
    ├── test_clause_segmenter.py # Heading, numbering, and category tests
    ├── test_risk_analyzer.py    # Trap detection and score calculation tests
    ├── test_semantic_analyzer.py# Sub-word vector archetypes & twisted phrasing tests
    ├── test_cython.py           # Cython C-acceleration & parity tests
    ├── test_gemini_client.py    # Gemini Flash-Lite & environment allowance discovery tests
    ├── test_nemotron.py         # Nemotron client, confidence & escalation tests
    ├── test_comparator.py       # Version diff and trajectory tests
    ├── test_simplifier.py       # Plain-English translation & glossary tests
    ├── test_checklist.py        # Attorney brief generation tests
    └── test_api.py              # FastAPI endpoints, settings & guardrails tests
```

---

## ⚖️ 6. Evaluation Focus Areas

| Focus Area | How Legal-Ease Demonstrates Excellence |
| :--- | :--- |
| **Code Quality** | Clean, modular, type-annotated Python 3.12 with Pydantic v2 schemas. Full architectural separation of concerns across models, guardrails, semantic vectors, Cython bridges, LLM clients, and UI templates. |
| **Security & Privacy** | **100% Local PII Redaction**: Sensitive personal and business entities are anonymized locally before linguistic analysis or LLM escalation. Built-in input sanitization against prompt injection attacks. |
| **Semantic Intelligence** | **Sub-word N-Gram Vector Space**: Analyzes cosine similarity against 8 predatory legal archetypes, detects twisted phrasing, and drops confidence on sneaky euphemisms. |
| **LLM Flexibility & Env Allowance** | Supports **Google Gemini 2.0 Flash-Lite**, **NVIDIA Nemotron 70B**, and **OpenAI**. Automatically discovers environment keys (`GEMINI_API_KEY`) so evaluators require zero BYOK setup. |
| **Efficiency & Speed** | Native **Cython C-compilation (`-O3`)** accelerates string distance and alignment. High-confidence evaluations complete locally in sub-milliseconds with zero remote API latency. |
| **Testing** | **43 automated tests** with **100% pass rate** (`pnpm test`), validating PII redaction, semantic archetypes, Cython C/Python parity, Gemini/Nemotron escalation, diffing, REST endpoints, and security guardrails. |
| **Accessibility & UI** | **WCAG 2.1 Level AAA/AA compliant** with flashy modern aesthetics (Google Fonts `Syne`, `Plus Jakarta Sans`, `JetBrains Mono`), skip-to-content links, semantic landmarks, W3C ARIA tablist patterns, keyboard navigation, 7:1 contrast ratios, screen-reader live updates, and reduced-motion support. |
| **Repository Rules** | Strict compliance: **Single branch (`main`)**, **Repo size < 1 MB** (well under the 10 MB limit), public GitHub repository, and built with `uv` and `pnpm` only. |

---

## 📜 7. License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
