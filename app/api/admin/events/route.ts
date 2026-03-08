import { NextRequest, NextResponse } from "next/server";
import { getEventRosters } from "@/lib/signup/queries";
import { getDbEvents, getDbNotes, upsertEvent, deleteEvent, replaceNotes } from "@/lib/signup/content-queries";

export const dynamic = "force-dynamic";

function checkAdmin(request: NextRequest): NextResponse | null {
  const password = request.headers.get("x-admin-password");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
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
