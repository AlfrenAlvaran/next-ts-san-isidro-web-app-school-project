import { auth } from "@/auth";
import { connection } from "@/lib/database";
import ResidentProfileModel from "@/models/ResidentProfileModel";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !["admin", "superadmin"].includes(role ?? "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connection();

    const docs = await ResidentProfileModel.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "fullName email phone isApproved isVerified avatarUrl",
      });

    function calcAge(birthdate: Date | null | undefined): number | null {
      if (!birthdate) return null;
      const diff = Date.now() - new Date(birthdate).getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    const residents = docs
      .filter((p) => p.user) // guard against orphaned profiles if a User was ever deleted
      .map((p) => {
        const u = p.user as unknown as {
          _id: unknown;
          fullName?: string;
          email: string;
          phone: string;
          isApproved: boolean;
          isVerified: boolean;
          avatarUrl: string | null;
        };

        return {
          id: p._id.toString(),
          userId: String(u._id),
          fullName: u.fullName ?? "Unnamed",
          email: u.email,
          phone: u.phone,
          isApproved: u.isApproved,
          isVerified: u.isVerified,
          avatarUrl: u.avatarUrl,
          birthdate: p.birthdate,
          age: calcAge(p.birthdate),
          sex: p.sex,
          civilStatus: p.civilStatus,
          address: p.address,
          purok: p.purok,
          householdNo: p.householdNo,
          idNumber: p.idNumber,
          yearsResiding: p.yearsResiding,
          memberSince: p.memberSince
            ? p.memberSince.toISOString().split("T")[0]
            : null,
          joined: p.createdAt.toISOString().split("T")[0],
        };
      });

    return NextResponse.json({ residents }, { status: 200 });
  } catch (error) {
    console.error("Fetch residents error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
