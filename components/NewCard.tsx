'use client'
import { NewsCardProps } from "@/data";

export const NewsCard = ({ category, date, title, desc }: NewsCardProps) => {
  return (
    <a
      href="#"
      className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 transition-all duration-200 hover:-translate-y-1 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-md">
          {category}
        </span>
        <span className="text-slate-400 text-[11px]">{date}</span>
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 text-sm mb-2 leading-snug">
          {title}
        </h3>
        <p className="text-slate-500 text-[13px] leading-relaxed">{desc}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-1 text-[13px] font-medium text-slate-400 group-hover:text-slate-900 transition-colors">
        Read more
        <svg
          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
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
      </span>
    </a>
  );
};