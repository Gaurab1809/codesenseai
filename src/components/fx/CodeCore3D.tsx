import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const TOKENS = ["</>", "{ }", "=>", "[ ]", "( )", "&&", "||", "fn", "≡", "λ", "AI", "*"];
const COLORS = ["#ff6b6b", "#c8ff5a", "#7ad3ff", "#c8a6ff", "#ffd166"];

function Particles({ pointer }: { pointer: { x: number; y: number } }) {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 600;
  const { positions, base } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.6 + Math.random() * 2.2;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(p) * Math.cos(t);
      const y = r * Math.sin(p) * Math.sin(t);
      const z = r * Math.cos(p);
      positions.set([x, y, z], i * 3);
      base.set([x, y, z], i * 3);
    }
    return { positions, base };
  }, []);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    const px = pointer.x * 4;
    const py = pointer.y * 4;
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const bx = base[ix], by = base[ix + 1], bz = base[ix + 2];
      const dx = bx - px, dy = by - py;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
      const force = Math.min(0.6 / dist, 0.5);
      arr[ix] = bx + (dx / dist) * force + Math.sin(t + i) * 0.02;
      arr[ix + 1] = by + (dy / dist) * force + Math.cos(t + i) * 0.02;
      arr[ix + 2] = bz + Math.sin(t * 0.5 + i) * 0.04;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.rotation.y = t * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} />
      </bufferGeometry>
      <pointsMaterial size={0.04} sizeAttenuation color="#ff6b6b" transparent opacity={0.85} />
    </points>
  );
}

function Core({ pointer }: { pointer: { x: number; y: number } }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.25 + pointer.y * 0.4;
    ref.current.rotation.y = t * 0.35 + pointer.x * 0.6;
    const s = 1 + Math.sin(t * 2) * 0.04;
    ref.current.scale.set(s, s, s);
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial
        color="#0b0b0f"
        emissive="#ff6b6b"
        emissiveIntensity={0.45}
        wireframe
      />
    </mesh>
  );
}

function OrbitToken({ token, color, radius, speed, offset, tilt }: {
  token: string; color: string; radius: number; speed: number; offset: number; tilt: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.8 + tilt) * 0.6, Math.sin(t) * radius);
    ref.current.rotation.y = -t;
  });
  return (
    <group ref={ref}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh>
          <boxGeometry args={[0.7, 0.7, 0.18]} />
          <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
        </mesh>
        <Text position={[0, 0, 0.11]} fontSize={0.32} color="#0b0b0f" anchorX="center" anchorY="middle">
          {token}
        </Text>
      </Float>
    </group>
  );
}

function Scene({ pointer }: { pointer: { x: number; y: number } }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 4, 4]} intensity={1.4} color="#ff6b6b" />
      <pointLight position={[-5, -3, 2]} intensity={1} color="#7ad3ff" />
      <directionalLight position={[0, 5, 5]} intensity={0.6} />
      <Core pointer={pointer} />
      <Particles pointer={pointer} />
      {TOKENS.map((tk, i) => (
        <OrbitToken
          key={i}
          token={tk}
          color={COLORS[i % COLORS.length]}
          radius={2.4 + (i % 3) * 0.5}
          speed={0.35 + (i % 4) * 0.08}
          offset={(i / TOKENS.length) * Math.PI * 2}
          tilt={i * 0.4}
        />
      ))}
    </>
  );
}

export function CodeCore3D() {
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <div
      className="absolute inset-0"
      onPointerMove={(e) => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      aria-hidden
    >
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.6]}>
        <Suspense fallback={null}>
          <Scene pointer={pointer.current} />
        </Suspense>
      </Canvas>
    </div>
  );
}