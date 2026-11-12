"use client";

import { Canvas } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { LanyardBadge } from "./LanyardBadge";
import { Terrain } from "./Terrain";

export function TerrainCanvas({ active }: { active: boolean }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.4, 6.2], fov: 42, near: 0.1, far: 70 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="pointer-events-none h-full w-full"
    >
      <Terrain
        lineColor={isLight ? "#0b7a63" : "#3df5c4"}
        routeColor={isLight ? "#c84b31" : "#ff5a36"}
      />
    </Canvas>
  );
}

interface LanyardCanvasProps {
  active: boolean;
  flipped: boolean;
  onToggleFlip: () => void;
  onReady?: () => void;
}

export function LanyardCanvas({ active, flipped, onToggleFlip, onReady }: LanyardCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.35, 5.2], fov: 38, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady?.()}
      className="h-full w-full touch-none"
    >
      <ambientLight intensity={1.35} />
      <directionalLight position={[3.5, 5, 6]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-4, -2, 3]} intensity={0.9} color="#3df5c4" />
      <pointLight position={[0, 2, 3]} intensity={1.1} color="#ff5a36" distance={8} />
      <LanyardBadge flipped={flipped} onToggleFlip={onToggleFlip} />
    </Canvas>
  );
}
