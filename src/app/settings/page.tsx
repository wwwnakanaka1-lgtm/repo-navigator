import { AppShell } from "@/components/app-shell";
import { FooterNote } from "@/components/footer-note";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatChip } from "@/components/stat-chip";
import { getDashboardStats } from "@/lib/repo-scan";

export default async function SettingsPage() {
  const stats = await getDashboardStats();

  return (
    <AppShell active="settings">
      <PageHeader
        kicker="Runtime Snapshot"
        title="Scan Configuration"
        subtitle="Review runtime metrics and scan status for the current environment."
      />
      <SectionCard title="Current Status" description="Live values from the latest scan payload">
        <div className="flex flex-wrap gap-2">
          <StatChip label="Scanned projects" value={stats.scannedProjects} />
          <StatChip label="Scanned at" value={stats.scannedAt} />
          <StatChip label="Avg health" value={`${stats.averageHealth}%`} />
          <StatChip label="Critical" value={stats.criticalCount} />
          <StatChip label="Warning" value={stats.warningCount} />
        </div>
      </SectionCard>
      <FooterNote />
    </AppShell>
  );
}
