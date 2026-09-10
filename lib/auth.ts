import crypto from "crypto";

export const COUPLE_COOKIE = "couple_access";

/** How long a successful passcode entry stays valid. */
export const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

function passcode(): string {
  const p = process.env.COUPLE_PASSCODE;
  if (!p) throw new Error("COUPLE_PASSCODE is not set");
  return p;
}

function eq(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** Constant-time comparison of a user-supplied passcode. */
export function passcodeMatches(input: string): boolean {
  return eq(input, passcode());
}

/**
 * Stateless session token: an HMAC over a fixed string, keyed by the passcode.
 * Changing COUPLE_PASSCODE invalidates every issued cookie.
 */
export function issueToken(): string {
  return crypto.createHmac("sha256", passcode()).update("couple-access-v1").digest("hex");
}

export function tokenIsValid(token: string | undefined): boolean {
  if (!token) return false;
  try {
    return eq(token, issueToken());
  } catch {
    return false;
  }
}
