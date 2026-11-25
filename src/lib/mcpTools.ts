import benchmarksData from "@/content/benchmarks.json";
import { CASE_STUDIES } from "@/content/caseStudies";
import { PROFILE } from "@/content/profile";
import { RACES, RACE_STATS } from "@/content/races";
import { RECORDS } from "@/content/records";

export interface BenchmarkRun {
  id: string;
  family: "Qwen" | "Gemma" | "GLM" | string;
  model: string;
  paramsB: number;
  quant: "Q4_K_M" | "Q8_0" | string;
  vramGb: number;
  tokensPerSec: number;
  ttftMs: number;
  toolCallPassPct: number;
  contextK: number;
  bestWorkload: string;
  notes: string;
}

export interface BenchmarkDataset {
  meta: {
    datasetMode: "reference_baseline" | "live_rig" | string;
    hardware: string;
    runtime: string;
    note: string;
    updatedAt: string;
  };
  runs: BenchmarkRun[];
}

export const BENCHMARKS = benchmarksData as BenchmarkDataset;

export type McpToolName =
  | "get_candidate_profile"
  | "list_projects"
  | "search_experience"
  | "query_llm_benchmarks"
  | "get_endurance_races";

export interface McpToolSpec {
  name: McpToolName;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
  };
  sampleArgs: Record<string, unknown>;
}

export const MCP_TOOLS: McpToolSpec[] = [
  {
    name: "get_candidate_profile",
    description: "Returns Abdul Aziz's engineering profile, location, relocation status, and contact links.",
    inputSchema: { type: "object", properties: {} },
    sampleArgs: {},
  },
  {
    name: "list_projects",
    description:
      "Lists Abdul Aziz's flagship AI and software projects (AI Video Clipper, Motion Video Skills, Business Dashboard, Local AI Sandbox), optionally filtered by keyword.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Optional keyword to filter projects (e.g. 'clipper', 'motion', 'dashboard', 'sandbox')." },
      },
    },
    sampleArgs: { query: "" },
  },
  {
    name: "search_experience",
    description:
      "Filters Abdul Aziz's work history, education, and leadership records by keyword (e.g. 'MCP', 'Next.js', 'Hermes', 'Operations').",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keyword, stack, or organization to match." },
      },
    },
    sampleArgs: { query: "MCP" },
  },
  {
    name: "query_llm_benchmarks",
    description:
      "Returns local LLM inference telemetry (tokens/sec, TTFT, VRAM, tool-call pass rate) for Qwen, Gemma, and GLM.",
    inputSchema: {
      type: "object",
      properties: {
        family: {
          type: "string",
          enum: ["All", "Qwen", "Gemma", "GLM"],
          description: "Optional model family filter.",
        },
      },
    },
    sampleArgs: { family: "Qwen" },
  },
  {
    name: "get_endurance_races",
    description: "Lists verified marathon and ultra-trail finishes with official timing certificate URLs.",
    inputSchema: {
      type: "object",
      properties: {
        minKm: { type: "number", description: "Minimum race distance in km (e.g. 30)." },
      },
    },
    sampleArgs: { minKm: 30 },
  },
];

export function executeMcpTool(name: string, args: Record<string, unknown> = {}): unknown {
  switch (name) {
    case "get_candidate_profile":
      return {
        name: PROFILE.name,
        degree: `${PROFILE.degreeTitle} — ${PROFILE.university} (GPA ${PROFILE.gpa}/4.00)`,
        headline: PROFILE.roleHeadline,
        location: PROFILE.location,
        relocation: PROFILE.relocation,
        email: PROFILE.email,
        github: PROFILE.github,
        linkedin: PROFILE.linkedin,
        cvPdfPath: PROFILE.cvPdfPath,
        summary: PROFILE.summary,
      };

    case "list_projects": {
      const q = String(args.query ?? "").trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      const projects =
        tokens.length === 0
          ? CASE_STUDIES
          : CASE_STUDIES.filter((cs) => {
              const hay = [cs.title, cs.category, cs.tagline, cs.summary, cs.org, ...cs.stack]
                .join(" ")
                .toLowerCase();
              return tokens.some((tok) => hay.includes(tok));
            });
      return {
        query: q || "*",
        matchedCount: projects.length,
        projects,
      };
    }

    case "search_experience": {
      const q = String(args.query ?? "").trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      const records =
        tokens.length === 0
          ? RECORDS
          : RECORDS.filter((r) => {
              const hay = [r.type, r.org, r.role, r.location, r.subNote ?? "", ...(r.tags ?? []), ...r.details]
                .join(" ")
                .toLowerCase();
              return tokens.some((tok) => hay.includes(tok));
            });
      return {
        query: q || "*",
        matchedCount: records.length,
        records: records.map((r) => ({
          type: r.type,
          org: r.org,
          role: r.role,
          period: r.period,
          location: r.location,
          tags: r.tags ?? [],
          details: r.details,
        })),
      };
    }

    case "query_llm_benchmarks": {
      const fam = String(args.family ?? "All").trim().toLowerCase();
      const runs =
        !fam || fam === "all"
          ? BENCHMARKS.runs
          : BENCHMARKS.runs.filter((r) => r.family.toLowerCase() === fam);
      return {
        meta: BENCHMARKS.meta,
        matchedCount: runs.length,
        runs,
      };
    }

    case "get_endurance_races": {
      const minKm = Number(args.minKm ?? 0) || 0;
      const races = RACES.filter((r) => r.distanceKm >= minKm);
      return {
        minKm,
        stats: RACE_STATS,
        races,
      };
    }

    default:
      throw new Error(`Unknown MCP tool: ${name}`);
  }
}
