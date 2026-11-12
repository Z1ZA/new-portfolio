"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { CHECKPOINTS, type CheckpointId } from "@/content/profile";

const TOTAL_KM = CHECKPOINTS[CHECKPOINTS.length - 1].km;

/** Scroll progress expressed as race distance, with checkpoint ticks. */
export function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const height = useTransform(progress, (v) => `${v * 100}%`);
  const [km, setKm] = useState("00.0");
  const [active, setActive] = useState<CheckpointId>("start");

  useMotionValueEvent(progress, "change", (v) => {
    setKm((Math.min(1, Math.max(0, v)) * TOTAL_KM).toFixed(1).padStart(4, "0"));
  });

  useEffect(() => {
    const els = CHECKPOINTS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as CheckpointId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Mobile / tablet: thin top bar */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-16 z-40 h-px origin-left bg-signal lg:hidden"
        style={{ scaleX: progress }}
      />

      {/* Desktop: vertical race rail */}
      <aside
        aria-label="Race progress"
        className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 2xl:flex"
      >
        <span className="hud tabular text-ink" aria-live="off">
          KM <span className="text-signal">{km}</span>
        </span>
        <div className="relative h-[46vh] w-px bg-grid-strong">
          <motion.div className="absolute inset-x-0 top-0 bg-signal" style={{ height }} />
          {CHECKPOINTS.map((c) => {
            const isActive = c.id === active;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                aria-label={`${c.code} ${c.label}`}
                aria-current={isActive ? "location" : undefined}
                className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${(c.km / TOTAL_KM) * 100}%` }}
              >
                <span
                  className={`block size-2.5 rotate-45 border transition-all duration-300 ${
                    isActive
                      ? "scale-125 border-signal bg-signal"
                      : "border-grid-strong bg-canvas group-hover:border-ink"
                  }`}
                />
                <span
                  className={`hud pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity duration-300 ${
                    isActive ? "text-ink opacity-100" : "text-muted opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {c.code}
                </span>
              </a>
            );
          })}
        </div>
        <span className="hud text-muted">{TOTAL_KM} KM</span>
      </aside>
    </>
  );
}
