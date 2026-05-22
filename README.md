# Grain Conference Intelligence Tool

A working web app for Grain's sales team to prioritize conferences, plan annual coverage, capture leads in the field, recognize repeat contacts, and prepare HubSpot-ready follow-up.

## What It Does

- Ranks fintech, payments, treasury, travel, and SaaS events by ICP fit.
- Shows rep coverage, quarterly planning, and same-region trip clusters.
- Provides a mobile-friendly lead capture flow for busy conference floors.
- Groups repeat contacts across conferences using email, name variation, and company context.
- Generates an AI relationship summary and follow-up draft, with a mock fallback when no OpenAI key exists.
- Pushes leads to HubSpot when a private app token exists, with mock mode and CSV export by default.

## Run Locally

PowerShell blocks `npm.ps1` on this machine, so use `npm.cmd`.

Recommended stable local review command:

```powershell
npm.cmd install
npm.cmd run build
npm.cmd run start -- --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000`.

For active development, you can also run:

```powershell
npm.cmd run dev
```

## Environment Variables

Copy `.env.example` to `.env.local`.

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
HUBSPOT_PRIVATE_APP_TOKEN=
```

Both integrations are optional. Without keys, the app still demonstrates the full flow:

- AI relationship summaries use a deterministic demo fallback.
- HubSpot sync returns mock success and shows the payload shape.

## Tests

```powershell
npm.cmd run test
npm.cmd run build
```

Covered logic:

- Conference tier scoring.
- Repeat contact matching by email.
- Name/title changes across conferences.
- Common-name false positive protection.

## Deployment

Recommended path:

1. Push the source code to GitHub.
2. Import the repo into Vercel.
3. Add optional environment variables in Vercel Project Settings.
4. Deploy.

This app uses Next.js API routes, so Vercel works without extra backend setup.

## Submission Checklist

- Live URL from Vercel.
- Source code as GitHub repo or `grain-conference-intelligence-source.zip`.
- 5-10 minute video using `docs/video-script.md`.
- Mention that OpenAI and HubSpot keys are configurable and not hardcoded.
- Mention that the demo works without credentials through mock-safe fallbacks.

## Demo Path

1. Start on Dashboard and explain the sales problem.
2. Open Conferences and filter by Payments/Treasury.
3. Open Planning and show clusters plus open coverage.
4. Capture a new lead from Money20/20 Europe.
5. Open Contacts and generate an AI nudge for a repeat relationship.
6. Open Sync and show mock HubSpot sync plus CSV export.
