import { NextRequest, NextResponse } from "next/server";
import { connection } from "@/lib/database";
import UserModel from "@/models/UserModel";
export const runtime = "nodejs";

const MIN_PASSWORD_LENGTH = 8;

// Lets the UI check a token is still valid before the user even starts
// typing a new password, instead of only finding out after submit.
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token")?.trim();

    if (!token) {
      return NextResponse.json(
        { error: "Missing reset token." },
        { status: 400 },
      );
    }

    await connection();

    const user = await UserModel.findOne({ resetPasswordToken: token }).select(
      "+resetPasswordToken +resetPasswordTokenExpiry",
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or already-used reset link." },
        { status: 400 },
      );
    }

    if (
      user.resetPasswordTokenExpiry &&
      user.resetPasswordTokenExpiry.getTime() < Date.now()
    ) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiry = undefined;
      await user.save();

      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 },
      );
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("Validate reset token error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const token = body?.token?.trim();
    const password = body?.password;

    if (!token) {
      return NextResponse.json(
        { error: "Missing reset token." },
        { status: 400 },
      );
    }

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        {
          error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        },
        { status: 400 },
      );
    }

    await connection();

    const user = await UserModel.findOne({ resetPasswordToken: token }).select(
      "+resetPasswordToken +resetPasswordTokenExpiry",
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or already-used reset link." },
        { status: 400 },
      );
    }

    if (
      user.resetPasswordTokenExpiry &&
      user.resetPasswordTokenExpiry.getTime() < Date.now()
    ) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiry = undefined;
      await user.save();

      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 },
      );
    }

    // Schema's pre-save hook hashes this automatically since it's a
    // modified path — no need to hash it here.
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Your password has been reset. You can now sign in." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}