"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { CHECKPOINTS, type CheckpointId } from "@/content/profile";

/** Scroll progress rail showing only START, CP01–CP05, and FINISH. */
export function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const height = useTransform(progress, (v) => `${v * 100}%`);
  const [active, setActive] = useState<CheckpointId>("start");

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

  const lastIdx = CHECKPOINTS.length - 1;

  return (
    <>
      {/* Mobile / tablet: thin top bar */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-16 z-40 h-px origin-left bg-signal lg:hidden"
        style={{ scaleX: progress }}
      />

      {/* Desktop: vertical checkpoint rail (Start → CP01..CP05 → Finish) */}
      <aside
        aria-label="Course checkpoints"
        className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center 2xl:flex"
      >
        <div className="relative h-[48vh] w-px bg-grid-strong">
          <motion.div className="absolute inset-x-0 top-0 bg-signal" style={{ height }} />
          {CHECKPOINTS.map((c, idx) => {
            const isActive = c.id === active;
            const isEndpoint = idx === 0 || idx === lastIdx;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                aria-label={`${c.code} — ${c.label}`}
                aria-current={isActive ? "location" : undefined}
                className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: `${(idx / lastIdx) * 100}%` }}
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
                    isActive
                      ? "text-signal opacity-100"
                      : isEndpoint
                        ? "text-muted opacity-80 group-hover:text-ink group-hover:opacity-100"
                        : "text-muted opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {c.code}
                </span>
              </a>
            );
          })}
        </div>
      </aside>
    </>
  );
}
