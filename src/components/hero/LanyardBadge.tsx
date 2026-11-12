"use client";

import { RoundedBox } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createBackBadgeTexture, createFrontBadgeTexture, createStrapTexture } from "./badgeTexture";

const ANCHOR = new THREE.Vector3(0, 3.35, 0);
const SEGMENTS = 5;
const SEG_LEN = 0.42;
const GRAVITY = -19.5;
const DAMPING = 0.986;

interface RopeNode {
  pos: THREE.Vector3;
  prev: THREE.Vector3;
}

interface LanyardBadgeProps {
  flipped: boolean;
  onToggleFlip: () => void;
}

export function LanyardBadge({ flipped, onToggleFlip }: LanyardBadgeProps) {
  const { camera, gl } = useThree();
  const cardGroup = useRef<THREE.Group>(null);
  const strapGeo = useRef<THREE.BufferGeometry>(null);

  // Textures
  const frontTex = useMemo(() => createFrontBadgeTexture(), []);
  const backTex = useMemo(() => createBackBadgeTexture(), []);
  const strapTex = useMemo(() => createStrapTexture(), []);

  useEffect(() => {
    return () => {
      frontTex.dispose();
      backTex.dispose();
      strapTex.dispose();
    };
  }, [frontTex, backTex, strapTex]);

  // Initialize rope nodes with a slight initial swing so it visibly settles on load
  const nodes = useRef<RopeNode[]>(
    Array.from({ length: SEGMENTS + 1 }, (_, i) => {
      const x = i * 0.14;
      const y = ANCHOR.y - i * SEG_LEN;
      const z = i * 0.04;
      return {
        pos: new THREE.Vector3(x, y, z),
        prev: new THREE.Vector3(x - i * 0.018, y, z),
      };
    }),
  );

  // Drag & flip state
  const drag = useRef({
    active: false,
    moved: false,
    downScreen: new THREE.Vector2(),
    target: new THREE.Vector3(),
    plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    ray: new THREE.Raycaster(),
    ndc: new THREE.Vector2(),
  });

  const spin = useRef({ angle: 0, vel: 0 });
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3())),
    [],
  );

  const setCursor = (cursor: string) => {
    gl.domElement.style.cursor = cursor;
  };

  useEffect(() => {
    const onWindowUp = () => {
      if (drag.current.active) {
        drag.current.active = false;
        setCursor("auto");
      }
    };
    window.addEventListener("pointerup", onWindowUp);
    return () => window.removeEventListener("pointerup", onWindowUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const tip = nodes.current[SEGMENTS].pos;
    drag.current.active = true;
    drag.current.moved = false;
    drag.current.downScreen.set(e.clientX, e.clientY);
    drag.current.plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), tip);
    drag.current.target.copy(tip);
    (e.target as HTMLElement | undefined)?.setPointerCapture?.(e.pointerId);
    setCursor("grabbing");
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active) return;
    e.stopPropagation();
    if (drag.current.downScreen.distanceTo(new THREE.Vector2(e.clientX, e.clientY)) > 6) {
      drag.current.moved = true;
    }
    const rect = gl.domElement.getBoundingClientRect();
    drag.current.ndc.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    drag.current.ray.setFromCamera(drag.current.ndc, camera);
    const hit = new THREE.Vector3();
    if (drag.current.ray.ray.intersectPlane(drag.current.plane, hit)) {
      hit.x = THREE.MathUtils.clamp(hit.x, -2.6, 2.6);
      hit.y = THREE.MathUtils.clamp(hit.y, -1.6, 2.8);
      drag.current.target.copy(hit);
    }
  };

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const wasDragging = drag.current.active;
    const moved = drag.current.moved;
    drag.current.active = false;
    setCursor("grab");
    if (wasDragging && !moved) {
      spin.current.vel += 3.5;
      onToggleFlip();
    }
  };

  // Ribbon mesh buffers (24 lengthwise divisions × 2 vertices across width)
  const RIBBON_STEPS = 24;
  const RIBBON_HALF_W = 0.085;
  const ribbonPositions = useMemo(() => new Float32Array((RIBBON_STEPS + 1) * 2 * 3), []);
  const ribbonUVs = useMemo(() => {
    const uvs = new Float32Array((RIBBON_STEPS + 1) * 2 * 2);
    for (let i = 0; i <= RIBBON_STEPS; i++) {
      const v = i / RIBBON_STEPS;
      uvs[i * 4 + 0] = v;
      uvs[i * 4 + 1] = 0;
      uvs[i * 4 + 2] = v;
      uvs[i * 4 + 3] = 1;
    }
    return uvs;
  }, []);
  const ribbonIndices = useMemo(() => {
    const idx: number[] = [];
    for (let i = 0; i < RIBBON_STEPS; i++) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      idx.push(a, b, c, b, d, c);
    }
    return new Uint16Array(idx);
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const ns = nodes.current;

    // 1. Verlet integration
    for (let i = 1; i <= SEGMENTS; i++) {
      const n = ns[i];
      const vx = (n.pos.x - n.prev.x) * DAMPING;
      const vy = (n.pos.y - n.prev.y) * DAMPING;
      const vz = (n.pos.z - n.prev.z) * DAMPING;
      n.prev.copy(n.pos);
      n.pos.x += vx + Math.sin(state.clock.elapsedTime * 1.1 + i) * 0.0006;
      n.pos.y += vy + GRAVITY * dt * dt;
      n.pos.z += vz + Math.cos(state.clock.elapsedTime * 0.8 + i) * 0.0005;
    }

    // If user is dragging the badge, pull the tip toward the pointer
    if (drag.current.active) {
      const tip = ns[SEGMENTS];
      tip.pos.lerp(drag.current.target, 0.42);
    }

    // 2. Distance constraints (relaxation iterations)
    for (let iter = 0; iter < 10; iter++) {
      ns[0].pos.copy(ANCHOR);
      for (let i = 0; i < SEGMENTS; i++) {
        const a = ns[i].pos;
        const b = ns[i + 1].pos;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const dist = Math.hypot(dx, dy, dz) || 0.0001;
        const diff = (dist - SEG_LEN) / dist;
        if (i === 0) {
          b.x -= dx * diff;
          b.y -= dy * diff;
          b.z -= dz * diff;
        } else {
          const wA = drag.current.active && i + 1 === SEGMENTS ? 0.85 : 0.5;
          const wB = 1 - wA;
          a.x += dx * diff * wA;
          a.y += dy * diff * wA;
          a.z += dz * diff * wA;
          b.x -= dx * diff * wB;
          b.y -= dy * diff * wB;
          b.z -= dz * diff * wB;
        }
      }
    }

    // 3. Update ribbon geometry along Catmull-Rom curve
    for (let i = 0; i <= SEGMENTS; i++) {
      curve.points[i].copy(ns[i].pos);
    }
    if (strapGeo.current) {
      const pt = new THREE.Vector3();
      for (let i = 0; i <= RIBBON_STEPS; i++) {
        const t = i / RIBBON_STEPS;
        curve.getPoint(t, pt);
        // Slight V-pinch near the metal clip at the bottom
        const w = RIBBON_HALF_W * (1 - 0.55 * Math.pow(t, 3));
        const base = i * 6;
        ribbonPositions[base + 0] = pt.x - w;
        ribbonPositions[base + 1] = pt.y;
        ribbonPositions[base + 2] = pt.z;
        ribbonPositions[base + 3] = pt.x + w;
        ribbonPositions[base + 4] = pt.y;
        ribbonPositions[base + 5] = pt.z;
      }
      const attr = strapGeo.current.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
      strapGeo.current.computeVertexNormals();
    }

    // 4. Position & orient badge at tip
    if (cardGroup.current) {
      const tip = ns[SEGMENTS].pos;
      const prev = ns[SEGMENTS - 1].pos;
      const vx = (tip.x - ns[SEGMENTS].prev.x) / dt;
      cardGroup.current.position.copy(tip);

      // Pendulum tilt following the last rope segment + velocity sway
      const targetZ = THREE.MathUtils.clamp(-(tip.x - prev.x) * 1.15, -0.65, 0.65);
      const targetX = THREE.MathUtils.clamp((tip.z - prev.z) * 1.1, -0.45, 0.45);
      cardGroup.current.rotation.z = THREE.MathUtils.lerp(cardGroup.current.rotation.z, targetZ, 0.22);
      cardGroup.current.rotation.x = THREE.MathUtils.lerp(cardGroup.current.rotation.x, targetX, 0.22);

      // Spring-driven Y rotation for flip + velocity twist
      const targetY = (flipped ? Math.PI : 0) + THREE.MathUtils.clamp(vx * 0.06, -0.4, 0.4);
      const force = (targetY - spin.current.angle) * 28;
      spin.current.vel = (spin.current.vel + force * dt) * 0.84;
      spin.current.angle += spin.current.vel * dt;
      cardGroup.current.rotation.y = spin.current.angle;
    }
  });

  const CARD_W = 1.62;
  const CARD_H = 2.28;
  const CARD_D = 0.04;

  return (
    <group>
      {/* Woven lanyard ribbon */}
      <mesh frustumCulled={false}>
        <bufferGeometry ref={strapGeo}>
          <bufferAttribute attach="attributes-position" args={[ribbonPositions, 3]} />
          <bufferAttribute attach="attributes-uv" args={[ribbonUVs, 2]} />
          <bufferAttribute attach="index" args={[ribbonIndices, 1]} />
        </bufferGeometry>
        <meshStandardMaterial map={strapTex} side={THREE.DoubleSide} roughness={0.65} metalness={0.1} />
      </mesh>

      {/* Swinging clip + race-bib card */}
      <group
        ref={cardGroup}
        onPointerOver={() => setCursor(drag.current.active ? "grabbing" : "grab")}
        onPointerOut={() => {
          if (!drag.current.active) setCursor("auto");
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Brushed metal carabiner clip */}
        <mesh position={[0, 0.06, 0]}>
          <torusGeometry args={[0.075, 0.018, 12, 24]} />
          <meshStandardMaterial color="#d4d7dd" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[0.22, 0.11, 0.055]} />
          <meshStandardMaterial color="#9aa0aa" metalness={0.85} roughness={0.28} />
        </mesh>

        {/* Card body offset down from the top slot */}
        <group position={[0, -CARD_H / 2 - 0.02, 0]}>
          <RoundedBox args={[CARD_W, CARD_H, CARD_D]} radius={0.06} smoothness={4}>
            <meshPhysicalMaterial color="#101318" roughness={0.35} metalness={0.2} clearcoat={0.9} />
          </RoundedBox>

          {/* Front face (Bib & Portrait) */}
          <mesh position={[0, 0, CARD_D / 2 + 0.002]}>
            <planeGeometry args={[CARD_W - 0.03, CARD_H - 0.03]} />
            <meshPhysicalMaterial
              map={frontTex}
              roughness={0.24}
              metalness={0.06}
              clearcoat={1}
              clearcoatRoughness={0.14}
            />
          </mesh>

          {/* Back face (Telemetry Dossier) */}
          <mesh position={[0, 0, -CARD_D / 2 - 0.002]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[CARD_W - 0.03, CARD_H - 0.03]} />
            <meshPhysicalMaterial
              map={backTex}
              roughness={0.26}
              metalness={0.06}
              clearcoat={1}
              clearcoatRoughness={0.14}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
