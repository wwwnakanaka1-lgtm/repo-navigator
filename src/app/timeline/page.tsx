import { AppShell } from "@/components/app-shell";
import { FooterNote } from "@/components/footer-note";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { TimelineList } from "@/components/timeline-list";
import { getTimeline } from "@/lib/repo-scan";

export default async function TimelinePage() {
  const timeline = await getTimeline();

  return (
    <AppShell active="timeline">
      <PageHeader
        kicker="Freshness Signal"
        title="Commit Timeline"
        subtitle="Track repository activity in one stream and detect stale maintenance zones before they become risks."
      />
      <SectionCard title="Recent Commits" description="Latest 30 commit entries">
        <TimelineList timeline={timeline} />
      </SectionCard>
      <FooterNote />
    </AppShell>
  );
}
