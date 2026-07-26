import crypto from "crypto";

export function verifyPaymongoSignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string
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

  const expectedBuf = Buffer.from(expected);

  // Check whichever signature component(s) PayMongo actually sent.
  // The secret you configured determines which one will actually match —
  // no need to guess "live vs test" from NODE_ENV.
  const candidates = [parts.te, parts.li].filter(Boolean) as string[];

  return candidates.some((provided) => {
    const providedBuf = Buffer.from(provided);
    return (
      expectedBuf.length === providedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, providedBuf)
    );
  });
}