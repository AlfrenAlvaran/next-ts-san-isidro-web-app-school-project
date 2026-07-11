"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { timeLine } from "@/constant";

const HistoryTimeline = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <Reveal className="mb-14 max-w-xl">
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Our History
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Milestones Along the Way
          </h2>
        </Reveal>

        {/* ===== Mobile / tablet: vertical single-column timeline ===== */}
        <div className="relative max-w-2xl lg:hidden">
          <div className="absolute left-6.25 top-2 bottom-2 w-px bg-slate-200" />
          <div className="flex flex-col gap-10">
            {timeLine.map((t, i) => {
              const isActive = active === i;
              return (
                <Reveal key={t.year} delay={i * 80}>
                  <button
                    type="button"
                    onClick={() => setActive(isActive ? null : i)}
                    className="relative flex gap-6 text-left w-full group"
                  >
                    <div
                      className={`relative z-10 shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-[11px] font-bold tracking-tight transition-all duration-300 ease-out ${
                        isActive
                          ? "bg-[#B8860B] text-white scale-110 shadow-lg shadow-[#B8860B]/30"
                          : "bg-[#0F172A] text-white group-hover:scale-105 group-hover:bg-[#1E293B]"
                      }`}
                    >
                      {t.year}
                    </div>
                    <div className="pt-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-semibold text-sm mb-1.5 transition-colors duration-200 ${
                            isActive ? "text-[#B8860B]" : "text-slate-900"
                          }`}
                        >
                          {t.title}
                        </h3>
                        <svg
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ease-out shrink-0 ${
                            isActive ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          isActive
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <p className="overflow-hidden text-slate-500 text-[13px] leading-relaxed max-w-md">
                          {t.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* ===== Desktop: alternating center-line timeline ===== */}
        <div className="hidden lg:block relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-slate-200" />
          <div className="flex flex-col gap-4">
            {timeLine.map((t, i) => {
              const isLeft = i % 2 === 0;
              const isActive = active === i;
              return (
                <Reveal key={t.year} delay={i * 80}>
                  <div
                    className={`relative flex items-center gap-8 py-6 ${
                      isLeft ? "flex-row" : "flex-row-reverse"
                    }`}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                  >
                    {/* content card */}
                    <div className={`w-1/2 ${isLeft ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block max-w-sm rounded-2xl border p-5 transition-all duration-300 ease-out cursor-default ${
                          isActive
                            ? "border-[#B8860B]/40 bg-[#FFFBF0] shadow-lg shadow-[#B8860B]/10 -translate-y-1"
                            : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                        }`}
                      >
                        <span
                          className={`inline-block text-[11px] font-bold tracking-wide mb-2 transition-colors duration-200 ${
                            isActive ? "text-[#B8860B]" : "text-slate-400"
                          }`}
                        >
                          {t.year}
                        </span>
                        <h3 className="font-semibold text-slate-900 text-sm mb-1.5">
                          {t.title}
                        </h3>
                        <p className="text-slate-500 text-[13px] leading-relaxed">
                          {t.desc}
                        </p>
                      </div>
                    </div>

                    {/* center node */}
                    <div className="relative z-10 shrink-0">
                      <span
                        className={`absolute inset-0 rounded-full bg-[#B8860B]/30 transition-all duration-500 ease-out ${
                          isActive ? "scale-[2.2] opacity-100" : "scale-100 opacity-0"
                        }`}
                      />
                      <div
                        className={`relative w-4 h-4 rounded-full border-2 transition-all duration-300 ease-out ${
                          isActive
                            ? "bg-[#B8860B] border-[#B8860B] scale-125"
                            : "bg-white border-slate-300"
                        }`}
                      />
                    </div>

                    {/* spacer */}
                    <div className="w-1/2" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;