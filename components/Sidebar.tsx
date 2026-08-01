"use client";

import { SidebarAdmin } from "@/constant";
import { useRequests } from "@/hooks/useRequests";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, LogOut, UserCircle } from "lucide-react";

const Sidebar = () => {
  const { pendingCount } = useRequests();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const Fullname = session?.user?.name;
  const role = session?.user.role;

  const initials = Fullname
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-[#0F172A] flex-col relative">
      {/* Header / crest */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800 relative">
        <div className="relative w-9 h-9 shrink-0">
          <div className="absolute inset-0 rounded-full bg-[#B8860B]/20 blur-md" />
          <div className="relative w-9 h-9 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/40 flex items-center justify-center">
            <Image
              src={"/barangay-logo.svg"}
              alt="logo"
              width={64}
              height={64}
              className="w-5 h-5"
            />
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-white text-[13px] font-bold leading-none tracking-tight">
            San Isidro
          </p>
          <p className="text-slate-500 text-[10px] leading-none mt-1.5 tracking-[0.12em] uppercase">
            Admin Console
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-none">
        <style>{`
          .scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }
          .scrollbar-none::-webkit-scrollbar { display: none; }
        `}</style>
        {SidebarAdmin.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative w-full flex items-center justify-between gap-3 pl-4 pr-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] ${
                active
                  ? "bg-[#B8860B]/15 text-[#B8860B]"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {/* seal-ribbon active indicator */}
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full bg-[#B8860B] transition-all duration-300 ease-out ${
                  active ? "h-5 opacity-100" : "h-0 opacity-0"
                }`}
              />

              <span className="flex items-center gap-3">
                <item.icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    active ? "" : "group-hover:scale-110 group-hover:-translate-y-px"
                  }`}
                  strokeWidth={2}
                />
                {item.label}
              </span>

              {item.badge && pendingCount > 0 && (
                <span
                  className={`relative flex items-center justify-center text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] transition-colors duration-200 ${
                    active
                      ? "bg-[#B8860B] text-slate-900"
                      : "bg-slate-700 text-slate-200 group-hover:bg-slate-600"
                  }`}
                >
                  {pendingCount}
                  {!active && (
                    <span className="absolute inset-0 rounded-full bg-[#B8860B]/50 animate-ping" />
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile footer */}
      <div ref={menuRef} className="relative px-4 py-4 border-t border-slate-800">
        {menuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#16213a] border border-slate-800 rounded-lg shadow-xl overflow-hidden animate-[popIn_0.15s_ease-out]">
            <style>{`@keyframes popIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }`}</style>
            <Link
              href="/dashboard/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <UserCircle className="w-4 h-4" />
              View profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        )}

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.06] transition-colors duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8860B]"
        >
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse shrink-0" />
          ) : session?.user?.image ? (
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 relative ring-2 ring-[#B8860B]/30">
              <Image
                src={session.user.image}
                alt={Fullname as string}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-[#B8860B]/30">
              {initials ?? "?"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {status === "loading" ? (
              <>
                <div className="h-2.5 w-20 bg-slate-800 rounded animate-pulse mb-1.5" />
                <div className="h-2 w-12 bg-slate-800 rounded animate-pulse" />
              </>
            ) : (
              <>
                <p className="text-white text-xs font-semibold truncate">
                  {Fullname}
                </p>
                <p className="text-slate-500 text-[10px] capitalize">{role}</p>
              </>
            )}
          </div>
          <ChevronsUpDown
            className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;