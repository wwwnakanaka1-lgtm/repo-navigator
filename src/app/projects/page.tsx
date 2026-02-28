import { AppShell } from "@/components/app-shell";
import { FooterNote } from "@/components/footer-note";
import { PageHeader } from "@/components/page-header";
import { ProjectGrid } from "@/components/project-grid";
import { SectionCard } from "@/components/section-card";
import { getProjects } from "@/lib/repo-scan";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <AppShell active="projects">
      <PageHeader
        kicker="Repository Index"
        title="All Projects"
        subtitle="Explore every scanned repository in one place, ordered by current operational risk."
      />
      <SectionCard
        title="Scanned Projects"
        description={`${projects.length} repositories are currently indexed and ranked.`}
      >
        <ProjectGrid projects={projects} />
      </SectionCard>
      <FooterNote />
    </AppShell>
  );
}
