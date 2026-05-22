import type { Conference, ScoredConference, Tier } from "@/types/domain";

export function calculateConferenceScore(conference: Conference): number {
  const inputs = conference.scoreInputs;

  return Math.round(
    inputs.verticalFit +
      inputs.buyerDensity +
      inputs.audienceQuality +
      inputs.geographyFit +
      inputs.timingClusterPotential +
      inputs.logisticsPracticality
  );
}

export function getTier(score: number): Tier {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  return "Watch";
}

export function scoreConference(conference: Conference): ScoredConference {
  const score = calculateConferenceScore(conference);

  return {
    ...conference,
    score,
    tier: getTier(score)
  };
}

export function getScoredConferences(conferences: Conference[]): ScoredConference[] {
  return conferences.map(scoreConference).sort((a, b) => b.score - a.score);
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const sameYear = start.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && start.getMonth() === end.getMonth();
  const sameDay = start.toDateString() === end.toDateString();

  const monthDay = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  });
  const monthDayYear = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  if (sameDay) return monthDayYear.format(start);
  if (sameMonth) return `${monthDay.format(start)}-${end.getDate()}, ${end.getFullYear()}`;
  if (sameYear) return `${monthDay.format(start)}-${monthDayYear.format(end)}`;

  return `${monthDayYear.format(start)}-${monthDayYear.format(end)}`;
}

export function getQuarter(date: string): string {
  const month = new Date(`${date}T00:00:00`).getMonth();
  return `Q${Math.floor(month / 3) + 1}`;
}
