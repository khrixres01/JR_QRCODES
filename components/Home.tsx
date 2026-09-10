/* eslint-disable @next/next/no-img-element */
import { wedding } from "@/lib/content";

export default function Home() {
  return (
    <>
      <div className="hero hero-iv">
        <div className="welcome">{wedding.welcome}</div>
        <img className="iv-cover" src="/art/iv-cover.png" alt="Wedding invitation" />
        <div className="subtitle">{wedding.subtitle}</div>
        <div className="rule" />
        <div className="venue">{wedding.venue}</div>
      </div>

      <div className="chips one">
        <div className="chip">
          <div className="k">Time</div>
          <div className="v">{wedding.time}</div>
        </div>
      </div>

      <div className="note-card">
        <p>{wedding.note}</p>
      </div>

      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="sec-head">
          <div className="sec-eyebrow">Ministering</div>
          <div className="sec-title">Officiating Ministers</div>
        </div>
      </div>
      <div className="ministers">
        {wedding.ministers.map((m) => (
          <div className="minister" key={m}>
            <div className="dot" />
            <div className="m-name">{m}</div>
          </div>
        ))}
      </div>

      <div className="pad" />
    </>
  );
}
