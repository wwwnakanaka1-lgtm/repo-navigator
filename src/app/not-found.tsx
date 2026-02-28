import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-900">Project not found</h2>
        <p className="mt-2 text-sm text-slate-600">指定されたプロジェクトIDはスキャン結果に存在しません。</p>
        <Link href="/projects" className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Back to projects
        </Link>
      </div>
    </div>
  );
}
