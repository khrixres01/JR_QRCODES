import { menuFoot, menuMains, menuSides } from "@/lib/content";

export default function Menu() {
  return (
    <>
      <div className="section">
        <div className="sec-head">
          <div className="sec-eyebrow">Dining</div>
          <div className="sec-title">Menu</div>
        </div>

        {menuMains.map((m, i) => (
          <div className="menu-item" key={m.name}>
            <div className="menu-num">{i + 1}</div>
            <div>
              <div className="menu-name">{m.name}</div>
              {m.desc ? <div className="menu-desc">{m.desc}</div> : null}
              {m.allergen ? <span className="allergen">{m.allergen}</span> : null}
            </div>
          </div>
        ))}

        <div className="menu-cat">Side Munches</div>
        {menuSides.map((m) => (
          <div className="menu-item side" key={m.name}>
            <div className="menu-num">·</div>
            <div>
              <div className="menu-name">{m.name}</div>
            </div>
          </div>
        ))}

        <div className="menu-foot">{menuFoot}</div>
      </div>
      <div className="pad" />
    </>
  );
}
