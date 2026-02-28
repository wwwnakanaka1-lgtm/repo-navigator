import { RepoProject } from "@/lib/types";

export function criticalProjects(projects: RepoProject[]): RepoProject[] {
  return projects.filter((project) => project.quality.healthLevel === "critical");
}

export function warningProjects(projects: RepoProject[]): RepoProject[] {
  return projects.filter((project) => project.quality.healthLevel === "warning");
}

export function staleProjects(projects: RepoProject[]): RepoProject[] {
  const now = Date.now();
  return projects.filter((project) => {
    if (!project.lastCommitAt) return true;
    return now - Date.parse(project.lastCommitAt) > 1000 * 60 * 60 * 24 * 14;
  });
}
