import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import JSZip from "jszip";
import { COUPLE_COOKIE, tokenIsValid } from "@/lib/auth";
import { PHOTO_BUCKET } from "@/lib/supabase";
import { serverClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  if (!tokenIsValid(cookies().get(COUPLE_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const db = serverClient();
  if (!db) return NextResponse.json({ error: "not configured" }, { status: 500 });

  const { data: photos, error } = await db
    .from("photos")
    .select("storage_path, uploader_name, created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: "query failed" }, { status: 500 });
  if (!photos?.length) {
    return NextResponse.json({ error: "no photos yet" }, { status: 404 });
  }

  const zip = new JSZip();
  let n = 0;

  for (const p of photos) {
    const file = await db.storage.from(PHOTO_BUCKET).download(p.storage_path);
    if (file.error || !file.data) continue;
    n += 1;
    const ext = p.storage_path.split(".").pop() || "jpg";
    const who = (p.uploader_name || "guest").replace(/[^\w\- ]+/g, "").trim() || "guest";
    zip.file(`${String(n).padStart(3, "0")}-${who}.${ext}`, await file.data.arrayBuffer());
  }

  if (n === 0) {
    return NextResponse.json({ error: "no files could be read" }, { status: 500 });
  }

  const zipped = await zip.generateAsync({ type: "arraybuffer", compression: "STORE" });
  const blob = new Blob([zipped], { type: "application/zip" });

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(blob.size),
      "Content-Disposition": 'attachment; filename="wedding-photos.zip"',
      "Cache-Control": "no-store",
    },
  });
}
