import { NextResponse } from "next/server";
import { verifyPasscode } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** POST { code } → 200 if the passcode is right, 401 otherwise. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = typeof body?.code === "string" ? body.code : "";
  if (!verifyPasscode(code)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
