import { HealthLevel } from "@/lib/types";

export function toHealthLevel(score: number): HealthLevel {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "warning";
  return "critical";
}
