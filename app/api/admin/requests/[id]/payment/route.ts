import { auth } from "@/auth";
import { connection } from "@/lib/database";
import RequestModel from "@/models/RequestModel";
import { markRequestPaidAndNotify } from "@/lib/payments/markRequestPaid";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const patchSchema = z.object({
  paymentStatus: z.enum(["unpaid", "paid"]),
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

    const updated =
      parsed.data.paymentStatus === "paid"
        ? await markRequestPaidAndNotify({ _id: id })
        : await RequestModel.findByIdAndUpdate(
            id,
            { paymentStatus: "unpaid" },
            { returnDocument: "after" }
          );

    if (!updated) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: updated._id.toString(),
        paymentStatus: updated.paymentStatus,
        saleInvoiceNumber: updated.saleInvoiceNumber ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update payment status error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}