import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionHeaderProps {
  code: string;
  km?: number;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
}

/** Checkpoint-style section heading: `CP02 — FLAGSHIP SYSTEMS` + concise title. */
export function SectionHeader({ code, kicker, title, intro, id }: SectionHeaderProps) {
  return (
    <Reveal className="mb-10 max-w-3xl sm:mb-14">
      <div className="hud flex items-center gap-3 text-muted">
        <span className="bg-signal px-2 py-0.5 font-semibold text-white">{code}</span>
        <span className="h-px w-8 bg-grid-strong" aria-hidden="true" />
        <span className="text-telemetry">{kicker}</span>
      </div>
      <h2 id={id} className="mt-4 text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-3 max-w-2xl text-base leading-relaxed text-secondary">{intro}</p>}
    </Reveal>
  );
}

/** Serif italic accent for emotional words inside headings. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="font-serif font-normal italic text-signal">{children}</span>;
}
