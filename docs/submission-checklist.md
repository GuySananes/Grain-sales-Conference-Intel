# Submission Checklist

## Before Recording

- Run `npm.cmd run test`.
- Run `npm.cmd run lint`.
- Run `npm.cmd run build`.
- Start locally with `npm.cmd run start -- --hostname 127.0.0.1 --port 3000`.
- Walk through the app once on `http://127.0.0.1:3000`.

## Vercel Deployment

1. Create a GitHub repository.
2. Push this project folder.
3. In Vercel, choose "Add New Project" and import the repo.
4. Framework preset should auto-detect Next.js.
5. Leave environment variables empty for demo-safe mode, or add:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `HUBSPOT_PRIVATE_APP_TOKEN`
6. Deploy and copy the live URL.

## Video Recording

Use `docs/video-script.md` as the outline.

Must cover:

- Live salesperson demo.
- Scoring and prioritization logic.
- Cross-conference contact matching and edge cases.
- AI feature and why it belongs here.
- HubSpot path.
- How AI helped build the project.
- What to build next.

## Source Zip

If submitting a zip instead of GitHub, use the generated:

`grain-conference-intelligence-source.zip`

Do not include:

- `node_modules`
- `.next`
- `.env.local`
- personal API keys
