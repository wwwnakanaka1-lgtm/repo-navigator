import Link from "next/link";

import { ActionItem } from "@/lib/types";

const IMPACT_STYLE: Record<ActionItem["impact"], string> = {
  high: "impact-card impact-card-high",
  medium: "impact-card impact-card-medium",
  low: "impact-card impact-card-low",
};

const IMPACT_BADGE_STYLE: Record<ActionItem["impact"], string> = {
  high: "impact-badge impact-badge-high",
  medium: "impact-badge impact-badge-medium",
  low: "impact-badge impact-badge-low",
};

const IMPACT_GUIDE: Record<ActionItem["impact"], string[]> = {
  high: [
    "Reproduce and isolate the defect in the first 10 minutes.",
    "Ship a minimal fix and verify with lint, test, and build.",
    "Update README or runbook so the issue does not return.",
  ],
  medium: [
    "Reduce TODO/FIXME hotspots and simplify risky code paths.",
    "Strengthen checks around frequently changed modules.",
    "Document assumptions and remaining tradeoffs in short notes.",
  ],
  low: [
    "Clean readability issues and tighten naming consistency.",
    "Improve low-risk maintenance tasks that unblock future work.",
    "Bundle tiny refactors into one safe, reviewable change set.",
  ],
};

export function ActionList({ actions }: Readonly<{ actions: ActionItem[] }>) {
  if (actions.length === 0) {
    return <p className="text-sm text-slate-600">No prioritized actions are available right now.</p>;
  }

  return (
    <div className="space-y-3">
      {actions.map((action, index) => (
        <article
          key={action.id}
          className={`surface-card-strong rounded-2xl border p-4 text-slate-800 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)] ${IMPACT_STYLE[action.impact]}`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${IMPACT_BADGE_STYLE[action.impact]}`}>
              {action.impact} impact
            </p>
            <span className="rounded-full border border-slate-200/80 bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
              Priority {index + 1}
            </span>
          </div>

          <h3 className="mt-2 text-base font-semibold tracking-tight text-slate-900">{action.title}</h3>
          <p className="mt-1 text-sm text-slate-700">{action.description}</p>

          <div className="surface-card mt-3 rounded-xl border border-slate-200/80 p-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">Execution guide</p>
            <ol className="mt-1 list-decimal space-y-1 pl-4 text-xs leading-relaxed text-slate-700">
              {IMPACT_GUIDE[action.impact].map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <Link href={`/projects/${action.projectId}`} className="font-semibold text-slate-800 underline">
              {action.projectName}
            </Link>
            <span className="font-semibold text-slate-700">+{action.scoreDeltaEstimate}pt potential</span>
          </div>
        </article>
      ))}
    </div>
  );
}
