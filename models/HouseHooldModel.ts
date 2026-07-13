import { IHouseHold, IHouseHoldModel } from "@/constant/interface/IHouseHold";
import { Schema, model, models } from "mongoose";

const schema = new Schema<IHouseHold, IHouseHoldModel>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "ResidentProfile",
      required: [true, "User Id is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    relation: {
      type: String,
      required: [true, "Relation is required"],
      trim: true,
      minlength: [1, "Relation is required"],
      maxlength: [50, "Relation is too long"],
    },
    age: {
      type: Number,
      required: [true, "Age is required."],
      min: [0, "Age cannot be negative."],
      max: [150, "Please enter a valid age."],
    },
  },
  { timestamps: true },
);
export const HouseHoldModel =
  (models.HouseHold as IHouseHoldModel) ||
  model<IHouseHold, IHouseHoldModel>("HouseHold", schema);

export default HouseHoldModel;
