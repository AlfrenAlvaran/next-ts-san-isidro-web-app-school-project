import { UserRole } from "@/constant/types";
import { connection } from "@/lib/database";
import { createInviteToken } from "@/lib/invite-token";
import { buildInviteEmail } from "@/lib/mail/buildInviteEmail";
import { transporter } from "@/lib/mailer";
import { Invite } from "@/models/InviteModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, role, barangay, inviteBy } = await req.json();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedName = name?.trim();

    if (!trimmedName || !trimmedEmail) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    if (!["ADMIN", "STAFF", "RESIDENT"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    await connection();

    const existingInvite = await Invite.findOne({ email: trimmedEmail });
    if (existingInvite && existingInvite.status === "PENDING") {
      return NextResponse.json(
        {
          error: `${trimmedEmail} already has a pending invite. Use resend instead.`,
        },
        { status: 409 },
      );
    }
    if (existingInvite && existingInvite.status === "ACCEPTED") {
      return NextResponse.json(
        { error: `${trimmedEmail} already has an account.` },
        { status: 409 },
      );
    }

    const { rawToken, tokenHash, expiresAt } = createInviteToken();

    const invite = existingInvite
      ? Object.assign(existingInvite, {
          name: trimmedName,
          role,
          barangay,
          status: "PENDING",
          tokenHash,
          expiresAt,
          inviteBy,
          userId: undefined,
          acceptedAt: undefined,
        })
      : new Invite({
          name: trimmedName,
          email: trimmedEmail,
          role: role as UserRole,
          barangay,
          status: "PENDING",
          tokenHash,
          expiresAt,
          inviteBy,
        });

    await invite.save();

    const inviteUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/accept-invite?token=${rawToken}`;

    const message = buildInviteEmail({
      to: trimmedEmail,
      name: trimmedName,
      role,
      inviteUrl,
    });

    await transporter.sendMail({
      from:
        process.env.SMTP_FROM ??
        '"San Isidro Staff Portal" <no-reply@sanisidro.gov.ph>',
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });

    return NextResponse.json({
      ok: true,
      account: {
        id: invite._id.toString(),
        name: trimmedName,
        email: trimmedEmail,
        role,
        status: "pending",
        joined: "Invited just now",
      },
    });
  } catch (error) {
    console.error("Failed to send invite email:", error);
    return NextResponse.json(
      {
        error:
          "Couldn't send the invite email. Check SMTP settings and try again.",
      },
      { status: 500 },
    );
  }
}
