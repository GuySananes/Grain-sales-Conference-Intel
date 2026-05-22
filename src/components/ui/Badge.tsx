import type { ReactNode } from "react";

const toneClass = {
  green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  teal: "bg-cyan-50 text-cyan-800 ring-cyan-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  rose: "bg-rose-50 text-rose-800 ring-rose-200",
  blue: "bg-blue-50 text-blue-800 ring-blue-200",
  neutral: "bg-stone-100 text-stone-700 ring-stone-200"
};

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: keyof typeof toneClass;
}) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ${toneClass[tone]}`}>
      {children}
    </span>
  );
}
