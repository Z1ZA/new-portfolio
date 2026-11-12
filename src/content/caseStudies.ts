export interface CaseStudyMeta {
  slug: "ai-sandbox" | "widya-robotics" | "synrgy-ticketing";
  code: string;
  title: string;
  org: string;
  location: string;
  role: string;
  period: string;
  category: "AI Infrastructure" | "Production Web" | "Full-Stack Product";
  headlineMetric: string;
  summary: string;
  highlights: string[];
  stack: string[];
  architectureNodes: { label: string; sub: string }[];
  metrics: { label: string; value: string; note: string }[];
}

export const CASE_STUDIES: CaseStudyMeta[] = [
  {
    slug: "ai-sandbox",
    code: "SYS-01",
    title: "Self-Hosted Local LLM Server & Autonomous Agent Sandbox",
    org: "Freelance (Partnered with Canadian Co-Founder of Measurand / Orica)",
    location: "Bali, Indonesia",
    role: "AI Project Developer",
    period: "Oct 2024 – Sep 2026",
    category: "AI Infrastructure",
    headlineMetric: "Hermes Agent & OpenClaw · Local Qwen & Gemma",
    summary:
      "Designed and assembled custom local LLM server hardware to run zero-cloud-dependency autonomous agents with Hermes Agent and OpenClaw, benchmarking open-weight models for latency, tool-calling reliability, and privacy.",
    highlights: [
      "Partnered directly with a Canadian co-founder of Measurand / Orica to architect, build, and stress-test an experimental AI sandbox.",
      "Assembled custom workstation-grade local LLM server hardware tuned for sustained multi-hour agent loops and high VRAM bandwidth.",
      "Deployed self-hosted autonomous agents using Hermes Agent and OpenClaw with sandboxed tool execution.",
      "Benchmarked Qwen and Gemma model families across quantization tiers to balance tokens/sec against reasoning accuracy.",
    ],
    stack: ["Local LLM Server", "Hermes Agent", "OpenClaw", "Qwen", "Gemma", "Linux", "Benchmarking"],
    architectureNodes: [
      { label: "Task Orchestrator", sub: "Hermes Agent / OpenClaw" },
      { label: "Local Inference Engine", sub: "Quantized Qwen & Gemma" },
      { label: "Sandboxed Tool Runner", sub: "Filesystem, Shell & Web" },
      { label: "Telemetry & Eval Harness", sub: "Tok/s · Tool Accuracy" },
    ],
    metrics: [
      { label: "Cloud Dependency", value: "0%", note: "100% local weights & private execution" },
      { label: "Agent Frameworks", value: "2", note: "Hermes Agent & OpenClaw side-by-side" },
      { label: "Model Families", value: "Qwen + Gemma", note: "Benchmarked across quantization levels" },
    ],
  },
  {
    slug: "widya-robotics",
    code: "SYS-02",
    title: "Modular Robotics Web Platform & Headless CMS Pipeline",
    org: "Widya Robotics",
    location: "Yogyakarta, Indonesia",
    role: "Frontend Developer",
    period: "Feb 2024 – Jun 2024",
    category: "Production Web",
    headlineMetric: "Next.js · Strapi CMS · PostgreSQL · GitLab",
    summary:
      "Engineered responsive product and company web applications backed by Strapi Headless CMS and PostgreSQL, enabling non-technical teams to publish updates while keeping frontend performance crisp.",
    highlights: [
      "Built responsive, production-grade Next.js interfaces for industrial AI and robotics product lines.",
      "Integrated Strapi CMS and PostgreSQL content schemas so marketing and product teams could ship pages without developer bottlenecks.",
      "Collaborated closely with UI/UX designers to translate Figma design systems into reusable React components.",
      "Maintained clean merge request workflows, code reviews, and branch hygiene in GitLab.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Strapi CMS", "PostgreSQL", "Tailwind CSS", "GitLab"],
    architectureNodes: [
      { label: "UI/UX Design System", sub: "Figma Component Tokens" },
      { label: "Next.js Frontend", sub: "SSR / Static Hybrid" },
      { label: "Strapi Headless CMS", sub: "REST Content API" },
      { label: "PostgreSQL Database", sub: "Relational Content Store" },
    ],
    metrics: [
      { label: "Core Stack", value: "Next.js + Strapi", note: "Decoupled headless publishing" },
      { label: "Database", value: "PostgreSQL", note: "Structured relational schemas" },
      { label: "Workflow", value: "GitLab CI", note: "Cross-division UI/UX & engineering" },
    ],
  },
  {
    slug: "synrgy-ticketing",
    code: "SYS-03",
    title: "Full-Stack Airline Ticketing & Seat Reservation System",
    org: "SYNRGY Academy (BCA × Binar Academy)",
    location: "Indonesia",
    role: "Full-Stack Developer",
    period: "Aug 2023 – Mar 2024",
    category: "Full-Stack Product",
    headlineMetric: "Full-Stack JavaScript · Agile Scrum",
    summary:
      "Delivered an end-to-end flight search, seat selection, checkout, and e-ticket platform in a cross-functional Agile Scrum squad during the intensive BCA × Binar Academy bootcamp.",
    highlights: [
      "Worked in cross-division Scrum sprints (Frontend, Backend, QA, UI/UX) from product backlog to final showcase.",
      "Implemented flight search filtering, multi-step passenger booking flows, and responsive checkout screens.",
      "Connected RESTful booking endpoints, authentication, and real-time status notifications.",
      "Practiced automated testing, clean JavaScript architecture, and sprint retrospectives.",
    ],
    stack: ["JavaScript", "React", "Node.js", "REST API", "Agile Scrum", "Responsive UI"],
    architectureNodes: [
      { label: "Search & Filter UI", sub: "Routes, Dates & Fare Tiers" },
      { label: "Booking State Machine", sub: "Passenger & Seat Hold" },
      { label: "REST API Layer", sub: "Auth, Orders & Notifications" },
      { label: "E-Ticket Issuance", sub: "Verified Booking Record" },
    ],
    metrics: [
      { label: "Methodology", value: "Agile Scrum", note: "Cross-division squad delivery" },
      { label: "Scope", value: "End-to-End", note: "Search → Seat Hold → E-Ticket" },
      { label: "Program", value: "BCA × Binar", note: "7-month intensive engineering track" },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
