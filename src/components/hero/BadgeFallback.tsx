"use client";

import { useState } from "react";
import { TiltCard } from "@/components/ui/TiltCard";
import { PROFILE } from "@/content/profile";
import { RACE_STATS } from "@/content/races";

interface BadgeFallbackProps {
  flipped: boolean;
  onToggleFlip: () => void;
}

/**
 * Pure HTML/CSS interactive Race-Bib ID Badge.
 * Served immediately on SSR (so LCP never waits for WebGL) and kept for
 * reduced-motion or low-power devices.
 */
export function BadgeFallback({ flipped, onToggleFlip }: BadgeFallbackProps) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="relative mx-auto flex w-full max-w-[330px] flex-col items-center select-none">
      {/* Lanyard strap above the badge */}
      <div
        aria-hidden="true"
        className="h-14 w-9 border-x-2 border-signal bg-surface/90 shadow-md"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 6px, rgba(255,255,255,0.04) 6px 7px)",
        }}
      />
      {/* Carabiner clip */}
      <div aria-hidden="true" className="-mt-1 h-4 w-12 rounded-sm border border-grid-strong bg-elevated shadow" />

      <TiltCard max={10} className="w-full">
        <div
          onClick={onToggleFlip}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggleFlip();
            }
          }}
          aria-label={`Race bib credential for ${PROFILE.name}. Activate to flip card.`}
          className="relative w-full cursor-pointer rounded-2xl border border-grid-strong bg-[#0e1014] p-4 text-[#f2f0eb] shadow-2xl transition-transform duration-500"
        >
          {/* Top signal bar */}
          <div className="-mx-4 -mt-4 mb-3 flex items-center justify-between rounded-t-2xl bg-signal px-4 py-2.5 font-mono text-[10px] font-bold tracking-wider text-white uppercase">
            <span>Ultra-Trail Engineer</span>
            <span className="h-2.5 w-12 rounded-full bg-black/70 ring-1 ring-white/30" aria-hidden="true" />
            <span>Bali · IDN</span>
          </div>

          {!flipped ? (
            <div>
              {/* Portrait frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-[#12161f] bg-topo">
                {imgOk && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={PROFILE.photo}
                    alt={PROFILE.name}
                    onError={() => setImgOk(false)}
                    className="h-full w-full object-cover"
                  />
                )}
                {!imgOk && (
                  <div className="flex h-full flex-col items-center justify-center gap-2">
                    <span className="grid size-20 place-items-center rounded-full border-2 border-telemetry bg-[#0d1016] font-mono text-3xl font-extrabold text-[#f2f0eb] shadow-lg">
                      {PROFILE.monogram}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-telemetry uppercase">
                      GPS {PROFILE.coordinates}
                    </span>
                  </div>
                )}
                <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-0.5 font-mono text-[10px] text-telemetry">
                  ● LIVE TELEMETRY
                </span>
              </div>

              {/* Name & Role */}
              <div className="mt-3">
                <div className="text-xl font-extrabold tracking-tight uppercase">{PROFILE.name}</div>
                <div className="font-mono text-[10px] tracking-wider text-telemetry uppercase">
                  Software &amp; AI Engineer · Operations · Ultra Runner
                </div>
              </div>

              {/* Race Bib Block */}
              <div className="mt-3 flex items-stretch overflow-hidden rounded-xl bg-[#f6f4ef] text-[#141413]">
                <div className="flex w-7 items-center justify-center bg-signal font-mono text-[9px] font-extrabold tracking-widest text-white uppercase [writing-mode:vertical-rl] rotate-180">
                  60 KM ULTRA
                </div>
                <div className="flex flex-1 items-center justify-between px-3 py-2">
                  <div>
                    <div className="font-mono text-[9px] font-bold tracking-wider text-[#57534e] uppercase">
                      Official Bib // Verified
                    </div>
                    <div className="font-mono text-5xl leading-none font-black tracking-tight">
                      {PROFILE.bib}
                    </div>
                  </div>
                  <div className="text-right font-mono text-[10px] font-bold">
                    <div className="rounded bg-[#141413] px-1.5 py-0.5 text-white">GPA {PROFILE.gpa}</div>
                    <div className="mt-1 text-signal">B.SC. INFO</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-[#8a8f98]">
                <span>OPEN TO RELOCATION</span>
                <span className="text-telemetry">{RACE_STATS.totalKm} KM · FLIP ↻</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-1">
              <div className="font-mono text-xs font-bold tracking-wider text-telemetry uppercase">
                Checkpoint Splits &amp; Stack
              </div>
              {[
                ["CP01 // AI INFRA", "Local LLM Server · Hermes · OpenClaw · Qwen & Gemma"],
                ["CP02 // FULL-STACK", "Next.js · TypeScript · Strapi CMS · PostgreSQL"],
                ["CP03 // OPERATIONS", "Production Workflows · Agile Scrum · Branding"],
                ["CP04 // EDUCATION", `B.Sc. Informatics (GPA ${PROFILE.gpa}/4.00) · UMS`],
                ["CP05 // ENDURANCE", "15K → 30K → 42K Marathon → 60K Ultra Finisher"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-white/10 bg-[#141820] px-3 py-2">
                  <div className="font-mono text-[10px] font-bold text-signal">{k}</div>
                  <div className="text-xs text-[#f2f0eb]">{v}</div>
                </div>
              ))}
              <div className="pt-1 text-center font-mono text-[10px] text-telemetry">
                CLICK OR PRESS ENTER TO FLIP BACK ↻
              </div>
            </div>
          )}
        </div>
      </TiltCard>
    </div>
  );
}
