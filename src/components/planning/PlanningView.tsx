import { Badge } from "@/components/ui/Badge";
import { formatDateRange, getQuarter } from "@/lib/scoring";
import type { ScoredConference } from "@/types/domain";
import { CalendarDays, Check, MapPinned, Plane } from "lucide-react";
import { useMemo } from "react";

function daysBetween(left: string, right: string): number {
  const one = Date.parse(`${left}T00:00:00`);
  const two = Date.parse(`${right}T00:00:00`);
  return Math.abs(two - one) / (1000 * 60 * 60 * 24);
}

export function PlanningView({
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
  const byQuarter = useMemo(() => {
    return conferences.reduce<Record<string, ScoredConference[]>>((acc, conference) => {
      const quarter = getQuarter(conference.startDate);
      acc[quarter] = [...(acc[quarter] ?? []), conference].sort((a, b) => a.startDate.localeCompare(b.startDate));
      return acc;
    }, {});
  }, [conferences]);

  const gaps = conferences.filter((conference) => conference.tier !== "Watch" && (assignments[conference.id] ?? []).length === 0);
  const clusters = conferences.flatMap((conference, index) =>
    conferences
      .slice(index + 1)
      .filter((candidate) => candidate.region === conference.region && daysBetween(conference.startDate, candidate.startDate) <= 21)
      .map((candidate) => ({ first: conference, second: candidate, days: daysBetween(conference.startDate, candidate.startDate) }))
  );

  return (
    <div className="space-y-5">
      <header className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-grain-muted">Annual coverage</p>
        <h2 className="mt-2 text-3xl font-semibold text-grain-ink">Plan trips where they compound.</h2>
      </header>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-grain-field text-grain-amber">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-grain-muted">Cluster opportunities</p>
              <h3 className="text-xl font-semibold text-grain-ink">Same-region trips within 21 days</h3>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {clusters.slice(0, 5).map(({ first, second, days }) => (
              <article key={`${first.id}-${second.id}`} className="rounded-lg border border-grain-line bg-grain-paper p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="amber">{days} days apart</Badge>
                  <Badge tone="neutral">{first.region}</Badge>
                </div>
                <p className="mt-2 font-semibold text-grain-ink">
                  {first.name} + {second.name}
                </p>
                <p className="mt-1 text-sm text-grain-muted">
                  {first.city} to {second.city}: plan one regional trip or pre-book account meetings around both.
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-grain-field text-grain-rose">
              <MapPinned className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-grain-muted">Open coverage</p>
              <h3 className="text-xl font-semibold text-grain-ink">Priority events without an owner</h3>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {gaps.slice(0, 6).map((conference) => (
              <article key={conference.id} className="grid gap-3 rounded-lg border border-grain-line bg-grain-paper p-4 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-grain-ink">{conference.name}</p>
                    <Badge tone={conference.tier === "A" ? "green" : "teal"}>Tier {conference.tier}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-grain-muted">
                    {formatDateRange(conference.startDate, conference.endDate)} · {conference.city}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {reps.slice(0, 3).map((rep) => (
                    <button
                      key={rep}
                      type="button"
                      onClick={() => onToggleAssignment(conference.id, rep)}
                      className="min-h-9 rounded-lg bg-white px-3 text-sm font-semibold text-grain-ink ring-1 ring-grain-line hover:bg-grain-field"
                    >
                      {rep}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {(["Q1", "Q2", "Q3", "Q4"] as const).map((quarter) => (
          <div key={quarter} className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-grain-teal" />
              <h3 className="text-xl font-semibold text-grain-ink">{quarter}</h3>
            </div>
            <div className="mt-4 space-y-3">
              {(byQuarter[quarter] ?? []).map((conference) => {
                const owners = assignments[conference.id] ?? [];
                return (
                  <article key={conference.id} className="rounded-lg border border-grain-line bg-grain-paper p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-grain-ink">{conference.name}</p>
                      <Badge tone={conference.tier === "A" ? "green" : conference.tier === "B" ? "teal" : "neutral"}>{conference.score}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-grain-muted">
                      {formatDateRange(conference.startDate, conference.endDate)} · {conference.city}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {reps.map((rep) => {
                        const selected = owners.includes(rep);
                        return (
                          <button
                            key={rep}
                            type="button"
                            onClick={() => onToggleAssignment(conference.id, rep)}
                            className={`inline-flex min-h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold ring-1 ${
                              selected ? "bg-emerald-50 text-grain-green ring-emerald-200" : "bg-white text-grain-muted ring-grain-line"
                            }`}
                          >
                            {selected && <Check className="h-3.5 w-3.5" />}
                            {rep}
                          </button>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
