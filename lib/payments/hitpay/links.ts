export class HitPayError extends Error {
  code?: string;
  errors?: Record<string, string[]>;
  constructor(message: string, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "HitPayError";
    this.code = code;
    this.errors = errors;
  }
}

interface HitPayLink {
  id: string;
  url: string;
  status: string;
  amount: string;
  currency: string;
  reference_number: string;
}

interface CreateHitPayLinkParams {
  amountPesos: number; // e.g. 25.00 — decimal pesos, not centavos
  purpose: string;
  referenceNo: string;
  redirectUrl?: string;
  webhookUrl?: string;
}

const HITPAY_BASE_URL =
  process.env.HITPAY_ENV === "production"
    ? "https://api.hit-pay.com"
    : "https://api.sandbox.hit-pay.com";

export async function createHitPayLink(
  params: CreateHitPayLinkParams,
): Promise<HitPayLink> {
  const apiKey = process.env.HITPAY_API_KEY;
  if (!apiKey) {
    throw new HitPayError("HITPAY_API_KEY is not configured.");
  }

  const res = await fetch(`${HITPAY_BASE_URL}/v1/payment-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-BUSINESS-API-KEY": apiKey,
    },
    body: JSON.stringify({
      amount: params.amountPesos,
      currency: "PHP",
      purpose: params.purpose,
      reference_number: params.referenceNo,
      redirect_url: params.redirectUrl,
      webhook: params.webhookUrl,
      send_email: "true",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new HitPayError(
      data.message ?? "Failed to create HitPay payment link.",
      String(res.status),
      data.errors,
    );
  }

  return data as HitPayLink;
}