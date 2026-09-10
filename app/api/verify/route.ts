import { NextResponse } from "next/server";
import { COOKIE_MAX_AGE, COUPLE_COOKIE, issueToken, passcodeMatches } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A small delay blunts brute-forcing of a 6-digit code. */
function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function POST(req: Request) {
  if (!process.env.COUPLE_PASSCODE) {
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  let passcode = "";
  try {
    const body = await req.json();
    passcode = typeof body?.passcode === "string" ? body.passcode : "";
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  await delay(400);

  if (!passcodeMatches(passcode)) {
    return NextResponse.json({ error: "incorrect" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COUPLE_COOKIE, issueToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
