"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "repo-navigator-theme";

function resolveTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode: ThemeMode): void {
  document.documentElement.setAttribute("data-theme", mode);
  document.documentElement.style.colorScheme = mode;
}

function getInitialTheme(): ThemeMode {
  if (typeof document !== "undefined") {
    const domTheme = document.documentElement.getAttribute("data-theme");
    if (domTheme === "light" || domTheme === "dark") return domTheme;
  }

  return resolveTheme();
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    applyTheme(mode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  function onToggle() {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }

  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-3 text-xs font-semibold text-slate-700 shadow-[0_4px_10px_rgba(15,23,42,0.08)] transition hover:-translate-y-[1px] hover:border-slate-300"
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
