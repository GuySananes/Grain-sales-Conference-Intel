# AI Build Log

## How AI Was Used

- Broke the assignment into product workflows and implementation slices.
- Translated the business problem into a scoring model and UI structure.
- Drafted seed data categories and edge cases for contact matching.
- Generated implementation scaffolding, tests, and documentation.
- Used AI as a reviewer for scope: keep the app demoable, avoid overbuilding a CRM.

## Where AI Helped

- Clarifying the right level of MVP depth.
- Making the scoring method explainable.
- Stress-testing contact matching edge cases.
- Preparing video narration and submission docs.

## Where AI Needed Human Judgment

- The scoring weights are product judgment, not objective truth.
- The UI needed sales empathy: fewer required fields, faster capture, stronger next-step cues.
- Contact matching needed restraint; common names should not auto-merge without context.
- HubSpot integration needed a mock-safe path because real credentials may not be available during review.

## AI Feature In The Product

The product's AI feature summarizes a repeat contact's relationship arc and drafts a practical follow-up. This is a good AI use case because the input is messy sales context and the output is language plus judgment, not a deterministic calculation.
