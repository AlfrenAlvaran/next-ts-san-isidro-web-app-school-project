import { auth } from "@/auth";
import { connection } from "@/lib/database";
import RequestModel from "@/models/RequestModel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["pending", "released", "rejected"]),
});

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

    const updated = await RequestModel.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { returnDocument: "after" }
    ).populate({
      path: "profile_id",
      populate: { path: "user", select: "fullName" },
    });

    if (!updated) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
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
          residentName: (updated.profile_id as any)?.user?.fullName ?? "Unknown",
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