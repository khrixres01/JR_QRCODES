import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COUPLE_COOKIE, tokenIsValid } from "@/lib/auth";
import { PHOTO_BUCKET } from "@/lib/supabase";
import { serverClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!tokenIsValid(cookies().get(COUPLE_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const db = serverClient();
  if (!db) return NextResponse.json({ error: "not configured" }, { status: 500 });

  const { data: photo, error } = await db
    .from("photos")
    .select("storage_path, uploader_name")
    .eq("id", id)
    .single();

  if (error || !photo) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const file = await db.storage.from(PHOTO_BUCKET).download(photo.storage_path);
  if (file.error || !file.data) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const bytes = await file.data.arrayBuffer();
  const type = file.data.type || "application/octet-stream";
  const buffer = new Blob([bytes], { type });
  const filename = photo.storage_path.split("/").pop() || "photo.jpg";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": type,
      "Content-Length": String(buffer.size),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
