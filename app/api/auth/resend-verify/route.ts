import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connection } from "@/lib/database";
import UserModel from "@/models/UserModel";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
export const runtime = "nodejs";

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours, matches the original link lifetime
const RESEND_COOLDOWN_MS = 30 * 1000; // keep in sync with the client-side cooldown

// Generic message used whenever we don't want to reveal whether an email
// is registered — prevents attackers from using this endpoint to enumerate
// accounts.
const GENERIC_MESSAGE =
  "If an account exists for that email, we've sent a new verification link.";

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
      "+lastVerificationEmailSentAt",
    );

    // Don't leak whether the email exists.
    if (!user) {
      return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "This email is already verified. You can sign in." },
        { status: 200 },
      );
    }

    // Server-side cooldown — the client-side timer is just UX, this is
    // what actually stops someone from hammering the endpoint.
    if (
      user.lastVerificationEmailSentAt &&
      Date.now() - user.lastVerificationEmailSentAt.getTime() <
        RESEND_COOLDOWN_MS
    ) {
      const waitSeconds = Math.ceil(
        (RESEND_COOLDOWN_MS -
          (Date.now() - user.lastVerificationEmailSentAt.getTime())) /
          1000,
      );
      return NextResponse.json(
        { error: `Please wait ${waitSeconds}s before requesting another email.` },
        { status: 429 },
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = new Date(Date.now() + TOKEN_EXPIRY_MS);
    user.lastVerificationEmailSentAt = new Date();
    await user.save();

    try {
      await sendVerificationEmail(user.email, user.fullName, verificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json(
        { error: "Couldn't send the email. Please try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}