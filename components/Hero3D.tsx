'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// The Liquid Object (Upgraded Visuals)
function LiquidShape() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const { x, y } = state.pointer;
      // Smoother interpolation for mouse following
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, y / 1.5, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x / 1.5, 0.05);
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={1.2} floatIntensity={1.5}>
      <Sphere
        args={[1, 128, 128]} // Higher polygon count for smoother waves
        scale={2.4}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        ref={meshRef}
      >
        <MeshDistortMaterial
          color={hovered ? "#9333ea" : "#2563eb"} // Purple to Royal Blue
          attach="material"
          distort={0.55} // Perfect liquid viscosity
          speed={hovered ? 3 : 1.5}
          roughness={0.1} // Shinier surface
          metalness={0.8} // Metallic look
        />
      </Sphere>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">

      {/* 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <pointLight position={[-10, -10, -5]} intensity={1} color="#a855f7" />
          <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1.5} />
          <LiquidShape />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center px-6 relative"
        >
          {/* Background Glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/20 blur-[100px] rounded-full" />

          {/* NAME UPGRADE */}
          <h1 className="relative text-7xl md:text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            KIRAN KUMAR
          </h1>

          {/* ROLE UPGRADE */}
          <p className="relative mt-6 text-xl md:text-2xl text-gray-400 font-light tracking-wide max-w-3xl mx-auto">
            Senior Full-Stack Engineer.
            <span className="block md:inline text-gray-500 mt-2 md:mt-0"> Architecting scalable systems with <span className="text-purple-400 font-medium">React & Node.js</span>.</span>
          </p>

          {/* BUTTONS (Now Functional) */}
          <div className="relative mt-12 pointer-events-auto flex flex-col md:flex-row gap-5 justify-center items-center">
            <a
              href="#work"
              className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-10 py-4 border border-white/20 backdrop-blur-xl text-white rounded-full hover:bg-white/10 hover:border-white/40 transition-all"
            >
              Contact Me
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 text-sm animate-bounce"
      >
        Scroll to explore
      </motion.div>
    </div>
  );
}