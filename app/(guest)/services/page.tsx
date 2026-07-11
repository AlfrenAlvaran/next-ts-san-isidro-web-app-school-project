"use client";

import Hero from "@/components/Hero";
import { CheckIcon } from "@/components/icons";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import { requirements, services } from "@/data";
import { useCountUp, useInView } from "@/hooks";
import Link from "next/link";
import { useMemo, useState, type RefObject } from "react";

const CATEGORIES = [
  "All Services",
  "Certificates & Documents",
  "Permits & Registration",
  "Assistance Programs",
];

const ServicesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Services");
  const [query, setQuery] = useState("");
  const [statsRef, statsVisible] = useInView(0.3);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesCategory =
        activeCategory === "All Services" || s.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        s.title.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const animatedTotal = useCountUp(services.length, statsVisible, {
    target: `${services.length}`,
    visible: statsVisible,
  });

  return (
    <>
      <Hero
        minHeight="70vh"
        eyebrow="Our Services"
        title="Barangay services made simple, fast, and accessible to every resident"
        description="From certificates and clearances to community programs and emergency assistance, Barangay San Isidro offers a full range of services designed around your needs — online or in person."
        maxWidth="max-w-3xl"
        showScrollCue
        actions={
          <>
            <Link
              href="/request"
              className="px-6 py-3 bg-white text-[#0F172A] text-sm font-semibold rounded-lg hover:bg-slate-100 active:scale-[0.98] transition-all duration-200"
            >
              Request a Certificate
            </Link>
            <Link
              href="#services-list"
              className="px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
            >
              Browse All Services
            </Link>
          </>
        }
        footer={
          <div className="relative border-t border-white/10 bg-black/20">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "Services Offered", value: "10+" },
                { label: "Avg. Processing Time", value: "1–2 Days" },
                { label: "Requests Filed Online", value: "6,500+" },
                { label: "Available", value: "Mon–Fri" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* ---------- Services list ---------- */}
      <section id="services-list" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div ref={statsRef as RefObject<HTMLDivElement>}>
            <Reveal className="mb-10">
              <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                Browse by category
              </p>
              <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  All Services
                </h2>
                <span className="text-sm text-slate-500">
                  {filtered.length} of {animatedTotal} services
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const active = activeCategory === c;
                    const count =
                      c === "All Services"
                        ? services.length
                        : services.filter((s) => s.category === c).length;
                    return (
                      <button
                        key={c}
                        onClick={() => setActiveCategory(c)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                          active
                            ? "bg-[#0F172A] text-white shadow-sm"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {c}
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                            active
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative sm:ml-auto sm:w-64">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search services..."
                    className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/10 focus:border-slate-300 transition-all duration-200"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {filtered.length > 0 ? (
            <div
              key={`${activeCategory}-${query}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((s, i) => (
                <Reveal key={s.title} delay={Math.min(i, 6) * 50}>
                  <ServiceCard {...s} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-slate-200 rounded-2xl bg-white">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-900 font-semibold text-sm mb-1">
                No matching services
              </p>
              <p className="text-slate-500 text-[13px] mb-5 max-w-xs">
                Try a different search term or browse another category.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All Services");
                }}
                className="text-sm font-medium text-[#B8860B] hover:text-[#96700A] transition-colors"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ---------- Requirements ---------- */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12">
          <Reveal>
            <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Before you apply
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              What you&apos;ll generally need
            </h2>
            <p className="text-slate-500 text-[15px] leading-relaxed max-w-sm">
              Requirements vary slightly by document, but most requests only
              need the following. Specific requirements are listed when you
              start a request.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {requirements.map((r, i) => (
              <Reveal key={r.title} delay={i * 70}>
                <div className="group flex gap-3 bg-slate-50 border border-slate-200 rounded-xl p-5 h-full transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center mt-0.5 transition-transform duration-200 group-hover:scale-110">
                    <CheckIcon />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">
                      {r.title}
                    </h3>
                    <p className="text-slate-500 text-[13px] leading-relaxed">
                      {r.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;