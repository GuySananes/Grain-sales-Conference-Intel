# 5-10 Minute Walkthrough Script

## 0:00 - Problem

Grain sells to payment service providers, cross-border payment companies, travel wholesalers, and teams with FX exposure. Conferences are important for pipeline, but the workflow is scattered across spreadsheets, Slack, and notebooks. This tool gives sales one place to prioritize, plan, capture, and follow up.

## 1:00 - Conference Prioritization

Show the Conference List. Explain the 100-point rubric:

- ICP vertical fit matters most.
- Buyer density matters more than raw audience size.
- Audience quality, geography, clustering, and logistics round out the score.

Use Money20/20 Europe, EuroFinance, and Money20/20 USA as examples of high-scoring events.

## 2:30 - Planning

Open Planning. Show quarterly coverage and open gaps. Point out same-region clusters, like North America events close together. Explain that the goal is not just attending events; it is reducing travel waste and pre-booking account meetings.

## 3:30 - Field Capture

Open Capture. Show how a rep can log a person quickly: name, company, title, email if available, intent, tags, notes. Emphasize that speed matters more than completeness on a busy floor.

## 4:30 - Cross-Conference Intelligence

Open Contacts. Show Maya Chen or Daniel Rosen. Explain exact email matching, name variation handling, job-title changes, and false-positive protection for common names like Alex Morgan.

## 5:45 - AI Feature

Generate an AI nudge. Explain that AI is useful here because it summarizes messy encounter history and turns it into a practical next step and follow-up email. If no key is configured, the fallback still demonstrates the intended behavior.

## 6:30 - HubSpot Path

Open Sync. Show the unsynced queue. Explain that the route can create HubSpot contacts when a private app token is configured, but in review/demo mode it returns a mock success and exposes the payload. CSV export is the backup.

## 7:30 - AI Build Process

Explain how AI helped structure the work, draft tests, and think through matching edge cases. Also explain where judgment was needed: scoring weights, avoiding over-automation, and choosing mock-safe integrations.

## 8:30 - Next Week

With another week:

- Add authenticated multi-user accounts.
- Store data in a real database.
- Add company/account enrichment.
- Add calendar/Slack reminders.
- Build a real HubSpot upsert and activity logging flow.
- Add admin-editable scoring weights.
