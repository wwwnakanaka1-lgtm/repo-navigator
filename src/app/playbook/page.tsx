import { AppShell } from "@/components/app-shell";
import { FooterNote } from "@/components/footer-note";
import { PageHeader } from "@/components/page-header";
import { PlaybookCard } from "@/components/playbook-card";
import { SectionCard } from "@/components/section-card";
import { getPlaybook } from "@/lib/repo-scan";

export default async function PlaybookPage() {
  const playbook = await getPlaybook();

  return (
    <AppShell active="playbook">
      <PageHeader
        kicker="Weekly Strategy"
        title="Execution Playbook"
        subtitle="Follow a day-by-day plan so quality improvements compound through the week."
      />
      <SectionCard title="This Week" description="Five-day action allocation based on current risk order">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {playbook.map((item) => (
            <PlaybookCard key={item.day} item={item} />
          ))}
        </div>
      </SectionCard>
      <FooterNote />
    </AppShell>
  );
}
