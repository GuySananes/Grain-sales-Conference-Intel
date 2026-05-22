import { buildHubSpotPayload, syncLeadToHubSpot } from "@/lib/hubspot";
import type { Lead } from "@/types/domain";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const lead = (await request.json()) as Lead;
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  const payload = buildHubSpotPayload(lead);

  if (!token) {
    return NextResponse.json({
      mode: "mock",
      status: "mock_synced",
      message: "No HubSpot token configured. This is the payload that would be sent.",
      payload
    });
  }

  try {
    const result = await syncLeadToHubSpot(lead, token);
    return NextResponse.json({
      mode: "live",
      status: "synced",
      ...result
    });
  } catch (error) {
    return NextResponse.json(
      {
        mode: "live",
        status: "failed",
        message: error instanceof Error ? error.message : "HubSpot sync failed",
        payload
      },
      { status: 502 }
    );
  }
}
