"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

/** Counts up from 0 to `value` when scrolled into view. Server-renders the final value. */
export function Counter({ value, decimals = 0, prefix = "", suffix = "", duration = 1.6, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value.toFixed(decimals));
  const [armed, setArmed] = useState(false);

  // Reset to zero after hydration so the count-up is visible (SSR shows the real value).
  useEffect(() => {
    if (reduce) return;
    setDisplay((0).toFixed(decimals));
    setArmed(true);
  }, [reduce, decimals]);

  useEffect(() => {
    if (!armed || !inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [armed, inView, value, decimals, duration]);

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
