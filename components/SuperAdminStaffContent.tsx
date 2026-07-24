"use client";

import Link from "next/link";
import React, { useMemo, useState, useCallback, useEffect } from "react";
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
  Loader2,
  Inbox,
} from "lucide-react";

type Role = "admin" | "staff";
type Status = "active" | "pending" | "deactivated";

interface Account {
  id: number | string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joined: string;
}

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
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [sending, setSending] = useState(false);
  const [resendingId, setResendingId] = useState<Account["id"] | null>(null);

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

  const loadAccounts = useCallback(async () => {
    setLoadingAccounts(true);
    setLoadError("");
    try {
      const res = await fetch("/api/super-admin/accounts");
      const data = await res.json();
      if (!res.ok) {
        setLoadError(data.error ?? "Couldn't load accounts.");
        return;
      }
      setAccounts(data.accounts ?? []);
    } catch (err) {
      console.error(err);
      setLoadError("Network error while loading accounts.");
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName || !trimmedEmail || sending) return;

    const alreadyExists = accounts.some((a) => a.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (alreadyExists) {
      pushToast(`${trimmedEmail} already has an account.`, "danger");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/super-admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          role: role.toUpperCase(), // "staff" -> "STAFF" to match Invite schema enum
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        pushToast(data.error ?? "Couldn't send the invite. Try again.", "danger");
        return;
      }

      pushToast(`Invite emailed to ${trimmedName} (${ROLE_INFO[role].title}).`, "success");
      setName("");
      setEmail("");
      setRole("staff");

      // Re-fetch so the new pending invite comes from the DB, not a guessed local shape
      await loadAccounts();
    } catch (err) {
      console.error(err);
      pushToast("Network error while sending the invite.", "danger");
    } finally {
      setSending(false);
    }
  };

  const handleResend = async (account: Account) => {
    if (resendingId !== null) return;
    setResendingId(account.id);
    try {
      const res = await fetch("/api/super-admin/invite/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: account.email }),
      });
      const data = await res.json();

      if (!res.ok) {
        pushToast(data.error ?? `Couldn't resend the invite to ${account.name}.`, "danger");
        return;
      }
      pushToast(`Invite resent to ${account.name}.`, "info");
    } catch (err) {
      console.error(err);
      pushToast("Network error while resending the invite.", "danger");
    } finally {
      setResendingId(null);
    }
  };

  const handleDeactivate = (account: Account) => {
    // TODO: UserModel has no status/isActive field yet, so this can't persist
    // to the DB. Add e.g. `isActive: { type: Boolean, default: true }` to
    // UserSchema, then wire this to PATCH /api/super-admin/accounts/[id]/deactivate.
    setAccounts((prev) =>
      prev.map((a) => (a.id === account.id ? { ...a, status: "deactivated" as Status } : a))
    );
    pushToast(`${account.name} was deactivated locally — not yet saved (see TODO).`, "danger");
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
                  disabled={sending}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors disabled:opacity-60"
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
                  disabled={sending}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors disabled:opacity-60"
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
                    disabled={sending}
                    className={`text-left p-4 rounded-lg border transition-all disabled:opacity-60 ${
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
              disabled={sending}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-[#0F172A]"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send invite
                </>
              )}
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
            <p className="text-xs text-slate-400 mt-0.5">
              {loadingAccounts ? "Loading..." : `${filtered.length} of ${accounts.length} shown`}
            </p>
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

        {loadingAccounts && (
          <div className="flex flex-col items-center py-12 gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p className="text-xs">Loading accounts...</p>
          </div>
        )}

        {!loadingAccounts && loadError && (
          <div className="flex flex-col items-center py-12 gap-2 text-center">
            <p className="text-xs text-rose-500">{loadError}</p>
            <button
              onClick={loadAccounts}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loadingAccounts && !loadError && (
          <div className="space-y-1">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-12 gap-2 text-center">
                <Inbox className="w-5 h-5 text-slate-300" />
                <p className="text-xs text-slate-400">
                  {accounts.length === 0 ? "No accounts yet. Send your first invite above." : "No accounts match your search."}
                </p>
              </div>
            )}
            {filtered.map((a, i) => {
              const roleInfo = ROLE_INFO[a.role];
              const RoleIcon = roleInfo.icon;
              const statusInfo = STATUS_STYLES[a.status];
              const StatusIcon = statusInfo.icon;
              const isResending = resendingId === a.id;
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
                      disabled={isResending}
                      className="p-1.5 rounded-md hover:bg-[#B8860B]/10 text-slate-400 hover:text-[#B8860B] transition-colors disabled:opacity-50"
                      title="Resend invite"
                    >
                      {isResending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
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
        )}
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