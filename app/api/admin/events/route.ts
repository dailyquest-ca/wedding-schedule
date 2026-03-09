import { NextRequest, NextResponse } from "next/server";
import { getEventRosters } from "@/lib/signup/queries";
import { getDbEvents, getDbNotes, upsertEvent, deleteEvent, replaceNotes } from "@/lib/signup/content-queries";

export const dynamic = "force-dynamic";

function checkAdmin(request: NextRequest): NextResponse | null {
  const password = request.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const ok = expected.length > 0 && password === expected;

  // #region agent log
  const _p1 = {sessionId:'e76c53',runId:'pre-fix',hypothesisId:'H3',location:'app/api/admin/events/route.ts:~7',message:'admin auth check',data:{expectedPresent:expected.length>0,expectedLen:expected.length,providedPresent:password.length>0,providedLen:password.length,ok},timestamp:Date.now()};
  fetch('http://127.0.0.1:7896/ingest/f9e706b0-cbe6-49af-9ca1-ef5c28b90de6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e76c53'},body:JSON.stringify(_p1)}).catch(()=>{});
  import('fs/promises').then((fs)=>fs.appendFile('debug-e76c53.log', JSON.stringify(_p1)+'\n')).catch(()=>{});
  // #endregion

  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authError = checkAdmin(request);
  if (authError) return authError;

  try {
    const [rosters, events, notes] = await Promise.all([
      getEventRosters(),
      getDbEvents(),
      getDbNotes(),
    ]);
    return NextResponse.json({ rosters, events, notes });
  } catch (error) {
    // #region agent log
    const _p2 = {sessionId:'e76c53',runId:'pre-fix',hypothesisId:'H4',location:'app/api/admin/events/route.ts:~27',message:'GET /api/admin/events error',data:{errorName:(error as any)?.name ?? null,errorMessage:(error as any)?.message ?? null},timestamp:Date.now()};
    fetch('http://127.0.0.1:7896/ingest/f9e706b0-cbe6-49af-9ca1-ef5c28b90de6',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e76c53'},body:JSON.stringify(_p2)}).catch(()=>{});
    import('fs/promises').then((fs)=>fs.appendFile('debug-e76c53.log', JSON.stringify(_p2)+'\n')).catch(()=>{});
    // #endregion
    console.error("GET /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Failed to load admin data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      id, dayDate, timeLabel, category,
      signupEnabled = false, active = true,
      source = "custom",
      labelEn, descriptionEn = null,
      labelJa, descriptionJa = null,
    } = body;

    if (!id || !dayDate || !timeLabel || !category || !labelEn || !labelJa) {
      return NextResponse.json(
        { error: "id, dayDate, timeLabel, category, labelEn, and labelJa are required" },
        { status: 400 }
      );
    }

    await upsertEvent(id, dayDate, timeLabel, category, signupEnabled, active, source, labelEn, descriptionEn, labelJa, descriptionJa);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    if (body.type === "notes") {
      const { en, ja } = body;
      if (!Array.isArray(en) || !Array.isArray(ja)) {
        return NextResponse.json({ error: "en and ja must be arrays" }, { status: 400 });
      }
      await replaceNotes(en, ja);
      return NextResponse.json({ ok: true });
    }

    const {
      id, dayDate, timeLabel, category,
      signupEnabled, active, source,
      labelEn, descriptionEn,
      labelJa, descriptionJa,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await upsertEvent(id, dayDate, timeLabel, category, signupEnabled, active, source, labelEn, descriptionEn ?? null, labelJa, descriptionJa ?? null);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const authError = checkAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    await deleteEvent(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/events error:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
