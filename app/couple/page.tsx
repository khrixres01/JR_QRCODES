"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import { publicPhotoUrl, type Photo, type Wish } from "@/lib/supabase";

export default function CouplePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/photos/list");
    if (res.status === 401) {
      setUnlocked(false);
      return;
    }
    if (!res.ok) return;
    const data = await res.json();
    setPhotos(data.photos ?? []);
    setWishes(data.wishes ?? []);
    setUnlocked(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function unlock() {
    if (code.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: code }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Incorrect passcode.");
      setCode("");
      return;
    }
    setError("");
    load();
  }

  async function toggle(table: "photos" | "wishes", id: string, hidden: boolean) {
    await fetch("/api/photos/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, id, hidden }),
    });
    load();
  }

  if (!unlocked) {
    return (
      <div className="wide">
        <h1>Couple access</h1>
        <div className="lead">Enter your 6-digit passcode</div>
        <div className="gate">
          <input
            className="pc-input"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") unlock();
            }}
          />
          <div className="pc-error">{error}</div>
          <button className="btn" style={{ width: "100%" }} disabled={busy} onClick={unlock}>
            {busy ? "Checking…" : "Unlock"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wide">
      <h1>Photos &amp; guestbook</h1>
      <div className="lead">Hide anything you would rather guests did not see</div>

      <div className="admin-bar">
        <span className="wall-count">
          {photos.length} photos · {photos.filter((p) => p.hidden).length} hidden
        </span>
        <a className="btn sm" href="/api/photos/download-all">
          ⤓ Download all photos
        </a>
      </div>

      <div className="admin-grid">
        {photos.map((p) => (
          <div className={`admin-ph${p.hidden ? " is-hidden" : ""}`} key={p.id}>
            <img src={publicPhotoUrl(p.storage_path)} alt={p.uploader_name || "Guest photo"} />
            <button className="toggle" onClick={() => toggle("photos", p.id, !p.hidden)}>
              {p.hidden ? "Unhide" : "Hide"}
            </button>
          </div>
        ))}
      </div>

      <div className="menu-cat">Guestbook</div>
      {wishes.map((w) => (
        <div className="wish" key={w.id} style={{ opacity: w.hidden ? 0.45 : 1 }}>
          <div className="msg">{w.message}</div>
          <div className="from">— {w.name || "Anonymous"}</div>
          <button
            className="btn ghost sm"
            style={{ marginTop: 10 }}
            onClick={() => toggle("wishes", w.id, !w.hidden)}
          >
            {w.hidden ? "Unhide" : "Hide"}
          </button>
        </div>
      ))}
    </div>
  );
}
