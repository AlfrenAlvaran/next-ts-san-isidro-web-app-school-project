"use client";

import Link from "next/link";
import React, { useMemo, useState, useCallback } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  IdCard,
  Send,
  UserMinus,
  Search,
  Check,
  Clock,
  Mail,
  User,
  X,
} from "lucide-react";

type Role = "admin" | "staff";
type Status = "active" | "pending" | "deactivated";

interface Account {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joined: string;
}

const SEED_ACCOUNTS: Account[] = [
  { id: 1, name: "Ramon Cruz", email: "ramon.cruz@sanisidro.gov.ph", role: "admin", status: "active", joined: "Jan 2025" },
  { id: 2, name: "Marites Santos", email: "marites.santos@sanisidro.gov.ph", role: "staff", status: "active", joined: "Mar 2025" },
  { id: 3, name: "Jun Dela Peña", email: "jun.delapena@sanisidro.gov.ph", role: "staff", status: "deactivated", joined: "Aug 2024" },
  { id: 4, name: "Liza Fernandez", email: "liza.fernandez@sanisidro.gov.ph", role: "staff", status: "pending", joined: "Invited 2 days ago" },
  { id: 5, name: "Noel Aquino", email: "noel.aquino@sanisidro.gov.ph", role: "admin", status: "pending", joined: "Invited 5 hours ago" },
];

const STATUS_STYLES: Record<Status, { bg: string; text: string; label: string; icon: React.ElementType }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Active", icon: Check },
  pending: { bg: "bg-[#B8860B]/10", text: "text-[#B8860B]", label: "Pending", icon: Clock },
  deactivated: { bg: "bg-rose-50", text: "text-rose-500", label: "Deactivated", icon: UserMinus },
};

const ROLE_INFO: Record<Role, { title: string; desc: string; icon: React.ElementType }> = {
  admin: { title: "Admin", desc: "Full dashboard and settings access", icon: ShieldCheck },
  staff: { title: "Staff", desc: "Certificate and records access only", icon: IdCard },
};

// ---------- Toast ----------

type ToastTone = "success" | "info" | "danger";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const TOAST_STYLES: Record<ToastTone, { icon: React.ElementType; iconBg: string; iconText: string }> = {
  success: { icon: Check, iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
  info: { icon: Send, iconBg: "bg-[#B8860B]/10", iconText: "text-[#B8860B]" },
  danger: { icon: UserMinus, iconBg: "bg-rose-50", iconText: "text-rose-500" },
};

function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-[calc(100%-2.5rem)] sm:w-80">
      {toasts.map((t) => {
        const style = TOAST_STYLES[t.tone];
        const Icon = style.icon;
        return (
          <div
            key={t.id}
            className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg shadow-lg p-3.5 animate-[toastIn_0.25s_ease-out_backwards]"
          >
            <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${style.iconBg}`}>
              <Icon className={`w-3.5 h-3.5 ${style.iconText}`} />
            </div>
            <p className="text-xs font-medium text-slate-700 flex-1 pt-1">{t.message}</p>
            <button
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-300 hover:text-slate-500 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ---------- Page ----------

export default function AddStaffOrAdminPage() {
  const [accounts, setAccounts] = useState<Account[]>(SEED_ACCOUNTS);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("staff");

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Role | "pending">("all");

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail) return;

    const alreadyExists = accounts.some((a) => a.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (alreadyExists) {
      pushToast(`${trimmedEmail} already has an account.`, "danger");
      return;
    }

    const newAccount: Account = {
      id: Date.now(),
      name: trimmedName,
      email: trimmedEmail,
      role,
      status: "pending",
      joined: "Invited just now",
    };

    // TODO: replace with your invite mutation — this optimistically adds
    // the account locally so the person sees it land immediately.
    setAccounts((prev) => [newAccount, ...prev]);
    pushToast(`Invite sent to ${trimmedName} (${ROLE_INFO[role].title}).`, "success");

    setName("");
    setEmail("");
    setRole("staff");
  };

  const handleResend = (account: Account) => {
    // TODO: wire up to your resend-invite endpoint
    pushToast(`Invite resent to ${account.name}.`, "info");
  };

  const handleDeactivate = (account: Account) => {
    // TODO: wire up to your deactivate endpoint
    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, status: "deactivated" as Status } : a))
    );
    pushToast(`${account.name} was deactivated.`, "danger");
  };

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      const matchesQuery =
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.email.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === "all" ? true : filter === "pending" ? a.status === "pending" : a.role === filter;
      return matchesQuery && matchesFilter;
    });
  }, [accounts, query, filter]);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/overview"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to overview
        </Link>
        <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
          Super Admin
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Staff & admin accounts.
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Invite someone to log in to the system, and set how much they can access.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Invite form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-5"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-900">Send an invite</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              They'll get an email with a link to set up their password.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Full name"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              Access level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(ROLE_INFO) as Role[]).map((r) => {
                const info = ROLE_INFO[r];
                const Icon = info.icon;
                const active = role === r;
                return (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`text-left p-4 rounded-lg border transition-all ${
                      active
                        ? "border-[#B8860B] bg-[#B8860B]/6 shadow-sm"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          active ? "bg-[#B8860B]/15" : "bg-slate-100"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? "text-[#B8860B]" : "text-slate-500"}`} />
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          active ? "border-[#B8860B] bg-[#B8860B]" : "border-slate-300"
                        }`}
                      >
                        {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{info.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{info.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Send className="w-4 h-4" /> Send invite
            </button>
          </div>
        </form>

        {/* Role guide */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">What each role can do</h3>
          {(Object.keys(ROLE_INFO) as Role[]).map((r) => {
            const info = ROLE_INFO[r];
            const Icon = info.icon;
            return (
              <div key={r} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{info.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{info.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accounts list */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">All accounts</h3>
            <p className="text-xs text-slate-400 mt-0.5">{filtered.length} of {accounts.length} shown</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or email"
                className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1">
              {(["all", "admin", "staff", "pending"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md capitalize transition-colors ${
                    filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          {filtered.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8">No accounts match your search.</p>
          )}
          {filtered.map((a, i) => {
            const roleInfo = ROLE_INFO[a.role];
            const RoleIcon = roleInfo.icon;
            const statusInfo = STATUS_STYLES[a.status];
            const StatusIcon = statusInfo.icon;
            return (
              <div
                key={a.id}
                className="group flex items-center gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-slate-50 transition-colors animate-[fadeUp_0.35s_ease-out_backwards]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[11px] font-bold text-slate-500">
                  {a.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">{a.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{a.email}</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                  <RoleIcon className="w-3 h-3" /> {roleInfo.title}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${statusInfo.bg} ${statusInfo.text}`}>
                  <StatusIcon className="w-2.5 h-2.5" /> {statusInfo.label}
                </span>
                <span className="hidden md:inline text-[11px] text-slate-400 w-32 text-right shrink-0">
                  {a.joined}
                </span>
                {a.status === "pending" ? (
                  <button
                    onClick={() => handleResend(a)}
                    className="p-1.5 rounded-md hover:bg-[#B8860B]/10 text-slate-400 hover:text-[#B8860B] transition-colors"
                    title="Resend invite"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                ) : a.status === "active" ? (
                  <button
                    onClick={() => handleDeactivate(a)}
                    className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Deactivate"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="w-6.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}