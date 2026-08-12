'use client';

import { motion } from 'framer-motion';
import { GitCommit } from 'lucide-react';
import { JOURNEY_FEED } from '@/data/journey';

export default function JourneyFeed() {
  return (
    <div className="relative ml-4 space-y-16 border-l border-white/10 md:ml-6">
      {JOURNEY_FEED.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="relative pl-12 md:pl-16"
        >
          <div
            className={`absolute -left-[9px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white/20 bg-black md:-left-[11px] md:h-6 md:w-6 ${item.color}`}
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
          </div>

          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className={`w-fit rounded bg-white/5 px-2 py-1 font-mono text-xs ${item.color} border border-white/10`}>
              {item.tag}
            </span>
            <span className="font-mono text-sm text-gray-500">{item.date}</span>
          </div>

          <h3 className="mb-2 flex items-center gap-3 text-2xl font-bold text-white">
            {item.title}
            <item.icon size={20} className={item.color} />
          </h3>

          <p className="mb-6 max-w-2xl leading-relaxed text-gray-400">{item.description}</p>

          <ul className="space-y-3">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-sm text-gray-300">
                <GitCommit size={16} className="mt-1 shrink-0 text-gray-600" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
