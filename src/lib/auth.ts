import { createHash, timingSafeEqual } from "crypto";

/**
 * The edit passcode lives ONLY in the CHECKLIST_PASSCODE env var
 * (.env.local for dev, host env settings in production). If it is unset,
 * every write is refused and the UI says so.
 */

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export function passcodeConfigured(): boolean {
  return Boolean(process.env.CHECKLIST_PASSCODE?.trim());
}

export function verifyPasscode(code: string | null | undefined): boolean {
  const secret = process.env.CHECKLIST_PASSCODE?.trim();
  if (!secret || !code) return false;
  const a = Buffer.from(sha256(code.trim()));
  const b = Buffer.from(sha256(secret));
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Write requests carry the passcode in an x-passcode header. */
export function authorized(req: Request): boolean {
  return verifyPasscode(req.headers.get("x-passcode"));
}
