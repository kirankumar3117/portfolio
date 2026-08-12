import { GitCommit, ArrowRight } from 'lucide-react';
import ChapterSection from '@/components/universe/ChapterSection';
import TechUniverse from '@/components/universe/TechUniverse';
import ProfilePhoto from '@/components/universe/ProfilePhoto';
import JourneyFeed from '@/components/universe/JourneyFeed';
import { PROJECTS } from '@/data/projects';

const ENGINEERING_TITLES = ['Newgas — LPG Distribution ERP', 'Officeous — HRMS'];
const PRODUCT_TITLES = ['Kiggidi', 'Smart Kirana'];

const ENGINEERING_PROJECTS = PROJECTS.filter((p) => ENGINEERING_TITLES.includes(p.title));
const PRODUCT_PROJECTS = PROJECTS.filter((p) => PRODUCT_TITLES.includes(p.title));

export default function AboutSection() {
  return (
    <div id="about" className="scroll-mt-24">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 px-6 pb-12 pt-24 sm:flex-row sm:items-center">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-indigo-300/80">Engineering Journey</p>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            From mechanical systems <br className="hidden sm:block" /> to distributed software systems.
          </h2>
        </div>

        <ProfilePhoto />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <JourneyFeed />
      </div>

      <ChapterSection number="01" title="Engineering" subtitle="Enterprise Systems & Architecture">
        <div className="mb-12 grid gap-8 sm:grid-cols-2">
          {ENGINEERING_PROJECTS.map((project) => (
            <div key={project.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-mono uppercase tracking-wider text-purple-400">{project.category}</p>
              <h3 className="mt-1 mb-4 text-xl font-bold text-white">{project.title}</h3>
              <ul className="space-y-3">
                {(project.technicalHighlights ?? []).slice(0, 3).map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-sm text-gray-400">
                    <GitCommit size={14} className="mt-1 shrink-0 text-gray-600" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <TechUniverse />
      </ChapterSection>

      <ChapterSection number="02" title="Products" subtitle="Kiggidi & The Rest">
        <div className="grid gap-8 sm:grid-cols-2">
          {PRODUCT_PROJECTS.map((project) => (
            <a
              key={project.title}
              href="#projects"
              data-cursor="explore"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
            >
              <p className="text-xs font-mono uppercase tracking-wider text-purple-400">{project.category}</p>
              <h3 className="mt-1 mb-3 text-xl font-bold text-white">{project.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-400">{project.description}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-white transition-all group-hover:gap-2">
                Explore <ArrowRight size={14} />
              </span>
            </a>
          ))}
        </div>
      </ChapterSection>
    </div>
  );
}
