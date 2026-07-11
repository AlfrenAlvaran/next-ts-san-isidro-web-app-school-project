import CTA from "@/components/CTA";
import Hero from "@/components/Hero";
import HistoryTimeline from "@/components/HistoryTimeLine";
import Reveal from "@/components/Reveal";
import { departments, timeLine, values } from "@/data";
import Link from "next/link";

const page = () => {
  return (
    <>
      <Hero
        minHeight="80vh"
        eyebrow="About Us"
        title="Serving the community of Barangay San Isidro with integrity and care"
        description="For over two decades, Barangay San Isidro has been committed to transparent governance, responsive public service, and building a safer, more connected community for every resident of Taytay, Rizal."
        maxWidth="max-w-3xl"
        showScrollCue
        actions={
          <>
            <Link
              href="/officials"
              className="px-6 py-3 bg-white text-[#0F172A] text-sm font-semibold rounded-lg hover:bg-slate-100 active:scale-[0.98] transition-all duration-200"
            >
              Meet the Officials
            </Link>
            <Link
              href="/services"
              className="px-6 py-3 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
            >
              Our Services
            </Link>
          </>
        }
      />

      {/* Mission & Vision */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Reveal>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 h-full">
              <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                Our Mission
              </p>
              <p className="text-slate-800 text-lg leading-relaxed">
                To deliver responsive, transparent, and accessible public
                service to every resident of Barangay San Isidro — protecting
                the welfare of our families, strengthening our streets, and
                building an inclusive community government.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="bg-[#0F172A] rounded-xl p-8 h-full text-white">
              <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                Our Vision
              </p>
              <p className="text-slate-200 text-lg leading-relaxed">
                A safe, self-reliant, and progressive barangay where every
                resident has equal access to opportunity, and where local
                government earns trust through consistent, visible action.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      {/* Value */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-12 max-w-xl">
            <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              What guides us
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Values
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 70}>
                  <div className="bg-white border border-slate-200 rounded-xl p-6 h-full hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-200">
                    <div className="w-9 h-9 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center mb-4">
                      <Icon />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1.5">
                      {v.title}
                    </h3>
                    <p className="text-slate-500 text-[13px] leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* TimeLine */}
      <HistoryTimeline />
      {/* TimeLine */}

       {/* Department */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <Reveal className="mb-12 max-w-xl">
            <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              How we're organized
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Offices & Committees
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
            {departments.map((d, i) => (
              <Reveal key={d.name} delay={i * 40}>
                <div className="bg-white p-6 h-full hover:bg-slate-50 transition-colors duration-200">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">
                    {d.name}
                  </h3>
                  <p className="text-slate-500 text-[13px]">{d.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {/* Department */}

      {/* CTA */}
      <CTA />
    </>
  );
};

export default page;
