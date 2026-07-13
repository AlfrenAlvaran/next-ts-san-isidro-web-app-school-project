import { Document, Model, Types } from "mongoose";

export type CivilStatus = "Single" | "Married" | "Widowed" | "Separated";
export type Sex = "Female" | "Male";

export interface IResidentProfile extends Document {
  user: Types.ObjectId;

  birthdate?: Date | null;
  sex?: Sex | null;
  civilStatus?: CivilStatus | null;

  address?: string | null;
  purok?: string | null;
  yearsResiding?: string | null;

  emergencyName?: string | null;
  emergencyRelation?: string | null;
  emergencyContact?: string | null;

  idNumber?: string | null;
  householdNo?: string | null;
  memberSince?: Date | null;
  validThru?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface IResidentProfileModel extends Model<IResidentProfile> {}
