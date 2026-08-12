'use client';

import { motion } from 'framer-motion';

interface ChapterSectionProps {
  number: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function ChapterSection({ number, title, subtitle, children }: ChapterSectionProps) {
  return (
    <section className="border-t border-white/5 py-24 first:border-t-0 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-start gap-6"
        >
          <span className="font-mono text-sm text-indigo-400/70">{number}</span>
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{title}</h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{subtitle}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
