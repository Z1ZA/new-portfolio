export interface EnduranceRace {
  order: string;
  name: string;
  category: string;
  distanceKm: number;
  status: "completed" | "upcoming";
  /** ISO date of the race (YYYY-MM-DD). Upcoming races with a date get a countdown. */
  date?: string;
  bib?: string;
  provider: string;
  url: string | null;
}

export const RACES: EnduranceRace[] = [
  {
    order: "01",
    name: "BTR Ultra 2025",
    category: "Mountain Trail",
    distanceKm: 15,
    status: "completed",
    provider: "ScoreNow",
    url: "https://results.scorenow.co.id/myresults.aspx?CId=19723&RId=249&EId=4&AId=373156",
  },
  {
    order: "02",
    name: "BTS Ultra 2025 — Bromo Tengger Semeru",
    category: "Ultra-Trail Mountain",
    distanceKm: 30,
    status: "completed",
    bib: "2694",
    provider: "FoneSport",
    url: "https://fonesport.id/bts100-2025/result-search?keyword=2694",
  },
  {
    order: "03",
    name: "Borobudur Marathon",
    category: "Road Marathon",
    distanceKm: 42,
    status: "completed",
    provider: "ScoreNow",
    url: "https://results.scorenow.co.id/myresults.aspx?CId=19723&RId=293&EId=1&AId=518057",
  },
  {
    order: "04",
    name: "BTR Ultra 2026",
    category: "Ultra-Trail Endurance",
    distanceKm: 60,
    status: "completed",
    provider: "ScoreNow",
    url: "https://results.scorenow.co.id/myresults.aspx?CId=19723&RId=321&EId=2&AId=552761",
  },
  {
    order: "05",
    name: "Bali Coast Trail 2026",
    category: "Coastal Trail",
    distanceKm: 30,
    status: "upcoming",
    // date: "2026-12-06", // ← add the real race date to enable the countdown
    provider: "Scheduled",
    url: null,
  },
];

export const RACE_STATS = (() => {
  const done = RACES.filter((r) => r.status === "completed");
  return {
    finished: done.length,
    longestKm: Math.max(...done.map((r) => r.distanceKm)),
    totalKm: done.reduce((sum, r) => sum + r.distanceKm, 0),
  };
})();
