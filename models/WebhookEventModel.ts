import { Schema, model, models } from "mongoose";

const WebhookEventSchema = new Schema(
  {
    eventId: { type: String, required: true, unique: true },
    provider: { type: String, required: true, default: "paymongo" },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.WebhookEvent || model("WebhookEvent", WebhookEventSchema);