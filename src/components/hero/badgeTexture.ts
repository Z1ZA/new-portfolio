import * as THREE from "three";
import { PROFILE } from "@/content/profile";
import { RACE_STATS } from "@/content/races";

const W = 768;
const H = 1080;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawStylizedPortrait(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, img?: HTMLImageElement | null) {
  ctx.save();
  roundRect(ctx, x, y, w, h, 16);
  ctx.clip();

  // Deep telemetry backdrop
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, "#141820");
  grad.addColorStop(0.6, "#0d1016");
  grad.addColorStop(1, "#1d1412");
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Subtle topographic contour rings
  ctx.strokeStyle = "rgba(61, 245, 196, 0.14)";
  ctx.lineWidth = 1.5;
  for (let i = 1; i <= 7; i++) {
    ctx.beginPath();
    ctx.ellipse(x + w * 0.52, y + h * 0.48, i * 42, i * 30, -0.25, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Mountain ridge silhouette
  ctx.fillStyle = "rgba(255, 90, 54, 0.14)";
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w * 0.22, y + h * 0.68);
  ctx.lineTo(x + w * 0.44, y + h * 0.78);
  ctx.lineTo(x + w * 0.72, y + h * 0.56);
  ctx.lineTo(x + w, y + h * 0.72);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fill();

  if (img && img.complete && img.naturalWidth > 0) {
    // Cover-fit user photo
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = x + (w - dw) / 2;
    const dy = y + (h - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);

    // Subtle duotone vignette
    const vig = ctx.createLinearGradient(x, y + h * 0.55, x, y + h);
    vig.addColorStop(0, "rgba(10,11,13,0)");
    vig.addColorStop(1, "rgba(10,11,13,0.78)");
    ctx.fillStyle = vig;
    ctx.fillRect(x, y, w, h);
  } else {
    // Stylized geometric athlete bust + monogram emblem
    const cx = x + w / 2;
    const cy = y + h * 0.44;

    // Halo ring
    ctx.strokeStyle = "#3df5c4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 88, 0, Math.PI * 2);
    ctx.stroke();

    // Shoulders silhouette
    ctx.fillStyle = "#1c222c";
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 135, y + h);
    ctx.quadraticCurveTo(cx - 115, cy + 75, cx - 48, cy + 68);
    ctx.lineTo(cx + 48, cy + 68);
    ctx.quadraticCurveTo(cx + 115, cy + 75, cx + 135, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Race singlet V-stripe
    ctx.strokeStyle = "#ff5a36";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 42, cy + 72);
    ctx.lineTo(cx, cy + 132);
    ctx.lineTo(cx + 42, cy + 72);
    ctx.stroke();

    // Monogram badge in center
    ctx.fillStyle = "#0e1116";
    ctx.beginPath();
    ctx.arc(cx, cy, 66, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f2f0eb";
    ctx.font = "800 58px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(PROFILE.monogram, cx, cy + 2);
  }

  // Corner HUD reticles
  ctx.strokeStyle = "#3df5c4";
  ctx.lineWidth = 2.5;
  const m = 14;
  const len = 18;
  // TL
  ctx.beginPath();
  ctx.moveTo(x + m, y + m + len);
  ctx.lineTo(x + m, y + m);
  ctx.lineTo(x + m + len, y + m);
  // TR
  ctx.moveTo(x + w - m - len, y + m);
  ctx.lineTo(x + w - m, y + m);
  ctx.lineTo(x + w - m, y + m + len);
  // BL
  ctx.moveTo(x + m, y + h - m - len);
  ctx.lineTo(x + m, y + h - m);
  ctx.lineTo(x + m + len, y + h - m);
  // BR
  ctx.moveTo(x + w - m - len, y + h - m);
  ctx.lineTo(x + w - m, y + h - m);
  ctx.lineTo(x + w - m, y + h - m - len);
  ctx.stroke();

  // Live telemetry tag inside portrait
  ctx.fillStyle = "rgba(10, 11, 13, 0.78)";
  roundRect(ctx, x + 22, y + h - 46, 230, 28, 6);
  ctx.fill();
  ctx.fillStyle = "#3df5c4";
  ctx.beginPath();
  ctx.arc(x + 36, y + h - 32, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f2f0eb";
  ctx.font = "600 13px ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(`GPS ${PROFILE.coordinates}`, x + 48, y + h - 31);

  ctx.restore();
}

export function createFrontBadgeTexture(onUpdate?: () => void): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const paint = (img?: HTMLImageElement | null) => {
    ctx.clearRect(0, 0, W, H);

    // Card base
    ctx.fillStyle = "#0e1014";
    roundRect(ctx, 0, 0, W, H, 36);
    ctx.fill();

    // Subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let gx = 48; gx < W; gx += 48) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, H);
      ctx.stroke();
    }
    for (let gy = 48; gy < H; gy += 48) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(W, gy);
      ctx.stroke();
    }

    // Top orange signal header band
    ctx.fillStyle = "#ff5a36";
    ctx.fillRect(0, 0, W, 92);

    // Lanyard punch slot
    ctx.fillStyle = "#060708";
    roundRect(ctx, W / 2 - 64, 22, 128, 22, 11);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Header text
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 15px ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText("ULTRA-TRAIL ENGINEER // CREDENTIAL", 36, 74);
    ctx.textAlign = "right";
    ctx.fillText("BALI · IDN", W - 36, 74);

    // Portrait window
    drawStylizedPortrait(ctx, 36, 116, W - 72, 390, img);

    // Name & headline
    ctx.fillStyle = "#f2f0eb";
    ctx.font = "800 44px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(PROFILE.name.toUpperCase(), 38, 560);

    ctx.fillStyle = "#3df5c4";
    ctx.font = "600 17px ui-monospace, monospace";
    ctx.fillText("SOFTWARE & AI ENGINEER · OPERATIONS · ULTRA RUNNER", 38, 592);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(38, 616);
    ctx.lineTo(W - 38, 616);
    ctx.stroke();

    // Giant Race Bib Number panel
    ctx.fillStyle = "#f6f4ef";
    roundRect(ctx, 36, 638, W - 72, 232, 18);
    ctx.fill();

    // Left vertical category strip inside bib
    ctx.fillStyle = "#ff5a36";
    roundRect(ctx, 36, 638, 56, 232, 18);
    ctx.fill();
    ctx.save();
    ctx.translate(64, 754);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 16px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("60 KM ULTRA", 0, 5);
    ctx.restore();

    // Bib label + giant digits
    ctx.fillStyle = "#141413";
    ctx.font = "700 16px ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText("OFFICIAL BIB // VERIFIED FINISHER", 114, 674);

    ctx.fillStyle = "#141413";
    ctx.font = "900 128px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillText(PROFILE.bib, 108, 796);

    // Telemetry QR / barcode block on right of bib
    const bx = W - 188;
    const by = 668;
    ctx.fillStyle = "#141413";
    const pattern = [
      "11111010111",
      "10001001001",
      "10111010111",
      "10111001101",
      "10001011011",
      "11111000101",
      "00000010110",
      "11011101011",
      "10100110101",
      "11101011111",
      "10011100101",
    ];
    const cell = 11;
    pattern.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === "1") {
          ctx.fillRect(bx + c * cell, by + r * cell, cell - 1, cell - 1);
        }
      }
    });
    ctx.font = "700 13px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(`GPA ${PROFILE.gpa}`, bx + 60, by + 148);
    ctx.fillStyle = "#c84b31";
    ctx.fillText("B.SC. INFO", bx + 60, by + 168);

    // Bottom telemetry footer
    ctx.fillStyle = "#8a8f98";
    ctx.font = "600 15px ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText("STATUS: OPEN TO RELOCATION", 38, 922);
    ctx.textAlign = "right";
    ctx.fillStyle = "#3df5c4";
    ctx.fillText(`${RACE_STATS.totalKm} KM LOGGED · DRAG OR CLICK TO FLIP ↻`, W - 38, 922);

    // Bottom barcode stripes
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    for (let i = 0; i < 58; i++) {
      const bw = i % 3 === 0 ? 6 : i % 2 === 0 ? 3 : 1.5;
      ctx.fillRect(38 + i * 12, 956, bw, 56);
    }

    // Outer border
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 4;
    roundRect(ctx, 2, 2, W - 4, H - 4, 36);
    ctx.stroke();

    texture.needsUpdate = true;
    onUpdate?.();
  };

  paint(null);

  // Try loading the user's real photo if placed in public/images/profile.jpg
  if (typeof window !== "undefined") {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => paint(img);
    img.src = PROFILE.photo;
  }

  return texture;
}

export function createBackBadgeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0d0f13";
  roundRect(ctx, 0, 0, W, H, 36);
  ctx.fill();

  // Top bar
  ctx.fillStyle = "#181c22";
  ctx.fillRect(0, 0, W, 92);
  ctx.fillStyle = "#060708";
  roundRect(ctx, W / 2 - 64, 22, 128, 22, 11);
  ctx.fill();

  ctx.fillStyle = "#3df5c4";
  ctx.font = "700 15px ui-monospace, monospace";
  ctx.textAlign = "left";
  ctx.fillText("TELEMETRY DOSSIER // REVERSE", 38, 74);
  ctx.textAlign = "right";
  ctx.fillStyle = "#8a8f98";
  ctx.fillText(`BIB #${PROFILE.bib}`, W - 38, 74);

  // Title
  ctx.fillStyle = "#f2f0eb";
  ctx.font = "800 32px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("CHECKPOINT SPLITS & CAPABILITIES", 38, 156);

  const rows = [
    ["CP01 // AI INFRA", "Local LLM Server · Hermes Agent · OpenClaw · Qwen & Gemma"],
    ["CP02 // FULL-STACK", "Next.js · React · TypeScript · Strapi CMS · PostgreSQL"],
    ["CP03 // OPERATIONS", "Production Workflows · Agile Scrum · Digital Branding"],
    ["CP04 // EDUCATION", `B.Sc. Informatics (GPA ${PROFILE.gpa}/4.00) · UMS`],
    ["CP05 // ENDURANCE", "15K → 30K → 42K Marathon → 60K Ultra-Trail Finisher"],
  ];

  rows.forEach(([kicker, body], i) => {
    const ry = 196 + i * 108;
    ctx.fillStyle = "#141820";
    roundRect(ctx, 38, ry, W - 76, 92, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#ff5a36";
    ctx.font = "700 15px ui-monospace, monospace";
    ctx.fillText(kicker, 58, ry + 34);

    ctx.fillStyle = "#f2f0eb";
    ctx.font = "500 19px system-ui, sans-serif";
    ctx.fillText(body, 58, ry + 66);
  });

  // Mini elevation profile graph
  const gx = 38;
  const gy = 760;
  const gw = W - 76;
  const gh = 150;
  ctx.fillStyle = "#12161d";
  roundRect(ctx, gx, gy, gw, gh, 14);
  ctx.fill();

  ctx.strokeStyle = "#3df5c4";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  const pts = [0.8, 0.62, 0.7, 0.45, 0.52, 0.28, 0.36, 0.14];
  pts.forEach((p, idx) => {
    const px = gx + 24 + (idx / (pts.length - 1)) * (gw - 48);
    const py = gy + 24 + p * (gh - 48);
    if (idx === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  ctx.fillStyle = "#8a8f98";
  ctx.font = "600 14px ui-monospace, monospace";
  ctx.fillText("ELEVATION GAIN // 2022 → 2026 CAREER PROFILE", gx + 20, gy + gh - 16);

  // Footer
  ctx.fillStyle = "#3df5c4";
  ctx.font = "700 16px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${PROFILE.email.toUpperCase()} · GITHUB.COM/${PROFILE.githubHandle}`, W / 2, 985);

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 4;
  roundRect(ctx, 2, 2, W - 4, H - 4, 36);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function createStrapTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#181a1f";
  ctx.fillRect(0, 0, 512, 64);

  // Edge stitching in signal orange
  ctx.fillStyle = "#ff5a36";
  ctx.fillRect(0, 0, 512, 6);
  ctx.fillRect(0, 58, 512, 6);

  ctx.fillStyle = "#f2f0eb";
  ctx.font = "700 18px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RACE TELEMETRY // ABDUL AZIZ // BIB 2694 //", 256, 32);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(3, 1);
  return tex;
}
