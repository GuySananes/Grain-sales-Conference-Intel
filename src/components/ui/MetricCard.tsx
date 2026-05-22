import type { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  detail,
  icon,
  tone = "green"
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: ReactNode;
  tone?: "green" | "teal" | "blue" | "amber";
}) {
  const toneClass = {
    green: "from-emerald-500 to-grain-green text-emerald-700",
    teal: "from-cyan-500 to-grain-teal text-cyan-700",
    blue: "from-blue-500 to-grain-blue text-blue-700",
    amber: "from-amber-500 to-grain-amber text-amber-700"
  };

  return (
    <section className="relative overflow-hidden rounded-lg border border-white/80 bg-white p-4 shadow-soft ring-1 ring-grain-line/70">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${toneClass[tone].split(" ").slice(0, 2).join(" ")}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-grain-muted">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-grain-ink">{value}</p>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-grain-field ${toneClass[tone].split(" ").at(-1)}`}>{icon}</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-grain-muted">{detail}</p>
    </section>
  );
}
