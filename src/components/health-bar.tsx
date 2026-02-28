import { cn } from "@/lib/format";

export function HealthBar({ value }: Readonly<{ value: number }>) {
  const tone =
    value >= 85
      ? "bg-emerald-500"
      : value >= 70
        ? "bg-sky-500"
        : value >= 50
          ? "bg-amber-500"
          : "bg-rose-500";

  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-slate-200/70">
        <div
          className={cn("h-2 rounded-full transition-all", tone)}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">{value}% health</p>
    </div>
  );
}
