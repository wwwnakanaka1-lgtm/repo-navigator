import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    data: {
      status: "ok",
      service: "repo-navigator",
      timestamp: new Date().toISOString(),
    },
  });
}
