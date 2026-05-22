# Architecture

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- LocalStorage for MVP persistence
- Serverless API routes for AI and HubSpot
- Vitest for scoring and matching tests

## Data Flow

1. Seed conference data loads from `src/data/conferences.ts`.
2. Scoring logic in `src/lib/scoring.ts` calculates the score and tier.
3. Captured leads are stored in LocalStorage through `src/lib/storage.ts`.
4. Matching logic in `src/lib/matching.ts` groups leads into contact relationships.
5. AI and HubSpot requests go through Next.js API routes, keeping keys off the client.

## Main Interfaces

- `Conference`: event metadata plus score inputs.
- `Lead`: field-captured person and context.
- `ContactGroup`: one or more matched encounters.
- `RelationshipSummary`: AI/mock output for relationship arc and follow-up.

## Scoring Method

The conference score is a 100-point weighted rubric:

- 30: ICP vertical fit.
- 25: buyer density.
- 15: audience quality.
- 10: geography fit.
- 10: timing and trip clustering.
- 10: logistics practicality.

Tier bands:

- A: 80+
- B: 65-79
- C: 50-64
- Watch: below 50

## Matching Method

The matching logic prefers precision over noisy automation:

- Exact email auto-groups.
- Name variation plus company or email-domain context auto-groups.
- Common names without strong company context stay separate.
- Job/title changes are preserved in the relationship timeline.

## Integration Strategy

OpenAI:

- Client calls `/api/ai/relationship-summary`.
- Route uses `OPENAI_API_KEY` if present.
- Route returns mock fallback when no key is present.

HubSpot:

- Client calls `/api/hubspot/sync-lead`.
- Route uses `HUBSPOT_PRIVATE_APP_TOKEN` if present.
- Route returns mock sync payload when no token is present.
