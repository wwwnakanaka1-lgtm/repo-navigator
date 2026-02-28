import { HealthLevel, ProjectQuality, RepoProject } from "@/lib/types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getHealthLevel(healthScore: number): HealthLevel {
  if (healthScore >= 85) return "excellent";
  if (healthScore >= 70) return "good";
  if (healthScore >= 50) return "warning";
  return "critical";
}

interface RiskInput {
  staleDays: number | null;
  dirtyFiles: number;
  openTodos: number;
  hasReadme: boolean;
  hasTests: boolean;
  hasDocker: boolean;
}

export function evaluateProjectQuality(input: RiskInput): ProjectQuality {
  let riskScore = 0;
  const riskReasons: string[] = [];

  if (input.staleDays !== null && input.staleDays > 14) {
    riskScore += 25;
    riskReasons.push(`最終コミットから${input.staleDays}日経過`);
  }

  if (input.dirtyFiles > 0) {
    riskScore += clamp(input.dirtyFiles * 3, 6, 24);
    riskReasons.push(`未コミット変更 ${input.dirtyFiles}件`);
  }

  if (input.openTodos > 0) {
    riskScore += clamp(Math.ceil(input.openTodos / 3), 3, 12);
    riskReasons.push(`TODO/FIXME ${input.openTodos}件`);
  }

  if (!input.hasReadme) {
    riskScore += 12;
    riskReasons.push("README 不足");
  }

  if (!input.hasTests) {
    riskScore += 16;
    riskReasons.push("テスト設定不足");
  }

  if (!input.hasDocker) {
    riskScore += 4;
  }

  riskScore = clamp(riskScore, 0, 100);
  const healthScore = 100 - riskScore;
  const healthLevel = getHealthLevel(healthScore);

  let recommendedAction = "軽微なリファクタとメンテナンスを継続";
  if (!input.hasTests) recommendedAction = "最優先で回帰テストを追加";
  if (input.dirtyFiles >= 5) recommendedAction = "変更を小さく分割してコミット";
  if (input.staleDays !== null && input.staleDays > 14)
    recommendedAction = "メンテナンスコミットを行い鮮度を回復";

  return {
    healthScore,
    riskScore,
    healthLevel,
    primaryRisk: riskReasons[0] ?? "重大なリスクなし",
    recommendedAction,
  };
}

export function estimateScoreDelta(project: RepoProject): number {
  let delta = 0;
  if (!project.hasTests) delta += 8;
  if (!project.hasReadme) delta += 4;
  if (project.dirtyFiles >= 3) delta += 5;
  if (project.openTodos >= 6) delta += 4;
  return clamp(delta, 1, 20);
}

export function sortByRiskDesc(projects: RepoProject[]): RepoProject[] {
  return [...projects].sort((a, b) => b.quality.riskScore - a.quality.riskScore);
}
