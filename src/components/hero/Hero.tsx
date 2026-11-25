"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { PROFILE } from "@/content/profile";

const TICKER = ["Local LLM", "MCP Agents", "Next.js", "Bali, ID", "Open to Relocation"];

export function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  // Runner drifts with the cursor; the giant name moves the opposite way for depth.
  const runnerX = useTransform(sx, (v) => v * 18);
  const runnerY = useTransform(sy, (v) => v * 10);
  const nameX = useTransform(sx, (v) => v * -10);

  function onMove(e: React.PointerEvent<HTMLElement>) {
    if (reduce || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <section
      id="start"
      aria-labelledby="hero-heading"
      onPointerMove={onMove}
      className="relative flex min-h-dvh flex-col overflow-hidden border-b border-grid pt-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-topo opacity-50" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 pb-6 text-center">
        {/* Giant name with the runner standing in front of it */}
        <div className="relative w-full max-w-[1400px]">
          <motion.h1
            id="hero-heading"
            style={{ x: nameX }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="select-none text-[clamp(4.5rem,20vw,17rem)] leading-[0.82] font-black tracking-tighter text-ink uppercase"
          >
            <span className="block">Abdul</span>
            <span className="block">Aziz</span>
          </motion.h1>

          <motion.div
            style={{ x: runnerX, y: runnerY }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-y-[-6%] left-1/2 w-[34%] max-w-[420px] min-w-[170px] -translate-x-1/2"
          >
            <Image
              src="/images/runner.png"
              alt={`${PROFILE.name} running`}
              fill
              priority
              sizes="(max-width: 768px) 40vw, 420px"
              className="object-contain object-bottom drop-shadow-[0_18px_40px_rgba(255,90,54,0.35)]"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="relative z-10 mt-8 flex flex-col items-center"
        >
          <p className="max-w-xl text-base text-secondary sm:text-lg">
            Software and AI Engineer, love endurance sport
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="#systems" variant="primary">
              View Work
            </ButtonLink>
            <ButtonLink href={PROFILE.cvPdfPath} variant="outline" download>
              Download CV
            </ButtonLink>
          </div>
        </motion.div>
      </div>

      {/* Ticker */}
      <div className="relative overflow-hidden border-t border-grid bg-canvas/80 py-3" aria-hidden="true">
        <div className="animate-marquee flex w-max items-center whitespace-nowrap">
          {[0, 1].map((n) => (
            <div key={n} className="flex items-center">
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={`${n}-${i}`} className="hud flex items-center text-secondary">
                  <span className="px-6 text-base sm:text-lg">{t}</span>
                  <span className="text-telemetry">●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
