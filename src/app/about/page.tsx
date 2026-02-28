import { AppShell } from "@/components/app-shell";
import { FooterNote } from "@/components/footer-note";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

export default function AboutPage() {
  return (
    <AppShell active="about">
      <PageHeader
        kicker="Product Intent"
        title="About Repo Navigator"
        subtitle="Repo Navigator is designed for teams and solo developers who manage many repositories and need clear execution order."
      />
      <SectionCard title="Design Principles" description="Core principles behind this product">
        <ul className="space-y-2 text-sm text-slate-700">
          <li>1. Show what to fix next in under 30 seconds.</li>
          <li>2. Convert abstract maintenance debt into concrete actions.</li>
          <li>3. Keep the workflow fast enough for daily usage.</li>
        </ul>
      </SectionCard>
      <FooterNote />
    </AppShell>
  );
}
