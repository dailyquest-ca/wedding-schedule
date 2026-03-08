import { NextRequest, NextResponse } from "next/server";
import { validateSignupInput } from "@/lib/signup/validation";
import { isSignupEnabledEvent } from "@/lib/signup/content-queries";
import { addSignup, removeSignup } from "@/lib/signup/queries";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, guestId } = body;

    const input = validateSignupInput(eventId, guestId);
    if (!input.valid) {
      return NextResponse.json({ error: input.error }, { status: 400 });
    }

    const eventExists = await isSignupEnabledEvent(eventId);
    if (!eventExists) {
      return NextResponse.json({ error: `Unknown or disabled event: ${eventId}` }, { status: 400 });
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

    const input = validateSignupInput(eventId, guestId);
    if (!input.valid) {
      return NextResponse.json({ error: input.error }, { status: 400 });
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
