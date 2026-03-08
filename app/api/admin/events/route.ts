import { NextRequest, NextResponse } from "next/server";
import { getEventRosters } from "@/lib/signup/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rosters = await getEventRosters();
    return NextResponse.json(rosters);
  } catch (error) {
    console.error("GET /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Failed to load rosters" },
      { status: 500 }
    );
  }
}
