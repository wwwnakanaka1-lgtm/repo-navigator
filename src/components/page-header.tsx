type HeaderProps = {
  kicker: string;
  title: string;
  subtitle: string;
};

export function PageHeader({ kicker, title, subtitle }: Readonly<HeaderProps>) {
  return (
    <header className="mb-8 space-y-3 md:mb-10">
      <div className="eyebrow-chip">
        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden />
        {kicker}
      </div>
      <h1 className="max-w-5xl text-3xl font-semibold tracking-tight text-slate-900 md:text-[2.95rem] md:leading-[1.08]">
        {title}
      </h1>
      <p className="max-w-4xl text-sm leading-relaxed text-slate-600 md:text-base md:leading-relaxed">{subtitle}</p>
    </header>
  );
}
