export interface PaymongoLinkAttributes {
  amount: number;
  archived: boolean;
  currency: string;
  description: string;
  livemode: boolean;
  fee: number | null;
  remarks: string | null;
  status: "unpaid" | "paid" | "archived";
  tax_inclusive: boolean | null;
  checkout_url: string;
  reference_number: string;
  created_at: number;
  updated_at: number;
  payments?: Array<{ data: { id: string; attributes: { status: string } } }>;
}

export interface PaymongoLink {
  id: string;
  type: "link";
  attributes: PaymongoLinkAttributes;
}

export interface PaymongoErrorDetail {
  code: string;
  detail: string;
  source?: { pointer: string; attribute: string };
}

export class PaymongoError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details: PaymongoErrorDetail[];

  constructor(
    message: string,
    status: number,
    details: PaymongoErrorDetail[] = [],
  ) {
    super(message);
    this.name = "PaymongoError";
    this.status = status;
    this.details = details;
    this.code = details[0]?.code;
  }
}
