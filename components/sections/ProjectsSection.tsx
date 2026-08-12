import ProjectsExperience from '@/components/universe/ProjectsExperience';

export default function ProjectsSection() {
  return (
    <div id="projects" className="scroll-mt-24 border-t border-white/5 pb-24 pt-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-indigo-300/80">Projects</p>
        <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
          Selected{' '}
          <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Works.
          </span>
        </h2>
        <p className="mb-16 max-w-2xl text-gray-400">
          A mix of mission-critical enterprise systems (NDA Protected) and creative open-source engineering.
        </p>

        <ProjectsExperience />
      </div>
    </div>
  );
}
