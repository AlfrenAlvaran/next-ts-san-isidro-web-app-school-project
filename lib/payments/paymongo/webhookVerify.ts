import crypto from "crypto";

export function verifyPaymongoSignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string,
  { live = false }: { live?: boolean } = {}
): boolean {
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k, v];
    })
  );

  if (!parts.t || (!parts.te && !parts.li)) return false;

  const signedPayload = `${parts.t}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex");

  const provided = live ? parts.li : parts.te ?? parts.li;
  if (!provided) return false;

  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}