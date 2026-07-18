import { UserRole } from "@/constant/types";
import mongoose, { Schema, models, model } from "mongoose";


export type InviteStatus = "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";

export interface IInvite {
  _id: mongoose.Types.ObjectId;
  name?: string; // optional prefill; the invitee can still set/confirm this later if you add that field to the form
  email: string;
  role: UserRole;
  barangay?: string;
  status: InviteStatus;
  tokenHash: string; // sha256 of the raw token — we never store the raw token
  expiresAt: Date;
  invitedBy?: string;
  userId?: mongoose.Types.ObjectId; // set once accepted
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InviteSchema = new Schema<IInvite>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ["ADMIN", "STAFF", "RESIDENT"], required: true },
    barangay: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REVOKED", "EXPIRED"],
      default: "PENDING",
    },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    invitedBy: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

export const Invite = models.Invite || model<IInvite>("Invite", InviteSchema);