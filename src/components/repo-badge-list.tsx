export function RepoBadgeList({ stack }: Readonly<{ stack: string[] }>) {
  return (
    <div className="flex flex-wrap gap-2">
      {stack.slice(0, 6).map((item) => (
        <span
          key={item}
          className="rounded-full border border-slate-200/80 bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
