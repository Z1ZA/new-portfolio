import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
  code: string;
  km: number;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
}

/** Checkpoint-style section heading: `CP02 · KM 21.0 — FLAGSHIP SYSTEMS`. */
export function SectionHeader({ code, km, kicker, title, intro, id }: SectionHeaderProps) {
  return (
    <Reveal className="mb-12 max-w-3xl sm:mb-16">
      <div className="hud flex items-center gap-3 text-muted">
        <span className="bg-signal px-1.5 py-0.5 font-semibold text-white">{code}</span>
        <span className="tabular">KM {km.toFixed(1).padStart(4, "0")}</span>
        <span className="h-px w-10 bg-grid-strong" aria-hidden="true" />
        <span className="text-telemetry">{kicker}</span>
      </div>
      <h2 id={id} className="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-5 text-base leading-relaxed text-secondary sm:text-lg">{intro}</p>}
    </Reveal>
  );
}

/** Serif italic accent for emotional words inside headings. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="font-serif font-normal italic text-signal">{children}</span>;
}
