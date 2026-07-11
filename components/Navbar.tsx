"use client";

import { navLinks } from "@/constant";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ChevronDown from "./ChevronDown";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [mobile, setMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuthenticated = status === "authenticated";
  const userEmail = session?.user?.email ?? null;
  const userName = session?.user?.name ?? null;

  // scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
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

  // close menus on route change
  useEffect(() => {
    setMobile(false);
    setMobileDropdown(null);
    setUserMenuOpen(false);
  }, [pathname]);

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setSigningOut(true);
    await signOut({ callbackUrl: "/sign-in" });
  };

  const handleDropdownEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const isLinkActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const initials = (userName || userEmail || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/70 shadow-[0_1px_0_0_rgba(15,23,42,0.04)]"
          : "bg-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform duration-200 ease-out hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="overflow-hidden rounded-full ring-1 ring-transparent group-hover:ring-slate-200 transition-all duration-300">
              <Image
                src={"/logo.jpg"}
                alt="logo"
                width={50}
                height={50}
                priority
                className="transition-transform duration-500 ease-out group-hover:rotate-[8deg]"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="black-text text-15 tracking-tight leading-none transition-colors duration-200 group-hover:text-slate-900">
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
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && handleDropdownEnter(link.label)
                  }
                  onMouseLeave={() => link.children && handleDropdownLeave()}
                >
                  <Link
                    href={link.href}
                    className={`group relative flex items-center gap-0.5 px-3.5 py-2 text-[13.5px] font-medium rounded-md transition-all duration-200 ease-out ${
                      active
                        ? "text-slate-900"
                        : "text-slate-600 hover:text-slate-900"
                    } hover:bg-slate-50`}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown open={activeDropdown === link.label} />
                    )}
                    <span
                      className={`pointer-events-none absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full bg-[#0F172A] transition-transform duration-300 ease-out origin-left ${
                        active
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>

                  {link.children && (
                    <div
                      className={`absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-900/10 z-50 py-1.5 overflow-hidden transition-all duration-200 ease-out origin-top ${
                        activeDropdown === link.label
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                      }`}
                    >
                      {link.children.map((child, i) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          style={{
                            transitionDelay:
                              activeDropdown === link.label
                                ? `${i * 30}ms`
                                : "0ms",
                          }}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:pl-5 transition-all duration-200 ease-out ${
                            activeDropdown === link.label
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-1"
                          }`}
                        >
                          <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0 transition-colors" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="w-px h-5 bg-slate-200 mx-2" />

            <Link
              href={"/request"}
              className="relative flex items-center gap-2 px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.97] text-white text-[13.5px] font-semibold rounded-lg transition-all duration-200 ease-out hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-[1px]"
            >
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:rotate-6"
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
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.97] transition-all duration-200 ease-out"
                >
                  <span className="w-7 h-7 rounded-full bg-[#0F172A] text-white text-[11px] font-semibold flex items-center justify-center transition-transform duration-200 ease-out">
                    {initials}
                  </span>
                  <ChevronDown open={userMenuOpen} />
                </button>

                <div
                  className={`absolute top-full right-0 mt-1 w-56 bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-900/10 z-50 py-1.5 overflow-hidden transition-all duration-200 ease-out origin-top-right ${
                    userMenuOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                  }`}
                >
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
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:pl-5 transition-all duration-200 ease-out"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:pl-5 transition-all duration-200 ease-out"
                  >
                    Profile Settings
                  </Link>

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 hover:pl-5 transition-all duration-200 ease-out disabled:opacity-50"
                  >
                    {signingOut ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-red-300 border-t-red-600 animate-spin" />
                        Signing out…
                      </>
                    ) : (
                      "Sign Out"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 ml-1">
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-semibold text-[#0F172A] border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.97] rounded-lg transition-all duration-200 ease-out"
                >
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
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
            className="lg:hidden relative p-2 -mr-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 transition-transform duration-300 ease-out"
              style={{ transform: mobile ? "rotate(90deg)" : "rotate(0deg)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                className="transition-all duration-300 ease-out"
                strokeLinecap="round"
                strokeLinejoin="round"
                d={mobile ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`lg:hidden border-t border-slate-100 bg-white overflow-hidden transition-all duration-300 ease-out ${
          mobile ? "max-h-[calc(100vh-64px)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 py-3 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
          {navLinks.map((link, idx) => {
            const active = isLinkActive(link.href);
            return (
              <div
                key={link.label}
                style={{
                  transitionDelay: mobile ? `${idx * 40}ms` : "0ms",
                }}
                className={`transition-all duration-300 ease-out ${
                  mobile
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2"
                }`}
              >
                <button
                  onClick={() =>
                    link.children
                      ? setMobileDropdown(
                          mobileDropdown === link.label ? null : link.label,
                        )
                      : router.push(link.href)
                  }
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-[14px] font-medium rounded-lg transition-all duration-200 ease-out active:scale-[0.98] ${
                    active
                      ? "text-slate-900 bg-slate-50"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                  {link.children && (
                    <ChevronDown open={mobileDropdown === link.label} />
                  )}
                </button>

                {link.children && (
                  <div
                    className={`pl-4 overflow-hidden transition-all duration-250 ease-out ${
                      mobileDropdown === link.label
                        ? "max-h-96 opacity-100 mb-1"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="space-y-0.5 py-0.5">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobile(false)}
                          className="block px-3 py-2 text-[13.5px] text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:pl-4 rounded-lg transition-all duration-200 ease-out"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/request"
            onClick={() => setMobile(false)}
            className="block text-center mt-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] text-white text-[13.5px] font-semibold rounded-lg transition-all duration-200 ease-out"
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
                className="block px-3 py-2.5 text-[14px] text-slate-600 hover:bg-slate-50 active:scale-[0.98] rounded-lg transition-all duration-200 ease-out"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full text-left px-3 py-2.5 text-[14px] text-red-600 hover:bg-red-50 active:scale-[0.98] rounded-lg transition-all duration-200 ease-out disabled:opacity-50"
              >
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/sign-in"
                onClick={() => setMobile(false)}
                className="text-center px-4 py-2.5 border border-slate-200 text-[13.5px] font-semibold text-[#0F172A] active:scale-[0.98] rounded-lg transition-all duration-200 ease-out"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;