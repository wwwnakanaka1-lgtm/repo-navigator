import Link from "next/link";

import { NavKey, TopNav } from "@/components/top-nav";
import { RefreshScanButton } from "@/components/refresh-scan-button";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({
  active,
  children,
}: Readonly<{ active: NavKey; children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-orange-300/28 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-sky-200/16 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,#94a3b81f_1px,transparent_1px),linear-gradient(to_bottom,#94a3b81f_1px,transparent_1px)] [background-size:34px_34px]" />
      </div>

      <header className="sticky top-0 z-40 px-3 pt-3 md:px-4">
        <div className="mx-auto max-w-[1280px] rounded-2xl border border-slate-200/80 bg-white/72 shadow-[0_14px_34px_rgba(15,23,42,0.1)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="group inline-flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_56%,#ef6a2f_100%)] text-xs font-semibold text-white shadow-[0_10px_20px_rgba(15,23,42,0.28)]">
                  RN
                </span>
                <span>
                  <span className="block text-lg font-semibold tracking-tight text-slate-900">Repo Navigator</span>
                  <span className="hidden text-[11px] font-medium tracking-[0.1em] text-slate-500 md:block">
                    BATTLE READY OPS
                  </span>
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <RefreshScanButton />
                <ThemeToggle />
                <span className="hidden rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 lg:inline-flex">
                  Product Ops Console
                </span>
              </div>
            </div>
            <TopNav active={active} />
          </div>
        </div>
      </header>

      <main className="page-enter mx-auto max-w-[1280px] px-4 pb-12 pt-7 md:px-6 md:pt-10">{children}</main>
    </div>
  );
}
