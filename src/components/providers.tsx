"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ThemeProvider } from "next-themes";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** Client mount timestamp (ms) for the shared course split timer. */
const RaceClockContext = createContext<number | null>(null);

export function useRaceStart() {
  return useContext(RaceClockContext);
}

function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [enableLenis, setEnableLenis] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const canHover = !window.matchMedia("(hover: none)").matches;
    setEnableLenis(finePointer && canHover);
  }, []);

  if (reduce || !enableLenis) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.11, anchors: { offset: -72 }, autoRaf: true }}>
      {children}
    </ReactLenis>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [start, setStart] = useState<number | null>(null);

  useEffect(() => {
    setStart(Date.now());
  }, []);

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <RaceClockContext.Provider value={start}>
          <SmoothScroll>{children}</SmoothScroll>
        </RaceClockContext.Provider>
      </MotionConfig>
    </ThemeProvider>
  );
}
