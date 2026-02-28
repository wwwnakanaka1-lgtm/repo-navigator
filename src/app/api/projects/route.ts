import { NextRequest, NextResponse } from "next/server";

import { getProjects } from "@/lib/repo-scan";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const force = request.nextUrl.searchParams.get("force") === "1";
  const projects = await getProjects(force);
  return NextResponse.json({ data: projects });
}
