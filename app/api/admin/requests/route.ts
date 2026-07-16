import { auth } from "@/auth";
import { connection } from "@/lib/database";
import RequestModel from "@/models/RequestModel";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();

    // ASSUMPTION: session.user.role exists ("resident" | "admin" | "superadmin"),
    // matching the enum on UserModel. Confirm this is actually populated in
    // your auth() session/jwt callbacks — if not, this check silently fails closed
    // (returns 401 for everyone), which is at least safe, but worth verifying.
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !["admin", "superadmin"].includes(role ?? "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connection();

    // ASSUMPTION: ResidentProfileModel has a "fullName" field (or similar) to
    // populate for a "resident name" column on the admin table. If it doesn't,
    // drop the .populate() call and residentName mapping below.
    const docs = await RequestModel.find()
      .sort({ createdAt: -1 })
      .populate("profile_id", "fullName");

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
      residentName: (r.profile_id as any)?.fullName ?? "Unknown",
    }));

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("Fetch admin requests error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}