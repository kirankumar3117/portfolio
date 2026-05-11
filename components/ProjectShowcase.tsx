'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Lock, ChevronRight, X, CheckCircle2 } from 'lucide-react';
import { PROJECTS, Project } from '@/data/projects';

const INITIAL_COUNT = 3;

export default function ProjectShowcase() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? PROJECTS : PROJECTS.slice(0, INITIAL_COUNT);

  // Prevent background scrolling when modal is open
  if (typeof window !== 'undefined') {
    document.body.style.overflow = selectedProject ? 'hidden' : 'unset';
  }

  return (
    <>
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
            {visibleProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col"
              >
                {/* Animated Glow on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${project.color} rounded-full blur-[80px] opacity-30`} />
                </div>

                {/* Abstract Gradient Header (Replaces Screenshots) */}
                <div className={`h-48 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-40 transition-opacity relative shrink-0`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <project.icon className="w-16 h-16 text-white/50 group-hover:scale-110 transition-transform duration-500" />
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
                <div className="p-8 relative z-10 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">{project.category}</span>
                      <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-purple-300 transition-colors">{project.title}</h3>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                    {project.description}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((t) => (
                      <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 group-hover:border-white/20 transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Footer / Links */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Impact</span>
                      <span className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">{project.stats}</span>
                    </div>

                    <div className="flex gap-3 relative z-20 mt-4 ml-2">
                      {/* Deep Dive Button */}
                      {(project.problemStatement || project.technicalHighlights) && (
                        <button 
                          onClick={() => setSelectedProject(project)}
                          className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors py-2 px-3 bg-purple-500/10 rounded-full hover:bg-purple-500/20"
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      )}

                      {!project.isConfidential && project.githubUrl && (
                         <a href={project.githubUrl} target="_blank" className="p-2 bg-white/5 hover:bg-white/20 border border-white/5 hover:border-white/20 rounded-full transition-all text-white hover:text-purple-300 hover:scale-110" aria-label="View Source Code">
                           <Github size={18} />
                         </a>
                      )}
                      
                      {!project.isConfidential && project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" className="p-2 bg-white/5 hover:bg-white/20 border border-white/5 hover:border-white/20 rounded-full transition-all text-white hover:text-blue-300 hover:scale-110" aria-label="Visit Live Site">
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View More / Less */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mt-16"
          >
            <button
              onClick={() => setShowAll(prev => !prev)}
              className="group flex items-center gap-3 px-8 py-4 border border-white/10 hover:border-purple-500/50 rounded-full text-gray-400 hover:text-white text-sm font-semibold transition-all duration-300 hover:bg-purple-500/10 backdrop-blur-sm"
            >
              {showAll ? (
                <>Show Less<ChevronRight size={16} className="rotate-[-90deg] group-hover:-translate-y-0.5 transition-transform" /></>
              ) : (
                <>View All {PROJECTS.length} Projects <ChevronRight size={16} className="rotate-90 group-hover:translate-y-0.5 transition-transform" /></>
              )}
            </button>
          </motion.div>

        </div>
      </section>

      {/* --- DEEP DIVE MODAL OVERLAY --- */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0c] border border-white/10 rounded-3xl shadow-2xl z-10"
              style={{ overflowX: 'hidden' }}
            >
              {/* Modal Header banner */}
              <div className={`h-32 md:h-40 bg-gradient-to-br ${selectedProject.color} opacity-20 relative`} />
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-white/10 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all z-20 backdrop-blur-md"
              >
                <X size={20} />
              </button>

              <div className="px-6 md:px-12 pb-12 -mt-16 md:-mt-20 relative z-10">
                {/* Icon & Title */}
                <div className="flex items-end gap-6 mb-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-[#121214] border-4 border-[#0a0a0c] rounded-2xl flex items-center justify-center shadow-xl">
                    <selectedProject.icon className={`w-12 h-12 md:w-16 md:h-16 text-transparent bg-clip-text bg-gradient-to-br ${selectedProject.color}`} style={{ color: "white", opacity: 0.8 }} />
                  </div>
                  <div className="pb-2">
                    <span className="text-xs md:text-sm font-mono text-purple-400 uppercase tracking-wider">{selectedProject.category}</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mt-1">{selectedProject.title}</h2>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                  {/* Left Column: Context (2/3 width) */}
                  <div className="md:col-span-2 space-y-10">
                    
                    {/* The Problem */}
                    {selectedProject.problemStatement && (
                      <section>
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" /> The Challenge
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                          {selectedProject.problemStatement}
                        </p>
                      </section>
                    )}

                    {/* The Solution */}
                    {selectedProject.solution && (
                      <section>
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500" /> The Solution
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                          {selectedProject.solution}
                        </p>
                      </section>
                    )}

                    {/* Technical Highlights */}
                    {selectedProject.technicalHighlights && selectedProject.technicalHighlights.length > 0 && (
                       <section>
                         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-purple-500" /> Engineering Highlights
                         </h3>
                         <ul className="space-y-4">
                           {selectedProject.technicalHighlights.map((highlight, idx) => (
                             <li key={idx} className="flex items-start gap-3 bg-white/5 border border-white/5 p-4 rounded-xl">
                               <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                               <span className="text-gray-300 text-sm md:text-base leading-relaxed">{highlight}</span>
                             </li>
                           ))}
                         </ul>
                       </section>
                    )}
                  </div>

                  {/* Right Column: Meta Info (1/3 width) */}
                  <div className="space-y-8">
                    {/* Tech Stack Breakdown */}
                    <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map((t) => (
                          <span key={t} className="px-3 py-1.5 bg-black/50 border border-white/10 rounded-md text-xs font-mono text-gray-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </section>
                    
                    {/* Future Scope */}
                    {selectedProject.futureScope && (
                      <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
                        <h4 className="text-sm font-bold text-purple-300 mb-3 uppercase tracking-wider">Future Scope</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {selectedProject.futureScope}
                        </p>
                      </section>
                    )}

                    {/* Source Code / Repositories */}
                    {selectedProject.repositories && selectedProject.repositories.length > 0 && (
                      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                          <Github className="w-4 h-4" /> Repositories
                        </h4>
                        <div className="flex flex-col gap-3">
                          {selectedProject.repositories.map((repo, idx) => (
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
                              <span className="text-xs text-gray-500 truncate mt-1">{repo.url.replace('https://github.com/', '')}</span>
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
    </>
  );
}