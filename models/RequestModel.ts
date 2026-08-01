// models/RequestModel.ts
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
  paymentStatus: "unpaid" | "paid";
  paymentLink?: string | null;
  paymongoLinkId?: string | null;
  paymentMethod?: "online" | "manual" | null;
  hitpayRequestId?: string | null;
  // Date the resident chose to collect the certificate at the barangay hall.
  pickupDate?: Date | null;
  // Set whenever an admin flags the request as overdue past `pickupDate`.
  // Drives both the email notice and the in-portal banner shown to the resident.
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
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paymentLink: { type: String, default: null },
    paymongoLinkId: { type: String, default: null, index: true },

    // HitPay
    paymentMethod: { type: String, enum: ["online", "manual"], default: null },
    hitpayRequestId: { type: String, default: null },

    // Resident-selected pickup date (set at submission time).
    pickupDate: { type: Date, default: null },

    // Overdue tracking — populated by PATCH /api/admin/requests/[id]/overdue
    overdueNotice: {
      notified: { type: Boolean, default: false },
      message: { type: String, default: null },
      revisedPickupDate: { type: Date, default: null },
      notifiedAt: { type: Date, default: null },
    },
  },
  { timestamps: true },
);

export default models.Request || model<IRequest>("Request", RequestSchema);