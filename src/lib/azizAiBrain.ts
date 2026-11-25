import { CASE_STUDIES } from "@/content/caseStudies";
import { PROFILE } from "@/content/profile";
import { RACES, RACE_STATS } from "@/content/races";
import { RECORDS } from "@/content/records";
import { GEAR } from "@/content/skills";
import { executeMcpTool, type McpToolName } from "./mcpTools";

export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

export interface BrainTraceStep {
  tool: string;
  args: Record<string, unknown>;
  durationMs: number;
  summary: string;
}

export interface BrainResult {
  answer: string;
  trace: BrainTraceStep[];
  matchedTopics: string[];
}

type IntentId =
  | "greeting"
  | "ai_clipper"
  | "motion_skills"
  | "business_dashboard"
  | "ai_sandbox"
  | "projects_overview"
  | "web_cms"
  | "skills_stack"
  | "experience_career"
  | "education"
  | "why_hire"
  | "relocation_location"
  | "contact"
  | "endurance_races"
  | "followup";

const INDONESIAN_RE =
  /\b(siapa|apa|bagaimana|gimana|dimana|di mana|proyek\w*|pengalaman|kontak|kerja\w*|bisa|buat|halo|hai|selamat|tentang|keahlian|kenapa|mengapa|rekrut|lokasi|pindah|lari|maraton|lulus|kuliah|lainnya|lanjut)\b/i;

const INTENT_RULES: { id: IntentId; pattern: RegExp }[] = [
  {
    id: "greeting",
    pattern:
      /^(hi|hello|hey|yo|hola|pagi|siang|sore|malam|halo|hai|assalamualaikum|good morning|good afternoon|good evening)[\s!?.]*$/i,
  },
  {
    id: "ai_clipper",
    pattern:
      /\b(clipper|clips?|podcast\w*|shorts?|reels|tiktok|subtitles?|captions?|karaoke|whisper|reframe|9:16|vertical video)\b/i,
  },
  {
    id: "motion_skills",
    pattern:
      /\b(motion|motion graphics|video skills?|animations?|kinetic|60\s?fps|timeline|render video|promo video)\b/i,
  },
  {
    id: "business_dashboard",
    pattern:
      /\b(dashboards?|linda|dessert\w*|f&b|ops|operations?|revenue|sales|pos|queue\w*|analytics|kpi\w*|store\w*|orders?)\b/i,
  },
  {
    id: "ai_sandbox",
    pattern:
      /\b(sandbox\w*|hermes|openclaw|orica|measurand|local llm\w*|local ai|gpu|servers?|qwen|gemma|glm|benchmarks?|mcp|self-hosted|offline)\b/i,
  },
  {
    id: "projects_overview",
    pattern: /\b(projects?|built|build|portfolio|showcase|work|proyek\w*|karya|aplikasi|sistem|buat apa)\b/i,
  },
  {
    id: "web_cms",
    pattern:
      /\b(widya|strapi|cms|postgres\w*|synrgy|bca|binar|tupai|figma|dicoding|gitlab|scrum|ticketing|frontend|full-?stack|web apps?)\b/i,
  },
  {
    id: "skills_stack",
    pattern: /\b(skills?|tech stack|stack|technologies|tools?|languages?|frameworks?|keahlian|teknologi|kemampuan)\b/i,
  },
  {
    id: "why_hire",
    pattern:
      /\b(why (?:should (?:we|i) )?hire\w*|why (?:work with|pick|choose) (?:you|him|aziz)|why aziz|strengths?|stand out|unique|value prop\w*|kenapa|mengapa|kelebihan|unggulan|rekrut)\b/i,
  },
  {
    id: "relocation_location",
    pattern:
      /\b(relocat\w*|sponsor\w*|visa|bali|location|remote|hybrid|where (?:is|are)|timezone|move|global|dimana|di mana|lokasi|pindah|domisili)\b/i,
  },
  {
    id: "contact",
    pattern:
      /\b(contact\w*|email\w*|mail|whatsapp|wa|phone|call|linkedin|github|reach|cv|resume|hubungi|kontak|nomor)\b/i,
  },
  {
    id: "education",
    pattern:
      /\b(educat\w*|degree|gpa|ipk|universit\w*|ums|muhammadiyah|informatics|fosti|linux|open source|kuliah|lulus|pendidikan|jurusan)\b/i,
  },
  {
    id: "experience_career",
    pattern:
      /\b(experience\w*|career|history|background|timeline|roles?|pengalaman|karir|riwayat|pekerjaan)\b/i,
  },
  {
    id: "endurance_races",
    pattern:
      /\b(races?|running|marathon\w*|ultra\w*|trail\w*|btr|bts|bromo|borobudur|endurance|sports?|lari|maraton|lomba|bib)\b/i,
  },
  {
    id: "followup",
    pattern:
      /\b(tell me more|more details|what else|another|next one|anything else|elaborate|lainnya|lanjut|jelaskan lagi|selain itu)\b/i,
  },
];

const STOPWORDS = new Set([
  "the", "is", "at", "which", "on", "a", "an", "and", "or", "for", "to", "of", "in", "it",
  "with", "about", "what", "who", "how", "does", "do", "did", "can", "you", "your", "his",
  "he", "him", "aziz", "abdul", "me", "tell", "show", "give", "are", "be", "has", "have",
  "should", "we", "they", "open", "into", "from", "this", "that", "there", "more",
  "yang", "dan", "di", "ke", "dari", "itu", "ini", "untuk", "dengan", "tentang", "apa", "siapa",
]);

function runTrackedTool(
  tool: McpToolName,
  args: Record<string, unknown>,
  trace: BrainTraceStep[],
): unknown {
  const t0 = performance.now();
  const output = executeMcpTool(tool, args);
  const durationMs = Number(Math.max(0.2, performance.now() - t0).toFixed(2));
  const outObj = output as Record<string, unknown>;

  let summary = "Executed tool";
  if (tool === "get_candidate_profile") summary = `Loaded profile (${PROFILE.name})`;
  if (tool === "list_projects") summary = `Found ${outObj.matchedCount ?? 0} project case studies`;
  if (tool === "search_experience") summary = `Matched ${outObj.matchedCount ?? 0} experience records`;
  if (tool === "query_llm_benchmarks") summary = `Loaded ${outObj.matchedCount ?? 0} model entries`;
  if (tool === "get_endurance_races") summary = `Loaded ${RACE_STATS.finished} verified race finishes`;

  trace.push({ tool, args, durationMs, summary });
  return output;
}

function renderTopic(intent: IntentId, idLang: boolean, trace: BrainTraceStep[]): string {
  switch (intent) {
    case "greeting": {
      runTrackedTool("get_candidate_profile", {}, trace);
      return idLang
        ? `Halo! Saya asisten AI portofolio **Abdul Aziz** (Software & AI Engineer di Bali). Anda bisa bertanya tentang:\n• **AI Video Clipper** & **Motion Video Skills**\n• **Business Dashboard** & sandbox **Local AI / MCP**\n• Pengalaman kerja, kesiapan relokasi, atau kontak langsung.`
        : `Hey there! I'm **Abdul Aziz's** portfolio AI assistant. You can ask me about:\n• His **AI Video Clipper** app, **Motion Video Skills**, or **Business Dashboard**\n• Self-hosted **Local AI / MCP agent sandboxes** (Hermes, OpenClaw, Qwen, Gemma, GLM)\n• Full-stack experience, relocation readiness, or verified ultra-trail races.`;
    }

    case "ai_clipper": {
      runTrackedTool("list_projects", { query: "clipper" }, trace);
      const cs = CASE_STUDIES.find((c) => c.slug === "ai-video-clipper")!;
      return idLang
        ? `**${cs.title}** adalah aplikasi web multimodal yang mengubah video panjang/podcast menjadi klip vertikal siap unggah:\n• **Whisper STT**: menghasilkan timestamp per kata agar potongan tepat di jeda kalimat.\n• **LLM Hook Scoring**: menilai bagian pembuka dan insight paling kuat secara otomatis.\n• **Smart 9:16 Reframe & Captions**: memfokuskan pembicara dan merender subtitle karaoke via FFmpeg.\nAnda bisa mencoba simulasi interaktifnya di tab **01 AI Video Clipper** di sebelah kiri.`
        : `**${cs.title}** turns long-form talks and podcasts into ready-to-post vertical shorts:\n• **Word-level Whisper STT** aligns cuts to natural sentence boundaries.\n• **LLM Hook Scoring** ranks high-retention openers and concise insights.\n• **9:16 Auto-Reframe + Burned Captions** tracks the active speaker and renders karaoke subtitles via FFmpeg.\nTry switching clips, aspect ratios, and captions live in the **01 AI Video Clipper** tab.`;
    }

    case "motion_skills": {
      runTrackedTool("list_projects", { query: "motion" }, trace);
      const cs = CASE_STUDIES.find((c) => c.slug === "motion-video-skills")!;
      return idLang
        ? `**${cs.title}** adalah kumpulan *agent skills* modular yang mengubah brief teks menjadi video motion graphics **60 FPS** secara terprogram:\n• Menggunakan skema **Timeline JSON** + spring physics agar tipografi dan grafik tetap tajam tanpa distorsi.\n• Memisahkan track tipografi, kamera, data KPI, dan audio untuk render MP4 otomatis.\nLihat animasi langsung & 4-track timeline-nya di tab **02 Motion Video Skills**.`
        : `**${cs.title}** gives autonomous AI agents a deterministic grammar for **60 FPS** motion graphics instead of hallucinated pixels:\n• Translates plain-English briefs into structured **Timeline JSON** with spring physics and safe typography.\n• Composes separate tracks for headlines, camera motion, animated KPIs, and audio cues into crisp MP4 exports.\nSwitch presets and hit **Replay Scene** in the **02 Motion Video Skills** tab to watch it run.`;
    }

    case "business_dashboard": {
      runTrackedTool("list_projects", { query: "dashboard" }, trace);
      runTrackedTool("search_experience", { query: "Linda" }, trace);
      const cs = CASE_STUDIES.find((c) => c.slug === "company-business-dashboard")!;
      return idLang
        ? `**${cs.title}** lahir dari pengalaman nyata Aziz memimpin operasional harian dan penjualan online di Bali (**Linda Dessert**, Oct 2024 – Jan 2026):\n• Menyatukan metrik omzet toko & order online dalam satu cockpit **Next.js + PostgreSQL**.\n• Dilengkapi papan antrean produksi (**Queued → In Progress → Dispatched**) untuk menjaga SLA pemenuhan order.\nCoba filter rentang waktu dan klik antrean statusnya di tab **03 Business Dashboard**.`
        : `**${cs.title}** bridges full-stack engineering with Aziz's real-world experience supervising daily store production and online sales in Bali (**Linda Dessert**):\n• Consolidates walk-in POS and online delivery revenue, order volume, and SLA metrics into one **Next.js + PostgreSQL** cockpit.\n• Includes an actionable **Queued → In Progress → Dispatched** production board to clear floor bottlenecks in real time.\nTest the filters and clickable queue in the **03 Business Dashboard** tab.`;
    }

    case "ai_sandbox": {
      runTrackedTool("list_projects", { query: "sandbox" }, trace);
      runTrackedTool("search_experience", { query: "Measurand" }, trace);
      return idLang
        ? `Pada **Oct 2024 – Oct 2026**, Aziz bermitra dengan co-founder **Measurand (Orica)** asal Kanada untuk membangun prototipe **AI Sandbox lokal**:\n• Merakit hardware server AI lokal agar agen berjalan tanpa mengirim data perusahaan ke cloud.\n• Mengembangkan *custom skills*, integrasi **MCP**, dan workflow otomatis untuk **Hermes** & **OpenClaw**.\n• Melakukan benchmark & optimasi LLM open-source (**Qwen, Gemma, GLM**) untuk inferensi lokal.`
        : `From **Oct 2024 – Oct 2026**, Aziz partnered with a Canadian co-founder of **Measurand (Orica)** to architect and test a **self-hosted AI Sandbox**:\n• Built custom local GPU server hardware so autonomous agents run with **zero cloud API data leakage**.\n• Engineered custom skills, **MCP integrations**, and automated workflows for **Hermes** and **OpenClaw**.\n• Benchmarked open-weight models (**Qwen, Gemma, GLM**) for local inference speed and reliable tool calling.`;
    }

    case "projects_overview": {
      runTrackedTool("list_projects", { query: "" }, trace);
      const list = CASE_STUDIES.map((c) => `• **${c.code} · ${c.title}** — ${c.tagline}`).join("\n");
      return idLang
        ? `Berikut empat proyek utama yang ditampilkan di portofolio ini:\n${list}\nDi luar itu, Aziz juga membangun aplikasi web **Next.js + Strapi** di **Widya Robotics** serta aplikasi full-stack di **SYNRGY Academy**.`
        : `Here are the four flagship builds highlighted in this portfolio:\n${list}\nBeyond these, Aziz engineered Next.js + Strapi web apps at **Widya Robotics** and an Agile Scrum full-stack booking platform at **SYNRGY Academy**.`;
    }

    case "web_cms": {
      runTrackedTool("search_experience", { query: "Widya SYNRGY Tupai Dicoding" }, trace);
      return idLang
        ? `Pengalaman rekayasa web produksi Aziz mencakup:\n• **Widya Robotics (Feb–Jun 2024)**: membangun fitur frontend produk perusahaan dengan **Next.js, Strapi CMS, PostgreSQL, dan GitLab** bersama tim UI/UX.\n• **SYNRGY Academy BCA × Binar (Aug 2023–Mar 2024)**: membangun aplikasi full-stack JavaScript dalam tim lintas divisi menggunakan **Agile Scrum**.\n• **Tupai Tech & Dicoding**: konversi Figma → Tailwind CSS, RESTful API, PWA, aksesibilitas web, automated testing, dan CI/CD.`
        : `Aziz's production web engineering spans:\n• **Widya Robotics (Feb–Jun 2024)**: built responsive product features with **Next.js, Strapi CMS, PostgreSQL, and GitLab** alongside the UI/UX team.\n• **SYNRGY Academy BCA × Binar (Aug 2023–Mar 2024)**: shipped a full-stack JavaScript web app in a cross-functional **Agile Scrum** squad.\n• **Tupai Tech & Dicoding**: Figma-to-Tailwind UI engineering, REST APIs, PWAs, accessibility, automated testing, and CI/CD.`;
    }

    case "skills_stack": {
      runTrackedTool("get_candidate_profile", {}, trace);
      const lines = GEAR.map((g) => `• **${g.title}**: ${g.items.join(", ")}`).join("\n");
      return idLang
        ? `Stack teknis inti yang digunakan Aziz di produksi:\n${lines}`
        : `Aziz's core technical kit across AI, full-stack web, and operations:\n${lines}`;
    }

    case "why_hire": {
      runTrackedTool("get_candidate_profile", {}, trace);
      runTrackedTool("list_projects", { query: "" }, trace);
      return idLang
        ? `Tiga alasan utama mengapa Aziz bernilai tinggi bagi tim engineering maupun operasional:\n1. **End-to-End Ownership**: mulai dari merakit server LLM lokal dan menulis integrasi MCP hingga membangun UI Next.js yang rapi.\n2. **Pola Pikir Operasional & Bisnis**: berpengalaman memimpin produksi harian dan penjualan online di Bali, sehingga solusi yang dibangun selalu selaras dengan dampak bisnis.\n3. **Daya Tahan Terbukti**: lulusan Informatika (IPK 3.88/4.00) sekaligus finisher maraton & ultra-trail — terbiasa mengeksekusi proyek jangka panjang hingga tuntas.`
        : `Three reasons teams value working with Abdul Aziz:\n1. **Full-Stack to Bare-Metal AI**: comfortable assembling custom local LLM hardware, writing MCP agent tools, and shipping polished **Next.js + TypeScript** products.\n2. **Business & Operations Context**: having managed daily F&B production and online sales in Bali, he builds software around real operational bottlenecks.\n3. **High Execution Grit**: **3.88/4.00 Informatics** graduate and **marathon & ultra-trail finisher** — calm under pressure and reliable through the finish line.`;
    }

    case "relocation_location": {
      runTrackedTool("get_candidate_profile", {}, trace);
      return idLang
        ? `Aziz saat ini berbasis di **Bali, Indonesia** (\`UTC+8\`) dan **terbuka untuk relokasi global maupun sponsor visa** (serta posisi remote/hybrid) di sektor teknologi, AI, operasional bisnis, maupun industri olahraga.`
        : `Aziz is currently based in **Bali, Indonesia** (\`UTC+8\`) and is **actively open to global relocation and visa sponsorship**—as well as remote or hybrid roles across tech, AI engineering, business operations, and sports/active-lifestyle companies.`;
    }

    case "contact": {
      runTrackedTool("get_candidate_profile", {}, trace);
      return idLang
        ? `Anda dapat menghubungi **Abdul Aziz** langsung melalui:\n• **Email**: ${PROFILE.email}\n• **WhatsApp**: ${PROFILE.phone}\n• **LinkedIn**: linkedin.com/in/abdaziz1\n• **GitHub**: github.com/${PROFILE.githubHandle}\nCV 1 halaman (PDF) juga dapat diunduh lewat tombol **Download CV** di bagian atas (Hero).`
        : `You can reach **Abdul Aziz** directly here:\n• **Email**: ${PROFILE.email}\n• **WhatsApp**: ${PROFILE.phone}\n• **LinkedIn**: linkedin.com/in/abdaziz1\n• **GitHub**: github.com/${PROFILE.githubHandle}\nYou can also download his 1-page ATS CV via the **Download CV** button in the Hero section.`;
    }

    case "education": {
      runTrackedTool("search_experience", { query: "Muhammadiyah FOSTI" }, trace);
      return idLang
        ? `• **Sarjana Informatika (S.Kom)** — ${PROFILE.university} (Jul 2020 – Sep 2024), **IPK ${PROFILE.gpa}/4.00**.\n• **Head of R&D @ FOSTI UMS (2022)**: memimpin program riset tahunan, mempromosikan perangkat lunak *open-source*, distribusi Linux, serta mengoordinasikan acara teknologi kampus.`
        : `• **Bachelor of Informatics (S.Kom)** — ${PROFILE.university} (Jul 2020 – Sep 2024), graduating with a **${PROFILE.gpa}/4.00 GPA**.\n• **Head of R&D at FOSTI UMS (2022)**: directed the annual open-source work program, Linux distribution initiatives, and university tech events.`;
    }

    case "experience_career": {
      runTrackedTool("search_experience", { query: "" }, trace);
      const top = RECORDS.slice(0, 5)
        .map((r) => `• **${r.role}** @ ${r.org} (${r.period})`)
        .join("\n");
      return idLang
        ? `Ringkasan perjalanan karir Aziz (terbaru ke sebelumnya):\n${top}\nSeluruh riwayat beserta elevasi perannya dapat Anda klik di bagian **CP02 · Route Log** di bawah.`
        : `Here is Aziz's recent career trajectory:\n${top}\nYou can click through every milestone on the interactive elevation chart in **CP02 · Route Log** below.`;
    }

    case "endurance_races": {
      runTrackedTool("get_endurance_races", { minKm: 0 }, trace);
      const completed = RACES.filter((r) => r.status === "completed")
        .map((r) => `• **${r.name}** — ${r.distanceKm} KM (${r.provider})`)
        .join("\n");
      return idLang
        ? `Aziz adalah pelari maraton & ultra-trail dengan **${RACE_STATS.finished} finis resmi terverifikasi** (total **${RACE_STATS.totalKm} KM**, jarak terjauh **${RACE_STATS.longestKm} KM**):\n${completed}\nSetiap sertifikat waktu resminya tertaut langsung di bagian **CP04 · Race Ledger**.`
        : `Aziz has completed **${RACE_STATS.finished} official verified races** totaling **${RACE_STATS.totalKm} KM** (peaking at **${RACE_STATS.longestKm} KM**):\n${completed}\nOfficial ScoreNow & FoneSport timing certificates are linked in **CP04 · Race Ledger**.`;
    }

    case "followup":
      return "";
  }
}

function handleFollowUp(history: ChatTurn[], idLang: boolean, trace: BrainTraceStep[]): string {
  const prevAssistant = history
    .filter((m) => m.role === "assistant")
    .map((m) => m.text)
    .join("\n");

  const candidates: { intent: IntentId; marker: string }[] = [
    { intent: "ai_clipper", marker: "AI Video Clipper Web App" },
    { intent: "motion_skills", marker: "Programmatic Motion Video Skills" },
    { intent: "business_dashboard", marker: "Company Business & Operations Dashboard" },
    { intent: "ai_sandbox", marker: "Measurand (Orica)" },
    { intent: "web_cms", marker: "Widya Robotics" },
    { intent: "why_hire", marker: "Three reasons teams value" },
    { intent: "endurance_races", marker: "official verified races" },
  ];

  for (const c of candidates) {
    if (!prevAssistant.includes(c.marker)) {
      return renderTopic(c.intent, idLang, trace);
    }
  }
  return renderTopic("contact", idLang, trace);
}

function tokenFallback(question: string, idLang: boolean, trace: BrainTraceStep[]): string | null {
  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  if (words.length === 0) return null;

  const docs: { intent: IntentId; keywords: string[] }[] = [
    { intent: "ai_clipper", keywords: ["clipper", "shorts", "whisper", "captions", "speaker", "reframe", "ffmpeg", "podcast"] },
    { intent: "motion_skills", keywords: ["motion", "60fps", "kinetic", "typography", "timeline", "agent", "render", "promo"] },
    { intent: "business_dashboard", keywords: ["dashboard", "revenue", "orders", "analytics", "queue", "linda", "dessert", "store"] },
    { intent: "ai_sandbox", keywords: ["local", "llm", "server", "gpu", "hermes", "openclaw", "mcp", "qwen", "gemma", "glm", "measurand", "orica"] },
    { intent: "web_cms", keywords: ["widya", "robotics", "strapi", "postgresql", "gitlab", "synrgy", "ticketing", "agile", "scrum", "tupai", "tailwind", "figma", "dicoding"] },
    { intent: "education", keywords: ["education", "university", "muhammadiyah", "surakarta", "informatics", "gpa", "3.88", "fosti", "linux"] },
    { intent: "endurance_races", keywords: ["marathon", "trail", "ultra", "60km", "42km", "30km", "15km", "btr", "bts", "bromo", "borobudur", "sport"] },
    { intent: "contact", keywords: ["email", "whatsapp", "phone", "linkedin", "github", "cv", "resume"] },
  ];

  let best: { intent: IntentId; score: number } | null = null;
  for (const doc of docs) {
    let score = 0;
    for (const w of words) {
      if (doc.keywords.includes(w)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { intent: doc.intent, score };
    }
  }

  if (!best) return null;
  return renderTopic(best.intent, idLang, trace);
}

export function answerPortfolioQuestion(
  question: string,
  history: ChatTurn[] = [],
): BrainResult {
  const trace: BrainTraceStep[] = [];
  const clean = question.trim();
  const idLang = INDONESIAN_RE.test(clean);

  const matched: IntentId[] = [];
  for (const rule of INTENT_RULES) {
    if (rule.pattern.test(clean)) {
      matched.push(rule.id);
    }
  }

  const specificProjects: IntentId[] = ["ai_clipper", "motion_skills", "business_dashboard", "ai_sandbox", "web_cms"];
  const filtered = matched.filter((id) => {
    if (id === "projects_overview" && matched.some((m) => specificProjects.includes(m))) return false;
    if (id === "skills_stack" && matched.includes("motion_skills") && !/\b(tech stack|stack|other skills|all skills)\b/i.test(clean)) {
      return false;
    }
    if (id === "experience_career" && matched.some((m) => specificProjects.includes(m) || m === "education")) return false;
    if (id === "followup" && matched.length > 1) return false;
    return true;
  });

  if (filtered.length === 1 && filtered[0] === "followup") {
    const answer = handleFollowUp(history, idLang, trace);
    return { answer, trace, matchedTopics: ["followup"] };
  }

  if (filtered.length > 0) {
    const picks = filtered.slice(0, 2);
    let parts = picks.map((id) => renderTopic(id, idLang, trace)).filter(Boolean);

    const lastBot = [...history].reverse().find((m) => m.role === "assistant")?.text ?? "";
    if (parts.join("\n\n") === lastBot && picks.length === 1) {
      const next = handleFollowUp(history, idLang, trace);
      const lead = idLang
        ? "Sebagai tambahan dari detail sebelumnya:"
        : "Building on that — here is another highlight:";
      parts = [`${lead}\n\n${next}`];
    }

    return {
      answer: parts.join("\n\n"),
      trace,
      matchedTopics: picks,
    };
  }

  const overlapAnswer = tokenFallback(clean, idLang, trace);
  if (overlapAnswer) {
    return { answer: overlapAnswer, trace, matchedTopics: ["semantic_match"] };
  }

  runTrackedTool("get_candidate_profile", {}, trace);
  const offTopic = idLang
    ? `Saya dirancang khusus untuk menjawab pertanyaan seputar proyek, keahlian engineering, dan karir **Abdul Aziz**.\nCoba tanyakan: *"Bagaimana cara kerja AI Video Clipper?"*, *"Ceritakan tentang Motion Video Skills"*, atau *"Apakah Aziz siap relokasi?"*`
    : `I'm focused specifically on **Abdul Aziz's** projects, engineering skills, and experience — so I don't have data on that topic.\nTry asking: *"How does the AI Video Clipper work?"*, *"Tell me about Motion Video Skills"*, or *"Why should we hire Aziz?"*`;

  return { answer: offTopic, trace, matchedTopics: ["off_topic"] };
}
