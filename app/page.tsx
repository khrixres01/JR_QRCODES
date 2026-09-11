"use client";

import { useState } from "react";
import Home from "@/components/Home";
import OrderOfService from "@/components/OrderOfService";
import Reception from "@/components/Reception";
import Menu from "@/components/Menu";
import Photos from "@/components/Photos";
import Wishes from "@/components/Wishes";
import PasscodeModal from "@/components/PasscodeModal";
import Backdrop from "@/components/Backdrop";

export type View = "home" | "order" | "reception" | "menu" | "photos" | "wishes";

export type Gate = { mode: "all" | "one"; photoId?: string };

const TABS: { key: View; icon: string; label: string }[] = [
  { key: "home", icon: "✦", label: "Home" },
  { key: "order", icon: "📖", label: "Service" },
  { key: "reception", icon: "🥂", label: "Reception" },
  { key: "menu", icon: "🍽️", label: "Menu" },
  { key: "photos", icon: "📷", label: "Photos" },
  { key: "wishes", icon: "✍", label: "Wishes" },
];

export default function App() {
  const [view, setView] = useState<View>("home");
  const [gate, setGate] = useState<Gate | null>(null);

  function go(next: View) {
    setView(next);
    window.scrollTo({ top: 0 });
  }

  function onUnlocked(g: Gate) {
    const url =
      g.mode === "all"
        ? "/api/photos/download-all"
        : `/api/photos/download?id=${encodeURIComponent(g.photoId ?? "")}`;
    window.location.href = url;
    setGate(null);
  }

  return (
    <div className={`app${view === "home" ? " on-home" : ""}`}>
      <Backdrop />

      <div className="screen" id="screen">
        <section className={`view${view === "home" ? " active" : ""}`}>
          <Home />
        </section>
        <section className={`view${view === "order" ? " active" : ""}`}>
          <OrderOfService />
        </section>
        <section className={`view${view === "reception" ? " active" : ""}`}>
          <Reception />
        </section>
        <section className={`view${view === "menu" ? " active" : ""}`}>
          <Menu />
        </section>
        <section className={`view${view === "photos" ? " active" : ""}`}>
          <Photos onRequestDownload={setGate} />
        </section>
        <section className={`view${view === "wishes" ? " active" : ""}`}>
          <Wishes />
        </section>
      </div>

      <nav className="nav">
        <div className="nav-inner">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={view === t.key ? "active" : undefined}
              onClick={() => go(t.key)}
            >
              <span className="ic">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <PasscodeModal
        gate={gate}
        onClose={() => setGate(null)}
        onUnlocked={onUnlocked}
      />
    </div>
  );
}
