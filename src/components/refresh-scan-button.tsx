"use client";

import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type RefreshStatus = "idle" | "loading" | "done" | "error";

export function RefreshScanButton() {
  const router = useRouter();
  const [status, setStatus] = useState<RefreshStatus>("idle");

  const label = useMemo(() => {
    if (status === "loading") return "Refreshing";
    if (status === "done") return "Updated";
    if (status === "error") return "Retry";
    return "Refresh Scan";
  }, [status]);

  async function onRefresh(): Promise<void> {
    if (status === "loading") return;

    setStatus("loading");
    try {
      const response = await fetch("/api/stats?force=1", { cache: "no-store" });
      if (!response.ok) throw new Error("Refresh failed");
      router.refresh();
      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 1400);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={status === "loading"}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-3 text-xs font-semibold text-slate-700 shadow-[0_4px_10px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <RotateCw size={14} className={status === "loading" ? "animate-spin" : ""} />
      <span>{label}</span>
    </button>
  );
}
