import React from "react";

const ChevronDown = ({ open }: { open: boolean }) => {
  return (
    <svg
      className={`w-3.5 h-3.5 ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
};

export default ChevronDown;
