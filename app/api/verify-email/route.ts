import { NextRequest, NextResponse } from "next/server";
import { connection } from "@/lib/database";
import UserModel from "@/models/UserModel";
import { sendWelcomePendingApprovalEmail } from "@/lib/sendVerificationEmail";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing verification token." },
        { status: 400 },
      );
    }

    await connection();

    const user = await UserModel.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or already-used verification link." },
        { status: 400 },
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "This email is already verified. You can sign in." },
        { status: 200 },
      );
    }

    if (
      user.verificationTokenExpiry &&
      user.verificationTokenExpiry.getTime() < Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "This verification link has expired. Please request a new one.",
        },
        { status: 400 },
      );
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    try {
      await sendWelcomePendingApprovalEmail(user.email, user.fullName);
    } catch (emailError) {
      console.error("Failed to send pending-approval email:", emailError);
    }

    return NextResponse.json(
      {
        message:
          "Email verified successfully. Your account is now pending admin approval.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}