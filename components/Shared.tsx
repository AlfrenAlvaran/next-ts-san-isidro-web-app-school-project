import React from "react";
import type { LucideIcon } from "lucide-react";
import { Send, Search as SearchIcon, CheckCircle2, PackageCheck, XCircle } from "lucide-react";


import { RequestStatus, STAGES } from "@/data";

// ---------------------------------------------------------------------------
// Small building blocks shared across the Dashboard and Profile pages
// ---------------------------------------------------------------------------

interface StageProps {
  stage: number;
  status: RequestStatus;
}

export function StagePill({ stage, status }: StageProps) {
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Rejected
      </span>
    );
  }
  if (status === "released") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Released
      </span>
    );
  }
  const label = STAGES[stage];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {label}
    </span>
  );
}

export function MiniProgress({ stage, status }: StageProps) {
  if (status === "rejected") return null;
  const pct = status === "released" ? 100 : (stage / (STAGES.length - 1)) * 100;
  return (
    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden w-full">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#0F172A] to-[#B8860B] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Stepper({ stage, status }: StageProps) {
  const icons = [Send, SearchIcon, CheckCircle2, PackageCheck];
  return (
    <div className="flex items-start">
      {STAGES.map((label, i) => {
        const Icon = icons[i];
        const reached = status === "released" ? true : i <= stage;
        const isRejectedPoint = status === "rejected" && i === stage + 1;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center text-center w-20">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ring-4 ${
                  isRejectedPoint
                    ? "bg-rose-50 ring-rose-100 text-rose-500"
                    : reached
                    ? "bg-[#0F172A] ring-[#B8860B]/20 text-[#B8860B]"
                    : "bg-slate-100 ring-white text-slate-300"
                }`}
              >
                {isRejectedPoint ? <XCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <p className={`text-[10px] font-semibold mt-2 leading-tight ${reached ? "text-slate-700" : "text-slate-350 text-slate-400"}`}>
                {isRejectedPoint ? "Rejected" : label}
              </p>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`h-0.5 flex-1 mt-4 ${reached && i < stage ? "bg-[#0F172A]" : reached && status === "released" ? "bg-[#0F172A]" : "bg-slate-100"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
}

export function Field({ label, value }: FieldProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-900 text-right">{value}</span>
    </div>
  );
}

export function Field2({ label, value }: FieldProps) {
  return (
    <div>
      <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-0.5">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  );
}

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export function QuickAction({ icon: Icon, label, onClick, primary }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${
        primary
          ? "bg-[#0F172A] border-[#0F172A] hover:bg-[#B8860B] hover:border-[#B8860B]"
          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${primary ? "bg-white/15" : "bg-slate-100"}`}>
        <Icon className={`w-4 h-4 ${primary ? "text-white" : "text-slate-600"}`} />
      </div>
      <span className={`text-[13px] font-semibold ${primary ? "text-white" : "text-slate-800"}`}>{label}</span>
    </button>
  );
}