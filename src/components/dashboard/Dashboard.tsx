import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import { formatDateRange } from "@/lib/scoring";
import type { ContactGroup, Lead, ScoredConference } from "@/types/domain";
import { ArrowRight, CalendarCheck2, CircleDollarSign, ContactRound, DatabaseZap, MapPinned, Plane, Sparkles, Target, UserPlus } from "lucide-react";

type View = "dashboard" | "conferences" | "planning" | "capture" | "contacts" | "settings";

export function Dashboard({
  conferences,
  leads,
  contactGroups,
  assignments,
  onViewChange
}: {
  conferences: ScoredConference[];
  leads: Lead[];
  contactGroups: ContactGroup[];
  assignments: Record<string, string[]>;
  onViewChange: (view: View) => void;
}) {
  const topEvents = conferences.filter((conference) => conference.tier === "A").slice(0, 4);
  const unsynced = leads.filter((lead) => lead.hubspotStatus === "not_synced" || lead.hubspotStatus === "failed");
  const repeatGroups = contactGroups.filter((group) => group.encounters.length > 1);
  const coverageGaps = conferences.filter((conference) => conference.tier !== "Watch" && (assignments[conference.id] ?? []).length === 0);
  const futureConferences = conferences.filter((conference) => new Date(`${conference.startDate}T00:00:00`) >= new Date("2026-05-22T00:00:00"));
  const nextAEvent = topEvents[0];

  return (
    <div className="space-y-5">
      <header className="overflow-hidden rounded-lg border border-white/20 bg-grain-ink text-white shadow-soft">
        <div className="dashboard-grid grid gap-5 p-5 lg:grid-cols-[1fr_360px] lg:p-6">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="inline-flex min-h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">
                <Sparkles className="h-4 w-4" />
                Pipeline command center
              </div>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white lg:text-5xl">
                Choose the right conferences. Capture the right people. Follow up with context.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/68">
                Built around Grain ICP: PSPs, payments teams, treasury leaders, travel wholesalers, and businesses exposed to currency risk.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onViewChange("capture")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-grain-ink shadow-soft hover:bg-grain-field"
              >
                <UserPlus className="h-4 w-4" />
                Capture lead
              </button>
              <button
                type="button"
                onClick={() => onViewChange("planning")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/[0.12] bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/[0.15]"
              >
                <Plane className="h-4 w-4" />
                Plan coverage
              </button>
            </div>
          </div>

          <aside className="rounded-lg border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">Next best move</p>
            {nextAEvent && (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-semibold text-white">{nextAEvent.name}</h3>
                  <div
                    className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-lg font-semibold text-white"
                    style={{ background: `conic-gradient(#19a974 ${nextAEvent.score * 3.6}deg, rgba(255,255,255,0.16) 0deg)` }}
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-grain-ink">{nextAEvent.score}</div>
                  </div>
                </div>
                <p className="mt-2 text-sm font-semibold text-emerald-100">
                  {formatDateRange(nextAEvent.startDate, nextAEvent.endDate)} · {nextAEvent.city}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/68">{nextAEvent.grainAngle}</p>
              </div>
            )}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xl font-semibold">{coverageGaps.length}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Gaps</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xl font-semibold">{repeatGroups.length}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Repeats</p>
              </div>
              <div className="rounded-lg bg-white/10 p-3">
                <p className="text-xl font-semibold">{unsynced.length}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Sync</p>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard tone="green" label="A-tier events" value={topEvents.length} detail="Highest ICP fit across payments, treasury, and travel." icon={<CircleDollarSign className="h-5 w-5" />} />
        <MetricCard tone="teal" label="Upcoming events" value={futureConferences.length} detail="Future 2026 events in the planning board." icon={<CalendarCheck2 className="h-5 w-5" />} />
        <MetricCard tone="blue" label="Repeat contacts" value={repeatGroups.length} detail="People seen across more than one conference." icon={<ContactRound className="h-5 w-5" />} />
        <MetricCard tone="amber" label="Unsynced leads" value={unsynced.length} detail="Ready for HubSpot API or CSV backup." icon={<DatabaseZap className="h-5 w-5" />} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-lg border border-white/80 bg-white shadow-soft ring-1 ring-grain-line/70">
          <div className="border-b border-grain-line bg-grain-paper px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-grain-muted">Priority list</p>
              <h3 className="mt-1 text-xl font-semibold text-grain-ink">Best ICP fit right now</h3>
            </div>
            <button
              type="button"
              onClick={() => onViewChange("conferences")}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-grain-line bg-grain-paper px-3 text-sm font-semibold text-grain-ink hover:bg-grain-field"
            >
              Explore
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          </div>

          <div className="divide-y divide-grain-line">
            {topEvents.map((conference) => (
              <article key={conference.id} className="grid gap-4 px-5 py-4 hover:bg-grain-paper/70 lg:grid-cols-[76px_1fr_auto]">
                <div className="grid h-16 w-16 place-items-center rounded-lg bg-grain-ink text-white">
                  <div className="text-center">
                    <p className="text-xl font-semibold">{conference.score}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/58">Fit</p>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-semibold text-grain-ink">{conference.name}</h4>
                    <Badge tone="green">Tier {conference.tier}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-grain-muted">{conference.grainAngle}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {conference.verticals.slice(0, 3).map((vertical) => (
                      <Badge key={vertical} tone="neutral">{vertical}</Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-grain-paper p-3 text-sm text-grain-muted lg:min-w-44 lg:text-right">
                  <p className="font-semibold text-grain-ink">{formatDateRange(conference.startDate, conference.endDate)}</p>
                  <p>{conference.city}, {conference.country}</p>
                  <p>{(assignments[conference.id] ?? []).join(", ") || "No owner"}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/80 bg-white p-5 shadow-soft ring-1 ring-grain-line/70">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-grain-field text-grain-teal">
              <MapPinned className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-grain-muted">Coverage map</p>
              <h3 className="text-xl font-semibold text-grain-ink">Where the year clusters</h3>
            </div>
          </div>

          <div className="relative mt-5 h-72 overflow-hidden rounded-lg border border-grain-line bg-[#ddebd9]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,33,27,0.07)_1px,transparent_1px),linear-gradient(rgba(23,33,27,0.07)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <div className="absolute left-4 top-4 rounded-lg bg-white/[0.82] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-grain-muted shadow-soft">
              Trip clusters
            </div>
            <div className="absolute left-[13%] top-[24%] h-2 w-32 rotate-[-12deg] rounded-full bg-grain-teal/45" />
            <div className="absolute left-[42%] top-[44%] h-2 w-36 rotate-[8deg] rounded-full bg-grain-green/45" />
            <div className="absolute left-[62%] top-[34%] h-2 w-28 rotate-[-18deg] rounded-full bg-grain-amber/45" />
            {[
              ["London", "18%", "28%", "bg-grain-green"],
              ["Amsterdam", "26%", "24%", "bg-grain-teal"],
              ["Barcelona", "31%", "42%", "bg-grain-amber"],
              ["New York", "55%", "36%", "bg-grain-blue"],
              ["Miami", "62%", "52%", "bg-grain-rose"],
              ["Singapore", "82%", "58%", "bg-grain-green"]
            ].map(([label, left, top, color]) => (
              <div key={label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left, top }}>
                <div className={`h-5 w-5 rounded-full border-[3px] border-white ${color} shadow-soft`} />
                <p className="mt-1 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-grain-ink shadow-soft">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3 text-sm text-grain-muted">
            <p>
              {coverageGaps.length} priority events still need an owner. The strongest travel and treasury cluster lands from September to November.
            </p>
            <button
              type="button"
              onClick={() => onViewChange("planning")}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-grain-ink px-3 text-sm font-semibold text-white hover:bg-black"
            >
              Plan coverage
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/80 bg-white p-5 shadow-soft ring-1 ring-grain-line/70">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-grain-muted">Relationship alerts</p>
            <h3 className="mt-1 text-xl font-semibold text-grain-ink">Repeat contacts that deserve judgment</h3>
          </div>
          <button
            type="button"
            onClick={() => onViewChange("contacts")}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-grain-line bg-grain-paper px-3 text-sm font-semibold text-grain-ink hover:bg-grain-field"
          >
            Open contacts
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {repeatGroups.slice(0, 3).map((group) => (
            <article key={group.id} className="rounded-lg border border-grain-line bg-grain-paper p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Target className="h-4 w-4 text-grain-green" />
                <h4 className="font-semibold text-grain-ink">{group.displayName}</h4>
                <Badge tone={group.relationshipSignal === "Warming" ? "green" : "amber"}>{group.relationshipSignal}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-grain-muted">{group.interpretation}</p>
              <p className="mt-3 text-sm font-semibold text-grain-ink">{group.encounters.length} encounters</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
