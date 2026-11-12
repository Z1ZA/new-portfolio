"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/* Ashima Arts 2D simplex noise (MIT) */
const NOISE = /* glsl */ `
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float routeX(float z){ return sin(z * 0.16) * 2.6 + sin(z * 0.071 + 1.3) * 1.8; }
float terrain(vec2 p){
  float h = 0.0, a = 1.0, f = 0.075;
  for (int i = 0; i < 5; i++) { h += a * snoise(p * f); f *= 2.03; a *= 0.5; }
  float valley = 1.0 - exp(-pow(p.x - routeX(p.y), 2.0) * 0.18);
  return h * 1.35 * (0.45 + 0.55 * valley);
}
`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
varying float vHeight;
varying vec2 vTrail;
varying vec2 vLocal;
varying float vDepth;
${NOISE}
void main(){
  vec3 pos = position;
  vec2 q = vec2(pos.x, pos.y + uTime * uSpeed);
  float h = terrain(q);
  h += exp(-pow((pos.y - 15.0) * 0.16, 2.0)) * (2.4 + snoise(vec2(pos.x * 0.12, 3.1)) * 1.4);
  pos.z += h;
  vHeight = h;
  vTrail = q;
  vLocal = pos.xy;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uLine;
uniform vec3 uRoute;
uniform float uTime;
uniform float uSpeed;
uniform float uOpacity;
varying float vHeight;
varying vec2 vTrail;
varying vec2 vLocal;
varying float vDepth;
float routeX(float z){ return sin(z * 0.16) * 2.6 + sin(z * 0.071 + 1.3) * 1.8; }
float isoline(float v, float width){
  float w = fwidth(v) * width;
  return 1.0 - smoothstep(0.0, w, abs(fract(v - 0.5) - 0.5));
}
void main(){
  float minor = isoline(vHeight * 3.0, 1.1) * 0.32;
  float major = isoline(vHeight * 0.6, 1.6) * 0.85;
  float grid = max(isoline(vLocal.x * 0.5, 1.0), isoline(vTrail.y * 0.5, 1.0)) * 0.07;

  float contour = max(max(minor, major), grid);

  float dx = abs(vTrail.x - routeX(vTrail.y));
  float trailW = fwidth(vTrail.x) * 1.4 + 0.035;
  float trail = 1.0 - smoothstep(trailW * 0.5, trailW, dx);
  float dash = step(0.42, fract(vTrail.y * 0.9));
  trail *= mix(0.55, 1.0, dash);

  float runnerZ = -6.0;
  vec2 runner = vec2(routeX(runnerZ + uTime * uSpeed), runnerZ);
  float rd = length(vec2(vTrail.x, vLocal.y) - runner);
  float glow = exp(-rd * rd * 5.0) * 0.9 + exp(-rd * rd * 0.35) * 0.18;
  float pulse = 0.75 + 0.25 * sin(uTime * 3.0);

  float fade = smoothstep(42.0, 12.0, vDepth) * smoothstep(1.0, 6.0, vDepth);
  fade *= 1.0 - smoothstep(9.0, 20.0, abs(vLocal.x));

  vec3 color = uLine * contour;
  float alpha = contour;
  color = mix(color, uRoute, clamp(trail + glow * pulse, 0.0, 1.0));
  alpha = max(alpha, max(trail * 0.95, glow * pulse));

  gl_FragColor = vec4(color, alpha * fade * uOpacity);
  if (gl_FragColor.a < 0.003) discard;
}
`;

interface TerrainProps {
  lineColor: string;
  routeColor: string;
}

export function Terrain({ lineColor, routeColor }: TerrainProps) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 0.55 },
      uOpacity: { value: 0 },
      uLine: { value: new THREE.Color(lineColor) },
      uRoute: { value: new THREE.Color(routeColor) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    uniforms.uLine.value.set(lineColor);
    uniforms.uRoute.value.set(routeColor);
  }, [lineColor, routeColor, uniforms]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20);
    uniforms.uTime.value += dt;
    uniforms.uOpacity.value = Math.min(1, uniforms.uOpacity.value + dt * 0.8);

    if (group.current) {
      const tx = -pointer.current.x * 1.1;
      const rx = -1.22 + pointer.current.y * 0.06;
      const rz = -pointer.current.x * 0.05;
      group.current.position.x += (tx - group.current.position.x) * 0.04;
      group.current.rotation.x += (rx - group.current.rotation.x) * 0.04;
      group.current.rotation.z += (rz - group.current.rotation.z) * 0.04;
    }
  });

  return (
    <group ref={group} position={[0, -2.6, -13]} rotation={[-1.22, 0, 0]}>
      <mesh>
        <planeGeometry args={[44, 44, 180, 180]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
