import { auth } from "@/auth";
import { connection } from "@/lib/database";
import UserModel from "@/models/UserModel";
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

    // Start from every resident *account*, not just the ones that already
    // filled out a ResidentProfile — this is what makes accounts with
    // isApproved: false (no profile yet) show up too.
    const users = await UserModel.find({ role: "resident" }).sort({
      createdAt: -1,
    });

    const profiles = await ResidentProfileModel.find({
      user: { $in: users.map((u) => u._id) },
    });

    const profileByUserId = new Map(
      profiles.map((p) => [String(p.user), p]),
    );

    console.log(`[residents] fetched ${users.length} User(s) with role "resident"`);
    console.log(`[residents] fetched ${profiles.length} matching ResidentProfile doc(s)`);

    function calcAge(birthdate: Date | null | undefined): number | null {
      if (!birthdate) return null;
      const diff = Date.now() - new Date(birthdate).getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    const residents = users.map((u) => {
      const p = profileByUserId.get(String(u._id));

      return {
        id: p ? p._id.toString() : String(u._id),
        userId: String(u._id),
        fullName: u.fullName ?? "Unnamed",
        email: u.email,
        phone: u.phone,
        isApproved: u.isApproved,
        isVerified: u.isVerified,
        avatarUrl: u.avatarUrl,
        documentUrl: u.documentUrl,
        birthdate: p?.birthdate ?? null,
        age: calcAge(p?.birthdate),
        sex: p?.sex ?? null,
        civilStatus: p?.civilStatus ?? null,
        address: p?.address ?? null,
        purok: p?.purok ?? null,
        householdNo: p?.householdNo ?? null,
        idNumber: p?.idNumber ?? null,
        yearsResiding: p?.yearsResiding ?? null,
        memberSince: p?.memberSince
          ? p.memberSince.toISOString().split("T")[0]
          : null,
        hasProfile: Boolean(p),
        joined: (p?.createdAt ?? u.createdAt).toISOString().split("T")[0],
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