import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="h-screen w-full bg-slate-50 font-sans flex overflow-hidden"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col h-screen">
        <TopBar />
        <main className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
