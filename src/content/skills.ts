export interface GearGroup {
  code: string;
  title: string;
  note: string;
  items: string[];
}

export const GEAR: GearGroup[] = [
  {
    code: "AI",
    title: "AI & LLM Systems",
    note: "Hydration pack — what keeps the long runs going",
    items: [
      "Local LLM servers (hardware build)",
      "Qwen & Gemma benchmarking",
      "Hermes Agent",
      "OpenClaw",
      "Agentic workflows",
      "AI sandbox prototyping",
    ],
  },
  {
    code: "WEB",
    title: "Full-Stack Web",
    note: "Trail shoes — used on every single run",
    items: [
      "Next.js & React",
      "TypeScript / JavaScript",
      "Tailwind CSS",
      "Strapi CMS",
      "PostgreSQL",
      "REST APIs & PWAs",
    ],
  },
  {
    code: "OPS",
    title: "Delivery & Operations",
    note: "Headlamp — for when the route gets dark",
    items: [
      "Agile Scrum",
      "Git, GitLab & CI/CD",
      "Figma-to-code with UI/UX teams",
      "Operations management",
      "Digital branding & online sales",
      "Web accessibility & testing",
    ],
  },
];
