"use client";
import CTA from "@/components/CTA";
import Hero from "@/components/Hero";
import { NewsCard } from "@/components/NewCard";
import Reveal from "@/components/Reveal";
import ServiceCard from "@/components/ServiceCard";
import StatItem from "@/components/StatItem";
import { StepCard } from "@/components/StepCard";
import { barangayFacts, milestone, news, services, stats, steps } from "@/data";
import { useInView } from "@/hooks";
import Image from "next/image";
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

      <section id="services" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-12">
            <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              What we offer
            </p>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Barangay Services
              </h2>
              <Link
                href="/services"
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                View All
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
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {services.slice(0, 6).map((service, i) => (
              <Reveal key={service.title} delay={i * 60}>
                <ServiceCard {...service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-14 max-w-xl">
            <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Process
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-5">
              How to get your certificate
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
            {steps.map((step, i) => {
              return (
                <Reveal key={step.step} delay={i * 80}>
                  <StepCard {...step} />
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* about and history  */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT */}
            <div>
              <Reveal>
                <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                  Our Story
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
                  A community rooted in history
                </h2>
              </Reveal>
              <Reveal delay={80}>
                <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                  Barangay San Isidro is one of the barangays of the
                  Municipality of Taytay, Rizal, a historic town founded during
                  the Spanish colonial period and recognized as one of the
                  oldest municipalities in the province. Named after San Isidro
                  Labrador, the patron saint of farmers, the barangay reflects
                  Taytay&apos;s agricultural heritage before the municipality
                  gradually developed into one of Rizal&apos;s growing
                  residential and commercial centers.
                </p>
              </Reveal>
              <Reveal delay={140}>
                <p className="text-slate-600 text-[15px] leading-relaxed mb-4">
                  Through the years, Barangay San Isidro has grown alongside the
                  continuous progress of Taytay while preserving the Filipino
                  values of unity, cooperation, and bayanihan. Today, the
                  barangay remains committed to providing transparent
                  governance, quality public services, disaster preparedness,
                  environmental stewardship, and programs that promote the
                  welfare, safety, and well-being of every resident.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-slate-600 text-[15px] leading-relaxed mb-8">
                  Today, Barangay San Isidro is home to over 12,000 residents
                  and continues to grow — committed to transparent governance,
                  accessible public services, and a safe, inclusive community
                  for every family.
                </p>
              </Reveal>
              <Reveal delay={260}>
                <div className="grid grid-cols-3 gap-4">
                  {milestone.map((m) => (
                    <div
                      key={m.year}
                      className="border-l-2 border-[#B8860B] pl-3"
                    >
                      <p className="text-[#B8860B] font-extrabold text-sm">
                        {m.year}
                      </p>
                      <p className="text-slate-500 text-[11px] leading-snug mt-0.5">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <div className="relative lg:h-105 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#0F172A] rounded-2xl rotate-3 opacity-60" />
                <div className="absolute inset-2 bg-[#B8860B]/20 border border-[#B8860B]/30 rounded-2xl -rotate-1" />
                <div className="relative bg-white rounded-2xl p-8 shadow-xl w-full mx-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                      <Image
                        src="/logo.jpg"
                        alt="Barangay San Isidro Logo"
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        Barangay San Isidro
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Est. 1820s · Province of Rizal
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {barangayFacts.map((r) => (
                      <div
                        key={r.label}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="text-slate-500 text-xs">
                          {r.label}
                        </span>
                        <span className="text-slate-900 text-xs font-semibold">
                          {r.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

  <section className="py-20 sm:py-24 bg-white">
  <div className="max-w-6xl mx-auto px-6 sm:px-8">
    <div className="mb-14">
      <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 w-full">
        <div className="flex-1">
          <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Stay informed
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Latest Announcements
          </h2>
        </div>

        <div>
          <Link
            href="/announcements"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            All announcements
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
        </div>
      </Reveal>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {news.map((n, i) => (
        <Reveal key={n.title} delay={i * 80}>
          <NewsCard {...n} />
        </Reveal>
      ))}
    </div>
  </div>
</section>

      <CTA />
    </div>
  );
};

export default page;