export function HeroBanner() {
  return (
    <section className="surface-card-dark relative mb-7 overflow-hidden rounded-3xl p-6 text-white md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-orange-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff18_1px,transparent_1px)] [background-size:26px_26px]" />

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">Execution First</p>
      <h2 className="mt-2 max-w-3xl text-2xl font-semibold tracking-tight md:text-4xl md:leading-tight">
        Decide the next repository to fix in under 30 seconds
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 md:text-base">
        Repo Navigator surfaces the highest-impact work by combining repo freshness, quality risk, and
        implementation effort into one clear queue.
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs md:text-sm">
        <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">Risk-ranked action queue</span>
        <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">Prompt generator for Codex/Claude</span>
        <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1">Fast local scan with cache</span>
      </div>
    </section>
  );
}
