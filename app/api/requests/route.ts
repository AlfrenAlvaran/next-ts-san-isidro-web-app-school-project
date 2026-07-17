import { auth } from "@/auth";
import { connection } from "@/lib/database";
import { sendRequestConfirmationEmail } from "@/lib/mail/sendRequestConfirmation";
import RequestModel from "@/models/RequestModel";
import ResidentProfileModel from "@/models/ResidentProfileModel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const createSchema = z.object({
  serviceTitle: z.string().min(2),
  category: z.string().min(2),
  fee: z.string().min(1),
  purpose: z.string().min(3),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await connection();

    const profile = await ResidentProfileModel.findOne({
      user: session.user.id,
    });
    if (!profile) {
      return NextResponse.json(
        { error: "Resident profile not found." },
        { status: 404 },
      );
    }

    const referenceNo = `SI-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;

    const created = await RequestModel.create({
      ...parsed.data,
      profile_id: profile._id,
      referenceNo,
      stage: 0,
      status: "submitted",
    });

    const submittedDate = created.createdAt.toISOString().split("T")[0];

    const recipientEmail = session.user.email;
    if (recipientEmail) {
      try {
        await sendRequestConfirmationEmail({
          to: recipientEmail,
          recipientName: session.user.name ?? "Resident",
          referenceNo: created.referenceNo,
          serviceTitle: created.serviceTitle,
          category: created.category,
          fee: created.fee,
          purpose: created.purpose,
          submittedDate,
        });
      } catch (mailErr) {
        console.error("Failed to send confirmation email:", mailErr);
      }
    } else {
      console.warn(
        `No email found for profile ${profile._id.toString()} — confirmation email not sent.`,
      );
    }
    return NextResponse.json(
      {
        request: {
          id: created._id.toString(),
          referenceNo: created.referenceNo,
          serviceTitle: created.serviceTitle,
          category: created.category,
          fee: created.fee,
          purpose: created.purpose,
          stage: created.stage,
          status: created.status,
          submitted: created.createdAt.toISOString().split("T")[0],
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create request error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connection();

    const profile = await ResidentProfileModel.findOne({
      user: session.user.id,
    });
    if (!profile) {
      return NextResponse.json({ requests: [] }, { status: 200 });
    }

    const docs = await RequestModel.find({ profile_id: profile._id }).sort({
      createdAt: -1,
    });

    const requests = docs.map((r) => ({
      id: r._id.toString(),
      referenceNo: r.referenceNo,
      serviceTitle: r.serviceTitle,
      category: r.category,
      fee: r.fee,
      purpose: r.purpose,
      stage: r.stage,
      status: r.status,
      submitted: r.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("Fetch requests error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
