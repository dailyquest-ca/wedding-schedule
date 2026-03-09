import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getDbEvents } from "@/lib/signup/content-queries";
import type { EventWithCount } from "@/lib/signup/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();
    const dbEvents = await getDbEvents();
    const activeSignupEvents = dbEvents.filter((e) => e.active && e.signupEnabled);

    const eventIds = activeSignupEvents.map((e) => e.id);
    const rows = eventIds.length > 0
      ? await sql`
          SELECT event_id, COUNT(*)::int AS count
          FROM event_signups
          WHERE event_id = ANY(${eventIds})
          GROUP BY event_id
        `
      : [];

    const countMap = new Map(rows.map((r) => [r.event_id as string, r.count as number]));

    const events: EventWithCount[] = activeSignupEvents.map((e) => ({
      eventId: e.id,
      titleEn: e.labelEn,
      titleJa: e.labelJa,
      category: e.category,
      count: countMap.get(e.id) ?? 0,
      signupEnabled: e.signupEnabled,
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 }
    );
  }
}
