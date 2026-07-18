import crypto from "crypto";

const INVITE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function createInviteToken() {
  const rawToken = crypto.randomBytes(32).toString("hex"); // goes in the email link only
  const tokenHash = hashToken(rawToken); // goes in the DB
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS);
  return { rawToken, tokenHash, expiresAt };
}

export function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}