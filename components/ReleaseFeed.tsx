'use client';

import { motion } from 'framer-motion';
import { GitCommit, Star, Trophy, Rocket, Briefcase, GraduationCap } from 'lucide-react';

// --- YOUR CAREER STORY ---
const MILESTONES = [
  {
    version: "Current Focus",
    date: "Present",
    title: "Architecting Industrial Scale Systems",
    tag: "Lead Engineer",
    icon: Rocket,
    color: "text-purple-400",
    description: "Leading the frontend architecture for high-concurrency logistics platforms.",
    changes: [
      "Building 'NEWGAS' ERP for 1,000+ distributors",
      "Designing Offline-First architectures with Pinia",
      "Mentoring junior developers on React patterns"
    ]
  },
  {
    version: "2024",
    date: "Dec 2024",
    title: "Employee of the Month",
    tag: "Recognition",
    icon: Trophy,
    color: "text-yellow-400",
    description: "Awarded at Blue Ray Automation for exceptional delivery speed and technical leadership.",
    changes: [
      " delivered critical RBAC security module ahead of schedule",
      "Optimized legacy codebase reducing load times by 40%"
    ]
  },
  {
    version: "The Pivot",
    date: "2023",
    title: "Mechanical to Software Transformation",
    tag: "Education",
    icon: GraduationCap,
    color: "text-blue-400",
    description: "Graduated as a Mechanical Engineer but realized my passion lay in software logic. Committed to a 1,200+ hour intensive coding bootcamp.",
    changes: [
      "Mastered MERN Stack at Masai School",
      "Built 3 full-stack clones of major apps",
      "Top 5% of class in Data Structures & Algorithms"
    ]
  }
];

export default function ReleaseFeed() {
  return (
    <section className="py-32 bg-black relative border-t border-white/10" id="notes">

      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Engineering <span className="text-purple-500">Journey.</span>
          </h2>
          <p className="text-gray-400">
            From mechanical systems to distributed software systems.
          </p>
        </motion.div>

        {/* Timeline Line */}
        <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-16">
          {MILESTONES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative pl-12 md:pl-16"
            >
              {/* Timeline Dot */}
              <div className={`absolute -left-[9px] md:-left-[11px] top-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-black border-2 border-white/20 flex items-center justify-center ${item.color}`}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
              </div>

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                <span className={`text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/10 w-fit ${item.color}`}>
                  {item.tag}
                </span>
                <span className="text-sm text-gray-500 font-mono">{item.date}</span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                {item.title}
                <item.icon size={20} className={item.color} />
              </h3>

              <p className="text-gray-400 mb-6 leading-relaxed max-w-2xl">
                {item.description}
              </p>

              {/* Bullet Points */}
              <ul className="space-y-3">
                {item.changes.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                    <GitCommit size={16} className="mt-1 text-gray-600 shrink-0" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}