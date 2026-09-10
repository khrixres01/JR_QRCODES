"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase, type Wish } from "@/lib/supabase";

export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("wishes")
      .select("id, name, message, hidden, created_at")
      .eq("hidden", false)
      .order("created_at", { ascending: false });
    if (!error && data) setWishes(data as Wish[]);
  }, []);

  useEffect(() => {
    setName(window.localStorage.getItem("guestName") ?? "");
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [load]);

  async function sign() {
    const msg = message.trim();
    if (!msg) return;
    if (!supabase) {
      setNote("The guestbook is not configured yet.");
      return;
    }

    setBusy(true);
    const trimmed = name.trim().slice(0, 40);
    const { error } = await supabase
      .from("wishes")
      .insert({ message: msg.slice(0, 600), name: trimmed || null });
    setBusy(false);

    if (error) {
      setNote("Could not save your message. Please try again.");
      return;
    }
    if (trimmed) window.localStorage.setItem("guestName", trimmed);
    setMessage("");
    setNote("Thank you for signing the guestbook.");
    load();
  }

  return (
    <>
      <div className="section">
        <div className="sec-head">
          <div className="sec-eyebrow">Guestbook</div>
          <div className="sec-title">Well Wishes</div>
        </div>

        <div
          className="note-card"
          style={{ margin: "0 0 16px", background: "var(--paper-2)" }}
        >
          <textarea
            className="field"
            rows={3}
            maxLength={600}
            placeholder="Leave a message for the couple…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            className="field"
            placeholder="Your name"
            maxLength={40}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="btn"
            style={{ width: "100%" }}
            type="button"
            disabled={busy || !message.trim()}
            onClick={sign}
          >
            {busy ? "Signing…" : "Sign the guestbook"}
          </button>
          <div className="upload-note">{note}</div>
        </div>

        <div>
          {wishes.length === 0 ? (
            <div className="empty-wall">
              No messages yet — leave the first one.
            </div>
          ) : (
            wishes.map((w) => (
              <div className="wish" key={w.id}>
                <div className="msg">{w.message}</div>
                <div className="from">— {w.name || "Anonymous"}</div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="pad" />
    </>
  );
}
