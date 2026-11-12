import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { TopBar } from "@/components/hud/TopBar";
import { Providers } from "@/components/providers";
import { PROFILE, SITE_URL } from "@/content/profile";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif-editorial",
  display: "swap",
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-ui",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-tech",
  display: "swap",
});

const TITLE = `${PROFILE.name} — Software & AI Engineer | Operations & Endurance`;
const DESCRIPTION =
  "Portfolio of Abdul Aziz, S.Kom (B.Sc. Informatics, GPA 3.88/4.00). Self-hosted Local LLM Infrastructure, Autonomous Agents (Hermes, OpenClaw), Next.js Full-Stack Engineering, and 60 KM Ultra-Trail Finisher.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: PROFILE.name, url: PROFILE.github }],
  keywords: [
    "Abdul Aziz",
    "Software Engineer",
    "AI Engineer",
    "Local LLM",
    "Hermes Agent",
    "OpenClaw",
    "Next.js",
    "Bali",
    "Portfolio",
  ],
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${jakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <Providers>
          <TopBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
