"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ThemeProvider } from "next-themes";
import { createContext, useContext, useState, type ReactNode } from "react";

/** Timestamp (ms) when the visitor "crossed the start line" — powers the split timer. */
const RaceClockContext = createContext<number>(0);

export function useRaceStart() {
  return useContext(RaceClockContext);
}

function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.11, anchors: { offset: -72 }, autoRaf: true }}>
      {children}
    </ReactLenis>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [start] = useState(() => Date.now());

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
