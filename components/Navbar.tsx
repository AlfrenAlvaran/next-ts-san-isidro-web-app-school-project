"use client";

import { navLinks } from "@/constant";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ChevronDown from "./ChevronDown";

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [mobile, setMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === "authenticated";
  const userEmail = session?.user?.email ?? null;
  const userName = session?.user?.name ?? null;

  // scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setMobile(false);
    setMobileDropdown(null);
  }, [router]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut({ callbackUrl: "/sign-in" });
  };

  const initials = (userName || userEmail || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image src={"/logo.jpg"} alt="logo" width={50} height={50} priority />
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="black-text text-15 tracking-tight leading-none">
                  Brgy. San Isidro
                </span>
                <span className="hidden sm:inline text-slate-300 text-xs">
                  .
                </span>
                <span className="hidden sm:inline text-slate-400 text-11 font-medium">
                  Taytay Rizal
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-[0.12em] uppercase leading-none mt-0.5">
                Local Government Unit
              </p>
            </div>
          </Link>

          {/* desktop */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  link.children && setActiveDropdown(link.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="group flex items-center gap-0.5 px-3.5 py-2 text-[13.5px] font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-all duration-150"
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown open={activeDropdown === link.label} />
                  )}
                </Link>
                {link.children && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-900/10 z-50 py-1.5 overflow-hidden">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="w-px h-5 bg-slate-200 mx-2" />

            <Link
              href={"/request"}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] text-white text-[13.5px] font-semibold rounded-lg transition-all duration-150"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Request Certificate
            </Link>

            {/* Authentication Area */}
            {status === "loading" ? (
              <div className="ml-1 w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative ml-1" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-150"
                >
                  <span className="w-7 h-7 rounded-full bg-[#0F172A] text-white text-[11px] font-semibold flex items-center justify-center">
                    {initials}
                  </span>
                  <ChevronDown open={userMenuOpen} />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-900/10 z-50 py-1.5 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[13px] font-semibold text-slate-900 truncate">
                        {userName || "Resident"}
                      </p>
                      <p className="text-[12px] text-slate-400 truncate">
                        {userEmail}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      Profile Settings
                    </Link>

                    <div className="h-px bg-slate-100 my-1" />

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 ml-1">
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold text-[#0F172A] border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-all duration-150"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h8a2 2 0 012 2v1"
                    />
                  </svg>
                  Sign In
                </Link>
              </div>
            )}
            {/* Authentication Area */}
          </div>
          {/* desktop */}

          {/* mobile toggle */}
          <button
            onClick={() => setMobile((prev) => !prev)}
            className="lg:hidden p-2 -mr-2 text-slate-600 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobile ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {mobile && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-5 py-3 space-y-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <button
                  onClick={() =>
                    link.children
                      ? setMobileDropdown(
                          mobileDropdown === link.label ? null : link.label,
                        )
                      : router.push(link.href)
                  }
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[14px] font-medium text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown open={mobileDropdown === link.label} />
                  )}
                </button>

                {link.children && mobileDropdown === link.label && (
                  <div className="pl-4 space-y-0.5 mb-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobile(false)}
                        className="block px-3 py-2 text-[13.5px] text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/request"
              onClick={() => setMobile(false)}
              className="block text-center mt-2 px-4 py-2.5 bg-[#0F172A] text-white text-[13.5px] font-semibold rounded-lg"
            >
              Request Certificate
            </Link>

            <div className="h-px bg-slate-100 my-2" />

            {status === "loading" ? null : isAuthenticated ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-[13px] font-semibold text-slate-900 truncate">
                    {userName || "Resident"}
                  </p>
                  <p className="text-[12px] text-slate-400 truncate">
                    {userEmail}
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobile(false)}
                  className="block px-3 py-2.5 text-[14px] text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2.5 text-[14px] text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setMobile(false)}
                  className="text-center px-4 py-2.5 border border-slate-200 text-[13.5px] font-semibold text-[#0F172A] rounded-lg"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;