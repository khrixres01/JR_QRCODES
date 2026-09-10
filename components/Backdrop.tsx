/* eslint-disable @next/next/no-img-element */
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <img className="floral-tr" src="/art/floral-tr.png" alt="" />
      <img className="floral-bl" src="/art/floral-bl.png" alt="" />
      <img className="watermark" src="/art/monogram-watermark.png" alt="" />
    </div>
  );
}
