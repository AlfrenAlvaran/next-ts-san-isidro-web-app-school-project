"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ShieldCheck,
  IdCard,
  Lock,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useInvite } from "@/hooks/userInvite";


type Role = "admin" | "staff";

const ROLE_INFO: Record<Role, { title: string; desc: string; icon: React.ElementType }> = {
  admin: { title: "Admin", desc: "Full dashboard and settings access", icon: ShieldCheck },
  staff: { title: "Staff", desc: "Certificate and records access only", icon: IdCard },
};

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { invite, status } = useInvite(token);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requirements = useMemo(
    () => [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "One number", met: /\d/.test(password) },
      { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    ],
    [password]
  );
  const allMet = requirements.every((r) => r.met);
  const passwordsMatch = password.length > 0 && password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!allMet) {
      setError("Your password doesn't meet the requirements yet.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post("/api/invites/activate", { token, password });
      setDone(true);
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <CenteredCard>
        <p className="text-sm text-slate-400">Checking your invite…</p>
      </CenteredCard>
    );
  }

  if (status === "invalid" || !invite) {
    return (
      <CenteredCard>
        <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-5 h-5 text-rose-500" />
        </div>
        <h1 className="text-lg font-extrabold text-slate-900 mb-1.5">This invite link isn't valid.</h1>
        <p className="text-sm text-slate-500">
          It may have expired or already been used. Ask your Super Admin to send a new invite.
        </p>
      </CenteredCard>
    );
  }

  if (done) {
    return (
      <CenteredCard>
        <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
          <Check className="w-5 h-5 text-emerald-600" strokeWidth={3} />
        </div>
        <h1 className="text-lg font-extrabold text-slate-900 mb-1.5">
          You're all set{invite.name ? `, ${invite.name.split(" ")[0]}` : ""}.
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Your account is active. You can now sign in with {invite.email}.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="w-full px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Go to sign in
        </button>
      </CenteredCard>
    );
  }

  const roleInfo = ROLE_INFO[invite.role];
  const RoleIcon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Barangay {invite.barangay}
          </p>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Set up your account</h1>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
              {(invite.name || invite.email)
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {invite.name || invite.email}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{invite.email}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 shrink-0">
              <RoleIcon className="w-3 h-3" /> {roleInfo.title}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Create a password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {requirements.map((r) => (
                <div key={r.label} className="flex items-center gap-2 text-[11px]">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      r.met ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  >
                    {r.met && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className={r.met ? "text-slate-500" : "text-slate-400"}>{r.label}</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors"
                />
              </div>
              {confirm.length > 0 && !passwordsMatch && (
                <p className="text-[11px] text-rose-500 mt-1.5">Passwords don't match yet.</p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[11px] font-medium text-rose-500 bg-rose-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] disabled:opacity-60 disabled:hover:bg-[#0F172A] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {submitting ? "Activating…" : "Activate account"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-5">
          Trouble activating? Contact your Barangay Super Admin.
        </p>
      </div>
    </div>
  );
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 p-8 text-center">
        {children}
      </div>
    </div>
  );
}