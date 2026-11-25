"use client";

import { motion } from "motion/react";
import { useState } from "react";

type SceneId = "launch" | "data" | "bumper";

interface MotionScene {
  id: SceneId;
  label: string;
  prompt: string;
  durationSec: string;
  kicker: string;
  headline: string;
  accentWord: string;
  subline: string;
}

const SCENES: MotionScene[] = [
  {
    id: "launch",
    label: "Launch Promo",
    prompt: "Create a 60fps product launch reveal with kinetic type & live telemetry badge.",
    durationSec: "00:05:00",
    kicker: "RELEASE // V2.4 ENGINE",
    headline: "Ship autonomous workflows",
    accentWord: "faster",
    subline: "Deterministic motion templates authored directly by AI agents.",
  },
  {
    id: "data",
    label: "Data Story",
    prompt: "Animate quarterly growth bars and highlight +42% online channel momentum.",
    durationSec: "00:06:15",
    kicker: "Q4 REPORT // CHANNEL MIX",
    headline: "Online orders climbed",
    accentWord: "+42%",
    subline: "Real-time analytics compiled into crisp 1080p60 MP4 motion graphics.",
  },
  {
    id: "bumper",
    label: "Brand Bumper",
    prompt: "Render a bold editorial opening sting in Swiss grid typography.",
    durationSec: "00:03:24",
    kicker: "STUDIO // IDENTITY STING",
    headline: "Engineered with",
    accentWord: "precision",
    subline: "Reusable Motion Skill Pack · Spring Physics · Zero Pixel Warping.",
  },
];

const TRACKS = [
  { name: "TRK 01 // Typography", blocks: [{ start: 6, width: 58, color: "var(--accent-signal)", label: "Kinetic Headline" }] },
  { name: "TRK 02 // Spring Camera", blocks: [{ start: 0, width: 78, color: "var(--accent-telemetry)", label: "EaseOutExpo Zoom" }] },
  { name: "TRK 03 // Data Layer", blocks: [{ start: 22, width: 64, color: "var(--accent-blueprint)", label: "Chart & Callouts" }] },
  { name: "TRK 04 // Audio Cue", blocks: [{ start: 4, width: 88, color: "var(--text-muted)", label: "Whoosh + Sub Hit" }] },
];

export function MotionSkillsPreview() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  const scene = SCENES[sceneIdx];

  function triggerScene(idx: number) {
    setSceneIdx(idx);
    setReplayKey((k) => k + 1);
  }

  return (
    <div className="space-y-4">
      {/* Top Preset Switcher + Replay */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-grid-strong bg-surface/60 p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {SCENES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => triggerScene(idx)}
              className={`hud px-3 py-1.5 transition-colors ${
                idx === sceneIdx
                  ? "bg-signal text-white"
                  : "border border-grid-strong bg-canvas text-secondary hover:text-ink"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="hud hidden text-telemetry sm:inline">60 FPS · 1080P · AGENT SKILL</span>
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="hud border border-telemetry/60 bg-telemetry/10 px-3 py-1.5 font-semibold text-telemetry transition-colors hover:bg-telemetry/20"
          >
            Replay Scene ↻
          </button>
        </div>
      </div>

      {/* Prompt Banner */}
      <div className="flex items-center gap-2.5 border border-grid bg-canvas/80 px-4 py-2.5 font-mono text-xs">
        <span className="shrink-0 bg-signal/15 px-2 py-0.5 text-[10px] font-bold text-signal">
          AGENT PROMPT
        </span>
        <span className="truncate text-secondary">&ldquo;{scene.prompt}&rdquo;</span>
      </div>

      {/* 16:9 Live Animated Motion Canvas */}
      <div
        data-theme="dark"
        className="relative aspect-[16/8] min-h-[230px] w-full overflow-hidden border border-grid-strong bg-[#0a0b0d] p-5 sm:p-8"
      >
        {/* Subtle motion grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-blueprint-grid opacity-70" />

        {/* HUD Frame Corners */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[10px] text-telemetry">
          <span>REC ● CANVAS 1920×1080</span>
          <span className="tabular">{scene.durationSec} · 60 FPS</span>
        </div>

        <div
          key={`${scene.id}-${replayKey}`}
          className="relative z-10 flex h-[calc(100%-28px)] flex-col justify-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-[11px] tracking-[0.18em] text-telemetry uppercase"
          >
            {scene.kicker}
          </motion.div>

          <motion.h4
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 max-w-2xl text-2xl leading-tight font-black tracking-tight text-white sm:text-4xl"
          >
            {scene.headline}{" "}
            <motion.span
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block font-serif font-normal italic text-signal"
            >
              {scene.accentWord}.
            </motion.span>
          </motion.h4>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.42 }}
            className="mt-2 max-w-lg text-xs text-[#b4b7bd] sm:text-sm"
          >
            {scene.subline}
          </motion.p>

          {/* Scene-specific animated visual layer */}
          {scene.id === "data" && (
            <div className="mt-4 flex max-w-md items-end gap-2.5">
              {[38, 52, 64, 79, 96].map((h, i) => (
                <motion.div
                  key={h}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.round(h * 0.46)}px` }}
                  transition={{ duration: 0.5, delay: 0.45 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex-1 ${i === 4 ? "bg-signal" : "bg-telemetry/75"}`}
                />
              ))}
            </div>
          )}

          {scene.id === "launch" && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 h-1 max-w-sm origin-left bg-gradient-to-r from-signal via-telemetry to-blueprint"
            />
          )}

          {scene.id === "bumper" && (
            <div className="mt-5 flex items-center gap-2">
              {["TYPOGRAPHY", "SPRING", "MP4 EXPORT"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 + i * 0.1 }}
                  className="border border-white/20 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Synchronized 4-Track Timeline Editor */}
      <div className="relative overflow-hidden border border-grid-strong bg-surface/60 p-4">
        <div className="hud mb-3 flex items-center justify-between text-muted">
          <span>PROGRAMMATIC TIMELINE GRAPH</span>
          <span className="text-telemetry">JSON SCENE SCHEMA → MP4</span>
        </div>

        <div className="relative space-y-2">
          {/* Playhead */}
          <motion.div
            key={`head-${scene.id}-${replayKey}`}
            initial={{ left: "24%" }}
            animate={{ left: "98%" }}
            transition={{ duration: 2.4, ease: "linear" }}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 z-10 w-0.5 bg-signal"
          />

          {TRACKS.map((trk, idx) => (
            <div key={trk.name} className="grid grid-cols-12 items-center gap-2 font-mono text-[11px]">
              <div className="col-span-4 truncate text-secondary sm:col-span-3">{trk.name}</div>
              <div className="relative col-span-8 h-6 bg-canvas sm:col-span-9">
                {trk.blocks.map((blk) => (
                  <motion.div
                    key={`${blk.label}-${replayKey}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      left: `${blk.start}%`,
                      width: `${blk.width}%`,
                      backgroundColor: blk.color,
                    }}
                    className="absolute top-1 flex h-4 origin-left items-center px-2 text-[10px] font-bold text-canvas"
                  >
                    <span className="truncate">{blk.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
