import { fallbackRelationshipSummary } from "@/lib/ai";
import type { ContactGroup, RelationshipSummary } from "@/types/domain";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const group = (await request.json()) as ContactGroup;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(fallbackRelationshipSummary(group));
  }

  const prompt = `You are helping Grain's sales team interpret repeat conference contacts.
Return strict JSON with keys: relationshipArc, recommendedNudge, followUpEmail, risk.
Be concise, useful, and sales-practical. Avoid hype.

Contact group:
${JSON.stringify(group, null, 2)}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a sales intelligence assistant for Grain, a company helping PSPs, travel wholesalers, cross-border payment companies, and FX-exposed businesses manage currency risk."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    const body = await response.json();

    if (!response.ok) {
      return NextResponse.json(fallbackRelationshipSummary(group));
    }

    const content = body.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content) as Omit<RelationshipSummary, "mode">;

    return NextResponse.json({ mode: "ai", ...parsed });
  } catch {
    return NextResponse.json(fallbackRelationshipSummary(group));
  }
}
