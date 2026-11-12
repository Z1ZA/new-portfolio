import { Counter } from "@/components/ui/Counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Accent, SectionHeader } from "@/components/ui/SectionHeader";
import { PROFILE } from "@/content/profile";
import { RACE_STATS } from "@/content/races";

const STATS = [
  {
    label: "Informatics GPA",
    value: 3.88,
    decimals: 2,
    suffix: " / 4.00",
    note: PROFILE.university,
  },
  {
    label: "Years Shipping Code",
    value: 4,
    decimals: 0,
    suffix: "+ yrs",
    note: "Full-Stack Web, AI & Ops",
  },
  {
    label: "Official Races Finished",
    value: RACE_STATS.finished,
    decimals: 0,
    suffix: " finishes",
    note: "ScoreNow & FoneSport verified",
  },
  {
    label: "Longest Single Ultra",
    value: RACE_STATS.longestKm,
    decimals: 0,
    suffix: " KM",
    note: "BTR Ultra 2026 Mountain Trail",
  },
];

export function AthleteProfile() {
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      className="relative border-b border-grid py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <SectionHeader
          id="profile-heading"
          code="CP01"
          km={10}
          kicker="Athlete & Engineer Profile"
          title={
            <>
              Built for <Accent>long-horizon</Accent> problems.
            </>
          }
          intro="Whether debugging a local LLM inference pipeline at 2 a.m. or climbing Bromo Tengger Semeru at kilometer 45, the discipline is identical: manage the pace, read the telemetry, and finish clean."
        />

        {/* Two-column narrative: Engineer × Athlete */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal className="panel relative overflow-hidden p-6 sm:p-8">
            <div className="hud flex items-center justify-between text-telemetry">
              <span>01 // THE ENGINEER</span>
              <span>LOCAL AI · FULL-STACK · OPS</span>
            </div>
            <h3 className="mt-3 text-2xl font-bold tracking-tight">
              From bare-metal LLM rigs to production Next.js interfaces
            </h3>
            <p className="mt-3 leading-relaxed text-secondary">{PROFILE.bioEngineer}</p>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-grid pt-4 font-mono text-xs text-muted">
              <span>• B.Sc. Informatics ({PROFILE.gpa}/4.00)</span>
              <span>• Head of R&amp;D @ FOSTI UMS</span>
              <span>• Dicoding &amp; SYNRGY BCA Alumni</span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="panel relative overflow-hidden p-6 sm:p-8">
            <div className="hud flex items-center justify-between text-signal">
              <span>02 // THE ENDURANCE ATHLETE</span>
              <span>15 KM → 30 KM → 42 KM → 60 KM</span>
            </div>
            <h3 className="mt-3 text-2xl font-bold tracking-tight">
              Ultra-trail pacing applied to operations &amp; delivery
            </h3>
            <p className="mt-3 leading-relaxed text-secondary">{PROFILE.bioAthlete}</p>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-grid pt-4 font-mono text-xs text-muted">
              <span>• {RACE_STATS.totalKm} KM official race distance</span>
              <span>• Operations Manager @ Linda Dessert</span>
              <span>• Based in Bali, open worldwide</span>
            </div>
          </Reveal>
        </div>

        {/* Animated Telemetry Stat Counters */}
        <RevealGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <RevealItem key={s.label} className="panel p-6">
              <div className="hud text-muted">{s.label}</div>
              <div className="mt-3 font-mono text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <div className="mt-2 font-mono text-xs text-secondary">{s.note}</div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
