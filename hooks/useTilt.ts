"use client";

import React, { useRef, useState } from "react";

export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMouseMove = (e: React.MouseEvent<T>) => {
    if (!ref.current) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 10;
    const y = ((e.clientY - top) / height - 0.5) * -6;
    setTilt({ x, y });
  };
  const onMouseLeave = () => setTilt({ x: 0, y: 0 });

  return { ref, tilt, onMouseMove, onMouseLeave };
}
