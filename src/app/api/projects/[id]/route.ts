import { NextResponse } from "next/server";

import { getProjectById } from "@/lib/repo-scan";

export const runtime = "nodejs";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const project = await getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json({ data: project });
}
