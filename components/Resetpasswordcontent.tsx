"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

function LockIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SpinnerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

type Step = "validating" | "form" | "success" | "invalid";

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) return { score: 0, label: "", color: "bg-slate-200" };
  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
  if (score <= 4) return { score: 3, label: "Good", color: "bg-[#B8860B]" };
  return { score: 4, label: "Strong", color: "bg-emerald-600" };
}

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState<Step>("validating");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [redirectIn, setRedirectIn] = useState(4);

  const calledRef = useRef(false);

  const strength = useMemo(() => getStrength(password), [password]);
  const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;
  const canSubmit = password.length >= 8 && password === confirmPassword && !submitting;

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (!token) {
      setStep("invalid");
      setErrorMessage("This reset link is missing a token.");
      return;
    }

    const validate = async () => {
      try {
        await axios.get("/api/auth/reset-password", { params: { token } });
        setStep("form");
      } catch (err) {
        setStep("invalid");
        if (axios.isAxiosError(err)) {
          setErrorMessage(err.response?.data?.error || "This reset link is invalid.");
        } else {
          setErrorMessage("This reset link is invalid.");
        }
      }
    };

    validate();
  }, [token]);

  useEffect(() => {
    if (step !== "success") return;
    if (redirectIn <= 0) {
      router.push("/sign-in");
      return;
    }
    const t = setTimeout(() => setRedirectIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [step, redirectIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !token) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });
      setSuccessMessage(res.data?.message || "Your password has been reset.");
      setStep("success");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setSubmitError(err.response?.data?.error || "Something went wrong. Please try again.");
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-sm w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
        {step === "validating" && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-5">
              <SpinnerIcon className="w-6 h-6 text-slate-400" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mb-1.5">
              Checking your link...
            </h1>
            <p className="text-sm text-slate-500">This will only take a moment.</p>
          </>
        )}

        {step === "form" && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center mb-5">
              <LockIcon />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mb-1.5">
              Set a new password
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Choose something you haven&apos;t used before.
            </p>

            <form onSubmit={handleSubmit} className="text-left">
              <label htmlFor="password" className="sr-only">
                New password
              </label>
              <div className="relative mb-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {/* Strength meter — only takes up space once the user starts typing */}
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  password ? "max-h-8 opacity-100 mb-3" : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex items-center gap-1.5 pt-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                        i < strength.score ? strength.color : "bg-slate-200"
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-medium text-slate-500 w-10 text-right shrink-0">
                    {strength.label}
                  </span>
                </div>
              </div>

              <label htmlFor="confirmPassword" className="sr-only">
                Confirm new password
              </label>
              <div className="relative mb-1">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 ${
                    !passwordsMatch
                      ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                      : "border-slate-200 focus:ring-[#B8860B]/40 focus:border-[#B8860B]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showConfirm} />
                </button>
              </div>

              <div className={`overflow-hidden transition-all duration-200 ${!passwordsMatch ? "max-h-6 opacity-100 mb-2" : "max-h-0 opacity-0"}`}>
                <p className="text-xs text-red-500 text-left">Passwords don&apos;t match.</p>
              </div>

              {submitError && (
                <p className="text-xs text-red-500 mb-3 text-left">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 mt-2 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-white text-sm font-semibold rounded-lg transition-all duration-200"
              >
                {submitting && <SpinnerIcon className="w-4 h-4" />}
                {submitting ? "Resetting..." : "Reset password"}
              </button>
            </form>
          </>
        )}

        {step === "success" && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center mb-5">
              <CheckCircleIcon />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mb-1.5">
              Password reset
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {successMessage} Redirecting to sign in in {redirectIn}s...
            </p>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] text-white text-sm font-semibold rounded-lg transition-all duration-200"
            >
              Go to Sign In
            </Link>
          </>
        )}

        {step === "invalid" && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-5">
              <XCircleIcon />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mb-1.5">
              Link invalid or expired
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {errorMessage}
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] text-sm font-semibold text-[#0F172A] rounded-lg transition-all duration-200"
            >
              Request a new link
            </Link>
          </>
        )}
      </div>
    </div>
  );
}