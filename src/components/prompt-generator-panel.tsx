"use client";

import { useMemo, useState } from "react";

import { ActionItem, DashboardStats, RepoProject } from "@/lib/types";

type AgentTarget = "codex" | "claude-code";

type PromptActionOption = ActionItem;

function buildPrompt(
  agent: AgentTarget,
  action: PromptActionOption,
  project: RepoProject | undefined,
  stats: DashboardStats,
): string {
  const projectPath = project?.path ?? `C:\\Users\\wwwhi\\Create\\${action.projectId}`;
  const stack = project?.stack.join(", ") ?? "N/A";
  const architecture = project?.architecture ?? "N/A";
  const dirtyFiles = project?.dirtyFiles ?? "N/A";
  const openTodos = project?.openTodos ?? "N/A";
  const health = project?.quality.healthScore ?? "N/A";

  const agentLine =
    agent === "codex"
      ? "You are Codex. Complete this implementation end-to-end with minimal user interaction."
      : "You are Claude Code. Complete this implementation end-to-end and report concise execution results.";

  return `# Implementation Request
${agentLine}

## Goal
Complete the improvement task for ${action.projectName} and pass all quality gates.

## Target Project
- Project: ${action.projectName}
- Path: ${projectPath}
- Architecture: ${architecture}
- Stack: ${stack}
- Current Health: ${health}
- Dirty Files: ${dirtyFiles}
- Open TODO/FIXME: ${openTodos}
- Workspace Stats: critical=${stats.criticalCount}, warning=${stats.warningCount}, averageHealth=${stats.averageHealth}

## Priority Task
- Title: ${action.title}
- Description: ${action.description}
- Expected Impact: +${action.scoreDeltaEstimate} points

## Execution Requirements
1. Identify the root cause and state the fix strategy briefly.
2. Implement maintainable code changes (include refactor when needed).
3. Update README/config/docs if required.
4. Run lint, test, and build at the end and report exact results.
5. Provide a final handoff summary that can be pasted directly to the user.

## Output Format
- Change summary (max 3 lines)
- Modified files list
- Commands executed and results
- Remaining risks (or "none")
`;
}

function inferImpactFromProject(project: RepoProject): ActionItem["impact"] {
  if (project.quality.healthLevel === "critical") return "high";
  if (project.quality.healthLevel === "warning") return "medium";
  return "low";
}

function inferScoreDelta(project: RepoProject): number {
  if (project.quality.healthLevel === "critical") return 12;
  if (project.quality.healthLevel === "warning") return 8;
  if (project.quality.healthLevel === "good") return 4;
  return 2;
}

function buildAllActionOptions(actions: ActionItem[], projects: RepoProject[]): PromptActionOption[] {
  const actionProjectIds = new Set(actions.map((action) => action.projectId));

  const generatedFromProjects: PromptActionOption[] = projects
    .filter((project) => !actionProjectIds.has(project.id))
    .map((project) => ({
      id: `project-${project.id}`,
      title: `${project.name} quality improvement`,
      description: project.quality.recommendedAction,
      impact: inferImpactFromProject(project),
      projectId: project.id,
      projectName: project.name,
      scoreDeltaEstimate: inferScoreDelta(project),
    }));

  return [...actions, ...generatedFromProjects];
}

export function PromptGeneratorPanel({
  actions,
  projects,
  stats,
}: Readonly<{
  actions: ActionItem[];
  projects: RepoProject[];
  stats: DashboardStats;
}>) {
  const allActions = useMemo(() => buildAllActionOptions(actions, projects), [actions, projects]);

  const [target, setTarget] = useState<AgentTarget>("claude-code");
  const [selectedActionId, setSelectedActionId] = useState(allActions[0]?.id ?? "");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedAction = useMemo(
    () => allActions.find((action) => action.id === selectedActionId) ?? allActions[0],
    [allActions, selectedActionId],
  );

  function onGenerate(): void {
    if (!selectedAction) return;
    const project = projects.find((item) => item.id === selectedAction.projectId);
    setPrompt(buildPrompt(target, selectedAction, project, stats));
    setCopied(false);
  }

  async function onCopy(): Promise<void> {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  }

  if (!selectedAction) {
    return <p className="text-sm text-slate-600">No action is available for prompt generation.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Target Agent
          </span>
          <select
            value={target}
            onChange={(event) => setTarget(event.target.value as AgentTarget)}
            className="surface-card w-full rounded-xl border border-slate-200/80 px-3 py-2 text-sm text-slate-800"
          >
            <option value="codex">Codex</option>
            <option value="claude-code">Claude Code</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Action</span>
          <select
            value={selectedAction?.id ?? ""}
            onChange={(event) => setSelectedActionId(event.target.value)}
            className="surface-card w-full rounded-xl border border-slate-200/80 px-3 py-2 text-sm text-slate-800"
          >
            {allActions.map((action) => (
              <option key={action.id} value={action.id}>
                [{action.impact}] {action.projectName} - {action.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onGenerate}
          className="rounded-xl bg-[linear-gradient(135deg,#0f172a_0%,#1d2a44_52%,#ef6a2f_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(15,23,42,0.25)] transition hover:brightness-110"
        >
          Generate Prompt
        </button>
        <button
          type="button"
          onClick={onCopy}
          disabled={!prompt}
          className="surface-card rounded-xl border border-slate-200/80 px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Copy
        </button>
        {copied ? (
          <span className="self-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            Copied to clipboard
          </span>
        ) : null}
      </div>

      <textarea
        value={prompt}
        readOnly
        placeholder='Click "Generate Prompt" to create an instruction template.'
        className="surface-card h-56 w-full rounded-2xl border border-slate-200/80 px-3 py-2 font-mono text-xs leading-relaxed text-slate-800 md:h-64"
      />
    </div>
  );
}
