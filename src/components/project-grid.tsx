import { RepoProject } from "@/lib/types";

import { EmptyState } from "./empty-state";
import { ProjectRow } from "./project-row";

export function ProjectGrid({ projects }: Readonly<{ projects: RepoProject[] }>) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects found"
        message="Check your scan target directories and run the scan again to populate this view."
      />
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
    </div>
  );
}
