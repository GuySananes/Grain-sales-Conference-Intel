import type { Lead } from "@/types/domain";

export function buildHubSpotPayload(lead: Lead) {
  const [firstName, ...lastParts] = lead.fullName.trim().split(/\s+/);

  return {
    properties: {
      firstname: firstName ?? "",
      lastname: lastParts.join(" "),
      email: lead.email ?? "",
      company: lead.company,
      jobtitle: lead.title
    },
    context: {
      conferenceId: lead.conferenceId,
      capturedAt: lead.capturedAt,
      intent: lead.intent,
      notes: lead.notes,
      tags: lead.tags
    }
  };
}

export async function syncLeadToHubSpot(lead: Lead, token: string) {
  const payload = buildHubSpotPayload(lead);
  const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ properties: payload.properties })
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.message ?? "HubSpot contact sync failed");
  }

  return { hubspotResponse: body, payload };
}
