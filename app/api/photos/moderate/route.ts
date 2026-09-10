import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COUPLE_COOKIE, tokenIsValid } from "@/lib/auth";
import { adminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Hide or unhide a photo or a guestbook message. */
export async function POST(req: Request) {
  if (!tokenIsValid(cookies().get(COUPLE_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const db = adminClient();
  if (!db) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is required for moderation" },
      { status: 500 },
    );
  }

  let id = "";
  let hidden = false;
  let table = "photos";
  try {
    const body = await req.json();
    id = String(body?.id ?? "");
    hidden = Boolean(body?.hidden);
    table = body?.table === "wishes" ? "wishes" : "photos";
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const { error } = await db.from(table).update({ hidden }).eq("id", id);
  if (error) return NextResponse.json({ error: "update failed" }, { status: 500 });

  return NextResponse.json({ ok: true, id, hidden });
}
