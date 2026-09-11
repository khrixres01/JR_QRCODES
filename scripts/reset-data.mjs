/**
 * Clears guest-submitted data: every photo row, every guestbook message, and
 * every file in the storage bucket. Ceremony content is untouched, since that
 * lives in the code rather than the database.
 *
 *   npm run reset          shows what is there and deletes nothing
 *   npm run reset -- --yes deletes it
 *
 * Deletion is permanent. There is no undo.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
try {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
} catch {
  console.error("Could not read .env.local. Run this from the project root.");
  process.exit(1);
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "The service role key is required: row-level security blocks deletes otherwise.",
  );
  process.exit(1);
}

const BUCKET = "wedding-photos";
const db = createClient(url, key, { auth: { persistSession: false } });
const confirmed = process.argv.includes("--yes");

const { data: photos, error: pErr } = await db.from("photos").select("id");
const { data: wishes, error: wErr } = await db.from("wishes").select("id");
const { data: listed, error: sErr } = await db.storage.from(BUCKET).list("", { limit: 1000 });

if (pErr || wErr || sErr) {
  console.error("Could not read current data:", (pErr || wErr || sErr).message);
  process.exit(1);
}

const files = (listed ?? []).filter((f) => f.id).map((f) => f.name);

console.log(`\n  photos   ${photos.length} row(s)`);
console.log(`  wishes   ${wishes.length} row(s)`);
console.log(`  storage  ${files.length} file(s)\n`);

if (photos.length + wishes.length + files.length === 0) {
  console.log("Nothing to clear.\n");
  process.exit(0);
}

if (!confirmed) {
  console.log("Nothing deleted. Re-run with --yes to delete all of the above:\n");
  console.log("  npm run reset -- --yes\n");
  process.exit(0);
}

if (files.length) {
  const { error } = await db.storage.from(BUCKET).remove(files);
  console.log(error ? `  storage  FAILED: ${error.message}` : `  storage  deleted ${files.length} file(s)`);
}

for (const table of ["photos", "wishes"]) {
  const { data, error } = await db.from(table).delete().not("id", "is", null).select("id");
  console.log(error ? `  ${table}  FAILED: ${error.message}` : `  ${table.padEnd(7)}  deleted ${data.length} row(s)`);
}

console.log("\nDone.\n");
