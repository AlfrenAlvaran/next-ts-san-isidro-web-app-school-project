import { connection } from "@/lib/database";
import { Invite } from "@/models/InviteModel";
import UserModel from "@/models/UserModel";
import { NextResponse } from "next/server";

type UiRole = "admin" | "staff";
type UiStatus = "active" | "pending" | "deactivated";

interface UiAccount {
  id: string;
  name: string;
  email: string;
  role: UiRole;
  status: UiStatus;
  joined: string;
}

function mapUserRole(role: string): UiRole | null {
  if (role === "superadmin") return "admin";
  if (role === "admin") return "staff";
  return null; // resident — excluded from rendering
}

function mapInviteRole(role: string): UiRole | null {
  if (role === "ADMIN") return "admin";
  if (role === "STAFF") return "staff";
  return null;
}

function formatJoined(date: Date, isPendingInvite: boolean) {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (isPendingInvite) {
    if (diffMins < 60)
      return `Invited ${Math.max(diffMins, 1)} minute${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24)
      return `Invited ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays < 30)
      return `Invited ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
export async function GET() {
  await connection();

  const [pendingInvites, users] = await Promise.all([
    Invite.find({ status: "PENDING", role: { $in: ["ADMIN", "STAFF"] } })
      .sort({ createdAt: -1 })
      .lean(),
    UserModel.find({ role: { $in: ["admin", "superadmin"] } })
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const inviteAccounts: UiAccount[] = pendingInvites
    .map((inv: any) => {
      const role = mapInviteRole(inv.role);
      if (!role) return null;
      return {
        id: inv._id.toString(),
        name: inv.name || inv.email.split("@")[0],
        email: inv.email,
        role,
        status: "pending" as UiStatus,
        joined: formatJoined(inv.createdAt, true),
      };
    })
    .filter((a): a is UiAccount => a !== null);

  const userAccounts: UiAccount[] = users
    .map((u: any) => {
      const role = mapUserRole(u.role);
      if (!role) return null;
      return {
        id: u._id.toString(),
        name: u.fullName || u.email.split("@")[0],
        email: u.email,
        role,
        status: "active" as UiStatus,
        joined: formatJoined(u.createdAt, false),
      };
    })
    .filter((a): a is UiAccount => a !== null);

  const accounts = [...inviteAccounts, ...userAccounts];

  return NextResponse.json({ accounts });
}
