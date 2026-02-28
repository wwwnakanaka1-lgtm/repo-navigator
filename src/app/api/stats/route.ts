import { NextRequest, NextResponse } from "next/server";

import { getDashboardStats } from "@/lib/repo-scan";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const force = request.nextUrl.searchParams.get("force") === "1";
  const stats = await getDashboardStats(force);
  return NextResponse.json({ data: stats });
}
