"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    const message = error.message ?? "";
    const isChunkLoadError =
      /Loading chunk .* failed/i.test(message) ||
      /ChunkLoadError/i.test(message) ||
      /Failed to fetch dynamically imported module/i.test(message);

    if (!isChunkLoadError) return;

    const key = "repo-navigator-chunk-reload-once";
    if (sessionStorage.getItem(key) === "1") return;

    sessionStorage.setItem(key, "1");
    window.location.reload();
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg rounded-2xl border border-rose-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">Unexpected runtime error</h2>
        <p className="mt-2 text-sm text-slate-600">{error.message}</p>
        <button
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => {
            sessionStorage.removeItem("repo-navigator-chunk-reload-once");
            reset();
          }}
          type="button"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
