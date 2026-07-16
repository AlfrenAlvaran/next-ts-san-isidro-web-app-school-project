"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShieldAlert, ArrowRight, LogOut, X } from "lucide-react";
import type { UserRole } from "@/constant/types";

const PORTAL_LABELS: { prefix: string; label: string }[] = [
  { prefix: "/superadmin", label: "superadmin console" },
  { prefix: "/admin", label: "admin console" },
  { prefix: "/dashboard", label: "dashboard" },
  { prefix: "/home", label: "resident portal" },
  { prefix: "/request", label: "resident request area" },
  { prefix: "/track", label: "resident tracking page" },
  { prefix: "/resident", label: "resident portal" },
  { prefix: "/certificate-request", label: "certificate request page" },
];

const ROLE_HOME: Record<UserRole, string> = {
  resident: "/home",
  admin: "/dashboard",
  superadmin: "/dashboard",
};

const ROLE_LABEL: Record<UserRole, string> = {
  resident: "resident",
  admin: "admin",
  superadmin: "superadmin",
};

function getPortalLabel(path: string | null) {
  if (!path) return "that page";
  const match = PORTAL_LABELS.find((p) => path.startsWith(p.prefix));
  return match?.label ?? "that page";
}

export default function UnauthorizedView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const attemptedPath = searchParams.get("path");
  const portalLabel = getPortalLabel(attemptedPath);
  const role = session?.user?.role as UserRole | undefined;
  const home = role ? ROLE_HOME[role] : "/sign-in";
  const roleLabel = role ? ROLE_LABEL[role] : "account";

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMounted, setToastMounted] = useState(false);

  useEffect(() => {
    setToastMounted(true);
    const show = requestAnimationFrame(() => setToastVisible(true));
    const hide = setTimeout(() => setToastVisible(false), 5000);
    return () => {
      cancelAnimationFrame(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6 relative overflow-hidden">
      {/* ambient seal glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[560px] h-[560px] rounded-full bg-[#B8860B]/[0.05] blur-3xl" />
      </div>

      {/* toast */}
      {toastMounted && (
        <div
          className={`fixed top-5 right-5 z-50 transition-all duration-300 ease-out ${
            toastVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="flex items-start gap-3 bg-[#1E293B] border border-slate-700 rounded-xl shadow-2xl px-4 py-3.5 w-[320px]">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-rose-400" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-[13px] font-semibold leading-snug">
                Can&apos;t access {portalLabel}
              </p>
              <p className="text-slate-400 text-[12px] mt-0.5 leading-snug">
                Your {roleLabel} account doesn&apos;t have permission here.
              </p>
            </div>
            <button
              onClick={() => setToastVisible(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* main card */}
      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-[#1E293B]/60 backdrop-blur-sm border border-slate-800 rounded-2xl px-8 py-10 text-center">
          <div className="relative w-14 h-14 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-rose-500/10 blur-md" />
            <div className="relative w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-400" strokeWidth={1.75} />
            </div>
          </div>

          <p className="text-slate-500 text-[11px] font-semibold tracking-[0.12em] uppercase mb-2">
            Access restricted
          </p>
          <h1 className="text-white text-lg font-bold leading-snug mb-2">
            This portal isn&apos;t part of your account
          </h1>
          <p className="text-slate-400 text-[13px] leading-relaxed mb-8">
            You&apos;re signed in as {roleLabel}, and the {portalLabel} is
            reserved for a different role. If you think this is a mistake,
            contact your barangay administrator.
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => router.push(home)}
              className="w-full flex items-center justify-center gap-2 bg-[#B8860B] hover:bg-[#a3780a] text-slate-900 font-semibold text-[13px] rounded-lg py-2.5 transition-colors duration-150 active:scale-[0.98]"
            >
              Go to my {role === "resident" ? "portal" : "dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
              className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white text-[13px] font-medium rounded-lg py-2.5 transition-colors duration-150"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out and switch account
            </button>
          </div>
        </div>

        <p className="text-center text-slate-600 text-[11px] mt-5">
          San Isidro Barangay Management System
        </p>
      </div>
    </div>
  );
}