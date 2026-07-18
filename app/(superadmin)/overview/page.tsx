import Link from "next/link";
import React from "react";

import {
  LucideIcon,
  ShieldCheck,
  IdCard,
  Landmark,
  UserPlus,
  Mail,
  ArrowUpRight,
  UserMinus,
  UserCheck,
} from "lucide-react";
import { KPICard } from "@/components/Shared";

type ActivityTone = "positive" | "gold" | "negative";

interface ActivityItem {
  id: number;
  who: string;
  action: string;
  when: string;
  tone: ActivityTone;
}

interface SuperAdminSummary {
  totalAdmins: number;
  totalStaff: number;
  pendingInvites: number;
  officialsOnRecord: number;
  recentActivity: ActivityItem[];
}

// Dummy Activity
const SUMMARY: SuperAdminSummary = {
  totalAdmins: 3,
  totalStaff: 9,
  pendingInvites: 2,
  officialsOnRecord: 8,
  recentActivity: [
    {
      id: 1,
      who: "Marites Santos",
      action: "was added as Staff",
      when: "2 hours ago",
      tone: "positive",
    },
    {
      id: 2,
      who: "Ramon Cruz",
      action: "accepted an Admin invite",
      when: "Yesterday",
      tone: "gold",
    },
    {
      id: 3,
      who: "Kagawad Elena Reyes",
      action: "was added to Elected Officials",
      when: "2 days ago",
      tone: "positive",
    },
    {
      id: 4,
      who: "Jun Dela Peña",
      action: "was deactivated",
      when: "4 days ago",
      tone: "negative",
    },
  ],
};

const TONE_STYLES: Record<
  ActivityTone,
  { bg: string; text: string; icon: LucideIcon }
> = {
  positive: { bg: "bg-emerald-50", text: "text-emerald-600", icon: UserCheck },
  gold: { bg: "bg-[#B8860B]/10", text: "text-[#B8860B]", icon: ShieldCheck },
  negative: { bg: "bg-rose-50", text: "text-rose-500", icon: UserMinus },
};

const OverviewSuperAdminPage = () => {
  const {
    totalAdmins,
    totalStaff,
    pendingInvites,
    officialsOnRecord,
    recentActivity,
  } = SUMMARY;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Super Admin
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Access & records control.
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage who can log in to the system, and who holds elected office in
            San Isidro.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/staff"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 active:scale-[0.98] text-slate-700 text-sm font-semibold rounded-lg transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add staff or admin
          </Link>
          <Link
            href="/super-admin/officials"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <Landmark className="w-4 h-4" /> Add elected official
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Admin accounts",
            value: totalAdmins,
            delta: "Full system access",
            icon: ShieldCheck,
          },
          {
            label: "Staff accounts",
            value: totalStaff,
            delta: "Limited access",
            icon: IdCard,
          },
          {
            label: "Elected officials on record",
            value: officialsOnRecord,
            delta: "Current term",
            icon: Landmark,
          },
          {
            label: "Pending invites",
            value: pendingInvites,
            delta: pendingInvites > 0 ? "Awaiting acceptance" : "All accepted",
            icon: Mail,
          },
        ].map((card, i) => (
          <div
            key={card.label}
            className="animate-[fadeUp_0.4s_ease-out_backwards]"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <KPICard
              label={card.label}
              value={card.value}
              delta={card.delta}
              positive={card.label === "Pending invites" ? pendingInvites === 0 : true}
              icon={card.icon}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent account activity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Staff, admin, and official record changes
              </p>
            </div>
          </div>
          <div className="space-y-1">
            {recentActivity.map((item, i) => {
              const tone = TONE_STYLES[item.tone];
              const ToneIcon = tone.icon;
              return (
                <div
                  key={item.id}
                  className="group flex items-start gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-slate-50 transition-colors animate-[fadeUp_0.4s_ease-out_backwards]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tone.bg}`}
                  >
                    <ToneIcon className={`w-3.5 h-3.5 ${tone.text}`} />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">
                        {item.who}
                      </span>{" "}
                      {item.action}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.when}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Quick actions
          </h3>
          <QuickAction
            href="/staff"
            icon={ShieldCheck}
            title="Invite an admin"
            subtitle="Full dashboard and settings access"
          />
          <QuickAction
            href="/staff"
            icon={IdCard}
            title="Invite staff"
            subtitle="Certificate and records access only"
          />
          <QuickAction
            href="/super-admin/officials"
            icon={Landmark}
            title="Add elected official"
            subtitle="Kagawad, SK Chairman, and other posts"
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

interface QuickActionProps {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

function QuickAction({ href, icon: Icon, title, subtitle }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-[#B8860B] hover:bg-[#B8860B]/5 transition-colors"
    >
      <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#B8860B]/15 flex items-center justify-center shrink-0 transition-colors">
        <Icon className="w-4 h-4 text-slate-500 group-hover:text-[#B8860B]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-800">{title}</p>
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#B8860B] group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}

export default OverviewSuperAdminPage;