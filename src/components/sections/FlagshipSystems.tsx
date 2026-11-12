import Link from "next/link";
import { ViewTransition } from "react";
import { Chip } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Accent, SectionHeader } from "@/components/ui/SectionHeader";
import { TiltCard } from "@/components/ui/TiltCard";
import { CASE_STUDIES } from "@/content/caseStudies";

export function FlagshipSystems() {
  return (
    <section
      id="systems"
      aria-labelledby="systems-heading"
      className="relative border-b border-grid py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <SectionHeader
          id="systems-heading"
          code="CP02"
          km={21}
          kicker="Flagship Engineering Case Studies"
          title={
            <>
              Production <Accent>systems</Accent> &amp; autonomous agents.
            </>
          }
          intro="Three deep-dive engineering projects spanning self-hosted LLM agent infrastructure, enterprise headless CMS architecture, and full-stack transactional web systems. Select a card to inspect its architecture and outcomes."
        />

        <RevealGroup className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {CASE_STUDIES.map((cs) => (
            <RevealItem key={cs.slug} className="h-full">
              <TiltCard className="h-full">
                <ViewTransition name={`case-${cs.slug}`} share="morph" default="none">
                  <article className="panel flex h-full flex-col justify-between p-6 transition-colors duration-300 group-hover:border-telemetry/60 sm:p-7">
                    <div>
                      {/* Top telemetry bar */}
                      <div className="hud flex items-center justify-between gap-2 text-muted">
                        <span className="text-signal">{cs.code} // {cs.category}</span>
                        <span>{cs.period}</span>
                      </div>

                      <h3 className="mt-3 text-xl leading-snug font-bold tracking-tight sm:text-2xl">
                        <Link
                          href={`/work/${cs.slug}`}
                          className="after:absolute after:inset-0 focus:outline-none"
                        >
                          {cs.title}
                        </Link>
                      </h3>

                      <p className="mt-1 font-mono text-xs text-telemetry">{cs.headlineMetric}</p>
                      <p className="mt-3 text-sm leading-relaxed text-secondary">{cs.summary}</p>

                      {/* Mini architecture flow preview */}
                      <div className="mt-5 grid grid-cols-2 gap-2 border-y border-grid py-3">
                        {cs.architectureNodes.slice(0, 4).map((node, i) => (
                          <div key={node.label} className="bg-surface/60 px-2.5 py-1.5">
                            <div className="font-mono text-[10px] text-muted">0{i + 1} // {node.label}</div>
                            <div className="truncate font-mono text-[11px] font-semibold text-ink">
                              {node.sub}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bullet highlights */}
                      <ul className="mt-4 space-y-1.5 pl-4 text-xs leading-relaxed text-secondary list-disc">
                        {cs.highlights.slice(0, 3).map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4">
                      <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                        {cs.stack.map((tag) => (
                          <li key={tag}>
                            <Chip>{tag}</Chip>
                          </li>
                        ))}
                      </ul>

                      <div className="hud mt-5 flex items-center justify-between border-t border-grid pt-4 text-ink transition-colors group-hover:text-signal">
                        <span>Read Case Study &amp; Architecture</span>
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </article>
                </ViewTransition>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
