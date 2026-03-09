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

    // #region agent log
    const _p1 = {sessionId:'e76c53',runId:'pre-fix',hypothesisId:'H2',location:'app/api/events/route.ts:~15',message:'api/events computed eventIds',data:{eventIdsLen:eventIds.length,sampleIds:eventIds.slice(0,3)},timestamp:Date.now()};
    fetch('http://127.0.0.1:7896/ingest/f9e706b0-cbe6-49af-9ca1-ef5c28b90de6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e76c53'},body:JSON.stringify(_p1)}).catch(()=>{});
    import('fs/promises').then((fs)=>fs.appendFile('debug-e76c53.log', JSON.stringify(_p1)+'\n')).catch(()=>{});
    // #endregion

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

    // #region agent log
    const _p2 = {sessionId:'e76c53',runId:'pre-fix',hypothesisId:'H2',location:'app/api/events/route.ts:~35',message:'api/events response ready',data:{rowsLen:(rows as any[]).length,eventsLen:events.length,sampleCount:events[0]?{eventId:events[0].eventId,count:events[0].count}:null},timestamp:Date.now()};
    fetch('http://127.0.0.1:7896/ingest/f9e706b0-cbe6-49af-9ca1-ef5c28b90de6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e76c53'},body:JSON.stringify(_p2)}).catch(()=>{});
    import('fs/promises').then((fs)=>fs.appendFile('debug-e76c53.log', JSON.stringify(_p2)+'\n')).catch(()=>{});
    // #endregion

    return NextResponse.json(events);
  } catch (error) {
    // #region agent log
    const _p3 = {sessionId:'e76c53',runId:'pre-fix',hypothesisId:'H2',location:'app/api/events/route.ts:~40',message:'api/events error',data:{errorName:(error as any)?.name ?? null,errorMessage:(error as any)?.message ?? null},timestamp:Date.now()};
    fetch('http://127.0.0.1:7896/ingest/f9e706b0-cbe6-49af-9ca1-ef5c28b90de6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e76c53'},body:JSON.stringify(_p3)}).catch(()=>{});
    import('fs/promises').then((fs)=>fs.appendFile('debug-e76c53.log', JSON.stringify(_p3)+'\n')).catch(()=>{});
    // #endregion
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { error: "Failed to load events" },
      { status: 500 }
    );
  }
}
