import React from "react";
import { Stamp, BadgeCheck, QrCode } from "lucide-react";

interface ResidentIdCardProps {
  fullName: string;
  purok: string | null;
  householdNo: string | null;
  idNumber: string | null;
  memberSince: string | null;
  validThru: string | null;
  isVerified: boolean;
}

export default function ResidentIdCard({
  fullName,
  purok,
  householdNo,
  idNumber,
  memberSince,
  validThru,
  isVerified,
}: ResidentIdCardProps) {
  const initials = fullName
    .replace(",", "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0F172A] text-white shadow-xl">
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #B8860B 0px, #B8860B 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <p className="absolute -right-10 top-1/2 -translate-y-1/2 rotate-[-14deg] text-[11px] tracking-[0.5em] font-bold text-white/[0.07] whitespace-nowrap select-none">
        OFFICIAL RECORD · OFFICIAL RECORD · OFFICIAL RECORD
      </p>

      <div className="relative p-6 sm:p-7">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/15">
              <Stamp className="w-4 h-4 text-[#B8860B]" />
            </div>
            <div>
              <p className="text-[12px] font-bold leading-none">Barangay San Isidro</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.15em] mt-1">
                Resident Identification
              </p>
            </div>
          </div>
          {isVerified && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/30">
              <BadgeCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-400">
                Verified
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-lg font-extrabold text-[#B8860B] shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-extrabold tracking-tight truncate">{fullName}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {purok ?? "No Purok set"} · Household {householdNo ?? "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/10">
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wide mb-1">ID number</p>
            <p className="text-[12px] font-mono font-semibold tracking-tight">
              {idNumber ?? "Pending"}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wide mb-1">Resident since</p>
            <p className="text-[12px] font-semibold">{memberSince ?? "—"}</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wide mb-1">Valid thru</p>
            <p className="text-[12px] font-semibold">{validThru ?? "—"}</p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-dashed border-white/15 px-6 sm:px-7 py-3.5 flex items-center justify-between bg-black/10">
        <p className="text-[10px] text-slate-400">
          Present with a valid ID when claiming documents
        </p>
        <div className="flex items-center gap-1.5 text-slate-400">
          <QrCode className="w-4 h-4" />
          <span className="text-[9px] font-semibold uppercase tracking-wide">Scan to verify</span>
        </div>
      </div>
    </div>
  );
}