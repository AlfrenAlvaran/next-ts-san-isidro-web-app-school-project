import { auth } from "@/auth";
import { connection } from "@/lib/database";
import RequestModel from "@/models/RequestModel";
import { sendRequestStatusUpdateEmail } from "@/lib/mail/sendRequestStatusUpdate";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["submitted", "pending", "released", "rejected"]),
});

const STAGE_FOR_STATUS: Record<z.infer<typeof patchSchema>["status"], number | null> = {
  submitted: 0,
  pending: 1,
  released: 2,
  rejected: null,
};

function stageForStatus(status: keyof typeof STAGE_FOR_STATUS, currentStage: number) {
  const mapped = STAGE_FOR_STATUS[status];
  return mapped === null ? currentStage : mapped;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !["admin", "superadmin"].includes(role ?? "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connection();

    const existing = await RequestModel.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    const nextStage = stageForStatus(parsed.data.status, existing.stage);

    const updated = await RequestModel.findByIdAndUpdate(
      id,
      { status: parsed.data.status, stage: nextStage },
      { new: true }
    ).populate({
      path: "profile_id",
      populate: { path: "user", select: "fullName email" },
    });

    if (!updated) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    const residentUser = (updated.profile_id as any)?.user as
      | { fullName?: string; email?: string }
      | undefined;

    if (
      (parsed.data.status === "released" || parsed.data.status === "rejected") &&
      residentUser?.email
    ) {
      try {
        await sendRequestStatusUpdateEmail({
          to: residentUser.email,
          recipientName: residentUser.fullName ?? "Resident",
          referenceNo: updated.referenceNo,
          serviceTitle: updated.serviceTitle,
          status: parsed.data.status,
        });
      } catch (mailErr) {
        console.error("Failed to send status update email:", mailErr);
      }
    }

    return NextResponse.json(
      {
        request: {
          id: updated._id.toString(),
          referenceNo: updated.referenceNo,
          serviceTitle: updated.serviceTitle,
          category: updated.category,
          fee: updated.fee,
          purpose: updated.purpose,
          stage: updated.stage,
          status: updated.status,
          submitted: updated.createdAt.toISOString().split("T")[0],
          residentName: residentUser?.fullName ?? "Unknown",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update request status error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}