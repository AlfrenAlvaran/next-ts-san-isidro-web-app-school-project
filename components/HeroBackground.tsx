
"use client"
const HeroBackground = ({
  scrollY,
  tiltX,
}: {
  scrollY: number;
  tiltX: number;
}) => {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('/hero.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollY * 0.4}px) scale(1.2)`,
          willChange: "transform",
        }}
      />
      <div className="absolute inset-0 bg-[#0F172A]/70 pointer-events-none" />
      <div
        className="absolute top-20 right-10 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(184,134,11,0.12) 0%, transparent 70%)",
          transform: `translateY(${scrollY * 0.15}px) translateX(${tiltX * 2}px)`,
          transition: "transform 0.1s ease",
          willChange: "transform",
        }}
      />
      <div
        className="absolute bottom-10 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          transform: `translateY(${scrollY * 0.35}px)`,
          willChange: "transform",
        }}
      />
      <div
        className="absolute right-8 top-24 sm:right-20 sm:top-16 opacity-[0.06] pointer-events-none select-none"
        style={{
          transform: `translateY(${scrollY * 0.08}px) rotate(${scrollY * 0.02}deg) translateX(${tiltX * -3}px)`,
          willChange: "transform",
        }}
      >
        <svg width="420" height="420" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="#B8860B" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="70" stroke="#B8860B" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="50" stroke="#B8860B" strokeWidth="0.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 100 100)`}>
              <line
                x1="100"
                y1="10"
                x2="100"
                y2="30"
                stroke="#B8860B"
                strokeWidth="1"
              />
              <polygon
                points="100,5 96,20 104,20"
                fill="#B8860B"
                opacity="0.8"
              />
            </g>
          ))}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
            (deg) => (
              <line
                key={deg}
                x1="100"
                y1="30"
                x2="100"
                y2="38"
                stroke="#B8860B"
                strokeWidth="0.5"
                transform={`rotate(${deg} 100 100)`}
              />
            ),
          )}
          <circle cx="100" cy="100" r="5" fill="#B8860B" />
          <circle cx="100" cy="100" r="2.5" fill="#0F172A" />
        </svg>
      </div>
    </>
  );
};

export default HeroBackground;
