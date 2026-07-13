"use client";

import { auth } from "@/auth";
import { SidebarAdmin } from "@/constant";
import { useRequests } from "@/hooks/useRequests";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const { pendingCount } = useRequests();
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-[#0F172A] flex-col">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="w-8 h-8 rounded-full bg-[#B8860B]/20 border border-[#B8860B]/40 flex items-center justify-center">
          <Image src={"/barangay-logo.svg"} alt="logo" width={64} height={64} />
        </div>
        <div>
          <p className="text-white text-[13px] font-bold leading-none">
            San Isidro
          </p>
          <p className="text-slate-500 text-[10px] leading-none mt-1 tracking-wide uppercase">
            Admin Console
          </p>
        </div>
      </div>

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
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                active
                  ? "bg-[#B8860B]/15 text-[#B8860B]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <item.icon className="w-4 h-4" strokeWidth={2} />
                {item.label}
              </span>
              {item.badge && pendingCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    active
                      ? "bg-[#B8860B] text-slate-900"
                      : "bg-slate-700 text-slate-200"
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
          KP
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate">
            Kap. Julieta P. Ramos
          </p>
          <p className="text-slate-500 text-[10px]">Punong Barangay</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
