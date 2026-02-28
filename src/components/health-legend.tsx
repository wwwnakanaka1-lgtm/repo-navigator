export function HealthLegend() {
  const items = [
    { label: "Excellent", color: "bg-emerald-500" },
    { label: "Good", color: "bg-sky-500" },
    { label: "Warning", color: "bg-amber-500" },
    { label: "Critical", color: "bg-rose-500" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
          <span className={`h-2 w-2 rounded-full ${item.color}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
