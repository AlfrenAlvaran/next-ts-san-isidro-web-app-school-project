"use client"
import Hero from "@/components/Hero";
import StatItem from "@/components/StatItem";
import { stats } from "@/data";
import { useInView } from "@/hooks";
import Link from "next/link";

const page = () => {
  const [statsRef, statsVisible] = useInView(0.3);
  return (
    <div>
      <Hero
        minHeight="90vh"
        eyebrow="Republic of the Philippines · Province of Rizal"
        title={
          <>
            Barangay San Isidro
            <span className="block text-slate-400 font-light text-3xl sm:text-4xl lg:text-5xl mt-2">
              Serving our community
            </span>
          </>
        }
        description="Transparent governance and efficient public service delivery for every resident of Barangay San Isidro."
        showScrollCue
        actions={
          <>
            <Link
              href="/request"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#B8860B] active:scale-[0.97] text-slate-900 hover:text-white text-sm font-semibold rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Request a Certificate
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-[#B8860B] hover:bg-[#B8860B]/10 text-slate-300 hover:text-[#B8860B] text-sm font-medium rounded-lg transition-all duration-200"
            >
              View Services
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </>
        }
        footer={
          <div ref={statsRef} className="relative border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-800">
              {stats.map((s) => (
                <StatItem
                  key={s.label}
                  value={s.value}
                  label={s.label}
                  visible={statsVisible}
                />
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default page;