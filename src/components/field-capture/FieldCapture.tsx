import { Badge } from "@/components/ui/Badge";
import { formatDateRange } from "@/lib/scoring";
import type { IntentLevel, Lead, ScoredConference } from "@/types/domain";
import { ClipboardCheck, Mail, Plus, RotateCcw, Tag, UserPlus } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

const intentOptions: IntentLevel[] = ["High", "Medium", "Curious", "Low"];
const quickTags = ["PSP", "Treasury", "Travel wholesaler", "Cross-border", "FX exposure", "Buying committee", "Follow up"];

const emptyForm = {
  fullName: "",
  company: "",
  title: "",
  email: "",
  phone: "",
  notes: "",
  intent: "Medium" as IntentLevel,
  tags: [] as string[]
};

function newLeadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}`;
}

export function FieldCapture({ conferences, onAddLead }: { conferences: ScoredConference[]; onAddLead: (lead: Lead) => void }) {
  const upcomingOrTop = useMemo(
    () =>
      conferences
        .filter((conference) => new Date(`${conference.startDate}T00:00:00`) >= new Date("2026-05-22T00:00:00"))
        .slice(0, 8),
    [conferences]
  );
  const [conferenceId, setConferenceId] = useState(upcomingOrTop[0]?.id ?? conferences[0]?.id);
  const [form, setForm] = useState(emptyForm);
  const selectedConference = conferences.find((conference) => conference.id === conferenceId);

  function toggleTag(tag: string) {
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag) ? current.tags.filter((item) => item !== tag) : [...current.tags, tag]
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.fullName.trim() || !form.company.trim()) return;

    onAddLead({
      id: newLeadId(),
      conferenceId,
      capturedAt: new Date().toISOString(),
      fullName: form.fullName.trim(),
      company: form.company.trim(),
      title: form.title.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      notes: form.notes.trim(),
      intent: form.intent,
      tags: form.tags,
      hubspotStatus: "not_synced"
    });
    setForm(emptyForm);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-grain-ink text-white">
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-grain-muted">Field capture</p>
            <h2 className="text-3xl font-semibold text-grain-ink">Log the meeting before the next badge scan.</h2>
          </div>
        </div>
      </header>

      <form onSubmit={submit} className="rounded-lg border border-grain-line bg-white p-5 shadow-soft">
        <label className="block">
          <span className="text-sm font-semibold text-grain-ink">Conference</span>
          <select
            value={conferenceId}
            onChange={(event) => setConferenceId(event.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-grain-line bg-grain-paper px-3 text-sm"
          >
            {upcomingOrTop.map((conference) => (
              <option key={conference.id} value={conference.id}>
                {conference.name} · {conference.city}
              </option>
            ))}
          </select>
        </label>

        {selectedConference && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="green">Tier {selectedConference.tier}</Badge>
            <Badge tone="blue">{selectedConference.score}/100</Badge>
            <span className="text-sm text-grain-muted">{formatDateRange(selectedConference.startDate, selectedConference.endDate)}</span>
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-grain-ink">Name</span>
            <input
              value={form.fullName}
              onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
              className="mt-2 h-12 w-full rounded-lg border border-grain-line bg-grain-paper px-3 text-sm"
              placeholder="Maya Chen"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-grain-ink">Company</span>
            <input
              value={form.company}
              onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
              className="mt-2 h-12 w-full rounded-lg border border-grain-line bg-grain-paper px-3 text-sm"
              placeholder="FlyPay"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-grain-ink">Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="mt-2 h-12 w-full rounded-lg border border-grain-line bg-grain-paper px-3 text-sm"
              placeholder="VP Partnerships"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-grain-ink">Email</span>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grain-muted" />
              <input
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="h-12 w-full rounded-lg border border-grain-line bg-grain-paper pl-10 pr-3 text-sm"
                placeholder="maya@company.com"
                type="email"
              />
            </div>
          </label>
        </div>

        <div className="mt-5">
          <span className="text-sm font-semibold text-grain-ink">Intent</span>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {intentOptions.map((intent) => (
              <button
                key={intent}
                type="button"
                onClick={() => setForm((current) => ({ ...current, intent }))}
                className={`min-h-11 rounded-lg text-sm font-semibold ring-1 ${
                  form.intent === intent ? "bg-grain-ink text-white ring-grain-ink" : "bg-grain-paper text-grain-muted ring-grain-line"
                }`}
              >
                {intent}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-grain-green" />
            <span className="text-sm font-semibold text-grain-ink">Tags</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {quickTags.map((tag) => {
              const selected = form.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`min-h-9 rounded-lg px-3 text-sm font-semibold ring-1 ${
                    selected ? "bg-emerald-50 text-grain-green ring-emerald-200" : "bg-grain-paper text-grain-muted ring-grain-line"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-grain-ink">Notes</span>
          <textarea
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            className="mt-2 min-h-28 w-full resize-y rounded-lg border border-grain-line bg-grain-paper p-3 text-sm leading-6"
            placeholder="Pain, urgency, current process, next step"
          />
        </label>

        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-grain-green px-4 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            <ClipboardCheck className="h-4 w-4" />
            Save lead
          </button>
          <button
            type="button"
            onClick={() => setForm(emptyForm)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-grain-line bg-grain-paper px-4 text-sm font-semibold text-grain-ink hover:bg-grain-field"
          >
            <RotateCcw className="h-4 w-4" />
            Clear
          </button>
        </div>
      </form>

      <section className="rounded-lg border border-grain-line bg-grain-paper p-4">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-grain-green" />
          <p className="text-sm font-semibold text-grain-ink">Fast demo input</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-grain-muted">
          Try: “Maya Chen, FlyPay, Head of Strategic Partnerships, high intent, APAC expansion.” The contacts view will fold it into the existing relationship.
        </p>
      </section>
    </div>
  );
}
