'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { PROJECTS, Project } from '@/data/projects';

// Deterministic scatter layout (percentage of container) — deliberately
// hand-placed rather than randomised so the constellation is stable across
// renders and reads intentionally, not like a physics simulation.
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  Kiggidi: { x: 18, y: 20 },
  'Newgas — LPG Distribution ERP': { x: 55, y: 12 },
  'Officeous — HRMS': { x: 82, y: 38 },
  'Smart Kirana': { x: 30, y: 64 },
  'Granular RBAC Security Engine': { x: 65, y: 74 },
  '3D Interactive Portfolio': { x: 14, y: 84 },
};

const CONNECTIONS: [string, string][] = [
  ['Kiggidi', 'Newgas — LPG Distribution ERP'],
  ['Newgas — LPG Distribution ERP', 'Officeous — HRMS'],
  ['Kiggidi', 'Smart Kirana'],
  ['Smart Kirana', 'Granular RBAC Security Engine'],
  ['Granular RBAC Security Engine', 'Officeous — HRMS'],
  ['Smart Kirana', '3D Interactive Portfolio'],
];

interface ProjectConstellationProps {
  onExplore: (project: Project) => void;
}

export default function ProjectConstellation({ onExplore }: ProjectConstellationProps) {
  const [active, setActive] = useState<Project | null>(null);
  const positioned = PROJECTS.filter((p) => NODE_POSITIONS[p.title]);

  return (
    <div>
      {/* Desktop constellation */}
      <div className="relative hidden min-h-[640px] md:block">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {CONNECTIONS.map(([a, b], i) => {
            const from = NODE_POSITIONS[a];
            const to = NODE_POSITIONS[b];
            if (!from || !to) return null;
            return (
              <motion.line
                key={i}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                strokeWidth={1.5}
                initial={{ stroke: 'rgba(255,255,255,0.12)' }}
                whileInView={{ stroke: '#f97316' }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
              />
            );
          })}
        </svg>

        {positioned.map((project) => {
          const pos = NODE_POSITIONS[project.title];
          const isActive = active?.title === project.title;
          return (
            <button
              key={project.title}
              type="button"
              data-cursor="explore"
              onMouseEnter={() => setActive(project)}
              onFocus={() => setActive(project)}
              onClick={() => setActive(project)}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
            >
              <span
                className={`h-4 w-4 rounded-full border-2 transition ${
                  isActive ? 'scale-125 border-white bg-white' : 'border-white/40 bg-white/10'
                }`}
              />
              <span
                className={`whitespace-nowrap text-xs font-semibold uppercase tracking-wide transition ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                {project.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile fallback: simple list, no scatter layout */}
      <div className="space-y-3 md:hidden">
        {PROJECTS.map((project) => (
          <button
            key={project.title}
            type="button"
            onClick={() => setActive(project)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
              active?.title === project.title
                ? 'border-white/30 bg-white/10'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <span className="text-sm font-semibold text-white">{project.title}</span>
            <span className="text-xs text-gray-500">{project.category}</span>
          </button>
        ))}
      </div>

      {/* Shared preview panel */}
      <motion.div
        key={active?.title ?? 'empty'}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-6"
      >
        {active ? (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
                  {active.category}
                </span>
                {active.isConfidential && (
                  <span className="flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase text-yellow-100">
                    <Lock size={10} /> NDA
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">{active.title}</h3>
              <p className="mb-4 max-w-2xl text-sm leading-relaxed text-gray-400">{active.description}</p>
              <div className="flex flex-wrap gap-2">
                {active.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Impact</p>
                <p className="text-sm font-bold text-white">{active.stats}</p>
              </div>
              <button
                type="button"
                data-cursor="explore"
                onClick={() => onExplore(active)}
                className="flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold text-black transition hover:scale-105"
              >
                Explore <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Hover (or tap, on mobile) a node to preview a project.</p>
        )}
      </motion.div>
    </div>
  );
}
