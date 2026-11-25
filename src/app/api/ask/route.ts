import { NextResponse } from "next/server";
import { CASE_STUDIES } from "@/content/caseStudies";
import { PROFILE } from "@/content/profile";
import { RACES } from "@/content/races";
import { RECORDS } from "@/content/records";
import { answerPortfolioQuestion, type BrainTraceStep, type ChatTurn } from "@/lib/azizAiBrain";

export type ToolTraceStep = BrainTraceStep;

// Lightweight per-IP sliding window rate limiter (25 requests / 60s)
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 25;
const buckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const prev = (buckets.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (prev.length >= RATE_MAX) {
    buckets.set(ip, prev);
    return true;
  }
  prev.push(now);
  buckets.set(ip, prev);
  return false;
}

async function synthesizeWithGemini(
  question: string,
  history: ChatTurn[],
  apiKey: string,
): Promise<string | null> {
  try {
    const context = {
      profile: {
        name: PROFILE.degreeTitle,
        headline: PROFILE.roleHeadline,
        location: PROFILE.location,
        relocation: PROFILE.relocation,
        email: PROFILE.email,
        phone: PROFILE.phone,
        github: PROFILE.github,
        linkedin: PROFILE.linkedin,
        gpa: `${PROFILE.gpa}/4.00 (${PROFILE.university})`,
      },
      projects: CASE_STUDIES.map((p) => ({
        title: p.title,
        category: p.category,
        tagline: p.tagline,
        summary: p.summary,
        stack: p.stack,
      })),
      experience: RECORDS.map((r) => ({
        role: r.role,
        org: r.org,
        period: r.period,
        details: r.details,
      })),
      races: RACES.filter((r) => r.status === "completed").map((r) => ({
        name: r.name,
        distanceKm: r.distanceKm,
        provider: r.provider,
      })),
    };

    const recentHistory = history
      .slice(-6)
      .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.text}`)
      .join("\n");

    const prompt = [
      "You are the portfolio AI assistant for Abdul Aziz (Software & AI Engineer, Bali, Indonesia).",
      "Respond naturally, professionally, and directly in <= 140 words using ONLY verified facts from the portfolio context below.",
      "Reply in the same language as the visitor (English or Bahasa Indonesia). Never repeat a previous response verbatim.",
      "",
      recentHistory ? `Recent conversation:\n${recentHistory}\n` : "",
      `Visitor question: ${question}`,
      "",
      "Portfolio facts:",
      JSON.stringify(context),
    ].join("\n");

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.35, maxOutputTokens: 320 },
        }),
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!res.ok) return null;
    const json = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit reached (25 requests/min). Try again in a moment." },
      { status: 429 },
    );
  }

  let body: { question?: string; history?: ChatTurn[] };
  try {
    body = (await request.json()) as { question?: string; history?: ChatTurn[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const question = String(body.question ?? "").trim().slice(0, 400);
  if (!question) {
    return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  }

  const history: ChatTurn[] = Array.isArray(body.history)
    ? body.history
        .slice(-6)
        .map((m) => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          text: String(m.text ?? "").slice(0, 800),
        }))
    : [];

  const brainResult = answerPortfolioQuestion(question, history);

  let mode: "gemini-2.5-flash" | "portfolio-ai" = "portfolio-ai";
  let answer = brainResult.answer;

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    const llmAnswer = await synthesizeWithGemini(question, history, geminiKey);
    if (llmAnswer) {
      answer = llmAnswer;
      mode = "gemini-2.5-flash";
    }
  }

  return NextResponse.json({
    answer,
    mode,
    trace: brainResult.trace,
  });
}
