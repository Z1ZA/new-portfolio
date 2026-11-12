import { Hero } from "@/components/hero/Hero";
import { ProgressRail } from "@/components/hud/ProgressRail";
import { AthleteProfile } from "@/components/sections/AthleteProfile";
import { FinishLine } from "@/components/sections/FinishLine";
import { FlagshipSystems } from "@/components/sections/FlagshipSystems";
import { GearCheck } from "@/components/sections/GearCheck";
import { RaceLedger } from "@/components/sections/RaceLedger";
import { RouteLog } from "@/components/sections/RouteLog";

export default function HomePage() {
  return (
    <>
      <ProgressRail />
      <main id="main" className="bg-blueprint-grid">
        <Hero />
        <AthleteProfile />
        <FlagshipSystems />
        <RouteLog />
        <GearCheck />
        <RaceLedger />
      </main>
      <FinishLine />
    </>
  );
}
