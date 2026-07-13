"use client";
import React, { useState } from "react";
import { Search, Bell, ChevronDown, Stamp } from "lucide-react";
import Image from "next/image";
import { useRequests } from "@/hooks/useRequests";
const TopBar = () => {
  const { pendingCount } = useRequests();
  const [query, setQuery] = useState("");
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 sm:px-8 gap-4">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-7 h-7 rounded-full bg-[#0F172A] flex items-center justify-center">
          <Image src={"/barangay-logo.svg"} alt="logo" width={32} height={32} />
        </div>
        <span className="font-bold text-slate-900 text-sm">San Isidro</span>
      </div>
      <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-full max-w-sm">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search requests, residents…"
          className="bg-transparent text-[13px] text-slate-700 placeholder:text-slate-400 outline-none w-full"
        />
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
        <button className="relative w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
          <Bell className="w-4 h-4 text-slate-600" />
          {pendingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B8860B] ring-2 ring-white" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-[#B8860B] text-xs font-bold">
            KP
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
