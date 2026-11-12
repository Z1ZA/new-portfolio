export const PROFILE = {
  name: "Abdul Aziz",
  firstName: "Abdul",
  lastName: "Aziz",
  monogram: "AZ",
  degreeTitle: "Abdul Aziz, S.Kom",
  role: "Software & AI Engineer",
  roleHeadline: "Software & AI Engineer | Business Operations | Endurance Athlete",
  location: "Bali, Indonesia",
  relocation: "Open to Relocation & Sponsorship",
  coordinates: "-8.65, 115.21",
  phone: "+62 812-2972-1631",
  whatsappUrl: "https://wa.me/6281229721631",
  email: "sayaabdaziz1@gmail.com",
  linkedin: "https://linkedin.com/in/abdaziz1",
  github: "https://github.com/Z1ZA",
  githubHandle: "Z1ZA",
  gpa: "3.88",
  university: "Muhammadiyah University of Surakarta",
  /** Race bib printed on the hero badge (real BTS Ultra 2025 bib). */
  bib: "2694",
  /** Replace with your real photo at this path (see README). */
  photo: "/images/profile.jpg",
  cvPdfPath: "/cv/Abdul_Aziz_CV.pdf",
  summary:
    "Software Engineer and Informatics graduate (GPA 3.88/4.00) building local LLM infrastructure, agentic AI workflows, and production web systems — with a background in business operations and F&B digital marketing in Bali. I train for ultra-trail races, and I bring the same persistence to shipping software.",
  bioEngineer:
    "I build things that run: self-hosted LLM servers, autonomous agents with Hermes Agent and OpenClaw, and full-stack web apps with Next.js, Strapi and PostgreSQL. I like the whole path, from wiring the hardware to benchmarking the model to polishing the UI.",
  bioAthlete:
    "I have finished trail races from 15 KM up to a 60 KM ultra. Ultras teach pacing, problem-solving when things go wrong, and finishing what you start. Those habits shape how I run operations and how I ship code.",
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const CHECKPOINTS = [
  { id: "start", code: "START", label: "Start Line", km: 0 },
  { id: "profile", code: "CP01", label: "Athlete Profile", km: 10 },
  { id: "systems", code: "CP02", label: "Flagship Systems", km: 21 },
  { id: "route", code: "CP03", label: "Route Log", km: 32 },
  { id: "gear", code: "CP04", label: "Gear Check", km: 42 },
  { id: "races", code: "CP05", label: "Race Ledger", km: 51 },
  { id: "finish", code: "FINISH", label: "Finish Line", km: 60 },
] as const;

export type CheckpointId = (typeof CHECKPOINTS)[number]["id"];
