"use client";

import { useState } from "react";
import { useRaceStart } from "@/components/providers";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Accent, SectionHeader } from "@/components/ui/SectionHeader";
import { PROFILE } from "@/content/profile";
import { formatSplit, useElapsed } from "@/lib/hooks";

export function FinishLine() {
  const start = useRaceStart();
  const elapsed = useElapsed(start);
  const [tapeBroken, setTapeBroken] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    setTapeBroken(true);
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  }

  return (
    <footer
      id="finish"
      aria-labelledby="finish-heading"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <SectionHeader
          id="finish-heading"
          code="FINISH"
          km={60}
          kicker="Course Complete · Initiate Contact"
          title={
            <>
              Let&apos;s cross the next <Accent>finish line</Accent> together.
            </>
          }
          intro="Available for full-time Software & AI Engineering roles, Technical Operations, or ambitious contract builds — locally in Bali or relocating worldwide."
        />

        {/* Finish Arch & Interactive Break-the-Tape Banner */}
        <Reveal
          onPointerEnter={() => setTapeBroken(true)}
          className="panel relative overflow-hidden p-6 sm:p-10"
        >
          <div className="hud flex flex-wrap items-center justify-between gap-3 text-muted">
            <span>FINISH ARCH // KM 60.0</span>
            <span className="text-telemetry">
              ● YOUR COURSE SPLIT: <strong className="text-ink">{formatSplit(elapsed)}</strong>
            </span>
          </div>

          {/* Interactive SVG Finish Tape */}
          <div className="my-8">
            <svg
              viewBox="0 0 900 84"
              className="h-16 w-full overflow-visible sm:h-20"
              role="img"
              aria-label={tapeBroken ? "Finish tape broken!" : "Hover or activate a contact button to break the finish tape"}
            >
              {/* Left & right finish gantry pillars */}
              <rect x="0" y="6" width="18" height="72" fill="var(--accent-signal)" />
              <rect x="882" y="6" width="18" height="72" fill="var(--accent-signal)" />

              {/* Left half of tape */}
              <g
                style={{
                  transform: tapeBroken ? "translate(-18px, 14px) rotate(-8deg)" : "none",
                  transformOrigin: "18px 42px",
                  transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <path
                  d="M 18 30 L 446 30 L 438 42 L 448 54 L 18 54 Z"
                  fill="var(--accent-signal)"
                />
                <text
                  x="230"
                  y="46"
                  textAnchor="middle"
                  className="fill-white font-mono text-[13px] font-bold tracking-[0.22em]"
                >
                  ABDUL AZIZ // 60 KM
                </text>
              </g>

              {/* Right half of tape */}
              <g
                style={{
                  transform: tapeBroken ? "translate(18px, 14px) rotate(8deg)" : "none",
                  transformOrigin: "882px 42px",
                  transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <path
                  d="M 452 30 L 882 30 L 882 54 L 454 54 L 462 42 Z"
                  fill="var(--accent-signal)"
                />
                <text
                  x="670"
                  y="46"
                  textAnchor="middle"
                  className="fill-white font-mono text-[13px] font-bold tracking-[0.22em]"
                >
                  FINISH LINE // HIRE
                </text>
              </g>
            </svg>
          </div>

          {/* Primary Contact Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink
              href={`mailto:${PROFILE.email}`}
              variant="primary"
              onClick={() => setTapeBroken(true)}
            >
              Email {PROFILE.email} →
            </ButtonLink>

            <button
              type="button"
              onClick={copyEmail}
              className="hud inline-flex h-11 items-center gap-2 border border-grid-strong bg-elevated/70 px-4 font-semibold text-ink transition-colors hover:border-telemetry hover:text-telemetry"
            >
              {copied ? "✓ Email Copied to Clipboard" : "Copy Email Address"}
            </button>

            <ButtonLink href={PROFILE.whatsappUrl} variant="outline" external>
              WhatsApp ({PROFILE.phone})
            </ButtonLink>

            <ButtonLink href={PROFILE.linkedin} variant="outline" external>
              LinkedIn
            </ButtonLink>

            <ButtonLink href={PROFILE.github} variant="outline" external>
              GitHub ({PROFILE.githubHandle})
            </ButtonLink>

            <ButtonLink href={PROFILE.cvPdfPath} variant="outline" download>
              1-Page CV (PDF) ↓
            </ButtonLink>
          </div>
        </Reveal>

        {/* Bottom colophon */}
        <div className="hud mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-grid pt-8 text-muted">
          <span>
            © {new Date().getFullYear()} {PROFILE.degreeTitle} · Bib #{PROFILE.bib}
          </span>
          <span>
            Engineered with Next.js 16 · Tailwind v4 · React Three Fiber · Motion
          </span>
        </div>
      </div>
    </footer>
  );
}
