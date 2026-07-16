import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import React from "react";
export default async function AdminLayout({
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
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-5 sm:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
