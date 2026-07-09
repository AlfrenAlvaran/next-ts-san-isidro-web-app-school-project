import Navbar from "@/components/Navbar";
import React from "react";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-16">
        <Navbar />
        {children}
      </div>
    </>
  );
}
