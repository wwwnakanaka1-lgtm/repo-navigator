import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { FooterNote } from "@/components/footer-note";
import { HealthBar } from "@/components/health-bar";
import { PageHeader } from "@/components/page-header";
import { RepoBadgeList } from "@/components/repo-badge-list";
import { RiskPill } from "@/components/risk-pill";
import { SectionCard } from "@/components/section-card";
import { StatChip } from "@/components/stat-chip";
import { formatDateTime } from "@/lib/format";
import { getProjectById } from "@/lib/repo-scan";

export default async function ProjectDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <AppShell active="projects">
      <PageHeader
        kicker="Project Deep Dive"
        title={project.name}
        subtitle={`Path: ${project.path}`}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Health Snapshot">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RiskPill level={project.quality.healthLevel} />
              <p className="text-sm text-slate-600">primary risk: {project.quality.primaryRisk}</p>
            </div>
            <HealthBar value={project.quality.healthScore} />
            <p className="rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-sm text-slate-700">
              {project.quality.recommendedAction}
            </p>
            <RepoBadgeList stack={project.stack} />
          </div>
        </SectionCard>
        <SectionCard title="Key Metrics">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <StatChip label="Source files" value={project.sourceFiles} />
            <StatChip label="Dirty files" value={project.dirtyFiles} />
            <StatChip label="Open TODO" value={project.openTodos} />
            <StatChip label="Readme" value={project.hasReadme ? "yes" : "no"} />
            <StatChip label="Tests" value={project.hasTests ? "yes" : "no"} />
            <StatChip label="Docker" value={project.hasDocker ? "yes" : "no"} />
            <StatChip label="Last commit" value={formatDateTime(project.lastCommitAt)} />
          </div>
        </SectionCard>
      </div>
      <FooterNote />
    </AppShell>
  );
}
