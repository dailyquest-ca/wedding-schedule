import { NextRequest, NextResponse } from "next/server";
import { validateSignup } from "@/lib/signup/validation";
import { addSignup, removeSignup } from "@/lib/signup/queries";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, guestId } = body;

    const validation = validateSignup(eventId, guestId);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await addSignup(eventId, guestId);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/signups error:", error);
    return NextResponse.json(
      { error: "Failed to add signup" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, guestId } = body;

    const validation = validateSignup(eventId, guestId);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    await removeSignup(eventId, guestId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/signups error:", error);
    return NextResponse.json(
      { error: "Failed to remove signup" },
      { status: 500 }
    );
  }
}
