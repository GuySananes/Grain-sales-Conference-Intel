import { describe, expect, it } from "vitest";
import { sampleLeads } from "@/data/sampleLeads";
import { createContactGroups } from "@/lib/matching";
import type { Lead } from "@/types/domain";

describe("cross-conference contact matching", () => {
  it("groups exact email matches even when the name and title change", () => {
    const groups = createContactGroups(sampleLeads);
    const maya = groups.find((group) => group.encounters.some((lead) => lead.email === "maya.chen@flypay.com"));

    expect(maya?.encounters).toHaveLength(2);
    expect(maya?.relationshipSignal).toBe("Warming");
  });

  it("keeps common names separate when company context conflicts", () => {
    const groups = createContactGroups(sampleLeads);
    const alexGroups = groups.filter((group) => group.displayName === "Alex Morgan");

    expect(alexGroups).toHaveLength(2);
  });

  it("surfaces job changes as a relationship arc instead of breaking the group", () => {
    const danielLead: Lead = {
      id: "lead-test-daniel",
      conferenceId: "sibos-2026",
      capturedAt: "2026-09-30T12:00:00.000Z",
      fullName: "Daniel Rosen",
      company: "GlobeStay",
      title: "VP Treasury",
      email: "daniel.rosen@globestay.com",
      notes: "Now owns treasury systems budget.",
      intent: "High",
      tags: ["Promotion"],
      hubspotStatus: "not_synced"
    };

    const groups = createContactGroups([...sampleLeads, danielLead]);
    const daniel = groups.find((group) => group.encounters.some((lead) => lead.id === "lead-test-daniel"));

    expect(daniel?.encounters.length).toBe(3);
    expect(daniel?.relationshipSignal).toBe("Warming");
  });
});
