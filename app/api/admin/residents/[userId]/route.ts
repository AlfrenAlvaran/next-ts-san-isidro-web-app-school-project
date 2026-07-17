import { auth } from "@/auth";
import { connection } from "@/lib/database";
import UserModel from "@/models/UserModel";
import { sendMail } from "@/lib/mailer";

import { NextResponse } from "next/server";
import { approvalEmail, rejectionEmail } from "@/lib/mail/residentDecision";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !["admin", "superadmin"].includes(role ?? "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;
    const { action, reason } = (await req.json()) as {
      action: "approve" | "reject";
      reason?: string;
    };

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await connection();

    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Resident not found" }, { status: 404 });
    }

    user.isApproved = action === "approve";
    await user.save();

    const { subject, html } =
      action === "approve"
        ? approvalEmail(user.fullName ?? "Resident")
        : rejectionEmail(user.fullName ?? "Resident", reason);

    try {
      await sendMail({ to: user.email, subject, html });
    } catch (mailErr) {
      // Don't fail the approval/rejection just because the email bounced —
      // log it so you can follow up, but the DB state is already correct.
      console.error(`[residents] ${action} email failed:`, mailErr);
    }

    return NextResponse.json(
      { success: true, isApproved: user.isApproved },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resident decision error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}