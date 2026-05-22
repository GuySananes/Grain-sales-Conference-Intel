import type { Lead } from "@/types/domain";

const csvColumns = ["fullName", "company", "title", "email", "intent", "conferenceId", "capturedAt", "notes", "tags"];

function escapeCell(value: string): string {
  const escaped = value.replace(/"/g, "\"\"");
  return `"${escaped}"`;
}

export function leadsToCsv(leads: Lead[]): string {
  const rows = leads.map((lead) =>
    [
      lead.fullName,
      lead.company,
      lead.title,
      lead.email ?? "",
      lead.intent,
      lead.conferenceId,
      lead.capturedAt,
      lead.notes,
      lead.tags.join("; ")
    ]
      .map(escapeCell)
      .join(",")
  );

  return [csvColumns.join(","), ...rows].join("\n");
}
