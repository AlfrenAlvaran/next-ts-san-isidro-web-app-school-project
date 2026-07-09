import { IUser, IUserModel } from "@/constant/interface/IUser";
import {
  CallbackWithoutResultAndOptionalError,
  Schema,
  model,
  models,
} from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters."],
      select: false,
    },

    fullName: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
      unique: true,
      match: [
        /^(09\d{9}|\+639\d{9})$/,
        "Please enter a valid Philippine mobile number.",
      ],
    },

    role: {
      type: String,
      enum: ["resident", "admin", "superadmin"],
      default: "resident",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    avatarUrl: {
      type: String,
      default: null,
    },

    documentUrl: {
      type: String,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
      select: false,
    },

    verificationTokenExpiry: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const { password, verificationToken, verificationTokenExpiry, ...safe } =
      ret as unknown as Record<string, unknown>;
    return safe;
  },
});

export const UserModel =
  (models.User as IUserModel) || model<IUser, IUserModel>("User", UserSchema);

export default UserModel;
