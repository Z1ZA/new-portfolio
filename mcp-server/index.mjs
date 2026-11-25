#!/usr/bin/env node
/**
 * abdul-aziz-mcp — Zero-dependency stdio Model Context Protocol (MCP) Server.
 * Speaks JSON-RPC 2.0 (protocolVersion 2024-11-05) over stdin/stdout so any
 * MCP client (Claude Desktop, Cursor, Hermes Agent, OpenClaw) can query
 * Abdul Aziz's engineering background, local LLM benchmarks, and race telemetry.
 */

import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BENCHMARKS = JSON.parse(
  readFileSync(join(__dirname, "../src/content/benchmarks.json"), "utf8"),
);

const PROFILE = {
  name: "Abdul Aziz",
  degree: "B.Sc. Informatics (S.Kom), GPA 3.88/4.00 — Muhammadiyah University of Surakarta",
  role: "Software & AI Engineer | Business Operations | Endurance Athlete",
  location: "Bali, Indonesia (Open to Relocation & Sponsorship)",
  email: "sayaabdaziz1@gmail.com",
  github: "https://github.com/Z1ZA",
  linkedin: "https://linkedin.com/in/abdaziz1",
  focus: [
    "Self-hosted Local LLM Servers (Qwen, Gemma, GLM)",
    "Autonomous AI Agents & Custom Skills (Hermes, OpenClaw, MCP)",
    "Full-Stack Web Engineering (Next.js, TypeScript, Strapi, PostgreSQL)",
    "Business Operations & Digital Sales",
  ],
};

const EXPERIENCE = [
  {
    org: "Freelance (Measurand / Orica partner)",
    role: "AI Project Developer",
    period: "Oct 2024 – Oct 2026",
    location: "Bali, Indonesia",
    tags: ["Local LLM", "MCP", "Hermes", "OpenClaw", "Qwen", "Gemma", "GLM"],
    highlights: [
      "Partnered with a Canadian co-founder of Measurand (Orica) to architect, build, and test an AI sandbox prototype.",
      "Engineered custom skills, MCP integrations, and automated workflows for AI agents (Hermes, OpenClaw).",
      "Built custom local AI server hardware and benchmarked open-source LLMs (Qwen, Gemma, GLM) for local inference.",
    ],
  },
  {
    org: "Linda Dessert",
    role: "Operations Manager",
    period: "Oct 2024 – Jan 2026",
    location: "Bali, Indonesia",
    tags: ["Operations", "Digital Branding", "Online Sales"],
    highlights: [
      "Supervised daily production and store workflows and directed digital branding and online sales across Bali.",
    ],
  },
  {
    org: "Widya Robotics",
    role: "Frontend Developer",
    period: "Feb 2024 – Jun 2024",
    location: "Yogyakarta, Indonesia",
    tags: ["Next.js", "Strapi", "PostgreSQL", "GitLab"],
    highlights: [
      "Built and maintained responsive web applications with Next.js, Strapi, PostgreSQL, and GitLab alongside UI/UX.",
    ],
  },
  {
    org: "SYNRGY Academy (BCA × Binar)",
    role: "Full-Stack Developer",
    period: "Aug 2023 – Mar 2024",
    location: "Indonesia",
    tags: ["JavaScript", "Full-Stack", "Agile Scrum"],
    highlights: [
      "Built a full-stack application using modern JavaScript in a cross-functional Agile Scrum squad.",
    ],
  },
  {
    org: "Tupai Tech",
    role: "Frontend Developer",
    period: "Feb 2023 – Apr 2023",
    location: "Surakarta, Indonesia",
    tags: ["Tailwind CSS", "Figma"],
    highlights: ["Converted Figma UI designs into production-ready interfaces with Tailwind CSS."],
  },
  {
    org: "FOSTI UMS",
    role: "Head of Research & Development",
    period: "Jan 2022 – Dec 2022",
    location: "Surakarta, Indonesia",
    tags: ["Open Source", "Linux", "Leadership"],
    highlights: [
      "Led annual R&D programs promoting open-source software, Linux distributions, and university tech events.",
    ],
  },
];

const RACES = [
  { name: "BTR Ultra 2025", distanceKm: 15, status: "completed", provider: "ScoreNow", url: "https://results.scorenow.co.id/myresults.aspx?CId=19723&RId=249&EId=4&AId=373156" },
  { name: "BTS Ultra 2025 (Bromo Tengger Semeru)", distanceKm: 30, status: "completed", bib: "2694", provider: "FoneSport", url: "https://fonesport.id/bts100-2025/result-search?keyword=2694" },
  { name: "Borobudur Marathon", distanceKm: 42, status: "completed", provider: "ScoreNow", url: "https://results.scorenow.co.id/myresults.aspx?CId=19723&RId=293&EId=1&AId=518057" },
  { name: "BTR Ultra 2026", distanceKm: 60, status: "completed", provider: "ScoreNow", url: "https://results.scorenow.co.id/myresults.aspx?CId=19723&RId=321&EId=2&AId=552761" },
  { name: "Bali Coast Trail 2026", distanceKm: 30, status: "upcoming", provider: "Scheduled", url: null },
];

const TOOLS = [
  {
    name: "get_candidate_profile",
    description: "Returns Abdul Aziz's engineering profile, location, relocation status, and contact links.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "search_experience",
    description: "Filters Abdul Aziz's work history and leadership records by keyword (e.g. 'MCP', 'Next.js', 'Hermes', 'Operations').",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keyword or technology to match." },
      },
    },
  },
  {
    name: "query_llm_benchmarks",
    description: "Returns local LLM inference benchmarks (tokens/sec, TTFT, VRAM, tool-call pass rate) for Qwen, Gemma, and GLM.",
    inputSchema: {
      type: "object",
      properties: {
        family: { type: "string", enum: ["All", "Qwen", "Gemma", "GLM"], description: "Optional model family filter." },
      },
    },
  },
  {
    name: "get_endurance_races",
    description: "Lists verified marathon and ultra-trail finishes with official timing certificate URLs.",
    inputSchema: {
      type: "object",
      properties: {
        minKm: { type: "number", description: "Optional minimum race distance in kilometers." },
      },
    },
  },
];

function callTool(name, args = {}) {
  switch (name) {
    case "get_candidate_profile":
      return PROFILE;
    case "search_experience": {
      const q = String(args.query || "").trim().toLowerCase();
      const matches = !q
        ? EXPERIENCE
        : EXPERIENCE.filter((r) =>
            [r.org, r.role, ...r.tags, ...r.highlights].join(" ").toLowerCase().includes(q),
          );
      return { query: q || "*", count: matches.length, records: matches };
    }
    case "query_llm_benchmarks": {
      const fam = String(args.family || "All").toLowerCase();
      const runs =
        fam === "all" || !fam
          ? BENCHMARKS.runs
          : BENCHMARKS.runs.filter((r) => r.family.toLowerCase() === fam);
      return { meta: BENCHMARKS.meta, count: runs.length, runs };
    }
    case "get_endurance_races": {
      const min = Number(args.minKm) || 0;
      const races = RACES.filter((r) => r.distanceKm >= min);
      return { minKm: min, count: races.length, races };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function send(msg) {
  process.stdout.write(`${JSON.stringify(msg)}\n`);
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let req;
  try {
    req = JSON.parse(trimmed);
  } catch {
    return;
  }

  const { id, method, params } = req;
  if (method === "notifications/initialized") return;

  try {
    if (method === "initialize") {
      return send({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "abdul-aziz-mcp", version: "1.0.0" },
        },
      });
    }
    if (method === "tools/list") {
      return send({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
    }
    if (method === "tools/call") {
      const data = callTool(params?.name, params?.arguments);
      return send({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        },
      });
    }
    send({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method not found: ${method}` },
    });
  } catch (err) {
    send({
      jsonrpc: "2.0",
      id,
      error: { code: -32602, message: err instanceof Error ? err.message : String(err) },
    });
  }
});
