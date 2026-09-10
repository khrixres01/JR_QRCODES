"use client";

import { useEffect, useRef, useState } from "react";
import type { Gate } from "@/app/page";

export default function PasscodeModal({
  gate,
  onClose,
  onUnlocked,
}: {
  gate: Gate | null;
  onClose: () => void;
  onUnlocked: (gate: Gate) => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!gate) return;
    setValue("");
    setError("");
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [gate]);

  if (!gate) return <div className="modal" />;

  async function submit() {
    if (!gate) return;
    if (value.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: value }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Incorrect passcode. Please try again.");
      setValue("");
      return;
    }
    onUnlocked(gate);
  }

  return (
    <div
      className="modal show"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-lock">🔒</div>
        <div className="modal-title">Couple access</div>
        <div className="modal-sub">
          {gate.mode === "all"
            ? "Enter the 6-digit passcode to download all photos."
            : "Enter the 6-digit passcode to download this photo."}
        </div>
        <input
          ref={inputRef}
          className="pc-input"
          inputMode="numeric"
          maxLength={6}
          placeholder="••••••"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <div className="pc-error">{error}</div>
        <div className="modal-actions">
          <button className="btn ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" type="button" disabled={busy} onClick={submit}>
            {busy ? "Checking…" : "Unlock"}
          </button>
        </div>
      </div>
    </div>
  );
}
