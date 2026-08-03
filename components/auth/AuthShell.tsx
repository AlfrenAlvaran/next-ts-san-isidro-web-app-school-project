"use client";

import Link from "next/link";
import Image from "next/image";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"] });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });

const services = [
  "Request barangay clearance",
  "Apply for certificate of residency",
  "Track a request's status",
  "Book a visit at the barangay hall",
];

function Seal() {
  return (
    <svg viewBox="0 0 96 96" className="w-16 h-16">
      <circle cx="48" cy="48" r="44" fill="none" stroke="#B8860B" strokeOpacity="0.4" strokeWidth="1" />
      <circle cx="48" cy="48" r="36" fill="none" stroke="#B8860B" strokeOpacity="0.7" strokeWidth="1" />
      <path
        d="M48,29 L52,40 L64,40 L54,47 L58,58 L48,51 L38,58 L42,47 L32,40 L44,40 Z"
        fill="#B8860B"
      />
    </svg>
  );
}

export function AuthShell({
  formNumber,
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  formNumber: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className={`${body.className} min-h-screen flex`}>
      {/* Left — identity panel, pinned to the viewport so it doesn't stretch with the form's scroll height */}
      <div className="hidden lg:flex lg:w-[40%] lg:h-screen lg:sticky lg:top-0 bg-[#0F172A] text-white flex-col justify-between px-12 py-12">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <Image src="/logo.jpg" alt="logo" width={34} height={34} className="rounded" />
          <div>
            <span className="block font-semibold text-[14px] leading-none">Brgy. San Isidro</span>
            <span className={`${mono.className} block text-white/40 text-[10px] tracking-[0.12em] uppercase leading-none mt-1`}>
              Local Government Unit
            </span>
          </div>
        </Link>

        <div>
          <Seal />
          <h2 className={`${display.className} italic text-[26px] leading-[1.25] mt-6 max-w-xs`}>
            Your barangay hall, open every hour of the day.
          </h2>
          <p className="text-white/50 text-[13.5px] leading-relaxed mt-3 max-w-xs">
            File requests, track their status, and skip the line — all from the resident portal.
          </p>

          <ul className="mt-8 space-y-2.5">
            {services.map((s) => (
              <li key={s} className="flex items-center gap-2.5 text-white/70 text-[13px]">
                <span className="w-1 h-1 rounded-full bg-[#B8860B]" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <p className={`${mono.className} text-white/30 text-[10.5px] tracking-wide`}>
          RESIDENT PORTAL — TAYTAY, RIZAL
        </p>
      </div>

      {/* Right — the form, scrolls independently of the left panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-14 py-10">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-slate-400 hover:text-slate-700 text-[12.5px] font-medium transition-colors">
              ← Back to site
            </Link>
            <span className={`${mono.className} text-[10.5px] text-slate-400 tracking-[0.12em]`}>
              {formNumber}
            </span>
          </div>

          <p className={`${mono.className} text-[#B8860B] text-[10.5px] font-medium tracking-[0.16em] uppercase mb-3`}>
            {eyebrow}
          </p>
          <h1 className={`${display.className} text-[28px] text-[#0F172A] leading-tight mb-2`}>{title}</h1>
          <p className="text-slate-500 text-[13.5px] leading-relaxed mb-8">{subtitle}</p>

          {children}

          <div className="mt-7 pt-6 border-t border-slate-200 text-center text-[13px] text-slate-500">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}