import { connection } from "@/lib/database";
import { hashToken } from "@/lib/invite-token";
import { Invite } from "@/models/InviteModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } },
) {
  try {
    await connection();
    const tokenHash = hashToken(params.token);
    const invite = await Invite.findOne({ tokenHash, status: "PENDING" });

    if (!invite || invite.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invite is invalid or expired." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      invite: {
        name: invite.name ?? "",
        email: invite.email,
        role: invite.role.toLowerCase(),
        barangay: invite.barangay ?? "San Isidro",
      },
    });
  } catch (error) {
    console.error("[GET /api/invites/:token]", error);
    return NextResponse.json(
      { error: "Failed to load invite." },
      { status: 500 },
    );
  }
}
