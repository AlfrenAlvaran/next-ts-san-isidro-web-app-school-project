"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  IdCard,
  Check,
  X,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  PartyPopper,
  Phone,
  User,
} from "lucide-react";

type Role = "ADMIN" | "STAFF" | "RESIDENT";

interface InviteInfo {
  name: string;
  email: string;
  role: Role;
  barangay?: string | null;
}

const ROLE_INFO: Record<Role, { title: string; icon: React.ElementType }> = {
  ADMIN: { title: "Admin", icon: ShieldCheck },
  STAFF: { title: "Staff", icon: IdCard },
  RESIDENT: { title: "Resident", icon: IdCard },
};

const PH_PHONE_REGEX = /^(09\d{9}|\+639\d{9})$/;

type PageState = "loading" | "invalid" | "form" | "success";

function passwordChecks(password: string, confirm: string) {
  return [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "One number", pass: /[0-9]/.test(password) },
    { label: "Passwords match", pass: password.length > 0 && password === confirm },
  ];
}

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [state, setState] = useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [invite, setInvite] = useState<InviteInfo | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      if (!token) {
        setErrorMessage("This invite link is missing a token.");
        setState("invalid");
        return;
      }
      try {
        const res = await fetch(`/api/super-admin/invite/${encodeURIComponent(token)}`);
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setErrorMessage(data.error ?? "This invite link isn't valid.");
          setState("invalid");
          return;
        }
        setInvite(data);
        setFullName(data.name ?? "");
        setState("form");
      } catch {
        if (!cancelled) {
          setErrorMessage("Couldn't verify this invite. Check your connection and try again.");
          setState("invalid");
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const phoneValid = PH_PHONE_REGEX.test(phone.trim());
  const nameValid = fullName.trim().length > 1;
  const checks = passwordChecks(password, confirm);
  const allValid = checks.every((c) => c.pass) && phoneValid && nameValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid || submitting) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`/api/super-admin/invite/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          fullName: fullName.trim(),
          phone: phone.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setState("success");
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            San Isidro &middot; Staff Portal
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-7 shadow-sm">
          {state === "loading" && (
            <div className="flex flex-col items-center py-10 gap-3">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
              <p className="text-sm text-slate-500">Checking your invite...</p>
            </div>
          )}

          {state === "invalid" && (
            <div className="flex flex-col items-center py-6 gap-3 text-center">
              <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <h1 className="text-lg font-bold text-slate-900">This invite isn't valid</h1>
              <p className="text-sm text-slate-500 max-w-xs">{errorMessage}</p>
              <p className="text-xs text-slate-400 mt-2">
                Ask an admin to resend your invite, then open the new link from that email.
              </p>
              <Link
                href="/"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Back to home
              </Link>
            </div>
          )}

          {state === "success" && (
            <div className="flex flex-col items-center py-6 gap-3 text-center">
              <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center">
                <PartyPopper className="w-5 h-5 text-emerald-600" />
              </div>
              <h1 className="text-lg font-bold text-slate-900">
                You're all set{fullName ? `, ${fullName.split(" ")[0]}` : ""}.
              </h1>
              <p className="text-sm text-slate-500 max-w-xs">
                Your account is active. You can log in with your email and new password.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                Go to login
              </button>
            </div>
          )}

          {state === "form" && invite && (
            <>
              <div className="mb-5">
                <h1 className="text-lg font-bold text-slate-900">
                  Welcome{invite.name ? `, ${invite.name.split(" ")[0]}` : ""}.
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in your details to activate your account.
                </p>
              </div>

              <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[11px] font-bold text-slate-500">
                  {invite.name
                    ? invite.name.split(" ").map((n) => n[0]).slice(0, 2).join("")
                    : invite.email[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {invite.name || invite.email}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {invite.email}
                    {invite.barangay ? ` · Brgy. ${invite.barangay}` : ""}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 shrink-0">
                  {(() => {
                    const RoleIcon = ROLE_INFO[invite.role].icon;
                    return <RoleIcon className="w-3 h-3" />;
                  })()}
                  {ROLE_INFO[invite.role].title}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      disabled={submitting}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Mobile number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09XXXXXXXXX"
                      disabled={submitting}
                      inputMode="tel"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors disabled:opacity-60"
                    />
                  </div>
                  {phone.length > 0 && (
                    <p className={`mt-1.5 text-[11px] flex items-center gap-1 ${phoneValid ? "text-emerald-500" : "text-rose-500"}`}>
                      {phoneValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {phoneValid ? "Valid mobile number" : "Use format 09XXXXXXXXX or +639XXXXXXXXX"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a password"
                      disabled={submitting}
                      className="w-full pl-3 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Confirm password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    disabled={submitting}
                    className="w-full pl-3 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-colors disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  {checks.map((c) => (
                    <div key={c.label} className="flex items-center gap-2 text-[11px]">
                      {c.pass ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      )}
                      <span className={c.pass ? "text-slate-500" : "text-slate-400"}>{c.label}</span>
                    </div>
                  ))}
                </div>

                {submitError && (
                  <p className="text-xs text-rose-500 bg-rose-50 rounded-lg px-3 py-2">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={!allValid || submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#B8860B] active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0F172A]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Activating...
                    </>
                  ) : (
                    "Activate account"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}