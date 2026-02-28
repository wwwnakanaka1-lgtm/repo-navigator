import Link from "next/link";

import { formatDateTime } from "@/lib/format";
import { RepoProject } from "@/lib/types";

import { HealthBar } from "./health-bar";
import { RepoBadgeList } from "./repo-badge-list";
import { RiskPill } from "./risk-pill";
import { StatChip } from "./stat-chip";

export function ProjectRow({ project }: Readonly<{ project: RepoProject }>) {
  return (
    <article className="surface-card group rounded-2xl border border-slate-200/80 p-4 transition-all duration-200 hover:-translate-y-[1px] hover:border-slate-300/90 hover:shadow-[0_16px_28px_rgba(15,23,42,0.12)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/projects/${project.id}`}
              className="text-lg font-semibold text-slate-900 transition-colors hover:text-orange-700"
            >
              {project.name}
            </Link>
            <RiskPill level={project.quality.healthLevel} />
            <span className="inline-flex rounded-full border border-slate-200/80 bg-white/85 px-2 py-0.5 text-xs font-semibold text-slate-700">
              {project.quality.healthScore}% health
            </span>
          </div>
          <p className="font-mono text-[11px] text-slate-500">{project.path}</p>
          <RepoBadgeList stack={project.stack} />
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <StatChip label="Dirty" value={project.dirtyFiles} />
          <StatChip label="TODO" value={project.openTodos} />
          <StatChip label="Files" value={project.sourceFiles} />
          <StatChip label="Last commit" value={formatDateTime(project.lastCommitAt)} />
        </div>
      </div>

      <div className="mt-3">
        <HealthBar value={project.quality.healthScore} />
      </div>

      <p className="mt-2 text-sm text-slate-700">
        Primary risk: <span className="font-medium text-slate-900">{project.quality.primaryRisk}</span>
      </p>
    </article>
  );
}
