"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme !== "light";
  const next = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      className="hud group relative flex h-9 items-center gap-2 border border-grid-strong px-3 text-secondary transition-colors hover:border-telemetry hover:text-telemetry"
    >
      <span className="relative block size-3.5" aria-hidden="true">
        {/* sun / moon morph */}
        <span
          className={`absolute inset-0 rounded-full border-[1.5px] border-current transition-transform duration-500 ${
            isDark ? "scale-100" : "scale-75"
          }`}
        />
        <span
          className={`absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-canvas transition-all duration-500 ${
            isDark ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        />
      </span>
      <span className="hidden sm:inline">{mounted ? (isDark ? "Night" : "Day") : "Night"}</span>
    </button>
  );
}
