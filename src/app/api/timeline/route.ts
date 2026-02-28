import { NextRequest, NextResponse } from "next/server";

import { getTimeline } from "@/lib/repo-scan";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const force = request.nextUrl.searchParams.get("force") === "1";
  const timeline = await getTimeline(force);
  return NextResponse.json({ data: timeline });
}
