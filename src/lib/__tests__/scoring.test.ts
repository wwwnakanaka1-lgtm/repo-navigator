import { describe, expect, it } from "vitest";

import { estimateScoreDelta, evaluateProjectQuality } from "@/lib/scoring";
import { RepoProject } from "@/lib/types";

describe("evaluateProjectQuality", () => {
  it("returns low risk for healthy project", () => {
    const result = evaluateProjectQuality({
      staleDays: 2,
      dirtyFiles: 0,
      openTodos: 0,
      hasReadme: true,
      hasTests: true,
      hasDocker: true,
    });

    expect(result.riskScore).toBeLessThan(15);
    expect(result.healthScore).toBeGreaterThan(85);
    expect(result.healthLevel).toBe("excellent");
  });

  it("returns critical risk for stale project without tests", () => {
    const result = evaluateProjectQuality({
      staleDays: 40,
      dirtyFiles: 8,
      openTodos: 20,
      hasReadme: false,
      hasTests: false,
      hasDocker: false,
    });

    expect(result.riskScore).toBeGreaterThan(70);
    expect(result.healthLevel).toBe("critical");
    expect(result.recommendedAction).toContain("コミット");
  });
});

describe("estimateScoreDelta", () => {
  it("estimates a positive improvement range", () => {
    const project = {
      id: "demo",
      name: "Demo",
      path: "C:\\demo",
      stack: ["Next.js"],
      architecture: "frontend",
      sourceFiles: 10,
      dirtyFiles: 4,
      openTodos: 8,
      hasReadme: false,
      hasTests: false,
      hasDocker: false,
      lastCommitAt: null,
      lastCommitMessage: null,
      quality: {
        healthScore: 42,
        riskScore: 58,
        healthLevel: "warning",
        primaryRisk: "テスト不足",
        recommendedAction: "テスト追加",
      },
    } satisfies RepoProject;

    const delta = estimateScoreDelta(project);
    expect(delta).toBeGreaterThanOrEqual(1);
    expect(delta).toBeLessThanOrEqual(20);
  });
});
