"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/hooks";

interface ClipItem {
  id: string;
  title: string;
  duration: string;
  range: string;
  score: number;
  hookReason: string;
  words: string[];
}

const CLIPS: ClipItem[] = [
  {
    id: "local-ai",
    title: "Why Local AI Beats Cloud Cost",
    duration: "00:38",
    range: "04:12 → 04:50",
    score: 96,
    hookReason: "Strong contrarian opener",
    words: ["Running", "autonomous", "agents", "on", "local", "GPU", "hardware", "cuts", "API", "cost", "to", "zero."],
  },
  {
    id: "store-ops",
    title: "Scaling Daily Store Operations",
    duration: "00:31",
    range: "19:04 → 19:35",
    score: 93,
    hookReason: "Actionable ops framework",
    words: ["Unifying", "walk-in", "POS", "and", "online", "orders", "eliminates", "daily", "fulfillment", "bottlenecks."],
  },
  {
    id: "agent-loops",
    title: "Automated Agent Tool Loops",
    duration: "00:27",
    range: "34:40 → 35:07",
    score: 89,
    hookReason: "Clear engineering breakdown",
    words: ["Hermes", "and", "OpenClaw", "connect", "to", "real", "tools", "via", "typed", "MCP", "schemas."],
  },
];

type AspectRatio = "9:16" | "1:1" | "16:9";
type CaptionStyle = "karaoke" | "clean" | "off";

export function AiClipperPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, "80px");
  const [clipIdx, setClipIdx] = useState(0);
  const [aspect, setAspect] = useState<AspectRatio>("9:16");
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>("karaoke");
  const [playing, setPlaying] = useState(true);
  const [wordStep, setWordStep] = useState(0);

  const clip = CLIPS[clipIdx];

  useEffect(() => {
    setWordStep(0);
  }, [clipIdx]);

  useEffect(() => {
    if (!playing || !inView) return;
    const id = window.setInterval(() => {
      setWordStep((w) => (w + 1) % clip.words.length);
    }, 360);
    return () => window.clearInterval(id);
  }, [playing, inView, clip.words.length]);

  const frameBoxClass =
    aspect === "9:16"
      ? "w-[190px] sm:w-[215px] aspect-[9/16]"
      : aspect === "1:1"
        ? "w-[260px] sm:w-[290px] aspect-square"
        : "w-full max-w-[380px] aspect-video";

  const progressPct = Math.round(((wordStep + 1) / clip.words.length) * 100);

  return (
    <div ref={containerRef} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left: Source Video + Detected Viral Clips + Studio Controls */}
        <div className="flex flex-col justify-between gap-4 border border-grid-strong bg-surface/60 p-4 lg:col-span-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-grid pb-3">
              <div className="hud text-muted">SOURCE // FOUNDER &amp; AI PODCAST EP. 14</div>
              <span className="hud bg-telemetry/15 px-2 py-0.5 text-telemetry">
                3 VIRAL CLIPS DETECTED
              </span>
            </div>

            {/* Selectable AI-Detected Clips */}
            <div className="mt-3 space-y-2">
              {CLIPS.map((c, idx) => {
                const active = idx === clipIdx;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setClipIdx(idx)}
                    className={`flex w-full items-center justify-between gap-3 border p-3 text-left transition-colors ${
                      active
                        ? "border-signal bg-elevated"
                        : "border-grid bg-canvas/70 hover:border-grid-strong"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-bold ${active ? "text-signal" : "text-muted"}`}>
                          0{idx + 1}
                        </span>
                        <span className="truncate text-sm font-bold text-ink">{c.title}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
                        <span>{c.range}</span>
                        <span>·</span>
                        <span>{c.duration}</span>
                        <span>·</span>
                        <span className="text-secondary">{c.hookReason}</span>
                      </div>
                    </div>
                    <div className="shrink-0 border border-telemetry/40 bg-telemetry/10 px-2.5 py-1 text-center font-mono">
                      <div className="text-[9px] text-muted uppercase">Score</div>
                      <div className="text-sm font-black text-telemetry tabular">{c.score}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Aspect Ratio & Caption Controls */}
          <div className="space-y-3 border-t border-grid pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="hud text-muted">Aspect Reframe</span>
              <div className="flex gap-1.5">
                {(["9:16", "1:1", "16:9"] as const).map((ar) => (
                  <button
                    key={ar}
                    type="button"
                    onClick={() => setAspect(ar)}
                    className={`hud px-2.5 py-1 transition-colors ${
                      aspect === ar
                        ? "bg-signal text-white"
                        : "border border-grid-strong bg-canvas text-secondary hover:text-ink"
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="hud text-muted">Caption Style</span>
              <div className="flex gap-1.5">
                {(
                  [
                    { id: "karaoke", label: "Karaoke Pop" },
                    { id: "clean", label: "Clean Sub" },
                    { id: "off", label: "Off" },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setCaptionStyle(st.id)}
                    className={`hud px-2.5 py-1 transition-colors ${
                      captionStyle === st.id
                        ? "border border-telemetry bg-telemetry/15 text-telemetry"
                        : "border border-grid bg-canvas text-muted hover:text-ink"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Morphing Video Preview Frame with Speaker Lock & Kinetic Captions */}
        <div className="flex flex-col items-center justify-between border border-grid-strong bg-canvas/90 p-4 lg:col-span-6">
          <div className="hud flex w-full items-center justify-between text-muted">
            <span>SMART REFRAME PREVIEW ({aspect})</span>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="border border-grid-strong bg-surface px-2.5 py-1 text-telemetry hover:border-telemetry"
            >
              {playing ? "❚❚ Pause" : "▶ Play"}
            </button>
          </div>

          <div className="my-4 flex min-h-[340px] w-full items-center justify-center">
            <div
              data-theme="dark"
              className={`relative flex flex-col justify-between overflow-hidden border-2 border-grid-strong bg-gradient-to-b from-[#171b22] via-[#101318] to-[#0a0b0d] p-3 shadow-lg transition-[width,max-width] duration-300 ${frameBoxClass}`}
            >
              {/* Speaker Tracking Reticle */}
              <div className="flex items-center justify-between font-mono text-[9px]">
                <span className="bg-black/70 px-1.5 py-0.5 text-telemetry">● SPEAKER LOCK 98%</span>
                <span className="bg-signal px-1.5 py-0.5 font-bold text-white">{clip.duration}</span>
              </div>

              {/* Stylized Studio Speaker + Live Voice Equalizer */}
              <div className="relative mx-auto flex flex-col items-center justify-center py-2">
                <div className="relative grid size-20 place-items-center border border-dashed border-telemetry/70 p-2">
                  {/* Face / shoulders vector */}
                  <div className="size-7 rounded-full bg-[#f2f0eb]/90" />
                  <div className="mt-1 h-6 w-12 rounded-t-xl bg-[#ff5a36]/90" />
                  <span className="absolute -top-1 -left-1 size-2 border-t-2 border-l-2 border-telemetry" />
                  <span className="absolute -top-1 -right-1 size-2 border-t-2 border-r-2 border-telemetry" />
                  <span className="absolute -bottom-1 -left-1 size-2 border-b-2 border-l-2 border-telemetry" />
                  <span className="absolute -right-1 -bottom-1 size-2 border-r-2 border-b-2 border-telemetry" />
                </div>

                {/* Animated Audio Waveform (GPU scaleY only) */}
                <div className="mt-3 flex h-5 items-end gap-1" aria-hidden="true">
                  {[0.4, 0.9, 0.6, 1, 0.5, 0.85, 0.45, 0.75, 0.55].map((amp, i) => (
                    <motion.span
                      key={i}
                      animate={
                        playing && inView
                          ? { scaleY: [amp * 0.4, amp, amp * 0.35] }
                          : { scaleY: amp * 0.45 }
                      }
                      transition={{
                        duration: 0.65,
                        repeat: Infinity,
                        delay: i * 0.07,
                        ease: "easeInOut",
                      }}
                      className="h-full w-1 origin-bottom bg-telemetry"
                    />
                  ))}
                </div>
              </div>

              {/* Word-Synced Captions */}
              <div className="space-y-2">
                {captionStyle !== "off" && (
                  <div
                    className={`px-2 py-1.5 text-center leading-snug ${
                      captionStyle === "karaoke"
                        ? "bg-black/75 font-sans text-xs font-extrabold uppercase tracking-tight"
                        : "bg-black/65 font-mono text-[11px]"
                    }`}
                  >
                    {clip.words
                      .slice(Math.max(0, wordStep - 2), Math.max(0, wordStep - 2) + 5)
                      .map((word, idx) => {
                        const actualIdx = Math.max(0, wordStep - 2) + idx;
                        const activeWord = actualIdx === wordStep;
                        return (
                          <span
                            key={`${word}-${actualIdx}`}
                            className={`mx-0.5 inline-block transition-transform duration-150 ${
                              captionStyle === "karaoke" && activeWord
                                ? "scale-110 bg-signal px-1 text-white"
                                : "text-white/90"
                            }`}
                          >
                            {word}
                          </span>
                        );
                      })}
                  </div>
                )}

                {/* Scrubber bar */}
                <div className="h-1 w-full bg-white/15">
                  <div
                    className="h-full bg-telemetry transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4-stage pipeline strip */}
          <div className="grid w-full grid-cols-2 gap-2 border-t border-grid pt-3 font-mono text-[10px] sm:grid-cols-4">
            {["01 Whisper STT", "02 LLM Hook Score", "03 Auto-Reframe", "04 MP4 Export"].map((s) => (
              <div key={s} className="bg-surface px-2 py-1.5 text-center text-secondary">
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
