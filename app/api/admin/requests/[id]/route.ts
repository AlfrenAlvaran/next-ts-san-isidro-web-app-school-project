import { auth } from "@/auth";
import { connection } from "@/lib/database";
import RequestModel from "@/models/RequestModel";
import { sendRequestStatusUpdateEmail } from "@/lib/mail/sendRequestStatusUpdate";
import { sendPaymentRequestEmail } from "@/lib/mail/sendPaymentRequest";
import { createPaymentLink } from "@/lib/payments/paymongo/links";
import { PaymongoError } from "@/lib/payments/paymongo/types";
import { feeToCentavos } from "@/lib/payments/parseFee";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const patchSchema = z.object({
  status: z.enum(["submitted", "pending", "released", "rejected"]),
});

const STAGE_FOR_STATUS: Record<
  z.infer<typeof patchSchema>["status"],
  number | null
> = {
  submitted: 0,
  pending: 1,
  released: 2,
  rejected: null,
};

function stageForStatus(
  status: keyof typeof STAGE_FOR_STATUS,
  currentStage: number,
) {
  const mapped = STAGE_FOR_STATUS[status];
  return mapped === null ? currentStage : mapped;
}

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
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await connection();

    const existing = await RequestModel.findById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Request not found." },
        { status: 404 },
      );
    }

    const nextStage = stageForStatus(parsed.data.status, existing.stage);

   
    const updates: Record<string, unknown> = {
      status: parsed.data.status,
      stage: nextStage,
    };

    if (parsed.data.status === "released") {
      updates.overdueNotice = {
        notified: false,
        message: null,
        revisedPickupDate: null,
        notifiedAt: null,
      };
    }

    let generatedPaymentLink: string | null = null;

    if (parsed.data.status === "pending" && !existing.paymentLink) {
      const amountCentavos = feeToCentavos(existing.fee);

      if (amountCentavos > 0) {
        try {
          const link = await createPaymentLink({
            amountCentavos,
            description: `${existing.serviceTitle} - ${existing.referenceNo}`,
            remarks: existing.referenceNo,
            idempotencyKey: existing.referenceNo,
          });
          generatedPaymentLink = link.attributes.checkout_url;
          updates.paymentLink = link.attributes.checkout_url;
          updates.paymongoLinkId = link.id;
        } catch (linkErr) {
          if (linkErr instanceof PaymongoError) {
            console.error(`PayMongo error [${linkErr.code}]:`, linkErr.message);
          } else {
            console.error("Failed to create PayMongo link:", linkErr);
          }
        }
      }
      updates.paymentStatus = "unpaid";
    }

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

    console.log(
      "PATCH status:",
      parsed.data.status,
      "residentUser:",
      residentUser,
    );

    if (
      (parsed.data.status === "released" ||
        parsed.data.status === "rejected") &&
      residentUser?.email
    ) {
      sendRequestStatusUpdateEmail({
        to: residentUser.email,
        recipientName: residentUser.fullName ?? "Resident",
        referenceNo: updated.referenceNo,
        serviceTitle: updated.serviceTitle,
        status: parsed.data.status,
      }).catch((mailErr) =>
        console.error("Failed to send status update email:", mailErr),
      );
    }

    if (parsed.data.status === "pending" && residentUser?.email) {
      const paymentInfoUrl = (extra: Record<string, string | undefined>) => {
        const params = new URLSearchParams();
        params.set("ref", updated.referenceNo);
        params.set("service", updated.serviceTitle);
        if (updated.fee) params.set("amount", updated.fee);
        Object.entries(extra).forEach(([k, v]) => v && params.set(k, v));
        return `${process.env.APP_URL}/payment-info?${params.toString()}`;
      };

      sendPaymentRequestEmail({
        to: residentUser.email,
        recipientName: residentUser.fullName ?? "Resident",
        referenceNo: updated.referenceNo,
        serviceTitle: updated.serviceTitle,
        amountLabel: updated.fee,
        payOnlineUrl:
          generatedPaymentLink ?? updated.paymentLink ?? paymentInfoUrl({}),
        payInPersonUrl: paymentInfoUrl({
          link: generatedPaymentLink ?? updated.paymentLink ?? undefined,
        }),
      })
        .then(() =>
          console.log(`Payment email sent to ${residentUser.email}`),
        )
        .catch((mailErr) =>
          console.error("Failed to send payment request email:", mailErr),
        );
    } else if (parsed.data.status === "pending") {
      console.warn(
        "Skipped payment email: no residentUser.email found",
        residentUser,
      );
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
          paymentStatus: updated.paymentStatus,
          paymentLink: updated.paymentLink,
          submitted: updated.createdAt.toISOString().split("T")[0],
          pickupDate: updated.pickupDate
            ? updated.pickupDate.toISOString()
            : null,
          overdueNotice: updated.overdueNotice ?? null,
          residentName: residentUser?.fullName ?? "Unknown",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update request status error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}