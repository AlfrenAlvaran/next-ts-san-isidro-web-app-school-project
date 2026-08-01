// app/api/admin/requests/[id]/overdue/route.ts
import { auth } from "@/auth";
import { connection } from "@/lib/database";
import { sendOverdueNoticeEmail } from "@/lib/mail/sendOverdueNotice";
import RequestModel from "@/models/RequestModel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const overdueSchema = z.object({
  // New date the resident can expect to collect the certificate.
  revisedPickupDate: z.coerce.date(),
  // Optional custom note from the admin. Falls back to a default
  // apology + revised date message if omitted.
  message: z.string().min(3).optional(),
});

function formatDateLong(d: Date) {
  return d.toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// PATCH /api/admin/requests/[id]/overdue
// Marks an overdue certificate request, emails the resident an apology
// with the new pickup date, and stores the same notice on the request
// so the resident portal can render an in-app banner too.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !["admin", "superadmin"].includes(role ?? "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = overdueSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await connection();

    const existing = await RequestModel.findById(id).populate({
      path: "profile_id",
      populate: { path: "user", select: "fullName email" },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Request not found." },
        { status: 404 },
      );
    }

    const revisedPickupDate = parsed.data.revisedPickupDate;
    const formattedDate = formatDateLong(revisedPickupDate);
    const message =
      parsed.data.message ??
      `We're sorry — your ${existing.serviceTitle} (${existing.referenceNo}) wasn't ready on your original pickup date. It will now be ready for pickup on ${formattedDate}.`;

    const updates = {
      overdueNotice: {
        notified: true,
        message,
        revisedPickupDate,
        notifiedAt: new Date(),
      },
    };

    const updated = await RequestModel.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
    }).populate({
      path: "profile_id",
      populate: { path: "user", select: "fullName email" },
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Request not found." },
        { status: 404 },
      );
    }

    const residentUser = (updated.profile_id as any)?.user as
      | { fullName?: string; email?: string }
      | undefined;

    // Fire-and-forget: don't block the response on email delivery.
    if (residentUser?.email) {
      sendOverdueNoticeEmail({
        to: residentUser.email,
        recipientName: residentUser.fullName ?? "Resident",
        referenceNo: updated.referenceNo,
        serviceTitle: updated.serviceTitle,
        message,
        revisedPickupDate: formattedDate,
      }).catch((mailErr) =>
        console.error("Failed to send overdue notice email:", mailErr),
      );
    } else {
      console.warn(
        `No email found for request ${updated.referenceNo} — overdue notice email not sent.`,
      );
    }

    return NextResponse.json(
      {
        request: {
          id: updated._id.toString(),
          referenceNo: updated.referenceNo,
          status: updated.status,
          pickupDate: updated.pickupDate
            ? updated.pickupDate.toISOString()
            : null,
          overdueNotice: updated.overdueNotice,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Mark request overdue error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}