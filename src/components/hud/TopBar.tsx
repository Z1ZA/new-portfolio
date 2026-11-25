"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PROFILE } from "@/content/profile";
import { SplitTimer } from "./SplitTimer";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <span className="hud text-muted">
            Bib <span className="text-ink">#{PROFILE.bib}</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <SplitTimer className="hidden sm:inline" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
