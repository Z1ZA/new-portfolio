# Abdul Aziz — Portfolio v2 ("Race Telemetry")

Built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **React Three Fiber / Three.js**, **Motion**, **Lenis**, and **MDX**.

## Highlights

- **START LINE — 3D Topographic Terrain & Physics Lanyard Race-Bib Badge:** Interactive GLSL contour terrain + a swinging Verlet-physics lanyard badge (`BIB #2694`) that you can drag, fling, and click/press Enter to flip between Front (Athlete & Engineer Credential) and Back (Checkpoint Splits & Stack). Automatic HTML/CSS 3D fallback (`BadgeFallback`) for instant SSR paint and `prefers-reduced-motion` devices.
- **Checkpoints CP01 → CP05:**
  - `CP01` — Athlete & Engineer Profile + animated stat counters
  - `CP02` — Flagship Systems (3D tilt cards with React 19 `<ViewTransition>` shared-element morph into `/work/[slug]`)
  - `CP03` — Route Log (scroll-drawn SVG career elevation profile with interactive waypoints + full chronological ledger)
  - `CP04` — Gear Check (mandatory technical kit inspection)
  - `CP05` — Race Ledger (verified ScoreNow & FoneSport marathon/ultra-trail results from 15 KM to 60 KM)
- **FINISH LINE:** Interactive SVG finish arch where hovering or clicking breaks the tape, plus live visitor split time and one-click email copy.
- **Hidden Easter Egg:** Type `60k` anywhere on the page to toggle `60K ULTRA MODE`.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Adding Your Real Photo & CV PDF

1. **Profile photo:** Drop a square or portrait photo at `public/images/profile.jpg`. Both the 3D WebGL race-bib badge (`src/components/hero/badgeTexture.ts`) and the HTML/CSS fallback (`src/components/hero/BadgeFallback.tsx`) automatically detect and render `/images/profile.jpg` (and fall back to the stylized `AZ` telemetry emblem when the file is absent).
2. **1-Page CV PDF:** Place your PDF at `public/cv/Abdul_Aziz_CV.pdf` (configured via `PROFILE.cvPdfPath` in `src/content/profile.ts`).
