# betterbite
- **Visibility**: Public
- **Repository URL**: https://github.com/seeramsujay/betterbite
- **Status**: `Released (Metabolic Adaptation & Zustand Integration)`
- **Latest Release Tag**: `Metabolic Adaptation & Zustand Integration`

## 🚦 Releases & Release Notes
```text
Metabolic Adaptation & Zustand Integration	Latest	v1.1.0	2026-05-19T13:19:22Z
Cloud Run First Release	Pre-release	v1.0.0	2026-05-19T12:34:17Z
```

---

## 📖 README Content

# Slingshot-AMD (BetterBite)

Precision Metabolic Nutrition Engine - AI-powered meal analysis with biometric context optimization.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Google Cloud Run](https://img.shields.io/badge/Cloud_Run-Yes-blue)
![Firebase](https://img.shields.io/badge/Firestore-Yes-orange)

## Overview

Slingshot-AMD is an AI nutrition engine that:
- Analyzes meal photos using Gemini 1.5 Pro
- Calibrates nutrition against biometric data (sleep, heart rate, steps)
- Suggests bio-optimized counterfactual food swaps
- Generates autonomous recipes for suggested alternatives

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5-flash-lite
- **Database**: Firebase Firestore
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 20+
- pnpm
- Google Cloud CLI (`gcloud`)
- Firebase CLI (`firebase`)

### Setup

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Add your credentials to `.env.local`:**
   - `GOOGLE_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - For Firebase: Either use Application Default Credentials or set `GOOGLE_APPLICATION_CREDENTIALS`

4. **Start development server:**
   ```bash
   pnpm dev
   ```

5. **Build for production:**
   ```bash
   pnpm build
   ```

## Deployment

### Google Cloud Run (Recommended)

The project includes `cloudbuild.yaml` for automated Cloud Build deployment.

**Option 1: Cloud Build (Automatic)**

1. Set environment variables:
   ```bash
   gcloud secrets versions list run-api-key  # Get your secret version
   ```

2. Trigger build from Cloud Build:
   ```bash
   gcloud builds submit --config=cloudbuild.yaml .
   ```

**Option 2: Manual Docker Build**

```bash
# Build the image
gcloud builds submit --tag gcr.io/slingshot-amd/slingshot-amd .

# Deploy to Cloud Run
gcloud run deploy slingshot-amd \
  --image gcr.io/slingshot-amd/slingshot-amd \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --env-vars-file .env.yaml
```

**Option 3: Local Docker**

```bash
# Build locally
docker build -t slingshot-amd .

# Run locally
docker run -p 3000:3000 --env-file .env.prod slingshot-amd
```

### Vercel Deployment

The project is optimized for deploying on Vercel as a standard Next.js application.

1. **Import the repository** into Vercel.
2. **Configure Environment Variables** in the Vercel project settings:
   - `GOOGLE_API_KEY`: Your Gemini API key from Google AI Studio.
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: The contents of your Firebase Service Account JSON file as a single-line or multi-line string.
   - `NEXT_PUBLIC_APP_URL`: The public URL of the deployed Vercel application.
3. Click **Deploy**. Vercel will build and host the application automatically.

### Environment Variables for Production

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Gemini API key (store in Secret Manager) |
| `NODE_ENV` | No | Set to `production` |
| `NEXT_TELEMETRY_DISABLED` | No | Set to `1` to disable telemetry |

### Firebase Setup

1. **Create Firebase project:**
   ```bash
   firebase create slingshot-amd
   ```

2. **Enable Firestore:**
   ```bash
   firebase firestore:enable
   ```

3. **Set up service account for local development:**
   ```bash
   gcloud iam service-accounts create firebase-admin \
     --display-name="Firebase Admin"

   gcloud projects add-iam-policy-binding slingshot-amd \
     --member="serviceAccount:firebase-admin@slingshot-amd.iam.gserviceaccount.com" \
     --role="roles/firebase.admin"
   ```

4. **Download service account key:**
   ```bash
   gcloud iam service-accounts keys create firebase-key.json \
     --iam-account="firebase-admin@slingshot-amd.iam.gserviceaccount.com"
   ```

5. **Use locally:**
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json
   ```

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   ├── lib/              # Utilities (Firebase, AI)
│   ├── trpc/             # tRPC API routes
│   └── components/       # React components
├── public/               # Static assets
├── cloudbuild.yaml       # Cloud Build config
├── Dockerfile            # Container definition
├── .env.local.example   # Environment template
└── .env.yaml            # Cloud Run env vars
```

## API Endpoints

- `POST /api/analyze` - Analyze meal photo with biometric context
- `POST /api/chat` - Chat with nutrition AI
- `POST /api/pantry` - Get recipe suggestions

## Security Notes

- Never commit `.env` files to repository
- Store API keys in Secret Manager for production
- Use IAM service accounts instead of API keys where possible

---

*Project: Slingshot-AMD | Powered by Google Cloud*

---

## 🛡️ Licensing & Privacy Protection

Because this repository contains personal code, portfolios, or intellectual property, **strict privacy protections are in place**.

### ⚠️ Prohibitions on AI Training & Scraping
This repository is published for direct human viewing only. Automated data scraping, harvesting, and crawling are strictly prohibited under the author's personal copyright terms.

**By accessing this repository or its contents, you agree to the following terms:**
*   **NO AI/LLM Ingestion:** Any ingestion of code, text, layouts, designs, or assets for training, validation, testing, or tuning of machine learning models, neural networks, or artificial intelligence systems (such as Large Language Models) is strictly prohibited.
*   **NO Automated Data Scraping:** Any automated extraction, parsing, harvesting, or scraping of content by bots, crawlers, scripts, or spiders is prohibited.
*   **Personal Use Only:** Human viewing for personal or educational review is permitted. No duplication, modification, adaptation, or commercial distribution of this work is allowed without express written permission.
