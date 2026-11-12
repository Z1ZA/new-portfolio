"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CHECKPOINTS, PROFILE } from "@/content/profile";
import { SplitTimer } from "./SplitTimer";
import { ThemeToggle } from "./ThemeToggle";

const NAV = CHECKPOINTS.filter((c) => c.id !== "start");

export function TopBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [ultraMode, setUltraMode] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hidden "60k" keyboard easter egg
  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-3);
      if (buffer === "60k") {
        setUltraMode((u) => !u);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled ? "border-b border-grid bg-canvas/75 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <a
        href="#main"
        className="hud sr-only bg-signal px-3 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          href={isHome ? "#start" : "/"}
          className="group flex items-center gap-3"
          aria-label={`${PROFILE.name} — home`}
        >
          <span className="grid size-9 place-items-center border border-ink font-mono text-sm font-bold tracking-tight transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-white">
            {PROFILE.monogram}
          </span>
          <span className="hud hidden text-muted md:block">
            Bib <span className="text-ink">#{PROFILE.bib}</span>
          </span>
        </Link>

        <nav aria-label="Checkpoints" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((c) => (
              <li key={c.id}>
                <a
                  href={href(c.id)}
                  className="hud block px-2.5 py-2 text-muted transition-colors hover:text-ink"
                >
                  <span className="text-signal">{c.code}</span> {c.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {ultraMode && (
            <span className="hud border border-telemetry bg-telemetry/15 px-2.5 py-1 text-telemetry">
              ⚡ 60K ULTRA MODE ACTIVE
            </span>
          )}
          <SplitTimer className="hidden xl:inline" />
          <ThemeToggle />
          <a
            href={PROFILE.cvPdfPath}
            download
            className="hud flex h-9 items-center bg-signal px-3.5 font-semibold text-white transition-[filter] hover:brightness-110"
          >
            CV<span className="hidden sm:inline">&nbsp;↓</span>
          </a>
        </div>
      </div>
    </header>
  );
}
