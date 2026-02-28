"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { cn } from "@/lib/format";

export type NavKey =
  | "overview"
  | "projects"
  | "focus"
  | "timeline"
  | "playbook"
  | "settings"
  | "about";

const PRIMARY_ITEMS: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "overview", label: "Overview", href: "/" },
  { key: "focus", label: "Focus", href: "/focus" },
  { key: "projects", label: "Projects", href: "/projects" },
];

const SECONDARY_ITEMS: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "timeline", label: "Timeline", href: "/timeline" },
  { key: "playbook", label: "Playbook", href: "/playbook" },
  { key: "settings", label: "Settings", href: "/settings" },
  { key: "about", label: "About", href: "/about" },
];

export function TopNav({ active }: Readonly<{ active: NavKey }>) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      for (const item of [...PRIMARY_ITEMS, ...SECONDARY_ITEMS]) {
        router.prefetch(item.href);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [router]);

  const activeInSecondary = SECONDARY_ITEMS.some((item) => item.key === active);

  return (
    <nav className="flex w-full flex-wrap items-center gap-2 pb-0.5">
      {PRIMARY_ITEMS.map((item) => {
        const isActive = item.key === active;

        return (
          <Link
            key={item.key}
            href={item.href}
            prefetch
            aria-current={isActive ? "page" : undefined}
            style={isActive ? { color: "#ffffff" } : undefined}
            className={cn(
              "shrink-0 rounded-xl border px-3.5 py-2 text-sm font-semibold tracking-tight transition-all duration-200",
              isActive
                ? "border-slate-900/80 bg-[linear-gradient(135deg,#0f172a_0%,#1d2a44_100%)] text-white shadow-[0_10px_22px_rgba(15,23,42,0.25)]"
                : "border-slate-200/80 bg-white/72 text-slate-700 hover:-translate-y-[1px] hover:border-slate-300 hover:bg-white hover:text-slate-900",
            )}
          >
            <span className="inline-flex items-center gap-1.5 text-inherit">
              {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-orange-300" aria-hidden /> : null}
              {item.label}
            </span>
          </Link>
        );
      })}

      <details className="group relative shrink-0">
        <summary
          className={cn(
            "list-none rounded-xl border px-3.5 py-2 text-sm font-semibold tracking-tight transition-all duration-200 [&::-webkit-details-marker]:hidden",
            activeInSecondary
              ? "border-slate-900/80 bg-[linear-gradient(135deg,#0f172a_0%,#1d2a44_100%)] text-white shadow-[0_10px_22px_rgba(15,23,42,0.25)]"
              : "border-slate-200/80 bg-white/72 text-slate-700 hover:-translate-y-[1px] hover:border-slate-300 hover:bg-white hover:text-slate-900",
          )}
        >
          More
        </summary>

        <div className="surface-card-strong absolute right-0 top-[calc(100%+0.5rem)] z-50 w-44 rounded-xl border border-slate-200/80 p-1.5">
          {SECONDARY_ITEMS.map((item) => {
            const isActive = item.key === active;

            return (
              <Link
                key={item.key}
                href={item.href}
                prefetch
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100/80",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </details>
    </nav>
  );
}
