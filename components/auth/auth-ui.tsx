// Place at: components/auth/auth-ui.tsx
"use client";

import { IBM_Plex_Mono } from "next/font/google";

export const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

/**
 * A single "fill-in-the-blank" form line: label set in small tracked mono
 * caps above a borderless input with only a bottom rule — the paper-form
 * motif instead of a boxed input.
 */
export function LineField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  rightSlot,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rightSlot?: React.ReactNode;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`${plexMono.className} block text-[10.5px] font-medium text-slate-500 mb-2 uppercase tracking-[0.16em]`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-transparent border-0 border-b-[1.5px] transition-colors outline-none py-2.5 text-[15px] text-slate-900 placeholder:text-slate-300 ${
            rightSlot ? "pr-9" : ""
          } ${error ? "border-red-300" : "border-slate-300 focus:border-[#B8860B]"}`}
        />
        {rightSlot && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1.5">{error}</p>}
    </div>
  );
}

export function StrengthMeter({ strength }: { strength: number }) {
  const label = ["Too weak", "Weak", "Okay", "Good", "Strong"][strength];
  const color = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-lime-500",
    "bg-emerald-500",
  ][strength];
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-200 ${
              i < strength ? color : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className={`${plexMono.className} text-[10.5px] text-slate-400 mt-1`}>{label}</p>
    </div>
  );
}