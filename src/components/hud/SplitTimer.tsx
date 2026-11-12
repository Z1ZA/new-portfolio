"use client";

import { formatSplit, useElapsed } from "@/lib/hooks";
import { useRaceStart } from "@/components/providers";

export function SplitTimer({ className = "" }: { className?: string }) {
  const start = useRaceStart();
  const elapsed = useElapsed(start);

  return (
    <span className={`hud tabular text-muted ${className}`} title="Your time on the course">
      <span className="text-telemetry">●</span> Split <span className="text-ink">{formatSplit(elapsed)}</span>
    </span>
  );
}
