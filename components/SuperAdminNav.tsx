"use client";
import { tabs } from "@/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SuperAdminNav = () => {
  const pathname = usePathname();

  return (
    <div className="relative">
      <div
        role="tablist"
        aria-label="Super admin sections"
        className="flex items-end gap-1 overflow-x-auto scrollbar-none"
      >
        {tabs.map((tab, i) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          const badge = (tab as { badge?: number }).badge;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              role="tab"
              aria-selected={active}
              style={{ animationDelay: `${i * 60}ms` }}
              className={[
                "group relative flex shrink-0 items-center gap-2 rounded-t-xl border border-b-0 px-4 pt-3 pb-3 text-sm font-semibold",
                "outline-none transition-all duration-200 ease-out animate-[tabIn_0.35s_ease-out_backwards]",
                "focus-visible:ring-2 focus-visible:ring-[#B8860B]/50 focus-visible:ring-offset-1",
                active
                  ? "z-10 -mb-px border-[#E7E3D8] bg-[#FAF9F6] text-slate-900 shadow-[0_-6px_14px_-6px_rgba(15,23,42,0.10)]"
                  : "border-transparent text-slate-400 hover:text-slate-700 hover:bg-[#B8860B]/[0.06]",
              ].join(" ")}
            >
              <Icon
                className={`h-4 w-4 transition-colors duration-200 ${
                  active ? "text-[#B8860B]" : "text-slate-400 group-hover:text-slate-500"
                }`}
              />
              <span>{tab.label}</span>

              {!!badge && (
                <span
                  className={`ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold transition-colors ${
                    active ? "bg-[#B8860B] text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {badge}
                </span>
              )}

              {active && (
                <span className="pointer-events-none absolute inset-x-3 top-0 h-[2px] rounded-full bg-[#B8860B]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* base line the folder sits on */}
      <div className="h-px w-full bg-[#E7E3D8]" />

      <style jsx global>{`
        @keyframes tabIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SuperAdminNav;