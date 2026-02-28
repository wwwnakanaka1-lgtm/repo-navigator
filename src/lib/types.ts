export type HealthLevel = "excellent" | "good" | "warning" | "critical";

export interface ProjectQuality {
  healthScore: number;
  riskScore: number;
  healthLevel: HealthLevel;
  primaryRisk: string;
  recommendedAction: string;
}

export interface RepoProject {
  id: string;
  name: string;
  path: string;
  stack: string[];
  architecture: "full-stack" | "frontend" | "backend" | "utility";
  sourceFiles: number;
  dirtyFiles: number;
  openTodos: number;
  hasReadme: boolean;
  hasTests: boolean;
  hasDocker: boolean;
  lastCommitAt: string | null;
  lastCommitMessage: string | null;
  quality: ProjectQuality;
}

export interface DashboardStats {
  scannedProjects: number;
  averageHealth: number;
  criticalCount: number;
  warningCount: number;
  dirtyRepoCount: number;
  staleRepoCount: number;
  scannedAt: string;
}

export interface TimelineEvent {
  id: string;
  projectId: string;
  projectName: string;
  commitAt: string;
  commitMessage: string;
  isStale: boolean;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  projectId: string;
  projectName: string;
  scoreDeltaEstimate: number;
}

export interface PlaybookDay {
  day: string;
  focus: string;
  actions: string[];
}

export interface ScanPayload {
  stats: DashboardStats;
  projects: RepoProject[];
  actions: ActionItem[];
  timeline: TimelineEvent[];
  playbook: PlaybookDay[];
}
