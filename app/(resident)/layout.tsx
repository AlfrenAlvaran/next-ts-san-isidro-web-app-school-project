import Header from "@/components/Header";
import React from "react";
export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full bg-slate-50 font-sans"
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <Header />
      {children}
    </div>
  );
}
