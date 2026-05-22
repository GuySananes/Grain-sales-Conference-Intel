"use client";

import { ContactsView } from "@/components/contacts/ContactsView";
import { ConferenceExplorer } from "@/components/conferences/ConferenceExplorer";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { FieldCapture } from "@/components/field-capture/FieldCapture";
import { PlanningView } from "@/components/planning/PlanningView";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { conferences } from "@/data/conferences";
import { sampleLeads } from "@/data/sampleLeads";
import { createContactGroups } from "@/lib/matching";
import { getScoredConferences } from "@/lib/scoring";
import { usePersistentState } from "@/lib/storage";
import type { ContactGroup, Lead, RelationshipSummary } from "@/types/domain";
import { Activity, BarChart3, CalendarRange, ContactRound, DatabaseZap, MapPinned, Radar, ShieldCheck, UserPlus, Wifi } from "lucide-react";
import { useMemo, useState } from "react";

type View = "dashboard" | "conferences" | "planning" | "capture" | "contacts" | "settings";

const reps = ["Dana", "Noam", "Riley", "Lia"];

const defaultAssignments: Record<string, string[]> = {
  "money2020-europe-2026": ["Dana", "Noam"],
  "eurofinance-2026": ["Lia"],
  "money2020-usa-2026": ["Dana", "Riley"],
  "skift-global-forum-2026": ["Noam"],
  "sibos-2026": ["Riley"]
};

const navItems: Array<{ id: View; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "conferences", label: "Conferences", icon: Radar },
  { id: "planning", label: "Planning", icon: CalendarRange },
  { id: "capture", label: "Capture", icon: UserPlus },
  { id: "contacts", label: "Contacts", icon: ContactRound },
  { id: "settings", label: "Sync", icon: DatabaseZap }
];

export function AppShell() {
  const scoredConferences = useMemo(() => getScoredConferences(conferences), []);
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [leads, setLeads] = usePersistentState<Lead[]>("grain-demo-leads", sampleLeads);
  const [assignments, setAssignments] = usePersistentState<Record<string, string[]>>("grain-demo-assignments", defaultAssignments);
  const [summaries, setSummaries] = useState<Record<string, RelationshipSummary>>({});
  const [generatingGroupId, setGeneratingGroupId] = useState<string | null>(null);
  const [syncingLeadId, setSyncingLeadId] = useState<string | null>(null);

  const contactGroups = useMemo(() => createContactGroups(leads), [leads]);

  function toggleAssignment(conferenceId: string, rep: string) {
    setAssignments((current) => {
      const existing = current[conferenceId] ?? [];
      const next = existing.includes(rep) ? existing.filter((item) => item !== rep) : [...existing, rep];
      return {
        ...current,
        [conferenceId]: next
      };
    });
  }

  function addLead(lead: Lead) {
    setLeads((current) => [lead, ...current]);
    setActiveView("contacts");
  }

  async function generateSummary(group: ContactGroup) {
    setGeneratingGroupId(group.id);
    try {
      const response = await fetch("/api/ai/relationship-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group)
      });
      const summary = (await response.json()) as RelationshipSummary;
      setSummaries((current) => ({ ...current, [group.id]: summary }));
    } finally {
      setGeneratingGroupId(null);
    }
  }

  async function syncLead(leadId: string) {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) return;

    setSyncingLeadId(leadId);
    try {
      const response = await fetch("/api/hubspot/sync-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
      const result = (await response.json()) as { status?: Lead["hubspotStatus"] };
      setLeads((current) =>
        current.map((item) =>
          item.id === leadId
            ? {
                ...item,
                hubspotStatus: response.ok ? result.status ?? "mock_synced" : "failed",
                syncedAt: response.ok ? new Date().toISOString() : item.syncedAt
              }
            : item
        )
      );
    } finally {
      setSyncingLeadId(null);
    }
  }

  function resetDemo() {
    setLeads(sampleLeads);
    setAssignments(defaultAssignments);
    setSummaries({});
    setActiveView("dashboard");
  }

  const aTierCount = scoredConferences.filter((conference) => conference.tier === "A").length;
  const repeatCount = contactGroups.filter((group) => group.encounters.length > 1).length;

  return (
    <main className="min-h-screen px-3 py-4 sm:px-5 lg:px-7">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4 lg:flex-row">
        <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-[280px]">
          <div className="flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-grain-ink text-white shadow-soft">
            <div className="dashboard-grid border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-white text-grain-ink shadow-soft">
                <MapPinned className="h-6 w-6" />
              </div>
              <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Grain sales</p>
                  <h1 className="text-xl font-semibold text-white">Conference Intel</h1>
              </div>
            </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.08] p-3">
                  <p className="text-2xl font-semibold">{aTierCount}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/55">A-tier</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.08] p-3">
                  <p className="text-2xl font-semibold">{repeatCount}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/55">Repeats</p>
                </div>
              </div>
            </div>

            <nav className="grid grid-cols-2 gap-2 p-4 lg:grid-cols-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    className={`flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
                      isActive ? "bg-white text-grain-ink shadow-soft" : "bg-white/5 text-white/68 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto space-y-3 border-t border-white/10 p-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.08] p-3">
                <div className="flex items-center gap-2 text-emerald-200">
                  <Wifi className="h-4 w-4" />
                  <p className="text-sm font-semibold">Demo live</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  {leads.length} leads, {repeatCount} repeat relationships, mock-safe integrations.
                </p>
              </div>
              <div className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/54">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-200" />
                  Keys configurable
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-200" />
                  LocalStorage MVP
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          {activeView === "dashboard" && (
            <Dashboard
              conferences={scoredConferences}
              leads={leads}
              contactGroups={contactGroups}
              assignments={assignments}
              onViewChange={setActiveView}
            />
          )}
          {activeView === "conferences" && (
            <ConferenceExplorer
              conferences={scoredConferences}
              assignments={assignments}
              reps={reps}
              onToggleAssignment={toggleAssignment}
            />
          )}
          {activeView === "planning" && (
            <PlanningView
              conferences={scoredConferences}
              assignments={assignments}
              reps={reps}
              onToggleAssignment={toggleAssignment}
            />
          )}
          {activeView === "capture" && <FieldCapture conferences={scoredConferences} onAddLead={addLead} />}
          {activeView === "contacts" && (
            <ContactsView
              groups={contactGroups}
              conferences={scoredConferences}
              summaries={summaries}
              generatingGroupId={generatingGroupId}
              onGenerateSummary={generateSummary}
            />
          )}
          {activeView === "settings" && (
            <SettingsPanel leads={leads} syncingLeadId={syncingLeadId} onResetDemo={resetDemo} onSyncLead={syncLead} />
          )}
        </section>
      </div>
    </main>
  );
}
