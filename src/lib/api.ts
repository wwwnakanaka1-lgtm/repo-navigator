import { ActionItem, DashboardStats, PlaybookDay, RepoProject, TimelineEvent } from "@/lib/types";

type ApiResponse<T> = {
  data: T;
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
}

export const api = {
  getProjects: () => request<RepoProject[]>("/api/projects"),
  getStats: () => request<DashboardStats>("/api/stats"),
  getTimeline: () => request<TimelineEvent[]>("/api/timeline"),
  getActions: () => request<ActionItem[]>("/api/actions"),
  getPlaybook: () => request<PlaybookDay[]>("/api/playbook"),
};
