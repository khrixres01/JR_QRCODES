import { reception } from "@/lib/content";

export default function Reception() {
  return (
    <>
      <div className="section">
        <div className="sec-head">
          <div className="sec-eyebrow">After the Ceremony</div>
          <div className="sec-title">Reception Programme</div>
        </div>
        <div className="oos-list">
          {reception.map((name, i) => (
            <div className="rc-item" key={name}>
              <span className="rc-num">{i + 1}</span>
              <span className="rc-name">{name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="pad" />
    </>
  );
}
