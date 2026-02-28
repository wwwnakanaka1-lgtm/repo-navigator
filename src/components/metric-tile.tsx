import { formatPercent } from "@/lib/format";

type MetricTileProps = {
  label: string;
  value: number;
  suffix?: string;
  highlight?: boolean;
};

export function MetricTile({ label, value, suffix, highlight }: Readonly<MetricTileProps>) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        highlight
          ? "surface-card-strong border-orange-300 bg-[linear-gradient(145deg,#fff4ee_0%,#fff 58%)] text-slate-900"
          : "surface-card border-slate-200/80 text-slate-900"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight md:text-[2rem]">
        {value}
        {suffix ?? ""}
      </p>
      {label.toLowerCase().includes("health") ? (
        <p className="mt-1 text-xs text-slate-500">{formatPercent(value)} platform readiness</p>
      ) : null}

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
        <div
          className={`${highlight ? "bg-gradient-to-r from-orange-500 to-rose-500" : "bg-slate-700"} h-full rounded-full`}
          style={{ width: `${Math.max(12, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
