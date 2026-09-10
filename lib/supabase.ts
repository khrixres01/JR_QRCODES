import { createClient } from "@supabase/supabase-js";

export const PHOTO_BUCKET = "wedding-photos";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser client. Reads and writes go through row-level security, so this key
 * is safe to ship. See supabase/schema.sql for the policies it relies on.
 */
export const supabase =
  url && anonKey ? createClient(url, anonKey) : null;

export function publicPhotoUrl(path: string): string {
  return `${url}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
}

export type Photo = {
  id: string;
  storage_path: string;
  uploader_name: string | null;
  hidden: boolean;
  created_at: string;
};

export type Wish = {
  id: string;
  name: string | null;
  message: string;
  hidden: boolean;
  created_at: string;
};
