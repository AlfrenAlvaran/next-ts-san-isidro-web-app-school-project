"use client"
import { HeroProps } from "@/constant/types";
import { useParallax } from "@/hooks";
import { useTilt } from "@/hooks/useTilt";
import React from "react";
import HeroBackground from "./HeroBackground";

const Hero = ({
  minHeight = "90vh",
  eyebrow,
  title,
  description,
  maxWidth = "max-w-3xl",
  actions,
  showScrollCue = false,
  footer,
  className = "",
}: HeroProps) => {
  const scrollY = useParallax();
  const {
    ref: heroRef,
    tilt,
    onMouseMove,
    onMouseLeave,
  } = useTilt<HTMLElement>();
  return (
    <section
      ref={heroRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative text-white overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      <HeroBackground scrollY={scrollY} tiltX={tilt.x} />

      <div
        className="relative max-w-6xl mx-auto px-6 sm:px-8 flex items-center"
        style={{
          minHeight: `calc(${minHeight} - 64px)`,
          transform: `perspective(1000px) rotateY(${tilt.x * 0.3}deg) rotateX(${tilt.y * 0.3}deg)`,
          transition: "transform 0.15s ease",
        }}
      >
        <div className={`${maxWidth} py-20 sm:py-28`}>
          {eyebrow && (
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-5 h-px bg-[#B8860B]" />
              <span className="text-[#B8860B] text-xs font-semibold tracking-[0.2em] uppercase">
                {eyebrow}
              </span>
            </div>
          )}

          <h1
            className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight mb-6"
            style={{ transform: `translateY(${scrollY * -0.06}px)` }}
          >
            {title}
          </h1>

          {description && (
            <p
              className="text-slate-400 text-base sm:text-lg leading-relaxed mb-10 max-w-xl"
              style={{ transform: `translateY(${scrollY * -0.08}px)` }}
            >
              {description}
            </p>
          )}

          {actions && (
            <div
              className="flex flex-wrap gap-3"
              style={{ transform: `translateY(${scrollY * -0.1}px)` }}
            >
              {actions}
            </div>
          )}
        </div>
      </div>
      {showScrollCue && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <span className="text-slate-600 text-[10px] tracking-[0.2em] uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-linear-to-b from-slate-600 to-transparent animate-pulse" />
        </div>
      )}
      {footer}
    </section>
  );
};

export default Hero;
