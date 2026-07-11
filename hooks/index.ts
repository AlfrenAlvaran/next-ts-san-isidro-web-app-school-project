"use client";

import { UseCountUpProps } from "@/constant";
import { useEffect, useRef, useState } from "react";

export function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return offset;
}

export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

export function useCountUp(length: number, statsVisible: boolean, {
    target, visible, duration = 1400,
}: UseCountUpProps) {
  const [count, setCount] = useState<string>("");

  useEffect(() => {
    if (!visible) return;
    const numeric = parseInt(target.replace(/\D/g, ""), 10);
    if (isNaN(numeric)) {
      setCount(target);
      return;
    }
    let start = 0;
    const step = numeric / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(
          Math.floor(start).toLocaleString() +
            (target.includes("+") ? "+" : target.includes("%") ? "%" : ""),
        );
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target, duration]);
  return count;
}
