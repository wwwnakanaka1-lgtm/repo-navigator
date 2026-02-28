export function FocusMeter({ value }: Readonly<{ value: number }>) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="surface-card rounded-2xl border border-slate-200/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Focus confidence</p>
      <div className="mt-3 h-2.5 w-full rounded-full bg-slate-200/70">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-slate-900 shadow-[0_2px_10px_rgba(249,115,22,0.35)] transition-[width] duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-medium text-slate-700">{clamped}% expected execution gain</p>
    </div>
  );
}
