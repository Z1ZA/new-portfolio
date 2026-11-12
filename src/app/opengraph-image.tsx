import { ImageResponse } from "next/og";
import { PROFILE } from "@/content/profile";
import { RACE_STATS } from "@/content/races";

export const alt = `${PROFILE.name} — Software & AI Engineer (Bib #${PROFILE.bib})`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0b0d",
          color: "#f2f0eb",
          padding: "56px 64px",
          fontFamily: "sans-serif",
          border: "12px solid #ff5a36",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#3df5c4",
          }}
        >
          <span>RACE TELEMETRY // OFFICIAL ENGINEER CREDENTIAL</span>
          <span>{`BALI · IDN // BIB #${PROFILE.bib}`}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "740px" }}>
            <div style={{ display: "flex", fontSize: 72, fontWeight: 900, lineHeight: 1.02 }}>
              {PROFILE.name}
            </div>
            <div style={{ display: "flex", fontSize: 28, color: "#ff5a36", marginTop: 12, fontWeight: 700 }}>
              {PROFILE.roleHeadline}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#b4b7bd", marginTop: 20, lineHeight: 1.4 }}>
              {`Local LLM Infrastructure (Hermes, OpenClaw) · Next.js Full-Stack Systems · ${RACE_STATS.longestKm} KM Ultra-Trail Finisher`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f6f4ef",
              color: "#141413",
              padding: "28px 36px",
              borderRadius: 20,
            }}
          >
            <div style={{ display: "flex", fontSize: 16, fontWeight: 800, letterSpacing: "0.14em" }}>
              OFFICIAL BIB
            </div>
            <div style={{ display: "flex", fontSize: 88, fontWeight: 900, lineHeight: 1 }}>
              {PROFILE.bib}
            </div>
            <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#c84b31", marginTop: 8 }}>
              {`GPA ${PROFILE.gpa}/4.00`}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#8a8f98",
          }}
        >
          <span>STATUS: OPEN TO RELOCATION &amp; SPONSORSHIP</span>
          <span>{`GITHUB.COM/${PROFILE.githubHandle}`}</span>
        </div>
      </div>
    ),
    size,
  );
}
