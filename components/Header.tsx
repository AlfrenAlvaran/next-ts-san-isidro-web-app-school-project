"use client";

import { Page } from "@/constant/types";
import { Bell, ChevronDown, User } from "lucide-react";
import { useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Header = () => {
  const [page, setPage] = useState<Page>("home");
  const [avatarMenuOpen, setAvatarOpen] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center">
            <Image src="/barangay-logo.svg" alt="logo" width={64} height={64} />
          </div>
          <div>
            <p className="text-slate-900 text-[13px] font-bold leading-none">
              San Isidro
            </p>
            <p className="text-slate-400 text-[10px] leading-none mt-0.5 tracking-wide uppercase">
              Resident Portal
            </p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/home"
            className={`px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              page === "home"
                ? "text-slate-900 bg-slate-100"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
            }`}
          >
            Home
          </Link>
          <Link
            href="/request"
            className="px-3 py-2 rounded-lg text-[13px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            My Request
          </Link>
          <Link
            href="/profile"
            className={`px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors ${
              page === "profile"
                ? "text-slate-900 bg-slate-100"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
            }`}
          >
            Profile
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <button className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
            <Bell className="w-4 h-4 text-slate-600" />
          </button>

          <div className="relative">
            <button
              onClick={() => setAvatarOpen((v) => !v)}
              className="flex items-center gap-2 text-[#B8860B] text-xs font-bold"
            >
              <div className="w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center text-white text-xs font-bold">
                {session?.user?.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform ${avatarMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {avatarMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setAvatarOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-40 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">
                      {session?.user.name}
                    </p>
                    <Link
                      href="profile"
                      onClick={() => setAvatarOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <User className="w-3.5 h-3.5 text-slate-400" /> View account
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
