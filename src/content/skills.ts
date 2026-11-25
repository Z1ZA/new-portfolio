export interface GearGroup {
  code: string;
  title: string;
  note: string;
  items: string[];
}

export const GEAR: GearGroup[] = [
  {
    code: "AI",
    title: "AI Engineering",
    note: "Autonomous agents, local inference, and multimodal pipelines",
    items: [
      "Python",
      "LLM Agents & MCP (Hermes, OpenClaw)",
      "RAG & Prompt Engineering",
      "Local LLM Inference (Qwen, Gemma, GLM)",
      "Whisper & FFmpeg",
      "Motion Video Skills",
      "OpenAI & Gemini SDKs",
    ],
  },
  {
    code: "WEB",
    title: "Full-Stack Software",
    note: "End-to-end web products and scalable APIs",
    items: [
      "TypeScript",
      "Next.js & React",
      "Node.js & REST APIs",
      "PostgreSQL & SQL",
      "Tailwind CSS",
      "Strapi Headless CMS",
      "System Architecture",
    ],
  },
  {
    code: "OPS",
    title: "Infrastructure & Operations",
    note: "Shipping reliably from server to business floor",
    items: [
      "Docker & Linux",
      "Git & GitLab CI/CD",
      "Automated Testing & QA",
      "Agile Scrum",
      "Figma → Production",
      "Business & Sales Operations",
    ],
  },
];
