import { Schema, model, models } from "mongoose";
import {
  IResidentProfile,
  IResidentProfileModel,
} from "@/constant/interface/IResidentProfile";

const ResidentProfileSchema = new Schema<
  IResidentProfile,
  IResidentProfileModel
>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    birthdate: { type: Date, default: null },
    sex: { type: String, enum: ["Female", "Male"], default: null },
    civilStatus: {
      type: String,
      enum: ["Single", "Married", "Widowed", "Separated"],
      default: null,
    },

    address: { type: String, trim: true, default: null },
    purok: { type: String, trim: true, default: null },
    yearsResiding: { type: String, trim: true, default: null },

    emergencyName: { type: String, trim: true, default: null },
    emergencyRelation: { type: String, trim: true, default: null },
    emergencyContact: { type: String, trim: true, default: null },

    idNumber: { type: String, unique: true, sparse: true, default: null },
    householdNo: { type: String, trim: true, default: null },
    memberSince: { type: Date, default: null },
    validThru: { type: Date, default: null },
  },
  { timestamps: true },
);

ResidentProfileSchema.pre("save", function () {
  if (this.isNew) {
    if (!this.idNumber) {
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      this.idNumber = `SI-${year}-${random}`;
    }
    if (!this.memberSince) this.memberSince = new Date();
    if (!this.validThru) {
      const validThru = new Date();
      validThru.setFullYear(validThru.getFullYear() + 1);
      this.validThru = validThru;
    }
  }
});

const ResidentProfileModel =
  (models.ResidentProfile as IResidentProfileModel) ||
  model<IResidentProfile, IResidentProfileModel>(
    "ResidentProfile",
    ResidentProfileSchema,
  );

export default ResidentProfileModel;
