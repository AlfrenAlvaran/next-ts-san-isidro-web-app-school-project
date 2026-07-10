import Reveal from "./Reveal";

const CTA = () => {
  return (
    <section className="bg-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <Reveal>
          <h3 className="text-white font-extrabold text-xl sm:text-2xl tracking-tight mb-2">
            Need a document or have a concern?
          </h3>
          <p className="text-slate-400 text-sm">
            Aquarius Street, Brgy. San Isidro, Taytay Rizal · Mon–Fri, 8:00 AM –
            5:00 PM · Hotline (02) 8-527-1234
          </p>
        </Reveal>
        <a
          href="#"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#B8860B] hover:text-white text-slate-900 text-sm font-semibold rounded-lg transition-all duration-200 group"
        >
          Contact the Office
          <svg
            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
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
        </a>
      </div>
    </section>
  );
};

export default CTA;
