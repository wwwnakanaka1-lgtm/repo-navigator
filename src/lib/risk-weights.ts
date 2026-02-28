export const RISK_WEIGHTS = {
  stale: 25,
  dirtyBase: 3,
  dirtyMin: 6,
  dirtyMax: 24,
  todoMin: 3,
  todoMax: 12,
  missingReadme: 12,
  missingTests: 16,
  missingDocker: 4,
} as const;
