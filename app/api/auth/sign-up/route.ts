import { authFormSchema } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { connection } from "@/lib/database";
import UserModel from "@/models/UserModel";
import cloudinary from "@/lib/cloudinary";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const raw = {
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
      agreeTerms: form.get("agreeTerms") === "true",
    };

    const parsed = authFormSchema("sign-up").safeParse(raw);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];

      return NextResponse.json(
        { error: firstIssue.message, field: firstIssue.path[0] },
        { status: 400 },
      );
    }
    const { fullName, email, password, phone } = parsed.data;

    const file = form.get("idFile") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "Valid ID document is required." },
        { status: 400 },
      );
    }

    await connection();

    const existing = await UserModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      const field = existing.email === email ? "email" : "phone";
      return NextResponse.json(
        {
          error:
            field === "email"
              ? "This email is already registered."
              : "This phone number is already registered.",
          field,
        },
        { status: 409 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "san-isidro/ids", resource_type: "auto" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result as { secure_url: string });
          },
        );
        stream.end(buffer);
      },
    );

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await UserModel.create({
      fullName,
      email,
      password,
      phone,
      documentUrl: uploadResult.secure_url,
      verificationToken,
      verificationTokenExpiry,
    });
    try {
      await sendVerificationEmail(user.email, user.fullName, verificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }
    return NextResponse.json(
      {
        message:
          "Account created. Please check your email to verify your account.",
        user: { id: user._id.toString(), email: user.email },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
