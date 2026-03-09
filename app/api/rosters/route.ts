import { NextRequest, NextResponse } from "next/server";
import { isSignupEnabledEvent } from "@/lib/signup/content-queries";
import { getRosterForEvent } from "@/lib/signup/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const eventId = request.nextUrl.searchParams.get("eventId");
    if (!eventId) {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }

    const exists = await isSignupEnabledEvent(eventId);
    if (!exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const guests = await getRosterForEvent(eventId);
    return NextResponse.json({ eventId, guests });
  } catch (error) {
    console.error("GET /api/rosters error:", error);
    return NextResponse.json(
      { error: "Failed to load roster" },
      { status: 500 }
    );
  }
}
