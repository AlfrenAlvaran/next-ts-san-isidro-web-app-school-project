import Sidebar from "@/components/Sidebar";
import React from "react";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full bg-slate-50 font-sans flex"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
        <Sidebar />
      {children}
    </div>
  );
}
