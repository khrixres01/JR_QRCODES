"use client";

import { useState } from "react";
import { orderOfService, type Body, type OrderItem } from "@/lib/order";

/** Renders "\n" inside hymn stanzas as line breaks. */
function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((line, i) => (
        <span key={i}>
          {line}
          {i < parts.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

function Panel({ body }: { body: Body }) {
  if (body.kind === "hymn") {
    return (
      <div className="oos-body">
        <div className="hymn-title">{body.title}</div>
        {body.stanzas.map((s, i) => (
          <div className={`stanza${s.chorus ? " chorus" : ""}`} key={i}>
            <p>
              <Lines text={s.text} />
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="oos-body liturgy">
      {body.lines.map((l, i) => {
        if (l.response) {
          return (
            <p className="response" key={i}>
              {l.response}
            </p>
          );
        }
        return (
          <p key={i}>
            {l.speaker ? <span className="speaker">{l.speaker}</span> : null}
            {l.speaker && (l.stage || l.text) ? " " : null}
            {l.stage ? <span className="stage">{l.stage}</span> : null}
            {l.stage && l.text ? " " : null}
            {l.text}
          </p>
        );
      })}
    </div>
  );
}

function Item({ item }: { item: OrderItem }) {
  const [open, setOpen] = useState(false);
  const expandable = Boolean(item.body);

  return (
    <div className={`oos-item${open ? " open" : ""}`}>
      <button
        className="oos-btn"
        onClick={expandable ? () => setOpen((o) => !o) : undefined}
        aria-expanded={expandable ? open : undefined}
        type="button"
      >
        <span className="oos-num">{item.n}</span>
        <span className="oos-main">
          <span className="oos-name">{item.name}</span>
          {item.sub ? <span className="oos-sub">{item.sub}</span> : null}
          {item.readTag ? <span className="oos-readtag">{item.readTag}</span> : null}
        </span>
        {expandable ? <span className="oos-chev">▸</span> : null}
      </button>
      {item.body ? (
        <div className="oos-panel">
          <Panel body={item.body} />
        </div>
      ) : null}
    </div>
  );
}

export default function OrderOfService() {
  return (
    <>
      <div className="section">
        <div className="sec-head">
          <div className="sec-eyebrow">Ceremony</div>
          <div className="sec-title">Order of Service</div>
        </div>
        <div className="oos-intro">Tap any item marked “Read” to follow along</div>
        <div className="oos-list">
          {orderOfService.map((item) => (
            <Item item={item} key={item.n} />
          ))}
        </div>
      </div>
      <div className="pad" />
    </>
  );
}
