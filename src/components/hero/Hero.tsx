"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Accent } from "@/components/ui/SectionHeader";
import { PROFILE } from "@/content/profile";
import { RACE_STATS } from "@/content/races";
import { useCanRender3D, useInView } from "@/lib/hooks";
import { BadgeFallback } from "./BadgeFallback";

const TerrainCanvas = dynamic(() => import("./HeroCanvas").then((m) => m.TerrainCanvas), {
  ssr: false,
});

const LanyardCanvas = dynamic(() => import("./HeroCanvas").then((m) => m.LanyardCanvas), {
  ssr: false,
});

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, "150px");
  const can3D = useCanRender3D();
  const [badgeReady, setBadgeReady] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => setFlipped((f) => !f);

  return (
    <section
      ref={sectionRef}
      id="start"
      aria-labelledby="hero-heading"
      className="relative min-h-[calc(100dvh-4rem)] overflow-hidden border-b border-grid pt-20 pb-16 sm:pt-24 sm:pb-24"
    >
      {/* Instant CSS contour backdrop + lazy 3D terrain shader */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-topo opacity-60" />
      {can3D && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <TerrainCanvas active={inView} />
        </div>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent"
      />

      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-8">
        {/* Left column — Dossier & CTAs (30-second recruiter rule) */}
        <div className="lg:col-span-7">
          {/* HUD status strip */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="hud inline-flex items-center gap-2 border border-grid-strong bg-elevated/80 px-2.5 py-1 text-ink backdrop-blur">
              <span className="size-2 rounded-full bg-telemetry animate-pulse-dot" aria-hidden="true" />
              Start Line · KM 00.0
            </span>
            <span className="hud inline-flex items-center gap-1.5 border border-grid-strong bg-surface/70 px-2.5 py-1 text-telemetry">
              Status: {PROFILE.relocation}
            </span>
            <span className="hud hidden border border-grid-strong bg-surface/70 px-2.5 py-1 text-muted sm:inline-flex">
              GPS {PROFILE.coordinates} · {PROFILE.location}
            </span>
          </div>

          <p className="hud mt-6 text-signal">
            {PROFILE.degreeTitle} — {PROFILE.roleHeadline}
          </p>

          <h1
            id="hero-heading"
            className="mt-3 text-4xl leading-[1.04] font-extrabold tracking-tight text-balance sm:text-6xl xl:text-[4.1rem]"
          >
            Engineering <Accent>autonomous local AI</Accent> &amp; full-stack web systems with{" "}
            <Accent>ultra-distance</Accent> grit.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
            {PROFILE.summary}
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={PROFILE.cvPdfPath} variant="primary" download>
              Download 1-Page CV (PDF) ↓
            </ButtonLink>
            <ButtonLink href="#systems" variant="outline">
              Explore Systems (CP02) →
            </ButtonLink>
            <ButtonLink href={PROFILE.github} variant="outline" external>
              GitHub ({PROFILE.githubHandle})
            </ButtonLink>
            <ButtonLink href={PROFILE.linkedin} variant="outline" external>
              LinkedIn
            </ButtonLink>
          </div>

          {/* Quick telemetry readout bar */}
          <dl className="mt-10 grid grid-cols-2 gap-3 border-t border-grid pt-6 sm:grid-cols-4">
            <div>
              <dt className="hud text-muted">Informatics GPA</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-ink tabular">
                {PROFILE.gpa}
                <span className="text-sm text-muted">/4.00</span>
              </dd>
            </div>
            <div>
              <dt className="hud text-muted">AI Focus</dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-telemetry">
                Hermes · OpenClaw · Local LLM
              </dd>
            </div>
            <div>
              <dt className="hud text-muted">Longest Race</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-signal tabular">
                {RACE_STATS.longestKm} KM Ultra
              </dd>
            </div>
            <div>
              <dt className="hud text-muted">Verified Distance</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-ink tabular">
                {RACE_STATS.totalKm} KM{" "}
                <span className="text-xs font-normal text-muted">({RACE_STATS.finished} races)</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Right column — Interactive 3D Lanyard Race-Bib ID Badge */}
        <div className="relative flex flex-col items-center lg:col-span-5">
          <div className="relative flex h-[520px] w-full items-center justify-center sm:h-[560px]">
            {/* Fallback renders on SSR and stays visible until WebGL canvas reports ready */}
            <div
              className={`transition-opacity duration-500 ${
                can3D && badgeReady ? "pointer-events-none absolute inset-0 opacity-0" : "opacity-100"
              }`}
            >
              <BadgeFallback flipped={flipped} onToggleFlip={toggleFlip} />
            </div>

            {can3D && (
              <div
                aria-hidden="true"
                className={`absolute inset-0 transition-opacity duration-500 ${
                  badgeReady ? "opacity-100" : "opacity-0"
                }`}
              >
                <LanyardCanvas
                  active={inView}
                  flipped={flipped}
                  onToggleFlip={toggleFlip}
                  onReady={() => setBadgeReady(true)}
                />
              </div>
            )}
          </div>

          {/* Interactive hint + keyboard-accessible flip trigger */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="hud text-muted">
              {can3D ? "Drag & fling lanyard · Click badge to flip" : "Hover to tilt · Click badge to flip"}
            </span>
            <button
              type="button"
              onClick={toggleFlip}
              className="hud border border-grid-strong bg-elevated/80 px-3 py-1.5 text-telemetry transition-colors hover:border-telemetry hover:bg-surface"
            >
              Flip Bib #{PROFILE.bib} ({flipped ? "Show Front" : "Show Dossier"}) ↻
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
