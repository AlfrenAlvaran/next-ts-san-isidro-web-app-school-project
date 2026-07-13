import { Schema, model, models, Types } from "mongoose";

export interface IRequest {
  profile_id: Types.ObjectId;
  referenceNo: string;
  serviceTitle: string;
  category: string;
  fee: string;
  purpose: string;
  stage: number;
  status: "pending" | "released" | "rejected";
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
    stage: { type: Number, required: true, default: 0, min: 0, max: 3 },
    status: {
      type: String,
      enum: ["pending", "released", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.RequestModel || model<IRequest>("Request", RequestSchema);