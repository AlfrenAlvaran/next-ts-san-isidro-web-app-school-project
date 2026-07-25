import { paymongoRequest } from "./client";
import { PaymongoLink } from "./types";

export async function createPaymentLink(params: {
  amountCentavos: number;
  description: string;
  remarks?: string;
  idempotencyKey: string;
}): Promise<PaymongoLink> {
  if (params.amountCentavos < 100) {
    throw new Error("PayMongo payment links require a minimum amount of ₱100.00");
  }

  const res = await paymongoRequest<{ data: PaymongoLink }>("/links", {
    method: "POST",
    idempotencyKey: params.idempotencyKey,
    body: {
      data: {
        attributes: {
          amount: params.amountCentavos,
          description: params.description,
          remarks: params.remarks,
        },
      },
    },
  });

  return res.data;
}

export async function retrievePaymentLink(linkId: string): Promise<PaymongoLink> {
  const res = await paymongoRequest<{ data: PaymongoLink }>(`/links/${linkId}`, {
    method: "GET",
  });
  return res.data;
}

export async function archivePaymentLink(linkId: string): Promise<PaymongoLink> {
  const res = await paymongoRequest<{ data: PaymongoLink }>(`/links/${linkId}/archive`, {
    method: "POST",
  });
  return res.data;
}