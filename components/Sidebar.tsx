"use client";

import { auth } from "@/auth";
import { SidebarAdmin } from "@/constant";
import { useRequests } from "@/hooks/useRequests";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { pendingCount } = useRequests();
  const pathname = usePathname();
  const { data: session } = useSession();

  const Fullname = session?.user?.name;
  const role = session?.user.role;

  const initials = Fullname
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
      <nav className="flex-1 px-3 py-6 space-y-1">
        {SidebarAdmin.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative w-full flex items-center justify-between gap-3 pl-4 pr-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
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
      <div className="px-4 py-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.06] transition-colors duration-200 text-left">
          {session?.user?.image ? (
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
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate">
              {Fullname}
            </p>
            <p className="text-slate-500 text-[10px] capitalize">{role}</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;