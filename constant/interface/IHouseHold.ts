import { Document, Model, Types } from "mongoose";

export interface IHouseHold extends Document {
  user_id: Types.ObjectId;
  name: string;
  relation: string;
  age: number;
}

export interface IHouseHoldModel extends Model<IHouseHold> {}
