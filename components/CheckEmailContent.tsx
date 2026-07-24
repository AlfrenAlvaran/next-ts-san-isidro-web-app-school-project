"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const RESEND_COOLDOWN = 30; // seconds

function MailIcon() {
  return (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export default function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [cooldown, setCooldown] = useState(0);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resendMessage, setResendMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || cooldown > 0 || resendState === "sending") return;

    setResendState("sending");
    setResendMessage("");

    try {
      const res = await axios.post("/api/auth/resend-verification", { email });
      setResendState("sent");
      setResendMessage(res.data?.message || "Verification email sent.");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setResendState("error");
      if (axios.isAxiosError(err)) {
        setResendMessage(
          err.response?.data?.error || "Couldn't resend the email. Please try again."
        );
      } else {
        setResendMessage("Couldn't resend the email. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-sm w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center mb-5">
          <MailIcon />
        </div>

        <h1 className="text-lg font-bold text-slate-900 mb-1.5">
          Check your inbox
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-1">
          We sent a verification link to
        </p>
        {email && (
          <p className="text-sm font-semibold text-slate-900 mb-6 break-all">
            {email}
          </p>
        )}
        {!email && <div className="mb-6" />}

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Click the link in that email to activate your account. It may take
          a minute to arrive — don&apos;t forget to check spam.
        </p>

        <button
          onClick={handleResend}
          disabled={!email || cooldown > 0 || resendState === "sending"}
          className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-white text-sm font-semibold rounded-lg transition-all duration-200"
        >
          {resendState === "sending"
            ? "Sending..."
            : cooldown > 0
            ? `Resend email (${cooldown}s)`
            : "Resend email"}
        </button>

        {resendMessage && (
          <p
            className={`text-xs mt-3 ${
              resendState === "error" ? "text-red-500" : "text-slate-500"
            }`}
          >
            {resendMessage}
          </p>
        )}

        <Link
          href="/sign-in"
          className="inline-flex items-center justify-center w-full px-4 py-2.5 mt-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] text-sm font-semibold text-[#0F172A] rounded-lg transition-all duration-200"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}