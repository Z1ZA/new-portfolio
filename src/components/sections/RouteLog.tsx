"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { Chip } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeader } from "@/components/ui/SectionHeader";
import { RECORDS } from "@/content/records";

// Chronological order (oldest → newest) for the left-to-right elevation climb
const CHRONO = [...RECORDS].reverse();

const SVG_W = 1000;
const SVG_H = 260;
const PAD_X = 64;
const PAD_Y = 38;

const POINTS = CHRONO.map((rec, i) => {
  const x = PAD_X + (i / (CHRONO.length - 1)) * (SVG_W - PAD_X * 2);
  const y = SVG_H - PAD_Y - (rec.elevation / 100) * (SVG_H - PAD_Y * 2);
  return { ...rec, x, y };
});

function buildSmoothPath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

const LINE_PATH = buildSmoothPath(POINTS);
const AREA_PATH = `${LINE_PATH} L ${POINTS[POINTS.length - 1].x} ${SVG_H - 16} L ${POINTS[0].x} ${SVG_H - 16} Z`;

export function RouteLog() {
  const containerRef = useRef<HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string>(RECORDS[0].id);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 30%"],
  });
  const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  const activeRecord = RECORDS.find((r) => r.id === selectedId) ?? RECORDS[0];

  return (
    <section
      ref={containerRef}
      id="route"
      aria-labelledby="route-heading"
      className="relative border-b border-grid py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <SectionHeader
          id="route-heading"
          code="CP03"
          km={32}
          kicker="Career Elevation Profile & Chronological Ledger"
          title={
            <>
              Every role is a <Accent>waypoint</Accent> on the climb.
            </>
          }
          intro="From leading open-source research at university to shipping production Next.js platforms and assembling self-hosted AI agent servers in Bali. Select any waypoint on the elevation profile or browse the complete ledger below."
        />

        {/* Interactive SVG Elevation Profile */}
        <Reveal className="panel overflow-hidden p-4 sm:p-6">
          <div className="hud mb-3 flex flex-wrap items-center justify-between gap-2 text-muted">
            <span>ELEVATION GAIN // 2022 → 2026 CAREER ROUTE</span>
            <span className="text-telemetry">CLICK OR FOCUS A WAYPOINT TO INSPECT</span>
          </div>

          <div className="overflow-x-auto pb-2">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="h-56 min-w-[680px] w-full select-none sm:h-64"
              role="img"
              aria-label="Career elevation profile from 2022 to 2026"
            >
              <defs>
                <linearGradient id="elevFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-telemetry)" stopOpacity="0.26" />
                  <stop offset="100%" stopColor="var(--accent-telemetry)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal altitude gridlines */}
              {[0.25, 0.5, 0.75].map((t) => {
                const gy = PAD_Y + t * (SVG_H - PAD_Y * 2);
                return (
                  <line
                    key={t}
                    x1={PAD_X}
                    x2={SVG_W - PAD_X}
                    y1={gy}
                    y2={gy}
                    stroke="var(--grid-strong)"
                    strokeDasharray="4 6"
                  />
                );
              })}

              {/* Shaded elevation area */}
              <path d={AREA_PATH} fill="url(#elevFill)" />

              {/* Unfilled baseline route */}
              <path d={LINE_PATH} fill="none" stroke="var(--grid-strong)" strokeWidth={2} />

              {/* Scroll-drawn active telemetry route */}
              <motion.path
                d={LINE_PATH}
                fill="none"
                stroke="var(--accent-telemetry)"
                strokeWidth={3}
                style={{ pathLength }}
              />

              {/* Waypoint nodes */}
              {POINTS.map((pt, idx) => {
                const isSelected = pt.id === selectedId;
                return (
                  <g
                    key={pt.id}
                    onClick={() => setSelectedId(pt.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(pt.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${pt.role} at ${pt.org} (${pt.period})`}
                    className="cursor-pointer focus:outline-none"
                  >
                    {/* Vertical drop line */}
                    <line
                      x1={pt.x}
                      x2={pt.x}
                      y1={pt.y}
                      y2={SVG_H - 16}
                      stroke={isSelected ? "var(--accent-signal)" : "var(--grid-strong)"}
                      strokeWidth={isSelected ? 1.5 : 1}
                      strokeDasharray="2 3"
                    />

                    {/* Outer pulse ring when active */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={13}
                        fill="none"
                        stroke="var(--accent-signal)"
                        strokeWidth={1.5}
                      />
                    )}

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 7 : 5}
                      fill={isSelected ? "var(--accent-signal)" : "var(--bg-canvas)"}
                      stroke={isSelected ? "#ffffff" : "var(--accent-telemetry)"}
                      strokeWidth={2.5}
                    />

                    {/* Waypoint code & org label */}
                    <text
                      x={pt.x}
                      y={pt.y - 14}
                      textAnchor="middle"
                      className="fill-ink font-mono text-[10px] font-bold uppercase"
                    >
                      {pt.org.split(" ")[0]}
                    </text>
                    <text
                      x={pt.x}
                      y={SVG_H - 3}
                      textAnchor="middle"
                      className="fill-muted font-mono text-[9px]"
                    >
                      WP0{idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Waypoint Spotlight Panel */}
          <div className="mt-3 border-t border-grid pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="hud text-signal">{activeRecord.type}</span>
                <span className="hud mx-2 text-muted">//</span>
                <span className="hud text-muted">{activeRecord.period}</span>
                <h3 className="mt-1 text-lg font-bold sm:text-xl">
                  {activeRecord.role} — <span className="text-telemetry">{activeRecord.org}</span>{" "}
                  <span className="font-normal text-muted">({activeRecord.location})</span>
                </h3>
              </div>
              {activeRecord.tags && (
                <div className="flex flex-wrap gap-1.5">
                  {activeRecord.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              )}
            </div>
            <ul className="mt-3 space-y-1 pl-4 text-sm text-secondary list-disc">
              {activeRecord.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Full Chronological Ledger (all items visible for quick scanning) */}
        <div className="mt-10 divide-y divide-grid border-y border-grid">
          {RECORDS.map((item, idx) => {
            const active = item.id === selectedId;
            return (
              <article
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`grid cursor-pointer grid-cols-1 gap-3 py-5 transition-colors md:grid-cols-12 md:gap-6 ${
                  active ? "bg-surface/40 px-3" : "hover:bg-surface/20"
                }`}
              >
                <div className="hud md:col-span-3">
                  <div className="flex items-center gap-2">
                    <span className="text-signal">0{RECORDS.length - idx} // {item.type}</span>
                  </div>
                  <div className="mt-1 text-muted">{item.period}</div>
                </div>

                <div className="md:col-span-9">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold sm:text-lg">
                      {item.org} <span className="font-normal text-muted">— {item.location}</span>
                    </h3>
                    <span className="font-mono text-xs text-telemetry">{item.role}</span>
                  </div>
                  {item.subNote && <p className="mt-0.5 text-xs text-muted">{item.subNote}</p>}
                  <ul className="mt-2 space-y-1 pl-4 text-sm text-secondary list-disc">
                    {item.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
