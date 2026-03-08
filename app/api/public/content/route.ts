import { NextResponse } from "next/server";
import { getPublicContent } from "@/lib/signup/content-queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getPublicContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("GET /api/public/content error:", error);
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 }
    );
  }
}
