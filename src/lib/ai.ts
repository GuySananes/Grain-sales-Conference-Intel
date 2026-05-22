import type { ContactGroup, RelationshipSummary } from "@/types/domain";

export function fallbackRelationshipSummary(group: ContactGroup): RelationshipSummary {
  const latest = group.encounters.at(-1);
  const first = group.encounters[0];
  const repeatCount = group.encounters.length;
  const intentTrail = group.encounters.map((encounter) => encounter.intent).join(" -> ");

  return {
    mode: "mock",
    relationshipArc:
      repeatCount > 1
        ? `${group.displayName} first appeared as ${first.title} at ${first.company}; the latest touch is ${latest?.title} at ${latest?.company}. Intent moved ${intentTrail}.`
        : `${group.displayName} has one known conference touch at ${first.company}.`,
    recommendedNudge:
      group.relationshipSignal === "Warming"
        ? "Reference the prior meetings, ask for a focused 20-minute working session, and anchor on the business problem they raised."
        : group.relationshipSignal === "Tire-kicker risk"
          ? "Send one useful resource and ask for a concrete trigger before investing heavy sales time."
          : "Ask a crisp qualification question tied to FX exposure, payment flows, or travel supplier settlement.",
    risk:
      group.relationshipSignal === "Tire-kicker risk"
        ? "They may enjoy the conversation without owning a buying project."
        : "Main risk is over-following up before confirming ownership, urgency, and exposure size.",
    followUpEmail: `Subject: Good seeing you around the conference circuit\n\nHi ${group.displayName.split(" ")[0]},\n\nGood to connect again. I noticed our conversations keep coming back to ${latest?.notes.split(".")[0].toLowerCase()}.\n\nWorth a short working session next week to map where currency exposure is creating friction and whether Grain can help?\n\nBest,\nGrain Sales Team`
  };
}
