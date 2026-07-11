import { RevealChild } from "@/constant";
import { useInView } from "@/hooks";
import React, { useEffect, useRef, useState } from "react";

const Reveal = ({ children, delay = 0, className = "" }: RevealChild) => {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default Reveal;