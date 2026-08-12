'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SKILL_NODES, SKILL_CATEGORIES, SkillCategory, SkillNode } from '@/data/skills';

const CATEGORY_ORDER: SkillCategory[] = ['frontend', 'backend', 'database', 'infrastructure', 'architecture'];

export default function TechUniverse() {
  const [active, setActive] = useState<SkillNode | null>(null);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-10">
      <p className="mb-8 font-mono text-xs uppercase tracking-widest text-indigo-300/80">
        The Technical Universe
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORY_ORDER.map((cat) => {
          const meta = SKILL_CATEGORIES[cat];
          const nodes = SKILL_NODES.filter((n) => n.category === cat);
          return (
            <div key={cat}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: meta.color }}>
                {meta.label}
              </p>
              <ul className="space-y-2">
                {nodes.map((node) => (
                  <li key={node.id}>
                    <button
                      type="button"
                      data-cursor="hover"
                      onMouseEnter={() => setActive(node)}
                      onFocus={() => setActive(node)}
                      onClick={() => setActive(node)}
                      aria-pressed={active?.id === node.id}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        active?.id === node.id
                          ? 'border-white/30 bg-white/10 text-white'
                          : 'border-white/5 bg-black/30 text-gray-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {node.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <motion.div
        key={active?.id ?? 'empty'}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        role="status"
        className="mt-8 min-h-[3rem] rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-gray-300"
      >
        {active ? (
          <>
            <span className="font-semibold text-white">{active.label}</span> — {active.description}
          </>
        ) : (
          'Hover or tap a technology to see how it was actually used.'
        )}
      </motion.div>
    </div>
  );
}
