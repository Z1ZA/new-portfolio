export interface ExperienceRecord {
  id: string;
  type: "Work" | "Education" | "Organization";
  org: string;
  location: string;
  role: string;
  period: string;
  /** Year used to place the waypoint on the route profile. */
  year: number;
  /** Relative "elevation" (0–100) of the waypoint — bigger role, higher point. */
  elevation: number;
  subNote?: string;
  tags?: string[];
  details: string[];
}

/** Ordered newest → oldest. */
export const RECORDS: ExperienceRecord[] = [
  {
    id: "freelance-ai",
    type: "Work",
    org: "Freelance",
    location: "Bali, Indonesia",
    role: "AI Project Developer",
    period: "Oct 2024 – Sep 2026",
    year: 2025.5,
    elevation: 96,
    tags: ["Local LLM Server", "Hermes Agent", "OpenClaw", "Qwen", "Gemma"],
    details: [
      "Partnered with a Canadian co-founder of Measurand / Orica to design, build, and test an AI sandbox prototype.",
      "Assembled custom local LLM server hardware, deploying self-hosted autonomous agents via Hermes Agent and OpenClaw.",
      "Benchmarked local LLMs (Qwen, Gemma) to optimize inference speed and accuracy.",
    ],
  },
  {
    id: "linda-dessert",
    type: "Work",
    org: "Linda Dessert",
    location: "Bali, Indonesia",
    role: "Operations Manager",
    subNote: "Family business",
    period: "Oct 2024 – Jan 2026",
    year: 2024.9,
    elevation: 74,
    tags: ["Operations", "Digital Branding", "Online Sales"],
    details: [
      "Supervised daily production and store workflows while directing digital branding and online sales across Bali.",
    ],
  },
  {
    id: "ums",
    type: "Education",
    org: "Muhammadiyah University of Surakarta",
    location: "Surakarta, Indonesia",
    role: "B.Sc. Informatics — GPA 3.88/4.00",
    period: "Jul 2020 – Sep 2024",
    year: 2024.6,
    elevation: 66,
    details: ["Graduated with a 3.88/4.00 GPA in Informatics."],
  },
  {
    id: "widya",
    type: "Work",
    org: "Widya Robotics",
    location: "Yogyakarta, Indonesia",
    role: "Frontend Developer",
    period: "Feb 2024 – Jun 2024",
    year: 2024.2,
    elevation: 80,
    tags: ["Next.js", "Strapi CMS", "PostgreSQL", "GitLab"],
    details: [
      "Engineered responsive front-end features and individual web projects using Next.js, Strapi CMS, and PostgreSQL, collaborating with the UI/UX division and managing version control via GitLab.",
    ],
  },
  {
    id: "synrgy",
    type: "Work",
    org: "SYNRGY Academy",
    location: "Indonesia",
    role: "Full-Stack Developer",
    subNote: "Bootcamp Synrgy BCA × Binar Academy",
    period: "Aug 2023 – Mar 2024",
    year: 2023.6,
    elevation: 62,
    tags: ["JavaScript", "Full-Stack", "Agile Scrum"],
    details: [
      "Implemented Agile Scrum in cross-division teamwork using the JavaScript tech stack to build a full-stack ticketing application for the final project.",
    ],
  },
  {
    id: "tupai",
    type: "Work",
    org: "Tupai Tech",
    location: "Surakarta, Indonesia",
    role: "Frontend Developer",
    period: "Feb 2023 – Apr 2023",
    year: 2023.1,
    elevation: 46,
    tags: ["Tailwind CSS", "Figma-to-Code"],
    details: ["Converted Figma UI designs into responsive production landing pages using Tailwind CSS."],
  },
  {
    id: "dicoding",
    type: "Education",
    org: "Dicoding Indonesia",
    location: "Indonesia",
    role: "Independent Study — Full-Stack Web",
    period: "Aug 2022 – Dec 2022",
    year: 2022.7,
    elevation: 38,
    tags: ["REST API", "PWA", "Accessibility", "Testing", "CI/CD"],
    details: [
      "Completed intensive full-stack web development study covering RESTful APIs, mobile-first design, web accessibility, clean JavaScript, PWAs, automated testing, web performance, and CI/CD.",
    ],
  },
  {
    id: "fosti",
    type: "Organization",
    org: "FOSTI UMS",
    location: "Surakarta, Indonesia",
    role: "Head of Research & Development",
    subNote: "Open-source community: apps, Linux distributions, and campus tech events.",
    period: "Jan 2022 – Dec 2022",
    year: 2022.2,
    elevation: 30,
    details: [
      "Set the annual work program, supervised division activities, and ensured the success of each program.",
    ],
  },
];
