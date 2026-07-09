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

function SquareBullet() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" stroke="#B8860B" strokeWidth="1.3" />
    </svg>
  );
}

function Seal() {
  return (
    <svg viewBox="0 0 160 160" className="w-32 h-32">
      <defs>
        <path id="sealTopArc" d="M 18 84 A 62 62 0 0 1 142 84" />
        <path id="sealBottomArc" d="M 32 108 A 54 54 0 0 0 128 108" />
      </defs>
      <circle cx="80" cy="80" r="72" fill="none" stroke="#B8860B" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="1 4" />
      <circle cx="80" cy="80" r="58" fill="none" stroke="#B8860B" strokeOpacity="0.8" strokeWidth="1" />
      <text fill="#D9B24C" fontSize="9.5" letterSpacing="2.4" className={mono.className}>
        <textPath href="#sealTopArc" startOffset="50%" textAnchor="middle">
          BARANGAY SAN ISIDRO
        </textPath>
      </text>
      <text fill="#D9B24C" fontSize="9.5" letterSpacing="2.6" className={mono.className}>
        <textPath href="#sealBottomArc" startOffset="50%" textAnchor="middle">
          TAYTAY · RIZAL
        </textPath>
      </text>
      <g transform="translate(80,80)">
        <path
          d="M0,-19 L4.5,-6.5 L18,-6.5 L7.5,2 L11.5,15 L0,7 L-11.5,15 L-7.5,2 L-18,-6.5 L-4.5,-6.5 Z"
          fill="#B8860B"
          opacity="0.9"
        />
      </g>
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
    <div className={`${body.className} min-h-screen bg-[#FAF9F5] flex`}>
      {/* Left — identity panel */}
      <div className="hidden lg:flex lg:w-[42%] relative bg-[#0F172A] text-white flex-col justify-between px-12 py-12 overflow-hidden">
        {/* decorative contour rings, echoing the seal */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-28 -top-28 w-[26rem] h-[26rem] rounded-full border border-[#B8860B]/10" />
          <div className="absolute -left-10 -top-10 w-72 h-72 rounded-full border border-[#B8860B]/10" />
          <div className="absolute right-[-6rem] bottom-[-6rem] w-80 h-80 rounded-full border border-white/5" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #B8860B 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
        </div>

        <Link href="/" className="relative flex items-center gap-2.5 w-fit">
          <Image src="/logo.jpg" alt="logo" width={38} height={38} className="rounded" />
          <div>
            <span className="block font-bold text-[14px] tracking-tight leading-none">Brgy. San Isidro</span>
            <span className={`${mono.className} block text-white/40 text-[10px] tracking-[0.14em] uppercase leading-none mt-1`}>
              Local Government Unit
            </span>
          </div>
        </Link>

        <div className="relative">
          <Seal />
          <h2 className={`${display.className} italic text-[28px] leading-[1.2] mt-8 max-w-xs`}>
            Your barangay hall, open every hour of the day.
          </h2>
          <p className="text-white/50 text-[13.5px] leading-relaxed mt-3 max-w-xs">
            File requests, track their status, and skip the line — all from the resident portal.
          </p>

          <ul className="mt-8 space-y-2.5">
            {services.map((s) => (
              <li key={s} className="flex items-center gap-2.5 text-white/70 text-[13px]">
                <SquareBullet />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <p className={`${mono.className} relative text-white/30 text-[10.5px] tracking-wide`}>
          RESIDENT PORTAL — TAYTAY, RIZAL
        </p>
      </div>

      {/* Right — the "form" */}
      <div className="flex-1 flex flex-col">
        {/* perforated tear-strip */}
        <div className="w-full flex items-center gap-2 px-6 sm:px-14 py-3 border-b border-dashed border-slate-300 bg-white/60">
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-14 py-10">
          <div className="w-full max-w-sm mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="text-slate-400 hover:text-slate-700 text-[12.5px] font-medium transition-colors">
                ← Back to site
              </Link>
              <span className={`${mono.className} text-[10.5px] text-slate-400 tracking-[0.14em]`}>
                {formNumber}
              </span>
            </div>

            <p className={`${mono.className} text-[#B8860B] text-[10.5px] font-medium tracking-[0.2em] uppercase mb-3`}>
              {eyebrow}
            </p>
            <h1 className={`${display.className} text-[30px] text-[#0F172A] leading-tight mb-2`}>{title}</h1>
            <p className="text-slate-500 text-[13.5px] leading-relaxed mb-8">{subtitle}</p>

            {children}

            <div className="mt-7 pt-6 border-t border-slate-200 text-center text-[13px] text-slate-500">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}