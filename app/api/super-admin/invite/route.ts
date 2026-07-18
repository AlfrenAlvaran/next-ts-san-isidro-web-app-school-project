import { NextRequest, NextResponse } from "next/server";
import { connection } from "@/lib/database";
import UserModel from "@/models/UserModel";
import { Invite } from "@/models/InviteModel";
import { createInviteToken } from "@/lib/invite-token";
import { sendMail } from "@/lib/mailer";
import { inviteEmailHtml } from "@/lib/mail/InviteEmailHTML";

const ROLE_TITLES: Record<string, string> = { ADMIN: "Admin", STAFF: "Staff" };
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    await connection();

    const { email, role, name, barangay = "San Isidro" } = await req.json();
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email & Role are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "This person already has an active account." },
        { status: 409 },
      );
    }

    const existingInvite = await Invite.findOne({ email });
    if (
      existingInvite?.status === "PENDING" &&
      existingInvite.expiresAt > new Date()
    ) {
      return NextResponse.json(
        { error: "An invite is already pending for this email." },
        { status: 409 },
      );
    }

    const { rawToken, tokenHash, expiresAt } = createInviteToken();

    const invite = await Invite.findOneAndUpdate(
      { email },
      {
        email,
        role,
        name,
        barangay,
        status: "PENDING",
        tokenHash,
        expiresAt,
        $unset: { userId: "", acceptedAt: "" },
      },
      {
        upsert: true,
        new: true,
      },
    );

    const acceptUrl = `${BASE_URL}/accept-invite?token=${rawToken}`;

    await sendMail({
      to: email,
      subject: "You're invited to Barangay San Isidro Portal",
      html: inviteEmailHtml({
        name,
        roleTitle: ROLE_TITLES[role] ?? role,
        barangay,
        acceptUrl,
      }),
    });

    return NextResponse.json({
      invite: { id: invite._id, email: invite.email, status: invite.status },
    });
  } catch (error) {
    console.error("[POST /api/super-admin/invite]", error);
    return NextResponse.json(
      { error: "Failed to send invite." },
      { status: 500 },
    );
  }
}
