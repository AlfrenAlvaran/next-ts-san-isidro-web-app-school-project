'use client'

import { ServiceChild } from "@/data"
import { useState } from "react"

const ServiceCard = ({title, description, tag, icon: Icon}: ServiceChild) => {
    const [hovered, setHovered]=useState(false)
  return (
    <a
      href="/request"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-200 flex flex-col h-full"
      style={{
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
      }}
    >
      {tag && (
        <span className="absolute top-4 right-4 px-2 py-0.5 bg-[#B8860B]/10 text-[#B8860B] text-[10px] font-semibold tracking-wide rounded-md">
          {tag}
        </span>
      )}

      <div className="w-9 h-9 bg-slate-100 group-hover:bg-[#0F172A] text-slate-500 group-hover:text-white rounded-lg flex items-center justify-center mb-4 transition-all duration-200">
        <Icon className="w-5 h-5" />
      </div>

      <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{title}</h3>

      <p className="text-slate-500 text-[13px] leading-relaxed">
        {description}
      </p>
    </a>
  )
}

export default ServiceCard
