"use client";

import { motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import type { ToolTraceStep } from "@/app/api/ask/route";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  mode?: string;
  trace?: ToolTraceStep[];
}

const SUGGESTIONS = [
  "What projects has Aziz built?",
  "How does his AI Video Clipper work?",
  "Tell me about his Motion Video Skills",
  "Why hire Aziz for our team?",
  "Is he open to relocation & how to contact?",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    mode: "portfolio-ai",
    text: "Ask me anything about **Abdul Aziz** — his **AI Video Clipper**, **Motion Video Skills**, **Business Dashboard**, local LLM / MCP sandboxes, or hiring & relocation.",
    trace: [
      {
        tool: "get_candidate_profile",
        args: {},
        durationMs: 0.3,
        summary: "Loaded verified profile & project catalog",
      },
    ],
  },
];

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} className="italic text-secondary">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="bg-surface px-1 py-0.5 font-mono text-xs text-telemetry">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={idx}>{part}</Fragment>;
  });
}

export function AskAzizPanel() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll only the internal chat viewport (never the page window)
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ask(questionText: string) {
    const q = questionText.trim();
    if (!q || loading) return;

    const historyPayload = messages.slice(-6).map((m) => ({
      role: m.role,
      text: m.text,
    }));

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history: historyPayload }),
      });
      const data = (await res.json()) as {
        answer?: string;
        error?: string;
        mode?: string;
        trace?: ToolTraceStep[];
      };

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: data.answer ?? data.error ?? "Unable to answer right now.",
          mode: data.mode,
          trace: data.trace,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          text: "Network error reaching /api/ask. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Suggested prompt pills */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={loading}
            onClick={() => ask(s)}
            className="border border-grid-strong bg-surface/80 px-3 py-1.5 font-mono text-[11px] text-secondary transition-colors hover:border-telemetry hover:text-ink disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Live conversation transcript */}
      <div
        ref={chatContainerRef}
        data-lenis-prevent
        aria-live="polite"
        className="flex max-h-[360px] min-h-[260px] flex-col gap-3 overflow-y-auto border border-grid-strong bg-canvas/90 p-4"
      >
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex flex-col gap-1.5 ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            {m.role === "assistant" && m.trace && m.trace.length > 0 && (
              <details className="w-full max-w-2xl border border-grid bg-surface/70 px-3 py-1.5 font-mono text-[11px]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-telemetry">
                  <span>
                    ▸ Grounded via {m.trace.length} tool lookup{m.trace.length > 1 ? "s" : ""}
                  </span>
                  <span className="text-muted">
                    {m.mode === "gemini-2.5-flash" ? "Gemini 2.5 Flash" : "Aziz AI"}
                  </span>
                </summary>
                <div className="mt-2 space-y-1 border-t border-grid pt-2">
                  {m.trace.map((step, idx) => (
                    <div key={`${step.tool}-${idx}`} className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-ink">
                        <span className="text-signal">fn</span> {step.tool}(
                        <span className="text-muted">{JSON.stringify(step.args)}</span>)
                      </span>
                      <span className="text-telemetry">
                        {step.summary} · {step.durationMs}ms
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            )}

            <div
              className={`max-w-2xl whitespace-pre-line px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-signal font-medium text-white"
                  : "border border-grid-strong bg-elevated text-ink"
              }`}
            >
              {m.role === "user" ? m.text : renderFormattedText(m.text)}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 font-mono text-xs text-telemetry">
            <span className="size-2 rounded-full bg-telemetry animate-pulse-dot" />
            Searching Aziz&apos;s projects &amp; CV…
          </div>
        )}
      </div>

      {/* Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about AI Clipper, Motion Video Skills, Business Dashboard, relocation…"
          aria-label="Ask Abdul Aziz's AI assistant a question"
          className="h-11 flex-1 border border-grid-strong bg-canvas px-4 font-mono text-base text-ink placeholder:text-muted focus:border-telemetry focus:outline-none sm:text-xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="hud h-11 bg-signal px-6 font-bold text-white transition-[filter] hover:brightness-110 disabled:opacity-40"
        >
          {loading ? "Thinking…" : "Ask Aziz AI →"}
        </button>
      </form>
    </div>
  );
}
