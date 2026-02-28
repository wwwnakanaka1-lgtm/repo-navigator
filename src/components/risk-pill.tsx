import { cn } from "@/lib/format";
import { HealthLevel } from "@/lib/types";

const RISK_THEME: Record<HealthLevel, string> = {
  excellent: "bg-emerald-100 text-emerald-800 border-emerald-200",
  good: "bg-sky-100 text-sky-800 border-sky-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  critical: "bg-rose-100 text-rose-800 border-rose-200",
};

export function RiskPill({ level }: Readonly<{ level: HealthLevel }>) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]",
        RISK_THEME[level],
      )}
    >
      {level}
    </span>
  );
}
