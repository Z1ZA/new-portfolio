"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Accent, SectionHeader } from "@/components/ui/SectionHeader";

type KitZone = "AI" | "WEB" | "OPS";

interface FlatLayItem {
  name: string;
  sub: string;
  zone: KitZone;
  code: string;
  tilt: number;
}

const KIT_ITEMS: FlatLayItem[] = [
  // AI Engineering
  { name: "Python", sub: "AI scripts & pipelines", zone: "AI", code: "PY", tilt: -1.2 },
  { name: "LLM Agents & MCP", sub: "Hermes · OpenClaw · Tools", zone: "AI", code: "AG", tilt: 1.1 },
  { name: "RAG & Prompt Eng.", sub: "Context & JSON schemas", zone: "AI", code: "RG", tilt: -1.0 },
  { name: "Local LLM Inference", sub: "Qwen · Gemma · GLM", zone: "AI", code: "LM", tilt: 1.3 },
  { name: "Whisper & FFmpeg", sub: "Speech & video AI", zone: "AI", code: "AV", tilt: -1.1 },
  { name: "Motion Video Skills", sub: "Programmatic 60fps video", zone: "AI", code: "MV", tilt: 1.0 },
  { name: "OpenAI & Gemini SDK", sub: "Hybrid model APIs", zone: "AI", code: "SD", tilt: -1.2 },

  // Full-Stack Software Engineering
  { name: "TypeScript", sub: "Strict full-stack types", zone: "WEB", code: "TS", tilt: 1.1 },
  { name: "Next.js & React", sub: "App Router · SSR/SSG", zone: "WEB", code: "NX", tilt: -1.2 },
  { name: "Node.js & REST API", sub: "Backend & webhooks", zone: "WEB", code: "ND", tilt: 1.0 },
  { name: "PostgreSQL & SQL", sub: "Relational data modeling", zone: "WEB", code: "PG", tilt: -1.1 },
  { name: "Tailwind CSS", sub: "Minimalist UI systems", zone: "WEB", code: "TW", tilt: 1.2 },
  { name: "Strapi Headless CMS", sub: "Content API architecture", zone: "WEB", code: "ST", tilt: -1.0 },
  { name: "System Architecture", sub: "Scalable web & API design", zone: "WEB", code: "SA", tilt: 1.1 },

  // Infrastructure, Delivery & Operations
  { name: "Docker & Linux", sub: "Containers & GPU hosts", zone: "OPS", code: "DK", tilt: -1.1 },
  { name: "Git & GitLab CI/CD", sub: "Automated pipelines", zone: "OPS", code: "CI", tilt: 1.2 },
  { name: "Automated Testing", sub: "QA & web performance", zone: "OPS", code: "QA", tilt: -1.0 },
  { name: "Agile Scrum", sub: "Cross-squad delivery", zone: "OPS", code: "SC", tilt: 1.1 },
  { name: "Figma → Production", sub: "UI/UX collaboration", zone: "OPS", code: "FG", tilt: -1.2 },
  { name: "Business & Sales Ops", sub: "KPIs & workflow lead", zone: "OPS", code: "OP", tilt: 1.0 },
];

const FILTERS: { id: "ALL" | KitZone; label: string }[] = [
  { id: "ALL", label: "All (20)" },
  { id: "AI", label: "AI" },
  { id: "WEB", label: "Web" },
  { id: "OPS", label: "Ops" },
];

export function GearCheck() {
  const [filter, setFilter] = useState<"ALL" | KitZone>("ALL");
  const visible = filter === "ALL" ? KIT_ITEMS : KIT_ITEMS.filter((i) => i.zone === filter);

  return (
    <section
      id="gear"
      aria-labelledby="gear-heading"
      className="relative border-b border-grid py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            id="gear-heading"
            code="CP03"
            kicker="Core Skills"
            title={
              <>
                What I carry on the <Accent>course</Accent>.
              </>
            }
          />

          <div className="mb-10 flex flex-wrap gap-2 sm:mb-14" role="tablist" aria-label="Filter core skills">
            {FILTERS.map((f) => {
              const active = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className={`hud h-10 px-4 font-semibold transition-colors ${
                    active
                      ? "bg-signal text-white"
                      : "border border-grid-strong bg-elevated text-secondary hover:border-telemetry hover:text-ink"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimalist Technical Kit Flat-Lay */}
        <div className="panel relative overflow-hidden p-5 sm:p-8">
          <motion.div
            layout
            className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((item) => (
                <motion.div
                  layout
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1, rotate: item.tilt }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ rotate: 0, y: -6, scale: 1.03 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col justify-between border border-grid-strong bg-surface/90 p-4 shadow-sm transition-colors hover:border-telemetry hover:bg-elevated"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 ${
                        item.zone === "AI"
                          ? "bg-signal/15 text-signal"
                          : item.zone === "WEB"
                            ? "bg-telemetry/15 text-telemetry"
                            : "bg-blueprint/15 text-blueprint"
                      }`}
                    >
                      {item.zone}
                    </span>
                    <span className="font-mono text-[10px] text-muted group-hover:text-telemetry">
                      ✓
                    </span>
                  </div>

                  <div className="my-4 flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center border border-grid-strong bg-canvas font-mono text-sm font-black tracking-tight text-ink transition-colors group-hover:border-signal group-hover:text-signal">
                      {item.code}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-ink">{item.name}</div>
                      <div className="truncate font-mono text-[11px] text-muted">{item.sub}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
