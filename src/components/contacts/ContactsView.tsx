import { Badge } from "@/components/ui/Badge";
import { formatDateRange } from "@/lib/scoring";
import type { ContactGroup, RelationshipSummary, ScoredConference } from "@/types/domain";
import { BrainCircuit, Sparkles, UserRoundSearch } from "lucide-react";

function conferenceLabel(conferences: ScoredConference[], id: string) {
  const conference = conferences.find((item) => item.id === id);
  if (!conference) return id;
  return `${conference.name} · ${formatDateRange(conference.startDate, conference.endDate)}`;
}

function signalTone(signal: ContactGroup["relationshipSignal"]) {
  if (signal === "Warming") return "green";
  if (signal === "Tire-kicker risk") return "rose";
  if (signal === "Needs review") return "amber";
  return "neutral";
}

export function ContactsView({
  groups,
  conferences,
  summaries,
  generatingGroupId,
  onGenerateSummary
}: {
  groups: ContactGroup[];
  conferences: ScoredConference[];
  summaries: Record<string, RelationshipSummary>;
  generatingGroupId: string | null;
  onGenerateSummary: (group: ContactGroup) => void;
}) {
  return (
    <div className="space-y-5">
      <header className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-grain-ink text-white">
            <UserRoundSearch className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-grain-muted">Cross-conference intelligence</p>
            <h2 className="text-3xl font-semibold text-grain-ink">Spot relationships, not just duplicate rows.</h2>
          </div>
        </div>
      </header>

      <section className="grid gap-4">
        {groups.map((group) => {
          const summary = summaries[group.id];
          return (
            <article key={group.id} className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
              <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-grain-ink">{group.displayName}</h3>
                    <Badge tone={signalTone(group.relationshipSignal)}>{group.relationshipSignal}</Badge>
                    <Badge tone="neutral">{group.confidence}</Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-grain-muted">{group.primaryCompany}</p>
                  <p className="mt-3 text-sm leading-6 text-grain-muted">{group.interpretation}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.reasons.map((reason) => (
                      <Badge key={reason} tone="blue">{reason}</Badge>
                    ))}
                  </div>

                  <div className="mt-5 overflow-hidden rounded-lg border border-grain-line">
                    {group.encounters.map((lead) => (
                      <div key={lead.id} className="border-b border-grain-line bg-grain-paper p-4 last:border-b-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-grain-ink">{lead.title || "Unknown title"}</p>
                          <Badge tone={lead.intent === "High" ? "green" : lead.intent === "Medium" ? "teal" : "amber"}>{lead.intent}</Badge>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-grain-muted">{conferenceLabel(conferences, lead.conferenceId)}</p>
                        <p className="mt-2 text-sm leading-6 text-grain-muted">{lead.notes}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {lead.tags.map((tag) => (
                            <Badge key={tag} tone="neutral">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="rounded-lg border border-grain-line bg-grain-paper p-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-grain-teal" />
                    <h4 className="font-semibold text-grain-ink">AI nudge</h4>
                  </div>
                  {summary ? (
                    <div className="mt-4 space-y-4">
                      <Badge tone={summary.mode === "ai" ? "green" : "amber"}>{summary.mode === "ai" ? "OpenAI" : "Demo fallback"}</Badge>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-grain-muted">Arc</p>
                        <p className="mt-1 text-sm leading-6 text-grain-ink">{summary.relationshipArc}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-grain-muted">Nudge</p>
                        <p className="mt-1 text-sm leading-6 text-grain-ink">{summary.recommendedNudge}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-grain-muted">Follow-up draft</p>
                        <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-white p-3 text-sm leading-6 text-grain-ink ring-1 ring-grain-line">{summary.followUpEmail}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-sm leading-6 text-grain-muted">
                        Generates a relationship arc, qualification risk, and a practical follow-up email from the encounter history.
                      </p>
                      <button
                        type="button"
                        onClick={() => onGenerateSummary(group)}
                        disabled={generatingGroupId === group.id}
                        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-grain-ink px-4 text-sm font-semibold text-white hover:bg-black disabled:cursor-wait disabled:opacity-70"
                      >
                        <Sparkles className="h-4 w-4" />
                        {generatingGroupId === group.id ? "Generating" : "Generate nudge"}
                      </button>
                    </div>
                  )}
                </aside>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
