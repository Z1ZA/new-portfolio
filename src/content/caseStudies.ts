export type CaseStudySlug =
  | "ai-video-clipper"
  | "motion-video-skills"
  | "company-business-dashboard"
  | "local-ai-agent-sandbox";

export interface CaseStudyMeta {
  slug: CaseStudySlug;
  code: string;
  title: string;
  org: string;
  location: string;
  role: string;
  period: string;
  category: string;
  tagline: string;
  summary: string;
  stack: string[];
  metrics: { label: string; value: string; note: string }[];
  architectureNodes: { label: string; sub: string }[];
}

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: "ai-video-clipper",
    code: "01",
    title: "AI Video Clipper Web App",
    org: "Independent AI Product Build",
    location: "Bali, Indonesia",
    role: "Full-Stack & AI Engineer",
    period: "2025 – 2026",
    category: "AI Web App · Multimodal",
    tagline: "Turns long-form videos & podcasts into viral vertical shorts automatically",
    summary:
      "End-to-end web application that ingests long-form talks or podcasts, scores high-retention hooks with LLMs, auto-reframes active speakers to 9:16, and burns synchronized kinetic captions.",
    stack: ["Next.js", "TypeScript", "FFmpeg", "Whisper STT", "LLM Hook Scoring", "Tailwind CSS"],
    metrics: [
      { label: "Format Output", value: "9:16 / 1:1 / 16:9", note: "Auto-reframed speaker crop" },
      { label: "Hook Detection", value: "LLM Scored", note: "Ranks top viral segments" },
      { label: "Captions", value: "Word-Sync", note: "Animated karaoke subtitles" },
    ],
    architectureNodes: [
      { label: "Ingest & STT", sub: "Word-level timestamps" },
      { label: "Hook Ranker", sub: "LLM virality scoring" },
      { label: "Smart Reframe", sub: "9:16 speaker tracking" },
      { label: "Render Engine", sub: "Burned captions & MP4" },
    ],
  },
  {
    slug: "motion-video-skills",
    code: "02",
    title: "Programmatic Motion Video Skills",
    org: "AI Agent Skills & Creative Engineering",
    location: "Bali, Indonesia",
    role: "AI Automation & Motion Developer",
    period: "2025 – 2026",
    category: "Agent Skills · Motion Video",
    tagline: "Reusable AI agent skills that turn briefs into 60fps motion graphics",
    summary:
      "Engineered modular motion-video skills allowing autonomous AI agents to compose multi-track timelines, spring typography, data reveals, and branded MP4 exports from plain-text prompts.",
    stack: ["Agent Skills", "TypeScript", "React Motion", "Timeline JSON", "FFmpeg", "MCP"],
    metrics: [
      { label: "Frame Rate", value: "60 FPS", note: "Deterministic spring physics" },
      { label: "Workflow", value: "Prompt → MP4", note: "Agent-driven scene graph" },
      { label: "Reusability", value: "Modular", note: "Plug-and-play skill packs" },
    ],
    architectureNodes: [
      { label: "Brief / Prompt", sub: "Structured scene intent" },
      { label: "Motion Skill", sub: "Layout & timing rules" },
      { label: "Timeline Graph", sub: "Multi-track keyframes" },
      { label: "Video Export", sub: "1080p60 MP4 output" },
    ],
  },
  {
    slug: "company-business-dashboard",
    code: "03",
    title: "Company Business & Operations Dashboard",
    org: "Operations & Full-Stack Engineering (Linda Dessert / Enterprise)",
    location: "Bali, Indonesia",
    role: "Full-Stack Developer & Operations Manager",
    period: "Oct 2024 – 2026",
    category: "Full-Stack · Business Ops",
    tagline: "Unified cockpit for revenue, multi-channel orders, and daily production",
    summary:
      "Designed from real experience supervising daily production and online sales in Bali: brings store revenue, channel mix, fulfillment SLAs, and batch queues into one clear executive view.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Analytics UI", "Tailwind CSS", "REST API"],
    metrics: [
      { label: "Visibility", value: "Real-Time", note: "Sales + kitchen queue unified" },
      { label: "Channels", value: "Store + Online", note: "Consolidated Bali orders" },
      { label: "Decision Speed", value: "Instant", note: "Zero spreadsheet lag" },
    ],
    architectureNodes: [
      { label: "POS & Online", sub: "Order intake streams" },
      { label: "PostgreSQL", sub: "Normalized ops ledger" },
      { label: "Production Queue", sub: "Live batch tracking" },
      { label: "Executive UI", sub: "KPIs & channel trends" },
    ],
  },
  {
    slug: "local-ai-agent-sandbox",
    code: "04",
    title: "Self-Hosted AI Agent & MCP Sandbox",
    org: "Freelance (with Co-Founder of Measurand / Orica)",
    location: "Bali, Indonesia",
    role: "AI Project Developer",
    period: "Oct 2024 – Oct 2026",
    category: "Local LLM · Agents & MCP",
    tagline: "Zero-cloud autonomous agents running on custom local GPU hardware",
    summary:
      "Partnered with a Canadian co-founder of Measurand (Orica) to build a custom local AI server, benchmark open-weight LLMs (Qwen, Gemma, GLM), and run Hermes & OpenClaw agents with custom MCP tools.",
    stack: ["Local LLM Server", "MCP", "Hermes", "OpenClaw", "Qwen · Gemma · GLM", "Linux"],
    metrics: [
      { label: "Data Privacy", value: "100% Local", note: "Zero external API leakage" },
      { label: "Models Tested", value: "Qwen · Gemma · GLM", note: "Tuned for tool reliability" },
      { label: "Agent Runtimes", value: "Hermes + OpenClaw", note: "Custom skills & MCP" },
    ],
    architectureNodes: [
      { label: "Agent Loop", sub: "Hermes & OpenClaw" },
      { label: "Custom Skills", sub: "MCP tool integrations" },
      { label: "Local Inference", sub: "Qwen, Gemma & GLM" },
      { label: "Custom Rig", sub: "Self-hosted GPU server" },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
