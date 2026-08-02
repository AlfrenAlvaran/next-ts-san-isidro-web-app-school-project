import { connection } from "@/lib/database";
import { markRequestPaidAndNotify } from "@/lib/payments/markRequestPaid";
import { verifyPaymongoSignature } from "@/lib/payments/paymongo/webhookVerify";
import { NextRequest, NextResponse } from "next/server";
import WebhookEventModel from "@/models/WebhookEventModel";

export const runtime = "nodejs";

const PAID_EVENT_TYPES = new Set([
  "link.payment.paid",
  "checkout_session.payment.paid",
]);

function extractIdentifiers(resource: any) {
  const linkId: string | undefined =
    resource?.type === "link" ? resource?.id : resource?.attributes?.link_id;

  const firstPayment =
    resource?.attributes?.payments?.[0]?.data ??
    resource?.attributes?.payments?.[0] ??
    null;

  const remarks: string | undefined =
    resource?.attributes?.remarks ??
    firstPayment?.attributes?.description ??
    resource?.attributes?.description;

  const referenceNumber: string | undefined =
    resource?.attributes?.reference_number ??
    firstPayment?.attributes?.external_reference_number;

  return { linkId, remarks, referenceNumber };
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get("paymongo-signature") ?? "";
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;

  if (!secret) {
    console.error("PAYMONGO_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  if (!verifyPaymongoSignature(rawBody, sigHeader, secret)) {
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
      return NextResponse.json(
        { received: true, duplicate: true },
        { status: 200 },
      );
    }
    throw err;
  }

  if (PAID_EVENT_TYPES.has(type)) {
    const resource = event.data.attributes.data;
    const { linkId, remarks, referenceNumber } = extractIdentifiers(resource);

    let updated = null;

    if (linkId) {
      updated = await markRequestPaidAndNotify({ paymongoLinkId: linkId });
    }
    if (!updated && remarks) {
      updated = await markRequestPaidAndNotify({ referenceNo: remarks });
    }
    if (!updated && referenceNumber) {
      updated = await markRequestPaidAndNotify({
        referenceNo: referenceNumber,
      });
    }

    if (!updated) {
      console.warn("Webhook: no request found to mark paid", {
        type,
        linkId,
        remarks,
        referenceNumber,
      });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
