import { NextRequest, NextResponse } from "next/server";

import { getPlaybook } from "@/lib/repo-scan";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const force = request.nextUrl.searchParams.get("force") === "1";
  const playbook = await getPlaybook(force);
  return NextResponse.json({ data: playbook });
}
