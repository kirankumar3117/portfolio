'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUniverseStore } from '@/store/universeStore';

const STATUS_LINES = [
  'Booting the universe…',
  'Compiling the wireframe…',
  'Calibrating particles…',
  'Warming up the core…',
  'Almost there…',
];

export default function LoadingScreen() {
  const sceneReady = useUniverseStore((s) => s.sceneReady);
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  // Climbs smoothly toward ~92% on its own (nothing to genuinely measure —
  // there's no external asset loading here) and stops once the canvas has
  // actually reported back as created; the last stretch to 100% is derived
  // at render time below rather than stored, so there's nothing to
  // set-state-in-effect here.
  useEffect(() => {
    if (sceneReady) return;
    const interval = setInterval(() => {
      setProgress((p) => (p < 92 ? p + (92 - p) * 0.08 + 0.4 : p));
    }, 80);
    return () => clearInterval(interval);
  }, [sceneReady]);

  useEffect(() => {
    if (!sceneReady) return;
    const timeout = setTimeout(() => setHidden(true), 500);
    return () => clearTimeout(timeout);
  }, [sceneReady]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_LINES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  if (hidden) return null;

  const displayProgress = sceneReady ? 100 : progress;

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[3000] flex flex-col items-center justify-center bg-black"
        >
          <p className="mb-6 font-mono text-3xl font-bold tabular-nums text-white">
            {Math.floor(displayProgress)}%
          </p>

          <div className="h-1 w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-indigo-400"
              animate={{ width: `${displayProgress}%` }}
              transition={{ ease: 'easeOut', duration: 0.15 }}
            />
          </div>

          <p className="mt-6 font-mono text-xs text-gray-500">{STATUS_LINES[statusIndex]}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
