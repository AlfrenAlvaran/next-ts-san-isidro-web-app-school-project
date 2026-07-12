"use client";

import { Stamp } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 bg-[#0F172A] flex-col">
      <div className="h-16 flex item-center gap-3 px-6 border-b border-slate-800">
        <div className="w-8 h-8 rounded-full bg-[#B8860B]/20 border border-[#B8860B]/40 flex items-center justify-center">
          <Stamp className="w-4 h-4 text-[#B8860B]" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
