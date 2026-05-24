# Grain Conference Intelligence Tool

Live demo: https://grain-sales-conference-intel.vercel.app  
Source repo: https://github.com/GuySananes/Grain-sales-Conference-Intel

A working web app for Grain's sales team to prioritize conferences, plan annual coverage, capture leads in the field, recognize repeat contacts, and prepare HubSpot-ready follow-up.

## Project Summary

Grain sells to payment service providers, travel wholesalers, cross-border payment companies, treasury teams, and businesses with FX exposure. Conferences are a major sales channel, but today the workflow is split across spreadsheets, Slack, and personal notes.

This tool brings the workflow into one salesperson-friendly place:

- Decide which conferences are worth attending.
- Understand where the year has coverage gaps or travel clusters.
- Capture leads quickly during a live conference.
- Recognize repeat contacts across multiple events.
- Generate a relationship nudge and follow-up draft.
- Push captured leads toward HubSpot, with a mock-safe fallback.

The goal is not to build a heavy CRM. The goal is to show a scrappy, usable sales tool that supports conference pipeline decisions end to end.

## Main Features

### Dashboard

The dashboard is the salesperson's command center. It shows the strongest conference recommendation, A-tier event count, repeat-contact alerts, open coverage gaps, and unsynced leads.

### Conference List

The conference view includes a seeded database of fintech, payments, treasury, travel, and SaaS events. Users can search and filter by vertical, region, tier, and ICP fit.

Example events include:

- Money20/20 Europe
- Money20/20 USA
- EuroFinance International Treasury Management
- Sibos
- Singapore FinTech Festival
- FinovateEurope
- Skift Global Forum
- The Phocuswright Conference
- WTM London
- SaaStr AI Annual

### Scoring And Tiering

Each conference receives a 100-point ICP-fit score:

- 30 points: ICP vertical fit, especially PSPs, payments, cross-border, treasury, and travel wholesalers.
- 25 points: buyer density, such as finance, treasury, payments, partnerships, founders, and senior operators.
- 15 points: event scale and audience quality.
- 10 points: geography fit for Grain's likely sales coverage.
- 10 points: timing and trip clustering.
- 10 points: logistics practicality.

Tiers:

- A: 80+
- B: 65-79
- C: 50-64
- Watch: below 50

The scoring intentionally weights buyer relevance above raw audience size. A smaller treasury event can be more valuable than a huge generic SaaS event if the attendees have real FX exposure and buying authority.

### Planning View

The planning view shows:

- Events by quarter.
- Assigned reps.
- Open coverage gaps.
- Geographic and timing clusters.

This helps the team avoid isolated one-off trips and spot opportunities to combine conferences with customer or prospect meetings nearby.

### Field Capture

The capture flow is designed for a busy conference floor. The form keeps the most important fields close at hand:

- Conference
- Name
- Company
- Title
- Email
- Intent
- Tags
- Notes

Completeness matters less than speed. A rep can save the lead and return to the conversation quickly.

### Cross-Conference Contact Intelligence

The contacts view groups encounters into relationship profiles.

Matching rules:

- Exact email match is treated as the strongest signal.
- Normalized name plus company context is used for likely matches.
- Title changes are surfaced as useful context, not treated as a mismatch.
- Common-name collisions are handled carefully. For example, two different "Alex Morgan" records at different companies stay separate instead of being merged blindly.

The view interprets repeat contacts as either warming relationships or low-signal repeat conversations. The point is not just to count duplicates; it is to help a rep decide what kind of follow-up is justified.

### AI Relationship Nudge

The AI feature summarizes a contact's conference history and produces:

- A short relationship arc.
- A practical recommended nudge.
- A follow-up email draft.
- A risk or qualification concern.

Why AI belongs here: conference notes are messy, short, and spread across multiple meetings. AI is useful for compressing that context into a practical sales action.

The app uses `OPENAI_API_KEY` and `OPENAI_MODEL` when configured. The recommended low-cost model is:

```bash
OPENAI_MODEL=gpt-5-nano
```

If no key is configured, or if the key has no available quota, the app shows a deterministic "Demo fallback" response so the reviewer can still see the intended workflow. With a valid key and available quota, the badge changes to "OpenAI".

### HubSpot Path

The sync view provides a CRM path without making the assignment risky:

- `POST /api/hubspot/sync-lead` accepts a captured lead.
- If `HUBSPOT_PRIVATE_APP_TOKEN` exists, the route can send the contact to HubSpot.
- If no token exists, the route returns mock success.
- CSV export is available as a backup import path.

For the live demo, HubSpot is intentionally mock-safe by default.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- LocalStorage for the MVP data store
- Next.js API routes for AI and HubSpot integration paths
- Vitest for scoring and matching tests
- Vercel for deployment

## Project Structure

```text
src/
  app/
    page.tsx
    api/ai/relationship-summary/route.ts
    api/hubspot/sync-lead/route.ts
  components/
    contacts/
    conferences/
    dashboard/
    field-capture/
    planning/
    settings/
    ui/
  data/
    conferences.ts
    sampleLeads.ts
  lib/
    ai.ts
    csv.ts
    hubspot.ts
    matching.ts
    scoring.ts
    storage.ts
  types/
    domain.ts
  test/
    matching.test.ts
    scoring.test.ts
docs/
  video-script.md
  submission-checklist.md
```

## Run Locally

PowerShell blocks `npm.ps1` on this machine, so use `npm.cmd`.

Recommended stable local review command:

```powershell
npm.cmd install
npm.cmd run build
npm.cmd run start -- --hostname 127.0.0.1 --port 3000
```

Open:

```text
http://127.0.0.1:3000
```

For active development:

```powershell
npm.cmd run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` for local development, or add these in Vercel Project Settings.

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5-nano
HUBSPOT_PRIVATE_APP_TOKEN=
```

Do not commit real API keys. Both integrations are optional.

Without credentials:

- AI relationship summaries use a deterministic demo fallback.
- HubSpot sync returns mock success.
- CSV export still works.

## Tests

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

Covered logic:

- Conference tier scoring.
- Repeat contact matching by exact email.
- Name and title variation across conferences.
- Common-name false positive protection.

## Deployment

The project is deployed on Vercel:

```text
https://grain-sales-conference-intel.vercel.app
```

Recommended deployment path:

1. Push the source code to GitHub.
2. Import the repo into Vercel.
3. Keep the framework preset as Next.js.
4. Add optional environment variables.
5. Deploy.

This app uses Next.js API routes, so no separate backend service is required.

## Video Walkthrough Guide

Use the deployed Vercel URL for the recording, not localhost.

### 0:00 - Problem And Persona

Explain that Grain sells to PSPs, payment companies, treasury teams, travel wholesalers, and companies with FX exposure. Conferences are important for pipeline, but the team's current workflow is fragmented across spreadsheets, Slack, and notebooks.

Say that this tool is built for a non-technical salesperson who needs to decide where to go, capture people fast, and follow up with context.

### 1:00 - Dashboard

Start on the dashboard. Point out:

- Top recommended conference.
- A-tier event count.
- Repeat-contact alerts.
- Unsynced leads.

Position it as a command center for conference pipeline decisions.

### 2:00 - Conference Prioritization

Open Conferences. Filter or search for payments and treasury events.

Explain the scoring model:

- ICP fit and buyer density are weighted most heavily.
- Audience size matters, but only after relevance.
- Trip clustering and logistics help with sales coverage planning.

Use Money20/20 Europe, EuroFinance, and Sibos as examples.

### 3:00 - Planning

Open Planning. Show quarterly coverage, assigned reps, and open gaps.

Explain that this helps a sales leader answer:

- Are we over-invested in one region?
- Are we missing a high-fit quarter?
- Can we cluster trips to reduce travel waste?

### 4:00 - Field Capture

Open Capture. Add a quick demo lead.

Suggested demo:

```text
Name: Maya Chen
Company: FlyPay
Title: Head of Strategic Partnerships
Email: maya.chen@flypay.com
Intent: High
Tags: PSP, Travel wholesaler, FX exposure
Notes: APAC expansion, asked for product intro and ROI calculator.
```

Explain that the form is intentionally short because salespeople are using it between conversations on a busy conference floor.

### 5:00 - Cross-Conference Intelligence

Open Contacts. Show a repeat contact such as Maya Chen or Dan Rosen.

Explain:

- Exact email matching is automatic.
- Name/company context handles variations.
- Job changes are shown as signal.
- Common names without enough context are not merged aggressively.

Emphasize that the goal is relationship judgment, not just deduplication.

### 6:00 - AI Nudge

Click Generate nudge.

Explain that the AI turns messy encounter history into:

- Relationship arc.
- Recommended next step.
- Follow-up email.
- Qualification risk.

If the badge says "Demo fallback", explain that the app is built to use OpenAI when a configured key has available quota, and falls back safely when it does not. This keeps the submitted demo usable even without exposing paid credentials.

### 7:00 - HubSpot Path

Open Sync. Show:

- CSV export.
- API route path.
- Mock-safe sync queue.

Explain that with `HUBSPOT_PRIVATE_APP_TOKEN`, the same route can create or update contacts in HubSpot. Without it, the app returns mock success so reviewers can test safely.

### 8:00 - AI Build Process And Tradeoffs

Explain how AI helped:

- Structure the architecture.
- Draft scoring logic.
- Think through contact matching edge cases.
- Generate tests and documentation.

Also explain where human judgment mattered:

- Choosing sales-friendly scope.
- Keeping the capture form short.
- Avoiding noisy duplicate matching.
- Making integrations mock-safe.

### 9:00 - What I Would Build Next

With another week:

- Real database and authenticated users.
- Admin-editable scoring weights.
- Real HubSpot upsert plus activity logging.
- Slack/calendar reminders for follow-up.
- Account enrichment for company size, payments volume, and FX exposure.
- Better conference discovery using AI plus public event sources.

## Submission Package

Submit:

- Live URL: https://grain-sales-conference-intel.vercel.app
- GitHub repo: https://github.com/GuySananes/Grain-sales-Conference-Intel
- Video walkthrough URL
- Optional backup zip: `grain-conference-intelligence-source.zip`

## Notes For Reviewers

- The app is designed as a 4-6 hour MVP, not a production CRM.
- Data is seeded and stored in LocalStorage for demo simplicity.
- API keys are configurable and never hardcoded.
- HubSpot is mock-safe unless a private app token is configured.
- AI uses OpenAI when a valid key with quota is available; otherwise it returns a deterministic fallback.
