import { Badge } from "@/components/ui/Badge";
import { formatDateRange } from "@/lib/scoring";
import type { Region, ScoredConference, Tier, Vertical } from "@/types/domain";
import { Check, ExternalLink, Search, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";

const verticals: Array<Vertical | "All"> = ["All", "Payments", "Fintech", "Treasury", "Travel", "SaaS", "Banking"];
const regions: Array<Region | "All"> = ["All", "North America", "Europe", "APAC", "Middle East"];
const tiers: Array<Tier | "All"> = ["All", "A", "B", "C", "Watch"];

export function ConferenceExplorer({
  conferences,
  assignments,
  reps,
  onToggleAssignment
}: {
  conferences: ScoredConference[];
  assignments: Record<string, string[]>;
  reps: string[];
  onToggleAssignment: (conferenceId: string, rep: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [vertical, setVertical] = useState<Vertical | "All">("All");
  const [region, setRegion] = useState<Region | "All">("All");
  const [tier, setTier] = useState<Tier | "All">("All");

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    return conferences.filter((conference) => {
      const matchesQuery =
        !normalizedQuery ||
        [conference.name, conference.city, conference.country, conference.description, conference.grainAngle].some((value) =>
          value.toLowerCase().includes(normalizedQuery)
        );
      const matchesVertical = vertical === "All" || conference.verticals.includes(vertical);
      const matchesRegion = region === "All" || conference.region === region;
      const matchesTier = tier === "All" || conference.tier === tier;

      return matchesQuery && matchesVertical && matchesRegion && matchesTier;
    });
  }, [conferences, query, region, tier, vertical]);

  return (
    <div className="space-y-5">
      <header className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-grain-muted">Conference list</p>
        <h2 className="mt-2 text-3xl font-semibold text-grain-ink">Prioritize by ICP fit, not event hype.</h2>
      </header>

      <section className="rounded-lg border border-grain-line bg-white p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.6fr]">
          <label className="relative block">
            <span className="sr-only">Search conferences</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grain-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search event, city, vertical, angle"
              className="h-11 w-full rounded-lg border border-grain-line bg-grain-paper pl-10 pr-3 text-sm text-grain-ink"
            />
          </label>
          <select value={vertical} onChange={(event) => setVertical(event.target.value as Vertical | "All")} className="h-11 rounded-lg border border-grain-line bg-grain-paper px-3 text-sm">
            {verticals.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={region} onChange={(event) => setRegion(event.target.value as Region | "All")} className="h-11 rounded-lg border border-grain-line bg-grain-paper px-3 text-sm">
            {regions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select value={tier} onChange={(event) => setTier(event.target.value as Tier | "All")} className="h-11 rounded-lg border border-grain-line bg-grain-paper px-3 text-sm">
            {tiers.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4">
        {filtered.map((conference) => {
          const owners = assignments[conference.id] ?? [];
          return (
            <article key={conference.id} className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
              <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-grain-ink">{conference.name}</h3>
                    <Badge tone={conference.tier === "A" ? "green" : conference.tier === "B" ? "teal" : "neutral"}>Tier {conference.tier}</Badge>
                    <Badge tone="blue">{conference.score}/100</Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-grain-muted">
                    {formatDateRange(conference.startDate, conference.endDate)} · {conference.city}, {conference.country} · {conference.estimatedAudienceSize.toLocaleString()} est. attendees
                  </p>
                  <p className="mt-3 text-sm leading-6 text-grain-muted">{conference.grainAngle}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {conference.verticals.map((item) => (
                      <Badge key={item} tone="neutral">{item}</Badge>
                    ))}
                  </div>
                  <a
                    href={conference.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-grain-line bg-grain-paper px-3 text-sm font-semibold text-grain-ink hover:bg-grain-field"
                  >
                    Source
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="rounded-lg border border-grain-line bg-grain-paper p-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-grain-green" />
                    <h4 className="font-semibold text-grain-ink">Coverage</h4>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {reps.map((rep) => {
                      const selected = owners.includes(rep);
                      return (
                        <button
                          key={rep}
                          type="button"
                          onClick={() => onToggleAssignment(conference.id, rep)}
                          className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold ${
                            selected
                              ? "border-grain-green bg-emerald-50 text-grain-green"
                              : "border-grain-line bg-white text-grain-muted hover:bg-grain-field"
                          }`}
                        >
                          {selected && <Check className="h-4 w-4" />}
                          {rep}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-grain-muted">
                    {owners.length ? `${owners.join(", ")} assigned` : "No rep assigned yet"}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
