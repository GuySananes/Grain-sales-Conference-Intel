import { describe, expect, it } from "vitest";
import { conferences } from "@/data/conferences";
import { getScoredConferences, getTier, scoreConference } from "@/lib/scoring";

describe("conference scoring", () => {
  it("assigns tiers from the agreed score bands", () => {
    expect(getTier(92)).toBe("A");
    expect(getTier(80)).toBe("A");
    expect(getTier(79)).toBe("B");
    expect(getTier(65)).toBe("B");
    expect(getTier(64)).toBe("C");
    expect(getTier(49)).toBe("Watch");
  });

  it("ranks Money20/20 Europe as an A-tier ICP event", () => {
    const event = conferences.find((conference) => conference.id === "money2020-europe-2026");
    expect(event).toBeDefined();
    expect(scoreConference(event!).tier).toBe("A");
  });

  it("sorts conferences by score descending", () => {
    const scored = getScoredConferences(conferences);
    expect(scored[0].score).toBeGreaterThanOrEqual(scored[1].score);
  });
});
