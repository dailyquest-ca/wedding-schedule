import { NextResponse } from "next/server";
import { getEventsWithCounts } from "@/lib/signup/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await getEventsWithCounts();
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 }
    );
  }
}
