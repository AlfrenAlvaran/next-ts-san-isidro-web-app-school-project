import { connection } from "@/lib/database";
import RequestModel from "@/models/RequestModel";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

function verifyHitPaySignature(
  payload: Record<string, string>,
  salt: string,
): boolean {
  const { hmac, ...rest } = payload;
  if (!hmac) return false;

  const sorted = Object.keys(rest)
    .sort()
    .map((key) => `${key}${rest[key]}`)
    .join("");

  const calculated = crypto
    .createHmac("sha256", salt)
    .update(sorted)
    .digest("hex");

  return calculated === hmac;
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const params = new URLSearchParams(raw);
    const payload: Record<string, string> = {};
    params.forEach((value, key) => {
      payload[key] = value;
    });

    const salt = process.env.HITPAY_SALT;
    if (!salt) {
      console.error("HITPAY_SALT is not configured.");
      return NextResponse.json({ error: "Server misconfigured." }, { status: 500 });
    }

    if (!verifyHitPaySignature(payload, salt)) {
      console.error("Invalid HitPay webhook signature.");
      return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
    }

    const { reference_number: referenceNo, status, payment_request_id } = payload;

    if (!referenceNo) {
      return NextResponse.json({ error: "Missing reference_number." }, { status: 400 });
    }

    await connection();

    const request = await RequestModel.findOne({ referenceNo });
    if (!request) {
      console.error(`No request found for reference ${referenceNo}`);
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    if (status === "completed") {
      request.paymentStatus = "paid";
      request.hitpayRequestId = payment_request_id ?? request.hitpayRequestId;
      await request.save();
    } else {
      console.log(`HitPay webhook: request ${referenceNo} status=${status}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("HitPay webhook error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}