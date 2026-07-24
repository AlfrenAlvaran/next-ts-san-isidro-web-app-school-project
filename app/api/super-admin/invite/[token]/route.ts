import { UserRole } from "@/constant/types";
import { connection } from "@/lib/database";
import { hashToken } from "@/lib/invite-token";
import { Invite } from "@/models/InviteModel";
import UserModel from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

const ROLE_MAP: Record<string, UserRole> = {
  ADMIN: "superadmin",
  STAFF: "admin",
  RESIDENT: "resident",
};

const PH_PHONE_REGEX = /^(09\d{9}|\+639\d{9})$/;

async function loadValidInvite(rawToken: string) {
  const tokenHash = hashToken(rawToken);
  const invite = await Invite.findOne({ tokenHash });

  if (!invite)
    return { error: "This invite link is invalid.", status: 404 } as const;
  if (invite.status === "ACCEPTED")
    return {
      error: "This invite has already been used.",
      status: 410,
    } as const;
  if (invite.status === "REVOKED")
    return { error: "This invite has been revoked.", status: 410 } as const;
  if (invite.expiresAt.getTime() < Date.now()) {
    invite.status = "EXPIRED";
    await invite.save();
    return { error: "This invite link has expired.", status: 410 } as const;
  }

  return { invite } as const;
}

function passwordIssue(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password needs at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password needs at least one number.";
  return null;
}

// Verify the link, return who it's for
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json(
      { error: "Missing invite token." },
      { status: 400 },
    );
  }

  await connection();

  const result = await loadValidInvite(token);
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  const { invite } = result;
  return NextResponse.json({
    name: invite.name ?? "",
    email: invite.email,
    role: invite.role,
    barangay: invite.barangay ?? null,
  });
}

// set password + phone, create the user,mark invite accepted
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const { password, fullName, phone } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Missing token or password." },
        { status: 400 },
      );
    }
    if (!phone || !PH_PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        {
          error:
            "A valid Philippine mobile number is required (e.g. 09XXXXXXXXX).",
        },
        { status: 422 },
      );
    }

    await connection();

    const result = await loadValidInvite(token);
    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }
    const { invite } = result;

    const issue = passwordIssue(password);
    if (issue) {
      return NextResponse.json({ error: issue }, { status: 422 });
    }

    const existingPhone = await UserModel.findOne({ phone });
    if (existingPhone) {
      return NextResponse.json(
        { error: "That phone number is already in use." },
        { status: 409 },
      );
    }
    const user = await UserModel.create({
      email: invite.email,
      password,
      fullName: fullName?.trim() || invite.name || undefined,
      phone,
      role: ROLE_MAP[invite.role] ?? "resident",
      isApproved: true, // came through an admin-issued invite, so pre-approved
      isVerified: true, // email ownership already proven by clicking the invite link
    });

    invite.status = "ACCEPTED";
    invite.userId = user._id;
    invite.acceptedAt = new Date();
    await invite.save();
    return NextResponse.json({
      ok: true,
      account: { fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json(
        { error: "That email or phone is already registered." },
        { status: 409 },
      );
    }
    console.error("Failed to accept invite:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
