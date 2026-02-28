import { PlaybookDay } from "@/lib/types";

export function PlaybookCard({ item }: Readonly<{ item: PlaybookDay }>) {
  return (
    <article className="surface-card rounded-2xl border border-slate-200/80 p-4 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_12px_22px_rgba(15,23,42,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.day}</p>
      <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">{item.focus}</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
        {item.actions.map((action) => (
          <li key={action} className="rounded-lg border border-slate-200/70 bg-white/78 px-3 py-2">
            {action}
          </li>
        ))}
      </ul>
    </article>
  );
}
