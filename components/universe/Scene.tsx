'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars, Sparkles, Text } from '@react-three/drei';
import { useRef, type ComponentRef } from 'react';
import * as THREE from 'three';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { useUniverseStore } from '@/store/universeStore';

// A slowly rotating wireframe shell around a soft distorted core —
// reads as "an idea compiling", not a stock 3D primitive.
function CentralCore({ reducedMotion }: { reducedMotion: boolean }) {
  const shellRef = useRef<THREE.Mesh>(null!);
  const shellMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const coreMaterialRef = useRef<ComponentRef<typeof MeshDistortMaterial>>(null!);
  const shellBasePositions = useRef<Float32Array | null>(null);
  const isPlaying = useUniverseStore((s) => s.isPlaying);

  useFrame((state, delta) => {
    const { x, y } = state.pointer;
    const t = state.clock.elapsedTime;

    if (shellRef.current) {
      if (!reducedMotion) shellRef.current.rotation.y += delta * 0.06;
      shellRef.current.rotation.x = THREE.MathUtils.lerp(shellRef.current.rotation.x, y * 0.2, 0.04);

      // Each wireframe vertex pulses outward/inward on its own phase —
      // a stylized rhythm (no raw audio access is possible from the
      // Spotify/YouTube embeds), driven every frame so it stays smooth
      // and gated on isPlaying so it's still when nothing's playing.
      const posAttr = shellRef.current.geometry.attributes.position;
      if (!shellBasePositions.current) {
        shellBasePositions.current = new Float32Array(posAttr.array);
      }
      const base = shellBasePositions.current;

      for (let i = 0; i < posAttr.count; i++) {
        const ix = i * 3;
        const bx = base[ix];
        const by = base[ix + 1];
        const bz = base[ix + 2];

        let pulse = 0;
        if (isPlaying && !reducedMotion) {
          const seed = i * 0.7;
          pulse = Math.sin(t * 3.2 + seed) * 0.06 + Math.sin(t * 5.1 + seed * 1.5) * 0.03;
        }

        const scale = 1 + pulse;
        posAttr.setXYZ(i, bx * scale, by * scale, bz * scale);
      }
      posAttr.needsUpdate = true;
    }

    // Subtle, muted hue drift while playing — stays inside the site's own
    // cyan→indigo→violet palette rather than a full rainbow, and just
    // holds the static brand color when nothing's playing.
    if (shellMaterialRef.current) {
      if (isPlaying && !reducedMotion) {
        shellMaterialRef.current.color.setHSL(0.62 + Math.sin(t * 0.25) * 0.06, 0.5, 0.68);
      } else {
        shellMaterialRef.current.color.set('#6d7bff');
      }
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = THREE.MathUtils.lerp(coreRef.current.rotation.y, x * 0.3, 0.04);
      const pulse = isPlaying && !reducedMotion ? 1 + Math.sin(t * 2) * 0.06 : 1;
      const nextScale = THREE.MathUtils.lerp(coreRef.current.scale.x, pulse, 0.1);
      coreRef.current.scale.setScalar(nextScale);
    }

    if (coreMaterialRef.current) {
      if (isPlaying && !reducedMotion) {
        coreMaterialRef.current.color.setHSL(0.55 + Math.sin(t * 0.3 + 1.4) * 0.09, 0.65, 0.55);
      } else {
        coreMaterialRef.current.color.set('#5b6cff');
      }
    }
  });

  return (
    <group>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial ref={shellMaterialRef} color="#6d7bff" wireframe transparent opacity={0.35} />
      </mesh>
      <Sphere ref={coreRef} args={[1, 64, 64]} scale={0.9}>
        <MeshDistortMaterial
          ref={coreMaterialRef}
          color="#5b6cff"
          distort={0.35}
          speed={isPlaying ? 2.2 : 1}
          roughness={0.15}
          metalness={0.6}
        />
      </Sphere>
    </group>
  );
}

const CODE_FRAGMENTS: { text: string; position: [number, number, number] }[] = [
  { text: 'const build = () => ship();', position: [-3.4, 1.6, -2] },
  { text: 'git commit -m "ship it"', position: [3.6, -1.2, -1.5] },
  { text: 'while (learning) { grow(); }', position: [-2.8, -2, -3] },
  { text: '// TODO: nothing. it works.', position: [3.2, 2.1, -2.5] },
];

function CodeFragments({ count }: { count: number }) {
  const fragments = CODE_FRAGMENTS.slice(0, count);

  return (
    <>
      {fragments.map((fragment, i) => (
        <Float key={i} speed={0.6} floatIntensity={0.8} rotationIntensity={0.1}>
          <Text position={fragment.position} fontSize={0.22} color="#8b93b8" anchorX="center" anchorY="middle">
            {fragment.text}
          </Text>
        </Float>
      ))}
    </>
  );
}

export default function Scene() {
  const { isLowPower, prefersReducedMotion } = useDeviceCapability();
  const isPlaying = useUniverseStore((s) => s.isPlaying);
  const setSceneReady = useUniverseStore((s) => s.setSceneReady);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={isLowPower ? 1 : [1, 1.5]}
      gl={{ alpha: false, antialias: true }}
      onCreated={() => setSceneReady(true)}
    >
      <color attach="background" args={['#03030a']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 6, 4]} intensity={1.4} />
      <pointLight position={[-6, -4, -4]} intensity={0.8} color="#22d3ee" />

      <Stars
        radius={100}
        depth={50}
        count={isLowPower ? 1500 : 4500}
        factor={4}
        saturation={0}
        fade
        speed={prefersReducedMotion ? 0 : 1}
      />

      {/* Kept modest and constant regardless of playback — while a track is
          playing there's already real decode/JS work happening elsewhere,
          so this deliberately doesn't scale up and add to it. */}
      {!isLowPower && (
        <Sparkles
          count={30}
          scale={8}
          size={2}
          speed={prefersReducedMotion ? 0 : isPlaying ? 0.4 : 0.25}
          opacity={isPlaying ? 0.45 : 0.25}
          color="#7c6cf0"
        />
      )}

      <Float
        speed={prefersReducedMotion ? 0 : 1.4}
        rotationIntensity={prefersReducedMotion ? 0 : 0.4}
        floatIntensity={prefersReducedMotion ? 0 : 0.6}
      >
        <CentralCore reducedMotion={prefersReducedMotion} />
      </Float>

      {!isLowPower && <CodeFragments count={4} />}
    </Canvas>
  );
}
