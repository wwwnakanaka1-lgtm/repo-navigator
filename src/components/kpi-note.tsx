export function KpiNote({ text }: Readonly<{ text: string }>) {
  return (
    <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
      {text}
    </p>
  );
}
