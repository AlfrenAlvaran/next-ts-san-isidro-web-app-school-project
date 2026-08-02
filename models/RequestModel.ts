import { Schema, model, models, Types } from "mongoose";

export interface IOverdueNotice {
  notified: boolean;
  message: string | null;
  revisedPickupDate: Date | null;
  notifiedAt: Date | null;
}

export interface IRequest {
  profile_id: Types.ObjectId;
  referenceNo: string;
  serviceTitle: string;
  category: string;
  fee: string;
  purpose: string;
  stage: number;
  status: "submitted" | "pending" | "released" | "rejected";
  paymentStatus: "unpaid" | "paid" | "free";
  paymentLink?: string | null;
  paymongoLinkId?: string | null;
  paymentMethod?: "online" | "manual" | null;
  hitpayRequestId?: string | null;

  saleInvoiceNumber?: string;
  paidAt?: Date | null;

  pickupDate?: Date | null;

  overdueNotice: IOverdueNotice;
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    profile_id: {
      type: Schema.Types.ObjectId,
      ref: "ResidentProfile",
      required: true,
      index: true,
    },
    referenceNo: { type: String, required: true, unique: true },
    serviceTitle: { type: String, required: true },
    category: { type: String, required: true },
    fee: { type: String, required: true },
    purpose: { type: String, required: true, minlength: 3 },
    stage: { type: Number, required: true, default: 0, min: 0, max: 2 },
    status: {
      type: String,
      enum: ["submitted", "pending", "released", "rejected"],
      default: "submitted",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "free"],
      default: "unpaid",
    },
    paymentLink: { type: String, default: null },
    paymongoLinkId: { type: String, default: null, index: true },

    paymentMethod: { type: String, enum: ["online", "manual"], default: null },
    hitpayRequestId: { type: String, default: null },

    // No `default: null` here — the field stays entirely absent until the
    // payment PATCH route sets it. Combined with the partial index below,
    // this avoids the E11000 collision multiple undefined/null requests hit.
    saleInvoiceNumber: { type: String },
    paidAt: { type: Date, default: null },

    pickupDate: { type: Date, default: null },

    overdueNotice: {
      notified: { type: Boolean, default: false },
      message: { type: String, default: null },
      revisedPickupDate: { type: Date, default: null },
      notifiedAt: { type: Date, default: null },
    },
  },
  { timestamps: true },
);

// Only enforce uniqueness among documents where saleInvoiceNumber is an
// actual string — requests that never had one (free, or not yet paid)
// are excluded entirely, so they can never collide with each other.
RequestSchema.index(
  { saleInvoiceNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { saleInvoiceNumber: { $type: "string" } },
  },
);

export default models.Request || model<IRequest>("Request", RequestSchema);