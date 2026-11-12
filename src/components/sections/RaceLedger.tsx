"use client";

import { motion } from "motion/react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Accent, SectionHeader } from "@/components/ui/SectionHeader";
import { RACES, RACE_STATS } from "@/content/races";

const MAX_KM = Math.max(...RACES.map((r) => r.distanceKm));

export function RaceLedger() {
  return (
    <section
      id="races"
      aria-labelledby="races-heading"
      className="relative border-b border-grid py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <SectionHeader
          id="races-heading"
          code="CP05"
          km={51}
          kicker="Official Marathon & Ultra-Trail Telemetry"
          title={
            <>
              Verified <Accent>finisher</Accent> ledger (15 KM → {RACE_STATS.longestKm} KM).
            </>
          }
          intro={`Every completed race below links directly to its official third-party timing certificate on ScoreNow or FoneSport — ${RACE_STATS.totalKm} KM of verified mountain and marathon finishes.`}
        />

        <RevealGroup className="panel divide-y divide-grid">
          {RACES.map((r) => {
            const pct = Math.round((r.distanceKm / MAX_KM) * 100);
            const completed = r.status === "completed";

            return (
              <RevealItem
                key={r.order}
                className="grid grid-cols-1 items-center gap-4 p-5 sm:p-6 lg:grid-cols-12"
              >
                {/* Race name & category */}
                <div className="lg:col-span-5">
                  <div className="hud flex items-center gap-2 text-muted">
                    <span className="text-signal">{r.order}</span>
                    <span>//</span>
                    <span>{r.category}</span>
                    {r.bib && <span className="text-telemetry">· BIB #{r.bib}</span>}
                  </div>
                  <h3 className="mt-1 text-lg font-bold tracking-tight sm:text-xl">{r.name}</h3>
                </div>

                {/* Animated distance bar */}
                <div className="lg:col-span-4">
                  <div className="hud mb-1.5 flex items-center justify-between">
                    <span className="font-bold text-ink">{r.distanceKm} KM</span>
                    <span className={completed ? "text-telemetry" : "text-muted"}>
                      {completed ? "✓ FINISHER — VERIFIED" : "⏳ REGISTERED / SCHEDULED"}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden bg-surface">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full ${completed ? "bg-signal" : "bg-grid-strong"}`}
                    />
                  </div>
                </div>

                {/* Official timing link */}
                <div className="flex lg:col-span-3 lg:justify-end">
                  {r.url ? (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hud inline-flex h-10 items-center gap-2 border border-grid-strong bg-surface/80 px-3.5 font-semibold text-telemetry transition-colors hover:border-telemetry hover:bg-elevated"
                    >
                      Official Result ({r.provider}) <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="hud inline-flex h-10 items-center border border-grid px-3.5 text-muted">
                      {r.provider} Event
                    </span>
                  )}
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
