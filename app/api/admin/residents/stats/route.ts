import { auth } from "@/auth";
import { connection } from "@/lib/database";
import UserModel from "@/models/UserModel"; // adjust path to match your actual file
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function daysAgo(n: number, from: Date) {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return d;
}

export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !["admin", "superadmin"].includes(role ?? "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connection();

    const today = startOfDay(new Date());
    const thisWeekStart = daysAgo(6, today);
    const lastWeekStart = daysAgo(13, today);
    const lastWeekEnd = daysAgo(6, today);

    // ASSUMPTION: "registered residents" = all role:"resident" User docs,
    // regardless of isApproved. Add isApproved: true to every filter below
    // if unapproved accounts shouldn't count toward the KPI.
    const totalCount = await UserModel.countDocuments({ role: "resident" });

    const thisWeekCount = await UserModel.countDocuments({
      role: "resident",
      createdAt: { $gte: thisWeekStart },
    });

    const lastWeekCount = await UserModel.countDocuments({
      role: "resident",
      createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd },
    });

    const deltaPct =
      lastWeekCount === 0
        ? thisWeekCount > 0
          ? 100
          : 0
        : Math.round(((thisWeekCount - lastWeekCount) / lastWeekCount) * 100);

    return NextResponse.json({
      count: totalCount,
      deltaPct,
      newThisWeek: thisWeekCount,
    });
  } catch (error) {
    console.error("GET /api/admin/residents/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resident stats." },
      { status: 500 },
    );
  }
}