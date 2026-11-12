import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const BASE =
  "hud inline-flex h-11 items-center justify-center gap-2 px-5 font-semibold transition-[background-color,border-color,color,filter,transform] duration-200 active:translate-y-px";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-signal text-white hover:brightness-110",
  outline: "border border-grid-strong bg-elevated/60 text-ink backdrop-blur hover:border-telemetry hover:text-telemetry",
  ghost: "text-secondary hover:text-ink",
};

interface ButtonLinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
  variant?: Variant;
  external?: boolean;
  children: ReactNode;
}

export function ButtonLink({ href, variant = "outline", external, className = "", children, ...rest }: ButtonLinkProps) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {children}
        <span aria-hidden="true">↗</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  if (href.startsWith("/") && !href.endsWith(".pdf")) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={cls} {...rest}>
      {children}
    </a>
  );
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`hud inline-flex items-center border border-grid-strong bg-surface/70 px-2 py-1 text-secondary ${className}`}>
      {children}
    </span>
  );
}
