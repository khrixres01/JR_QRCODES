import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COUPLE_COOKIE, tokenIsValid } from "@/lib/auth";
import { serverClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Everything the couple can moderate, hidden rows included. */
export async function GET() {
  if (!tokenIsValid(cookies().get(COUPLE_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const db = serverClient();
  if (!db) return NextResponse.json({ error: "not configured" }, { status: 500 });

  const [photos, wishes] = await Promise.all([
    db
      .from("photos")
      .select("id, storage_path, uploader_name, hidden, created_at")
      .order("created_at", { ascending: false }),
    db
      .from("wishes")
      .select("id, name, message, hidden, created_at")
      .order("created_at", { ascending: false }),
  ]);

  if (photos.error || wishes.error) {
    return NextResponse.json({ error: "query failed" }, { status: 500 });
  }

  return NextResponse.json({ photos: photos.data, wishes: wishes.data });
}
