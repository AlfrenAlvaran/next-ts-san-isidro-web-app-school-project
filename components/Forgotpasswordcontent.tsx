"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const RESEND_COOLDOWN = 30;

function MailIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

type Step = "form" | "sent";

export default function ForgotPasswordContent() {
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simple crossfade between the form and confirmation states.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (cooldown <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  const requestReset = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || submitting || cooldown > 0) return;

    setSubmitting(true);
    setError("");

    try {
      await axios.post("/api/auth/forgot-password", { email });
      setStep("sent");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-sm w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center overflow-hidden">
        <div
          className={`transition-all duration-300 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          {step === "form" && (
            <>
              <div className="mx-auto w-14 h-14 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center mb-5">
                <MailIcon />
              </div>
              <h1 className="text-lg font-bold text-slate-900 mb-1.5">
                Forgot your password?
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Enter the email on your account and we&apos;ll send you a link
                to reset it.
              </p>

              <form onSubmit={requestReset} className="text-left">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] transition-all duration-150 mb-3"
                />

                {error && (
                  <p className="text-xs text-red-500 mb-3 -mt-1">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !email}
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                >
                  {submitting && <SpinnerIcon />}
                  {submitting ? "Sending..." : "Send reset link"}
                </button>
              </form>

              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 mt-3 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
              >
                <ArrowLeftIcon />
                Back to Sign In
              </Link>
            </>
          )}

          {step === "sent" && (
            <>
              <div className="mx-auto w-14 h-14 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center mb-5">
                <MailIcon />
              </div>
              <h1 className="text-lg font-bold text-slate-900 mb-1.5">
                Check your inbox
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed mb-1">
                If an account exists for
              </p>
              <p className="text-sm font-semibold text-slate-900 mb-6 break-all">
                {email}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                we&apos;ve sent a link to reset your password. It&apos;ll
                expire in an hour, so use it soon.
              </p>

              <button
                onClick={() => requestReset()}
                disabled={cooldown > 0 || submitting}
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-sm font-semibold text-[#0F172A] rounded-lg transition-all duration-200"
              >
                {submitting
                  ? "Sending..."
                  : cooldown > 0
                  ? `Resend link (${cooldown}s)`
                  : "Resend link"}
              </button>

              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 mt-3 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors duration-150"
              >
                <ArrowLeftIcon />
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}