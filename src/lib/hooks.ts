"use client";

import { useEffect, useState } from "react";

/**
 * Decides whether the device should get the full WebGL hero.
 * Returns `null` until measured on the client (render the fallback meanwhile).
 */
export function useCanRender3D(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };
    const saveData = nav.connection?.saveData === true;
    const lowCpu = (nav.hardwareConcurrency ?? 8) < 4;
    const lowMem = nav.deviceMemory !== undefined && nav.deviceMemory < 4;

    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      webgl = false;
    }

    setOk(webgl && !reduce && !saveData && !lowCpu && !lowMem);
  }, []);

  return ok;
}

/** True while `ref`'s element intersects the viewport. */
export function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = "0px") {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** Formats seconds as MM:SS (or H:MM:SS past an hour). */
export function formatSplit(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Elapsed whole seconds since `start`, ticking every second. */
export function useElapsed(start: number) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [start]);
  return elapsed;
}
