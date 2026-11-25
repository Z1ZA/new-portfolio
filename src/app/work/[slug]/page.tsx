import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { ButtonLink, Chip } from "@/components/ui/Button";
import { CASE_STUDIES, getCaseStudy, type CaseStudyMeta } from "@/content/caseStudies";
import { PROFILE } from "@/content/profile";
import AiVideoClipperMdx from "@/content/work/ai-video-clipper.mdx";
import CompanyBusinessDashboardMdx from "@/content/work/company-business-dashboard.mdx";
import LocalAiAgentSandboxMdx from "@/content/work/local-ai-agent-sandbox.mdx";
import MotionVideoSkillsMdx from "@/content/work/motion-video-skills.mdx";

const MDX_MAP: Record<CaseStudyMeta["slug"], ComponentType> = {
  "ai-video-clipper": AiVideoClipperMdx,
  "motion-video-skills": MotionVideoSkillsMdx,
  "company-business-dashboard": CompanyBusinessDashboardMdx,
  "local-ai-agent-sandbox": LocalAiAgentSandboxMdx,
};

export function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.title} — Case Study | ${PROFILE.name}`,
    description: cs.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const Content = MDX_MAP[cs.slug];
  const currentIdx = CASE_STUDIES.findIndex((c) => c.slug === cs.slug);
  const nextStudy = CASE_STUDIES[(currentIdx + 1) % CASE_STUDIES.length];

  return (
    <main id="main" className="min-h-svh pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/#systems"
            className="hud inline-flex items-center gap-2 border border-grid-strong bg-elevated px-3.5 py-2 text-ink transition-colors hover:border-telemetry hover:text-telemetry"
          >
            <span aria-hidden="true">←</span> Back to CP01 // Projects
          </Link>
          <span className="hud text-signal">CASE {cs.code}</span>
        </div>

        <header className="panel p-6 sm:p-10">
          <div className="hud flex flex-wrap items-center justify-between gap-2 text-muted">
            <span className="text-signal">
              {cs.category}
            </span>
            <span>
              {cs.period} · {cs.location}
            </span>
          </div>

          <h1 className="mt-4 text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
            {cs.title}
          </h1>

          <p className="mt-2 font-mono text-sm text-telemetry">
            {cs.role} — {cs.org}
          </p>

          <p className="mt-5 text-base leading-relaxed text-secondary sm:text-lg">{cs.summary}</p>

          <dl className="mt-8 grid grid-cols-1 gap-4 border-t border-grid pt-6 sm:grid-cols-3">
            {cs.metrics.map((m) => (
              <div key={m.label} className="border border-grid bg-surface/60 p-4">
                <dt className="hud text-muted">{m.label}</dt>
                <dd className="mt-1 font-mono text-2xl font-extrabold text-ink">{m.value}</dd>
                <dd className="mt-1 font-mono text-xs text-secondary">{m.note}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 border-t border-grid pt-6">
            <div className="hud mb-3 text-muted">SYSTEM ARCHITECTURE PIPELINE</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              {cs.architectureNodes.map((node, i) => (
                <div
                  key={node.label}
                  className="relative border border-grid-strong bg-surface/80 p-3.5"
                >
                  <div className="font-mono text-[10px] font-bold text-signal">
                    STAGE 0{i + 1}
                  </div>
                  <div className="mt-1 font-mono text-xs font-bold text-ink">{node.label}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-secondary">{node.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {cs.stack.map((t) => (
              <li key={t}>
                <Chip>{t}</Chip>
              </li>
            ))}
          </ul>
        </header>

        <article className="mt-10 border-b border-grid pb-12">
          <Content />
        </article>

        <nav aria-label="Next case study" className="mt-12">
          <div className="panel flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <div className="hud text-muted">NEXT CASE</div>
              <div className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                {nextStudy.title}
              </div>
              <div className="mt-1 font-mono text-xs text-telemetry">{nextStudy.tagline}</div>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`/work/${nextStudy.slug}`} variant="primary">
                Next Case Study →
              </ButtonLink>
              <ButtonLink href="/#finish" variant="outline">
                Hire / Contact
              </ButtonLink>
            </div>
          </div>
        </nav>
      </div>
    </main>
  );
}
