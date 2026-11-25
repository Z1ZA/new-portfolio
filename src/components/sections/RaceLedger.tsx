"use client";

import { motion } from "motion/react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Accent, SectionHeader } from "@/components/ui/SectionHeader";
import { RACES, RACE_STATS } from "@/content/races";

export function RaceLedger() {
  return (
    <section
      id="races"
      aria-labelledby="races-heading"
      className="relative border-b border-grid py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            id="races-heading"
            code="CP04"
            kicker="Verified Finisher Medal Rack"
            title={
              <>
                {RACE_STATS.totalKm} KM of <Accent>verified</Accent> finishes.
              </>
            }
          />

          <p className="hud mb-10 text-muted sm:mb-14">
            CLICK ANY MEDAL TO OPEN OFFICIAL TIMING CERTIFICATE ↗
          </p>
        </div>

        {/* Top steel medal hanger bar */}
        <div
          aria-hidden="true"
          className="hidden h-2 w-full border border-grid-strong bg-surface lg:block"
        />

        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {RACES.map((r) => {
            const completed = r.status === "completed";
            const isPeak = r.distanceKm >= 60;

            return (
              <RevealItem key={r.order} className="flex flex-col items-center">
                {/* V-shaped neck ribbon hanging from the top rack */}
                <div aria-hidden="true" className="hidden flex-col items-center lg:flex">
                  <div
                    className={`h-10 w-9 border-x-2 ${
                      completed
                        ? isPeak
                          ? "border-signal bg-signal/25"
                          : "border-telemetry bg-telemetry/15"
                        : "border-dashed border-grid-strong bg-transparent"
                    }`}
                  />
                  <div className="-mt-1 h-2.5 w-6 rounded-sm border border-grid-strong bg-elevated" />
                </div>

                {/* Medal Card */}
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative flex h-full w-full flex-col items-center justify-between p-5 text-center transition-colors ${
                    completed
                      ? "panel hover:border-telemetry"
                      : "border border-dashed border-grid-strong bg-surface/30"
                  }`}
                >
                  <div className="hud flex w-full items-center justify-between text-muted">
                    <span className={completed ? "text-signal" : "text-muted"}>#{r.order}</span>
                    <span>{completed ? "✓ VERIFIED" : "⏳ NEXT"}</span>
                  </div>

                  {/* Spinning Medallion Coin */}
                  <div className="my-5 [perspective:700px]">
                    <div
                      className={`relative grid size-28 place-items-center rounded-full border-2 transition-transform duration-700 group-hover:[transform:rotateY(180deg)] ${
                        completed
                          ? isPeak
                            ? "border-signal bg-gradient-to-br from-signal/25 via-canvas to-surface shadow-lg"
                            : "border-telemetry bg-gradient-to-br from-telemetry/20 via-canvas to-surface shadow-md"
                          : "border-dashed border-grid-strong bg-surface/50"
                      }`}
                    >
                      {/* Inner engraved ring */}
                      <div className="grid size-22 place-items-center rounded-full border border-grid-strong bg-canvas/90">
                        <div>
                          <div
                            className={`font-mono text-2xl leading-none font-black ${
                              completed ? (isPeak ? "text-signal" : "text-ink") : "text-muted"
                            }`}
                          >
                            {r.distanceKm}
                            <span className="text-xs font-bold">K</span>
                          </div>
                          <div className="mt-1 font-mono text-[9px] tracking-widest text-telemetry uppercase">
                            {completed ? "FINISHER" : "UPCOMING"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Race title & category */}
                  <div>
                    <div className="font-mono text-[10px] tracking-wider text-muted uppercase">
                      {r.category}
                    </div>
                    <h3 className="mt-1 text-base leading-snug font-bold text-ink">{r.name}</h3>
                    {r.bib && (
                      <div className="mt-1 font-mono text-[11px] text-signal">BIB #{r.bib}</div>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="mt-5 w-full border-t border-grid pt-3">
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hud inline-flex w-full items-center justify-center gap-1.5 py-1.5 font-semibold text-telemetry transition-colors group-hover:text-signal after:absolute after:inset-0"
                      >
                        {r.provider} Result <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="hud inline-block py-1.5 text-muted">
                        Scheduled Race
                      </span>
                    )}
                  </div>
                </motion.div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
