export function StatChip({ label, value }: Readonly<{ label: string; value: string | number }>) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/82 px-3 py-1 text-xs font-medium text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
