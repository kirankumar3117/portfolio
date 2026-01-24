'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Lock, Database, Shield, Server, Cpu, Globe } from 'lucide-react';
import Image from 'next/image';

// --- DATA: YOUR REAL PROJECTS ---
const PROJECTS = [
  {
    title: "Industrial Logistics ERP",
    category: "Enterprise Architecture",
    description: "A mission-critical platform managing LPG distribution for 1,000+ active agencies. Engineered a custom 'Multi-Tab State Synchronization' engine to prevent data corruption during high-volume workflows.",
    tech: ["Next.js", "TypeScript", "Pinia", "Python FastAPI", "Redis"],
    isConfidential: true, // Hides Code links
    stats: "50k+ Daily Txns",
    icon: Database,
    color: "from-blue-600 to-cyan-500"
  },
  {
    title: "Granular RBAC Security Engine",
    category: "System Security",
    description: "Architected a custom Identity & Access Management (IAM) system for HR payroll data. Implemented resource-level permission gates that dynamically render UI components based on user roles (Admin/Manager/Employee).",
    tech: ["React", "Node.js", "JWT", "Audit Logging", "Middleware"],
    isConfidential: true,
    stats: "Zero Breaches",
    icon: Shield,
    color: "from-purple-600 to-pink-500"
  },
  {
    title: "3D Interactive Portfolio",
    category: "Creative Engineering",
    description: "The site you are looking at right now. A showcase of WebGL performance, integrating React Three Fiber for 3D visuals and a custom-built 'Local LLM' chat agent running entirely in the browser.",
    tech: ["R3F (Three.js)", "Tailwind", "Framer Motion", "EmailJS"],
    isConfidential: false, // Shows Code links
    liveUrl: "#",
    githubUrl: "https://github.com/kirankumar3117",
    stats: "100/100 Lighthouse",
    icon: Globe,
    color: "from-emerald-500 to-green-500"
  }
];

export default function ProjectShowcase() {
  return (
    <section className="py-32 bg-black relative" id="work">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Works.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            A mix of mission-critical enterprise systems (NDA Protected) and creative open-source engineering.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-colors"
            >
              {/* Abstract Gradient Header (Replaces Screenshots) */}
              <div className={`h-48 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <project.icon className="w-16 h-16 text-white/50" />
                </div>

                {/* Confidential Badge */}
                {project.isConfidential && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
                    <Lock size={12} className="text-yellow-400" />
                    <span className="text-[10px] font-bold text-yellow-100 uppercase tracking-wide">Enterprise / NDA</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">{project.category}</span>
                    <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">{project.title}</h3>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((t) => (
                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-gray-300">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Footer / Links */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase">Impact</span>
                    <span className="text-sm font-bold text-white">{project.stats}</span>
                  </div>

                  <div className="flex gap-3">
                    {project.isConfidential ? (
                      <span className="text-xs text-gray-600 italic cursor-not-allowed">Code Private</span>
                    ) : (
                      <>
                        <a href={project.githubUrl} target="_blank" className="p-2 bg-white/5 hover:bg-white/20 rounded-full transition text-white">
                          <Github size={18} />
                        </a>
                        <a href={project.liveUrl} target="_blank" className="p-2 bg-white/5 hover:bg-white/20 rounded-full transition text-white">
                          <ExternalLink size={18} />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}