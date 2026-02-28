import Link from "next/link";

import { formatDateTime } from "@/lib/format";
import { TimelineEvent } from "@/lib/types";

export function TimelineList({ timeline }: Readonly<{ timeline: TimelineEvent[] }>) {
  if (timeline.length === 0) {
    return <p className="text-sm text-slate-600">No commit timeline is available yet.</p>;
  }

  return (
    <div className="space-y-2.5">
      {timeline.map((event) => (
        <article key={event.id} className="surface-card rounded-xl border border-slate-200/80 p-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/projects/${event.projectId}`}
              className="text-sm font-semibold text-slate-900 transition-colors hover:text-orange-700"
            >
              {event.projectName}
            </Link>
            <span className="font-mono text-[11px] text-slate-500">{formatDateTime(event.commitAt)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-700">{event.commitMessage}</p>
          {event.isStale ? (
            <p className="mt-1 inline-flex rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
              Stale repository alert
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
