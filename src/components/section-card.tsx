import { cn } from "@/lib/format";

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ title, description, children, className }: Readonly<SectionCardProps>) {
  return (
    <section className={cn("surface-card rounded-3xl p-5 md:p-6", className)}>
      <header className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
        </div>
        <span
          aria-hidden
          className="mt-1 hidden h-2.5 w-2.5 rounded-full bg-orange-400/70 shadow-[0_0_0_6px_rgba(249,115,22,0.12)] md:inline-block"
        />
      </header>
      {children}
    </section>
  );
}
