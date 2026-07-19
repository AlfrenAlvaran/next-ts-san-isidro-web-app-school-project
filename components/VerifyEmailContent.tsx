"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Status = "loading" | "success" | "error";

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

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return; // avoid double-fire in React StrictMode
    calledRef.current = true;

    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing a token.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Something went wrong.");
          return;
        }

        setStatus("success");
        setMessage(data.message || "Your email has been verified.");
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-sm w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mb-1.5">
              Verifying your email...
            </h1>
            <p className="text-sm text-slate-500">
              This will only take a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center mb-5">
              <CheckCircleIcon />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mb-1.5">
              Email verified
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {message}
            </p>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] text-white text-sm font-semibold rounded-lg transition-all duration-200"
            >
              Go to Sign In
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-5">
              <XCircleIcon />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mb-1.5">
              Verification failed
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {message}
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] text-sm font-semibold text-[#0F172A] rounded-lg transition-all duration-200"
            >
              Back to Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}