import SuperAdminNav from "@/components/SuperAdminNav";
import React from "react";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[#FAF9F6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SuperAdminNav />
        {children}
      </div>
    </div>
  );
}