import Link from "next/link";

import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { HealthDistributionChart } from "@/components/charts/health-distribution";
import { FooterNote } from "@/components/footer-note";
import { MetricTile } from "@/components/metric-tile";
import { PageHeader } from "@/components/page-header";
import { ProjectGrid } from "@/components/project-grid";
import { SectionCard } from "@/components/section-card";
import { getActions, getDashboardStats, getProjects } from "@/lib/repo-scan";

export default async function Home() {
  const [stats, projects, actions] = await Promise.all([
    getDashboardStats(),
    getProjects(),
    getActions(),
  ]);

  const nextAction = actions[0];

  return (
    <AppShell active="overview">
      <PageHeader
        kicker="Battle Ready Ops"
        title="Overview"
        subtitle="A compact command view: decide the next move quickly, then execute without context switching."
      />

      <section className="surface-card-dark rounded-3xl p-5 text-white md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">Next best move</p>
        {nextAction ? (
          <>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">{nextAction.title}</h2>
            <p className="mt-1 text-sm text-slate-200">{nextAction.projectName}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/focus"
                className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-white"
              >
                Open Focus Queue
              </Link>
              <Link
                href={`/projects/${nextAction.projectId}`}
                className="rounded-lg border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
              >
                Open Project Detail
              </Link>
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-200">No urgent action is currently detected.</p>
        )}
      </section>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <MetricTile label="Projects" value={stats.scannedProjects} />
        <MetricTile label="Average Health" value={stats.averageHealth} highlight />
        <MetricTile label="Critical" value={stats.criticalCount} suffix="" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title="Project Health Distribution"
          description="Current quality spread across scanned repositories."
        >
          <HealthDistributionChart projects={projects} />
        </SectionCard>

        <SectionCard title="Top 3 Priority Actions" description="Execute from top to bottom.">
          <ActionList actions={actions.slice(0, 3)} />
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="At-Risk Projects" description="High-risk repositories to inspect after top actions.">
          <ProjectGrid projects={projects.slice(0, 6)} />
        </SectionCard>
      </div>

      <FooterNote />
    </AppShell>
  );
}
