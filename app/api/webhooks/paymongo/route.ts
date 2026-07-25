import { connection } from "@/lib/database";
import RequestModel from "@/models/RequestModel";

import { verifyPaymongoSignature } from "@/lib/payments/paymongo/webhookVerify";
import { NextRequest, NextResponse } from "next/server";
import WebhookEventModel from "@/models/WebhookEventModel";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get("paymongo-signature") ?? "";
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;

  if (!secret) {
    console.error("PAYMONGO_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const live = process.env.NODE_ENV === "production";
  if (!verifyPaymongoSignature(rawBody, sigHeader, secret, { live })) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const eventId = event?.data?.id;
  const type = event?.data?.attributes?.type;

  if (!eventId || !type) {
    return NextResponse.json({ error: "Malformed event" }, { status: 400 });
  }

  await connection();

  try {
    await WebhookEventModel.create({ eventId, type, provider: "paymongo" });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
    }
    throw err;
  }

  if (type === "link.payment.paid") {
    const resource = event.data.attributes.data;
    const linkId: string | undefined = resource?.attributes?.link_id ?? resource?.id;

    if (linkId) {
      const updated = await RequestModel.findOneAndUpdate(
        { paymongoLinkId: linkId },
        { paymentStatus: "paid" },
        { new: true }
      );
      if (!updated) {
        console.warn(`Webhook: no request found for PayMongo link ${linkId}`);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}