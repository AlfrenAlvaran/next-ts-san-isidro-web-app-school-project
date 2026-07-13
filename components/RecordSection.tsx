"use client";
import React, { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Pencil, X, Check } from "lucide-react";
import { Profile, RecordField } from "@/constant/types";
interface RecordSectionProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  fields: RecordField[];
  onSave: (patch: Partial<Profile>) => void;
}
const RecordSection = ({
  icon: Icon,
  title,
  subtitle,
  fields,
  onSave,
}: RecordSectionProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [draft, setDraft] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.value])),
  );
  useEffect(() => {
    if (!edit)
      setDraft(Object.fromEntries(fields.map((f) => [f.key, f.value])));
  }, [edit]);

  function handleSave() {
    onSave(draft as Partial<Profile>);
    setEdit(false);
  }
  function handleCancel() {
    setDraft(Object.fromEntries(fields.map((f) => [f.key, f.value])));
    setEdit(false);
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-[#B8860B]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {edit ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCancel}
              className="w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition-colors"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0F172A] hover:bg-[#B8860B] text-white transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 transition-colors shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        )}
      </div>

      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {fields.map((f) => (
          <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
            <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-1.5 font-semibold">{f.label}</p>
            {edit ? (
              f.type === "select" ? (
                <select
                  value={draft[f.key]}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/15 transition-shadow"
                >
                  <option value="" disabled>
                    Select {f.label.toLowerCase()}
                  </option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={draft[f.key]}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/15 transition-shadow"
                />
              )
            ) : (
              <p className="text-sm font-semibold text-slate-800">{f.display ? f.display(f.value) : f.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordSection;