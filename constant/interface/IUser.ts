// IUser.ts
import { UserRole } from "@/constant/types";
import { Document, Model } from "mongoose";


export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  phone: string;

  role: UserRole;
  isApproved: boolean;

  avatarUrl?: string | null;
  documentUrl?: string | null;

  isVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpiry?: Date | null;
  lastVerificationEmailSentAt?: Date | null

  // Forgot Password
  resetPasswordToken?: string
  resetPasswordTokenExpiry?: Date | null
  lastPasswordResetEmailSentAt?: Date |null
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidate: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {}