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
  /** Signature bib printed in the header (symmetrical binary + #01). */
  bib: "0101",
  /** Replace with your real photo at this path (see README). */
  photo: "/images/profile.jpg",
  cvPdfPath: "/cv/Abdul_Aziz_CV.pdf",
  summary:
    "Self-hosted LLM servers, autonomous agents (Hermes, OpenClaw), and full-stack Next.js systems — shipped from Bali with ultra-trail discipline.",
  bioEngineer:
    "I build things that run: self-hosted LLM servers, autonomous agents with Hermes Agent and OpenClaw, and full-stack web apps with Next.js, Strapi and PostgreSQL. I like the whole path, from wiring the hardware to benchmarking the model to polishing the UI.",
  bioAthlete:
    "I have finished mountain trail and road marathon races. Ultras teach pacing, problem-solving when things go wrong, and finishing what you start. Those habits shape how I run operations and how I ship code.",
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const CHECKPOINTS = [
  { id: "start", code: "START", label: "Start Line", km: 0 },
  { id: "systems", code: "CP01", label: "Flagship Systems", km: 15 },
  { id: "route", code: "CP02", label: "Route Log", km: 30 },
  { id: "gear", code: "CP03", label: "Gear Check", km: 45 },
  { id: "races", code: "CP04", label: "Race Ledger", km: 55 },
  { id: "finish", code: "FINISH", label: "Finish Line", km: 60 },
] as const;

export type CheckpointId = (typeof CHECKPOINTS)[number]["id"];
