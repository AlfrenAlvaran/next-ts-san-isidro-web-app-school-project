const Loading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* Mark + orbiting ring */}
      <div className="relative w-20 h-20 mb-8">
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          style={{ animationDuration: "1.6s" }}
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#E2E8F0"
            strokeWidth="3"
          />
          <path
            d="M40 4a36 36 0 0 1 36 36"
            stroke="#B8860B"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/barangay-logo.svg" alt="Barangay San Isidro seal" className="w-11 h-12" />
        </div>
      </div>

      <p className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
        Barangay San Isidro
      </p>
      <p className="text-slate-500 text-sm">Loading, please wait…</p>

      {/* Progress hint */}
      <div className="mt-6 w-40 h-1 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-[#0F172A] animate-[loadbar_1.2s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes loadbar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(320%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;