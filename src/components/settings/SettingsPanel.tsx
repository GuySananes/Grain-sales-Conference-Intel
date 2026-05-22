import { Badge } from "@/components/ui/Badge";
import { leadsToCsv } from "@/lib/csv";
import type { Lead } from "@/types/domain";
import { Download, RotateCcw, Send, Settings2 } from "lucide-react";

function downloadCsv(leads: Lead[]) {
  const blob = new Blob([leadsToCsv(leads)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "grain-conference-leads.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function SettingsPanel({
  leads,
  syncingLeadId,
  onSyncLead,
  onResetDemo
}: {
  leads: Lead[];
  syncingLeadId: string | null;
  onSyncLead: (leadId: string) => void;
  onResetDemo: () => void;
}) {
  const unsynced = leads.filter((lead) => lead.hubspotStatus === "not_synced" || lead.hubspotStatus === "failed");

  return (
    <div className="space-y-5">
      <header className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-grain-ink text-white">
            <Settings2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-grain-muted">HubSpot path</p>
            <h2 className="text-3xl font-semibold text-grain-ink">Sync when a token exists, mock when it does not.</h2>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-grain-ink">Lead export</p>
          <p className="mt-2 text-sm leading-6 text-grain-muted">{leads.length} captured leads are available for CRM import or analysis.</p>
          <button
            type="button"
            onClick={() => downloadCsv(leads)}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-grain-green px-4 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </article>

        <article className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-grain-ink">API route</p>
          <p className="mt-2 text-sm leading-6 text-grain-muted">`/api/hubspot/sync-lead` uses `HUBSPOT_PRIVATE_APP_TOKEN` when configured.</p>
          <Badge tone="amber">Mock-safe by default</Badge>
        </article>

        <article className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-grain-ink">Demo reset</p>
          <p className="mt-2 text-sm leading-6 text-grain-muted">Restore seeded leads, assignments, and relationship examples.</p>
          <button
            type="button"
            onClick={onResetDemo}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-grain-line bg-grain-paper px-4 text-sm font-semibold text-grain-ink hover:bg-grain-field"
          >
            <RotateCcw className="h-4 w-4" />
            Reset demo
          </button>
        </article>
      </section>

      <section className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-grain-muted">Unsynced queue</p>
            <h3 className="mt-1 text-xl font-semibold text-grain-ink">{unsynced.length} leads ready to push</h3>
          </div>
          <button
            type="button"
            onClick={() => unsynced.forEach((lead) => onSyncLead(lead.id))}
            disabled={!unsynced.length || Boolean(syncingLeadId)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-grain-ink px-4 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            Sync queue
          </button>
        </div>

        <div className="mt-4 divide-y divide-grain-line overflow-hidden rounded-lg border border-grain-line">
          {leads.map((lead) => (
            <article key={lead.id} className="grid gap-3 bg-grain-paper p-4 md:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-grain-ink">{lead.fullName}</p>
                  <Badge tone={lead.hubspotStatus === "synced" || lead.hubspotStatus === "mock_synced" ? "green" : lead.hubspotStatus === "failed" ? "rose" : "neutral"}>
                    {lead.hubspotStatus.replace("_", " ")}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-grain-muted">
                  {lead.company} · {lead.title || "Unknown title"} · {lead.email || "No email"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSyncLead(lead.id)}
                disabled={syncingLeadId === lead.id}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-3 text-sm font-semibold text-grain-ink ring-1 ring-grain-line hover:bg-grain-field disabled:cursor-wait disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {syncingLeadId === lead.id ? "Syncing" : "Sync"}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
