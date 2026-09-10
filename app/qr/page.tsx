/* eslint-disable @next/next/no-img-element */
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

export default async function QrPage() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const dataUrl = await QRCode.toDataURL(site, {
    width: 720,
    margin: 1,
    errorCorrectionLevel: "H",
    color: { dark: "#38281E", light: "#FFFFFF" },
  });

  return (
    <div className="wide">
      <h1>Scan to open</h1>
      <div className="lead">Print this for the tables and the welcome board</div>
      <div className="qr-wrap">
        <img src={dataUrl} alt={`QR code linking to ${site}`} />
        <div className="qr-url">{site}</div>
      </div>
    </div>
  );
}
