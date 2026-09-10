import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import QRCode from "qrcode";

const site =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.argv[2] ||
  "http://localhost:3000";

const outDir = join(process.cwd(), "public", "qr");
await mkdir(outDir, { recursive: true });

const options = {
  margin: 1,
  errorCorrectionLevel: "H",
  color: { dark: "#38281E", light: "#FFFFFF" },
};

const png = await QRCode.toBuffer(site, { ...options, width: 2000, type: "png" });
await writeFile(join(outDir, "wedding-qr.png"), png);

const svg = await QRCode.toString(site, { ...options, type: "svg" });
await writeFile(join(outDir, "wedding-qr.svg"), svg);

console.log(`QR codes for ${site}`);
console.log("  public/qr/wedding-qr.png  (2000px, for print)");
console.log("  public/qr/wedding-qr.svg  (vector)");
