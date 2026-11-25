"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Accent, SectionHeader } from "@/components/ui/SectionHeader";
import { CASE_STUDIES, type CaseStudySlug } from "@/content/caseStudies";
import { AiClipperPreview } from "./cp01/AiClipperPreview";
import { AskAzizPanel } from "./cp01/AskAzizPanel";
import { BusinessDashboardPreview } from "./cp01/BusinessDashboardPreview";
import { MotionSkillsPreview } from "./cp01/MotionSkillsPreview";

type TabId = "clipper" | "motion" | "dashboard" | "ask";

interface MissionTab {
  id: TabId;
  code: string;
  shortTitle: string;
  category: string;
  title: string;
  tagline: string;
  caseSlug?: CaseStudySlug;
}

const TABS: MissionTab[] = [
  {
    id: "clipper",
    code: "01",
    shortTitle: "AI Video Clipper",
    category: "AI Web App · Auto-Shorts",
    title: CASE_STUDIES[0].title,
    tagline: CASE_STUDIES[0].tagline,
    caseSlug: "ai-video-clipper",
  },
  {
    id: "motion",
    code: "02",
    shortTitle: "Motion Video Skills",
    category: "Agent Skill · 60fps Video",
    title: CASE_STUDIES[1].title,
    tagline: CASE_STUDIES[1].tagline,
    caseSlug: "motion-video-skills",
  },
  {
    id: "dashboard",
    code: "03",
    shortTitle: "Business Dashboard",
    category: "Full-Stack · Company Ops",
    title: CASE_STUDIES[2].title,
    tagline: CASE_STUDIES[2].tagline,
    caseSlug: "company-business-dashboard",
  },
  {
    id: "ask",
    code: "04",
    shortTitle: "Ask Aziz AI",
    category: "Live Assistant · Q&A",
    title: "Ask Aziz's AI Assistant",
    tagline: "Interactive Q&A grounded in Abdul Aziz's projects, engineering stack, and experience.",
  },
];

const SANDBOX_EXPERIMENTS = [
  {
    code: "LAB-01",
    title: "Self-Hosted LLM Rig",
    detail:
      "Custom GPU workstation running Qwen, Gemma & GLM locally with zero cloud data leakage.",
    href: "/work/local-ai-agent-sandbox",
  },
  {
    code: "LAB-02",
    title: "Autonomous Agent & MCP Workflows",
    detail:
      "Custom tools and automated task loops for Hermes and OpenClaw built with a Measurand (Orica) co-founder.",
    href: "/work/local-ai-agent-sandbox",
  },
  {
    code: "LAB-03",
    title: "Robotics Web & Headless CMS",
    detail:
      "Production Next.js, Strapi & PostgreSQL platform engineered with the UI/UX team at Widya Robotics.",
  },
  {
    code: "LAB-04",
    title: "Full-Stack Ticketing App",
    detail:
      "End-to-end flight search, seat reservation, and e-ticket system delivered in an Agile Scrum squad at SYNRGY BCA.",
  },
];

export function FlagshipSystems() {
  const [active, setActive] = useState<number>(0);
  const consoleRef = useRef<HTMLDivElement>(null);
  const current = TABS[active];

  function openAskAi() {
    setActive(3);
    consoleRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <section
      id="systems"
      aria-labelledby="systems-heading"
      className="relative border-b border-grid py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            id="systems-heading"
            code="CP01"
            kicker="Selected Work & AI"
            title={
              <>
                Products &amp; <Accent>AI systems</Accent> I&apos;ve built.
              </>
            }
          />

          <button
            type="button"
            onClick={openAskAi}
            className={`hud mb-10 inline-flex h-11 items-center gap-2 px-5 font-bold transition-colors sm:mb-14 ${
              active === 3
                ? "bg-telemetry text-canvas"
                : "border border-telemetry/60 bg-telemetry/10 text-telemetry hover:bg-telemetry/20"
            }`}
          >
            <span aria-hidden="true">✦</span> Ask Aziz AI
          </button>
        </div>

        {/* Mission Control Interactive Console (Layout C) */}
        <div ref={consoleRef}>
          <Reveal className="panel overflow-hidden">
            {/* Window Chrome */}
            <div className="flex items-center gap-2 border-b border-grid px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-signal" />
              <span className="size-2.5 rounded-full bg-telemetry" />
              <span className="size-2.5 rounded-full bg-grid-strong" />
              <span className="hud ml-2 text-muted">SELECTED WORK</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Vertical Tab Rail */}
              <div
                role="tablist"
                aria-label="Flagship Projects and AI Assistant"
                className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto border-b border-grid p-3 lg:col-span-3 lg:flex-col lg:gap-1.5 lg:border-r lg:border-b-0 lg:p-4"
              >
                {TABS.map((item, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setActive(i)}
                      className={`relative min-w-[175px] snap-start shrink-0 border-l-2 px-4 py-3.5 text-left transition-colors sm:min-w-[205px] lg:min-w-0 ${
                        on
                          ? "border-signal bg-elevated"
                          : "border-transparent hover:border-grid-strong hover:bg-surface/60"
                      }`}
                    >
                      <div className="flex items-baseline gap-2.5">
                        <span
                          className={`font-mono text-sm font-bold ${
                            on ? "text-signal" : "text-muted"
                          }`}
                        >
                          {item.code}
                        </span>
                        <span
                          className={`text-sm leading-snug font-bold ${
                            on ? "text-ink" : "text-secondary"
                          }`}
                        >
                          {item.shortTitle}
                        </span>
                      </div>
                      <div className="mt-1 pl-7 font-mono text-[11px] text-muted">
                        {item.category}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Interactive Stage */}
              <div className="p-4 sm:p-6 lg:col-span-9">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Minimalist Header */}
                    <div className="border-b border-grid pb-4">
                      <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                        {current.title}
                      </h3>
                      <p className="mt-1 text-sm text-secondary">{current.tagline}</p>
                    </div>

                    {/* Interactive Body */}
                    <div className="mt-5">
                      {current.id === "clipper" && <AiClipperPreview />}
                      {current.id === "motion" && <MotionSkillsPreview />}
                      {current.id === "dashboard" && <BusinessDashboardPreview />}
                      {current.id === "ask" && <AskAzizPanel />}
                    </div>

                    {/* Clean Case Study Footer (tabs 01–03 only) */}
                    {current.caseSlug && (
                      <div className="mt-5 flex justify-end border-t border-grid pt-4">
                        <ButtonLink href={`/work/${current.caseSlug}`} variant="outline">
                          Read Case Study →
                        </ButtonLink>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>

        {/* More Builds & Experiments Strip */}
        <div className="mt-10">
          <div className="hud mb-4 text-muted">MORE BUILDS &amp; EXPERIMENTS</div>

          <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SANDBOX_EXPERIMENTS.map((exp) => (
              <RevealItem key={exp.code} className="panel flex flex-col justify-between p-5">
                <div>
                  <div className="hud flex items-center justify-between text-signal">
                    <span>{exp.code}</span>
                    {exp.href && (
                      <Link
                        href={exp.href}
                        className="text-telemetry transition-colors hover:text-ink"
                      >
                        Case Study →
                      </Link>
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-bold tracking-tight text-ink">{exp.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-secondary">{exp.detail}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
