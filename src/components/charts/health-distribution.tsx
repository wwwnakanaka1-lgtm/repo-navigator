"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { RepoProject } from "@/lib/types";

type BucketKey = "Excellent" | "Good" | "Warning" | "Critical";

type Bucket = {
  bucket: BucketKey;
  count: number;
  colorVar: string;
};

const BUCKET_KEYS: BucketKey[] = ["Excellent", "Good", "Warning", "Critical"];

const BUCKET_COLOR_VAR: Record<BucketKey, string> = {
  Excellent: "--chart-excellent",
  Good: "--chart-good",
  Warning: "--chart-warning",
  Critical: "--chart-critical",
};

function toBuckets(projects: RepoProject[]): Bucket[] {
  const counts: Record<BucketKey, number> = {
    Excellent: 0,
    Good: 0,
    Warning: 0,
    Critical: 0,
  };

  for (const project of projects) {
    if (project.quality.healthScore >= 85) counts.Excellent += 1;
    else if (project.quality.healthScore >= 70) counts.Good += 1;
    else if (project.quality.healthScore >= 50) counts.Warning += 1;
    else counts.Critical += 1;
  }

  return BUCKET_KEYS.map((bucket) => ({
    bucket,
    count: counts[bucket],
    colorVar: BUCKET_COLOR_VAR[bucket],
  }));
}

export function HealthDistributionChart({ projects }: Readonly<{ projects: RepoProject[] }>) {
  const data = toBuckets(projects);

  return (
    <div className="w-full overflow-x-auto">
      <BarChart width={640} height={280} data={data} margin={{ top: 10, right: 8, left: 8, bottom: 2 }}>
        <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="4 4" />
        <XAxis
          dataKey="bucket"
          tick={{ fill: "var(--chart-axis)", fontSize: 13, fontWeight: 600 }}
          axisLine={{ stroke: "var(--chart-grid)" }}
          tickLine={{ stroke: "var(--chart-grid)" }}
        />
        <YAxis
          allowDecimals={false}
          width={32}
          tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
          axisLine={{ stroke: "var(--chart-grid)" }}
          tickLine={{ stroke: "var(--chart-grid)" }}
        />
        <Tooltip
          cursor={{ fill: "rgba(148,163,184,0.14)" }}
          contentStyle={{
            background: "var(--chart-tooltip-bg)",
            border: "1px solid var(--chart-tooltip-border)",
            borderRadius: "12px",
            color: "var(--foreground)",
          }}
          labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
          itemStyle={{ color: "var(--foreground)", fontWeight: 500 }}
          formatter={(value) => [value, "Projects"]}
        />
        <Bar dataKey="count" radius={[10, 10, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.bucket} fill={`var(${entry.colorVar})`} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}
