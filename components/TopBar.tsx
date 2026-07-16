"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Loader2,
  FileText,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRequests } from "@/hooks/useRequests";
import { useResidents } from "@/hooks/useResidents";
import { useSession, signOut } from "next-auth/react";

type SearchResult = {
  id: string;
  type: "resident" | "request";
  title: string;
  subtitle: string;
  href: string;
};

const TopBar = () => {
  const router = useRouter();
  const { pendingCount, requests } = useRequests();
  const { residents } = useResidents();
  const { data: session } = useSession();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Debounce so filtering doesn't run on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const results = useMemo<SearchResult[]>(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();

    const residentMatches: SearchResult[] = (residents ?? [])
      .filter(
        (r) =>
          r.fullName?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.phone?.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((r) => ({
        id: r.id,
        type: "resident" as const,
        title: r.fullName,
        subtitle: r.email,
        href: `/admin/residents/${r.id}`,
      }));

    const requestMatches: SearchResult[] = (requests ?? [])
      .filter(
        (req: any) =>
          req.residentName?.toLowerCase().includes(q) ||
          req.type?.toLowerCase().includes(q) ||
          req.status?.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((req: any) => ({
        id: req.id,
        type: "request" as const,
        title: req.type ?? "Certificate request",
        subtitle: `${req.residentName ?? "Unknown resident"} · ${req.status}`,
        href: `/admin/certificate-requests/${req.id}`,
      }));

    return [...requestMatches, ...residentMatches];
  }, [debouncedQuery, residents, requests]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setQuery("");
    setDebouncedQuery("");
    setSearchOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut({ callbackUrl: "/sign-in" });
  };

  const showDropdown = searchOpen && debouncedQuery.length > 0;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-5 sm:px-8 gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 rounded-full bg-[#0F172A] flex items-center justify-center">
          <Image src={"/barangay-logo.svg"} alt="logo" width={32} height={32} className="w-4 h-4" />
        </div>
        <span className="font-bold text-slate-900 text-sm">San Isidro</span>
      </div>

      <div className="relative hidden sm:block w-full max-w-sm" ref={searchRef}>
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 border border-transparent focus-within:border-[#B8860B]/40 focus-within:bg-white focus-within:shadow-sm transition-all duration-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search requests, residents…"
            className="bg-transparent text-[13px] text-slate-700 placeholder:text-slate-400 outline-none w-full"
          />
          {query && (
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-[13px] text-slate-500">
                  No matches for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Try a name, email, or request type
                </p>
              </div>
            ) : (
              <ul>
                {results.map((r, i) => (
                  <li key={`${r.type}-${r.id}`}>
                    <button
                      onClick={() => handleSelect(r)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        activeIndex === i ? "bg-slate-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          r.type === "resident"
                            ? "bg-[#0F172A]/5 text-[#0F172A]"
                            : "bg-[#B8860B]/10 text-[#B8860B]"
                        }`}
                      >
                        {r.type === "resident" ? (
                          <Users className="w-3.5 h-3.5" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-slate-900 truncate">
                          {r.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {r.subtitle}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <p className="hidden md:block text-xs text-slate-400">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <button
          className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors duration-150 active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-600" />
          {pendingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex">
              <span className="absolute inline-flex w-2 h-2 rounded-full bg-[#B8860B] opacity-75 animate-ping" />
              <span className="relative w-2 h-2 rounded-full bg-[#B8860B] ring-2 ring-white" />
            </span>
          )}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-slate-100 transition-colors duration-150"
          >
            <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-[#B8860B] text-xs font-bold shrink-0">
              {initials}
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {session?.user?.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
                <User className="w-4 h-4" />
                My profile
              </button>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {signingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;