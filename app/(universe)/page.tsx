import type { Metadata } from 'next';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import HireSection from '@/components/sections/HireSection';

export const metadata: Metadata = {
  title: 'Kiran Kumar | Software Guru',
};

export default function HomePage() {
  return (
    <main>
      <section id="home" className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-indigo-300/80">
          Full-Stack Engineer
        </p>

        <h1 className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-7xl">
          Kiran Kumar
        </h1>

        <p className="mt-6 max-w-md text-sm text-gray-400 sm:text-base">
          A small universe of things I&apos;ve built, learned, and shipped.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#about"
            data-cursor="explore"
            className="rounded-full bg-white px-10 py-4 text-sm font-bold text-black transition hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
          >
            About Me
          </a>
          <a
            href="#projects"
            data-cursor="explore"
            className="rounded-full border border-white/20 px-10 py-4 text-sm font-medium text-white backdrop-blur-xl transition hover:border-white/40 hover:bg-white/10"
          >
            Projects
          </a>
          <a
            href="#hire"
            data-cursor="explore"
            className="rounded-full border border-white/20 px-10 py-4 text-sm font-medium text-white backdrop-blur-xl transition hover:border-white/40 hover:bg-white/10"
          >
            Hire Me
          </a>
        </div>

        <p className="mt-16 font-mono text-xs text-gray-600">
          press <kbd className="rounded border border-white/10 px-1.5 py-0.5">⌘K</kbd> to explore
        </p>
      </section>

      <AboutSection />
      <ProjectsSection />
      <HireSection />
    </main>
  );
}
