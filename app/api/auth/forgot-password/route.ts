import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connection } from "@/lib/database";
import UserModel from "@/models/UserModel";
import { sendPasswordResetEmail } from "@/lib/mail/Sendpasswordresetemail";

export const runtime = "nodejs";

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour — shorter-lived than email verification, since it grants account access
const RESEND_COOLDOWN_MS = 30 * 1000;

// Always return this, whether or not the email exists — never let this
// endpoint be used to check which emails are registered.
const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a password reset link.";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = body?.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    await connection();

    const user = await UserModel.findOne({ email }).select(
      "+lastPasswordResetEmailSentAt",
    );

    if (!user) {
      return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
    }

    if (
      user.lastPasswordResetEmailSentAt &&
      Date.now() - user.lastPasswordResetEmailSentAt.getTime() <
        RESEND_COOLDOWN_MS
    ) {
      const waitSeconds = Math.ceil(
        (RESEND_COOLDOWN_MS -
          (Date.now() - user.lastPasswordResetEmailSentAt.getTime())) /
          1000,
      );
      return NextResponse.json(
        { error: `Please wait ${waitSeconds}s before requesting another email.` },
        { status: 429 },
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + TOKEN_EXPIRY_MS);
    user.lastPasswordResetEmailSentAt = new Date();
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, user.fullName, resetToken);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      return NextResponse.json(
        { error: "Couldn't send the email. Please try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}