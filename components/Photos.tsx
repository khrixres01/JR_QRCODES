"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { PHOTO_BUCKET, publicPhotoUrl, supabase, type Photo } from "@/lib/supabase";
import type { Gate } from "@/app/page";

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export default function Photos({
  onRequestDownload,
}: {
  onRequestDownload: (gate: Gate) => void;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("photos")
      .select("id, storage_path, uploader_name, hidden, created_at")
      .eq("hidden", false)
      .order("created_at", { ascending: false });
    if (!error && data) setPhotos(data as Photo[]);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  async function upload(file: File) {
    if (!supabase) {
      setNote("Photo sharing is not configured yet.");
      return;
    }
    if (!ALLOWED.includes(file.type)) {
      setNote("Please choose a JPEG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setNote("That image is larger than 12 MB. Please pick a smaller one.");
      return;
    }

    setBusy(true);
    setNote("Uploading…");
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const up = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, file, { cacheControl: "3600", contentType: file.type });

    if (up.error) {
      setBusy(false);
      setNote("Upload failed. Please try again.");
      return;
    }

    const trimmed = name.trim().slice(0, 40);

    const ins = await supabase
      .from("photos")
      .insert({ storage_path: path, uploader_name: trimmed || null });

    setBusy(false);
    if (ins.error) {
      setNote("Saved the image but could not add it to the wall.");
      return;
    }
    setName("");
    setNote("Thank you — your photo is on the wall.");
    load();
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) upload(f);
  }

  return (
    <>
      <div className="section">
        <div className="sec-head">
          <div className="sec-eyebrow">Celebrate</div>
          <div className="sec-title">Photo Wall</div>
        </div>

        <div className="upload">
          <div className="u-t">Share your moment</div>
          <div className="u-s">
            Snap a photo and add it to the wall for everyone to enjoy.
          </div>
          <input
            className="field"
            placeholder="Your name (optional)"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={onPick}
          />
          <button
            className="btn"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            type="button"
          >
            {busy ? "Uploading…" : "Add your photo"}
          </button>
          <div className="upload-note">{note}</div>
        </div>

        <div className="wall-bar">
          <span className="wall-count">
            {photos.length} {photos.length === 1 ? "photo" : "photos"}
          </span>
          <button
            className="btn ghost sm"
            type="button"
            disabled={photos.length === 0}
            onClick={() => onRequestDownload({ mode: "all" })}
          >
            ⤓ Download all
          </button>
        </div>

        {photos.length === 0 ? (
          <div className="empty-wall">
            No photos yet — be the first to share one.
          </div>
        ) : (
          <div className="grid">
            {photos.map((p) => (
              <div className="ph" key={p.id}>
                <img
                  src={publicPhotoUrl(p.storage_path)}
                  alt={p.uploader_name ? `Photo by ${p.uploader_name}` : "Guest photo"}
                  loading="lazy"
                />
                <button
                  className="dl"
                  title="Download"
                  type="button"
                  onClick={() => onRequestDownload({ mode: "one", photoId: p.id })}
                >
                  ⤓
                </button>
                <span>{p.uploader_name || "A guest"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="pad" />
    </>
  );
}
