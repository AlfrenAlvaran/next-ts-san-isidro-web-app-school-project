"use client";

import { Bell, ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/request", label: "Request" },
  { href: "/profile", label: "Profile" },
  { href: "/track", label: "Track" },
];

const Header = () => {
  const [avatarMenuOpen, setAvatarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAvatarOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setSigningOut(true);
    await signOut({ callbackUrl: "/sign-in" });
  }

  const displayName = session?.user?.name ?? "Resident";
  const displayEmail = session?.user?.email ?? "";
  const initial = displayEmail?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 upports-backdrop-filter:bg-white/70">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
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
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/home"
                ? pathname === "/home"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute left-3 right-3 -bottom-px h-0.5 bg-[#B8860B] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {/* Optional notification dot — wire up when you have real notification state */}
            {/* <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#B8860B]" /> */}
          </button>

          {/* Avatar dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setAvatarOpen((v) => !v)}
              className="flex items-center gap-2 text-[#B8860B] text-xs font-bold rounded-lg px-1.5 py-1 hover:bg-slate-50 transition-colors"
              aria-expanded={avatarMenuOpen}
              aria-haspopup="menu"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#B8860B] to-[#8a6508] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initial}
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-200 ${
                  avatarMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {avatarMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl border border-slate-200 shadow-xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {displayName}
                  </p>
                  {displayEmail && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {displayEmail}
                    </p>
                  )}
                </div>

                <Link
                  href="/profile"
                  onClick={() => setAvatarOpen(false)}
                  role="menuitem"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" /> View account
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={signingOut}
                  role="menuitem"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-t border-slate-100"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {signingOut ? "Signing out…" : "Log out"}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-4.5 h-4.5 text-slate-600" />
            ) : (
              <Menu className="w-4.5 h-4.5 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white px-5 py-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/home"
                ? pathname === "/home"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default Header;