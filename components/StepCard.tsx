"use client"
import { StepCardProps } from "@/constant";
import { useState } from "react";

export const StepCard = ({ step, title, description }: StepCardProps) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white p-7 flex flex-col gap-4 h-full transition-colors duration-200"
      style={{ background: hovered ? "#0F172A" : "#fff" }}
    >
      <span
        style={{ color: "#B8860B" }}
        className="font-extrabold text-xs tracking-widest"
      >
        {step}
      </span>
      <div>
        <h3
          className="font-semibold text-sm mb-1.5 transition-colors duration-200"
          style={{ color: hovered ? "#fff" : "#0f172a" }}
        >
          {title}
        </h3>
        <p
          className="text-[13px] leading-relaxed transition-colors duration-200"
          style={{ color: hovered ? "#94a3b8" : "#64748b" }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};