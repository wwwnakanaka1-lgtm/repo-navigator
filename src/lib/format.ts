import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "No commit data";
  const date = new Date(iso);
  if (Number.isNaN(date.valueOf())) return "Invalid date";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
