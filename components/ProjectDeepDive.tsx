'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, X, CheckCircle2 } from 'lucide-react';
import { Project } from '@/data/projects';

interface ProjectDeepDiveProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDeepDive({ project, onClose }: ProjectDeepDiveProps) {
  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0c] border border-white/10 rounded-3xl shadow-2xl"
            style={{ overflowX: 'hidden' }}
          >
            <div className={`h-32 md:h-40 bg-gradient-to-br ${project.color} opacity-20 relative`} />

            <button
              onClick={onClose}
              aria-label="Close project details"
              className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all z-20 backdrop-blur-md"
            >
              <X size={20} />
            </button>

            <div className="px-6 md:px-12 pb-12 -mt-16 md:-mt-20 relative z-10">
              <div className="flex items-end gap-6 mb-8">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-[#121214] border-4 border-[#0a0a0c] rounded-2xl flex items-center justify-center shadow-xl">
                  <project.icon
                    className={`w-12 h-12 md:w-16 md:h-16 text-transparent bg-clip-text bg-gradient-to-br ${project.color}`}
                    style={{ color: 'white', opacity: 0.8 }}
                  />
                </div>
                <div className="pb-2">
                  <span className="text-xs md:text-sm font-mono text-purple-400 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mt-1">{project.title}</h2>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-10">
                  {project.problemStatement && (
                    <section>
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" /> The Challenge
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                        {project.problemStatement}
                      </p>
                    </section>
                  )}

                  {project.solution && (
                    <section>
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" /> The Solution
                      </h3>
                      <p className="text-gray-400 leading-relaxed text-sm md:text-base">{project.solution}</p>
                    </section>
                  )}

                  {project.technicalHighlights && project.technicalHighlights.length > 0 && (
                    <section>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" /> Engineering Highlights
                      </h3>
                      <ul className="space-y-4">
                        {project.technicalHighlights.map((highlight, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 bg-white/5 border border-white/5 p-4 rounded-xl"
                          >
                            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm md:text-base leading-relaxed">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                <div className="space-y-8">
                  <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1.5 bg-black/50 border border-white/10 rounded-md text-xs font-mono text-gray-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </section>

                  {project.futureScope && (
                    <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-purple-300 mb-3 uppercase tracking-wider">
                        Future Scope
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{project.futureScope}</p>
                    </section>
                  )}

                  {project.repositories && project.repositories.length > 0 && (
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Github className="w-4 h-4" /> Repositories
                      </h4>
                      <div className="flex flex-col gap-3">
                        {project.repositories.map((repo, idx) => (
                          <a
                            key={idx}
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col p-3 bg-black/50 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all"
                          >
                            <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                              {repo.name}
                              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                            <span className="text-xs text-gray-500 truncate mt-1">
                              {repo.url.replace('https://github.com/', '')}
                            </span>
                          </a>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
