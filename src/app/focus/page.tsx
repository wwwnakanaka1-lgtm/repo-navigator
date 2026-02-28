import { ActionList } from "@/components/action-list";
import { AppShell } from "@/components/app-shell";
import { FocusMeter } from "@/components/focus-meter";
import { FooterNote } from "@/components/footer-note";
import { PageHeader } from "@/components/page-header";
import { PromptGeneratorPanel } from "@/components/prompt-generator-panel";
import { SectionCard } from "@/components/section-card";
import { getActions, getDashboardStats, getProjects } from "@/lib/repo-scan";

export default async function FocusPage() {
  const [actions, stats, projects] = await Promise.all([
    getActions(),
    getDashboardStats(),
    getProjects(),
  ]);

  const confidence = Math.max(35, Math.min(98, 100 - stats.warningCount * 6 - stats.criticalCount * 12));
  const focusActions = actions.slice(0, 6);

  return (
    <AppShell active="focus">
      <PageHeader
        kicker="Execution Mode"
        title="Focus Queue"
        subtitle="Two-step loop: choose from the top action list, generate the prompt, execute, and verify with quality gates."
      />

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <SectionCard title="Execution Confidence" description="Current momentum for this session.">
          <FocusMeter value={confidence} />
        </SectionCard>

        <SectionCard
          title="Session Guardrails"
          description="Keep this loop short and reliable."
          className="md:col-span-2"
        >
          <ul className="space-y-2 text-sm text-slate-700">
            <li>1. Pick one top action and finish it end-to-end.</li>
            <li>2. Run lint, test, build before moving to the next action.</li>
            <li>3. Update docs only when behavior or operation changes.</li>
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <SectionCard
          title="Prompt Generator"
          description="Generate and copy instructions with one click."
          className="order-1 xl:order-2 xl:col-span-5 xl:sticky xl:top-28 xl:self-start"
        >
          <PromptGeneratorPanel actions={actions} projects={projects} stats={stats} />
        </SectionCard>

        <SectionCard
          title="Priority Action Queue (Top 6)"
          description="Start from the top and execute in order."
          className="order-2 xl:order-1 xl:col-span-7"
        >
          <ActionList actions={focusActions} />
        </SectionCard>
      </div>

      <FooterNote />
    </AppShell>
  );
}
