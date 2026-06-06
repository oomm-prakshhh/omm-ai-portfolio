'use client';
/* eslint-disable react-hooks/purity, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── Pulsing inner energy core ───────────────────────────────────────────────
function InnerCore({ hovered }: { hovered: boolean }) {
  const innerRef = useRef<THREE.Mesh>(null!);
  const shellRef = useRef<THREE.Mesh>(null!);
  const matRef   = useRef<any>(null!);
  const eiRef    = useRef(1.8);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // breathing pulse
    const pulse = 1 + Math.sin(t * 2.4) * 0.07;
    innerRef.current.scale.setScalar(pulse);
    // shell slow rotation
    shellRef.current.rotation.x += 0.004;
    shellRef.current.rotation.y += 0.006;
    // hover glow
    eiRef.current = THREE.MathUtils.lerp(eiRef.current, hovered ? 4.5 : 1.8, 0.06);
    if (matRef.current) matRef.current.emissiveIntensity = eiRef.current;
  });

  return (
    <group>
      {/* Tiny hotspot glow */}
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshBasicMaterial color="#7dd3fc" />
      </mesh>

      {/* Mid energized shell */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <MeshDistortMaterial
          ref={matRef}
          color="#050b1a"
          roughness={0.05}
          metalness={1}
          emissive="#0ea5e9"
          emissiveIntensity={1.8}
          distort={0.5}
          speed={3}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Outer glass shell */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#0c1a2e"
          roughness={0.0}
          metalness={1}
          emissive="#22d3ee"
          emissiveIntensity={0.4}
          transparent
          opacity={0.18}
          wireframe={false}
        />
      </mesh>

      {/* Wireframe icosahedron for geometric edge lines */}
      <mesh>
        <icosahedronGeometry args={[0.92, 2]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.12} wireframe />
      </mesh>
    </group>
  );
}

// ─── Single orbital ring with glowing nodes ───────────────────────────────────
interface RingProps {
  radius: number;
  tubeRadius: number;
  color: string;
  speed: number;
  initialRotation: [number, number, number];
  nodeCount: number;
  nodeSize: number;
}

function OrbitalRing({ radius, tubeRadius, color, speed, initialRotation, nodeCount, nodeSize }: RingProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const baseRot  = useMemo(() => new THREE.Euler(...initialRotation), [initialRotation]);

  const nodePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      positions.push([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
    }
    return positions;
  }, [radius, nodeCount]);

  useFrame((_, delta) => {
    groupRef.current.rotation.z += speed * delta;
  });

  return (
    <group rotation={baseRot}>
      <group ref={groupRef}>
        {/* Ring tube */}
        <mesh>
          <torusGeometry args={[radius, tubeRadius, 20, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.2}
            roughness={0.05}
            metalness={0.95}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Glowing nodes */}
        {nodePositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[nodeSize, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={color}
              emissiveIntensity={5}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── Animated light-trail arc ─────────────────────────────────────────────────
function LightTrail({ radius, color, speed, offset, tiltX, tiltZ }: {
  radius: number; color: string; speed: number; offset: number; tiltX: number; tiltZ: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const arcPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 1.4 - Math.PI * 0.7;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
    }
    return pts;
  }, [radius]);

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(arcPoints);
    const g = new THREE.TubeGeometry(curve, 64, 0.008, 8, false);
    return g;
  }, [arcPoints]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.z = t * speed + offset;
  });

  return (
    <mesh ref={ref} rotation={[tiltX, 0, tiltZ]}>
      <primitive object={geometry} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}

// ─── Floating neural particles ─────────────────────────────────────────────────
function NeuralParticles() {
  const ref = useRef<THREE.Points>(null!);
  const innerRef = useRef<THREE.Points>(null!);

  const count  = 300;
  const iCount = 50;

  const [outerPositions, outerColors, innerPositions, innerColors] = useMemo(() => {
    const pos   = new Float32Array(count  * 3);
    const cols  = new Float32Array(count  * 3);
    const ipos  = new Float32Array(iCount * 3);
    const icols = new Float32Array(iCount * 3);

    const cyan    = new THREE.Color('#22d3ee');
    const blue    = new THREE.Color('#3b82f6');
    const indigo  = new THREE.Color('#818cf8');
    const white   = new THREE.Color('#e0f2fe');

    for (let i = 0; i < count; i++) {
      const u = Math.random(), v = Math.random();
      const theta = u * Math.PI * 2;
      const phi   = Math.acos(2 * v - 1);
      const r     = 2.2 + Math.random() * 2.8;
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
      const c = [cyan, blue, indigo, white][Math.floor(Math.random() * 4)].clone();
      cols[i*3] = c.r; cols[i*3+1] = c.g; cols[i*3+2] = c.b;
    }
    for (let i = 0; i < iCount; i++) {
      const u = Math.random(), v = Math.random();
      const theta = u * Math.PI * 2;
      const phi   = Math.acos(2 * v - 1);
      const r     = 1.0 + Math.random() * 0.6;
      ipos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      ipos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      ipos[i*3+2] = r * Math.cos(phi);
      const c = cyan.clone().lerp(white, Math.random() * 0.4);
      icols[i*3] = c.r; icols[i*3+1] = c.g; icols[i*3+2] = c.b;
    }
    return [pos, cols, ipos, icols];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y      = t * 0.04;
    ref.current.rotation.x      = t * 0.02;
    innerRef.current.rotation.y = -t * 0.08;
    innerRef.current.rotation.z =  t * 0.05;
  });

  return (
    <>
      {/* Outer cloud */}
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[outerPositions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[outerColors,    3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* Inner dense halo */}
      <points ref={innerRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[innerPositions, 3]} />
          <bufferAttribute attach="attributes-color"    args={[innerColors,    3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

// ─── Outer geodesic cage ───────────────────────────────────────────────────────
function GeoCage() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.07;
    ref.current.rotation.y = t * 0.04;
    ref.current.rotation.z = t * 0.03;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.0, 1]} />
      <meshBasicMaterial color="#1e40af" transparent opacity={0.06} wireframe />
    </mesh>
  );
}

// ─── Dynamic coloured point lights ────────────────────────────────────────────
function AnimatedLights() {
  const light1 = useRef<THREE.PointLight>(null!);
  const light2 = useRef<THREE.PointLight>(null!);
  const light3 = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    light1.current.position.set(Math.sin(t * 0.7) * 4, Math.cos(t * 0.5) * 3, 2);
    light2.current.position.set(Math.cos(t * 0.9) * 4, Math.sin(t * 0.6) * 3, -2);
    light3.current.position.set(Math.sin(t * 1.1) * 2, -3, Math.cos(t * 0.8) * 4);
  });

  return (
    <>
      <pointLight ref={light1} color="#22d3ee" intensity={3}   distance={12} />
      <pointLight ref={light2} color="#3b82f6" intensity={2.5} distance={12} />
      <pointLight ref={light3} color="#818cf8" intensity={1.5} distance={10} />
    </>
  );
}

// ─── Master scene ──────────────────────────────────────────────────────────────
function AIScene() {
  const rootRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const { pointer } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Mouse reactive tilt
    rootRef.current.rotation.y = THREE.MathUtils.lerp(rootRef.current.rotation.y, pointer.x * 0.4, 0.04);
    rootRef.current.rotation.x = THREE.MathUtils.lerp(rootRef.current.rotation.x, -pointer.y * 0.4, 0.04);
    // Floating
    rootRef.current.position.y = Math.sin(t * 0.9) * 0.12;
  });

  return (
    <group ref={rootRef}>
      {/* Dynamic lights */}
      <AnimatedLights />
      <ambientLight intensity={0.15} />

      {/* Outer geodesic wireframe cage */}
      <GeoCage />

      {/* Neural particle clouds */}
      <NeuralParticles />

      {/* Light trail arcs */}
      <LightTrail radius={1.35} color="#22d3ee" speed={0.8}  offset={0}            tiltX={Math.PI/3}   tiltZ={0} />
      <LightTrail radius={1.6}  color="#3b82f6" speed={-1.1} offset={Math.PI*0.6}  tiltX={-Math.PI/4}  tiltZ={Math.PI/5} />
      <LightTrail radius={1.9}  color="#818cf8" speed={0.6}  offset={Math.PI*1.2}  tiltX={Math.PI/6}   tiltZ={-Math.PI/4} />
      <LightTrail radius={2.15} color="#06b6d4" speed={-0.7} offset={Math.PI*0.3}  tiltX={-Math.PI/2.5} tiltZ={Math.PI/6} />

      {/* Orbital ring system — 6 rings at unique angles and speeds */}
      <OrbitalRing radius={1.45} tubeRadius={0.014} color="#22d3ee" speed={0.55}  initialRotation={[Math.PI/2,    0,             0]}           nodeCount={3} nodeSize={0.055} />
      <OrbitalRing radius={1.7}  tubeRadius={0.011} color="#3b82f6" speed={-0.75} initialRotation={[Math.PI/5,   -Math.PI/4,    0]}           nodeCount={2} nodeSize={0.048} />
      <OrbitalRing radius={1.95} tubeRadius={0.009} color="#818cf8" speed={0.4}   initialRotation={[-Math.PI/3,   Math.PI/3,    0]}           nodeCount={4} nodeSize={0.04}  />
      <OrbitalRing radius={2.2}  tubeRadius={0.007} color="#0ea5e9" speed={-0.35} initialRotation={[Math.PI/7,    Math.PI/6,   -Math.PI/5]}   nodeCount={0} nodeSize={0.035} />
      <OrbitalRing radius={2.45} tubeRadius={0.006} color="#38bdf8" speed={0.22}  initialRotation={[-Math.PI/2.5, Math.PI/2.5,  Math.PI/3.5]} nodeCount={0} nodeSize={0.03}  />
      <OrbitalRing radius={2.65} tubeRadius={0.005} color="#1d4ed8" speed={-0.18} initialRotation={[Math.PI/4,   -Math.PI/5,   Math.PI/4]}   nodeCount={0} nodeSize={0.025} />

      {/* Central energy core (interactive) */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true);  }}
        onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); }}
      >
        <sphereGeometry args={[1.0, 4, 4]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <InnerCore hovered={hovered} />
    </group>
  );
}

// ─── Canvas export ─────────────────────────────────────────────────────────────
export default function AICoreCanvas() {
  return (
    <div className="w-full h-[320px] sm:h-[420px] md:h-[520px] cursor-grab active:cursor-grabbing select-none flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <AIScene />
      </Canvas>
    </div>
  );
}
