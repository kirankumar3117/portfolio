import { GitCommit, ArrowRight } from 'lucide-react';
import ChapterSection from '@/components/universe/ChapterSection';
import TechUniverse from '@/components/universe/TechUniverse';
import ProfilePhoto from '@/components/universe/ProfilePhoto';
import { JOURNEY_CHAPTERS, RECOGNITION, SPEAKING } from '@/data/journey';
import { PROJECTS } from '@/data/projects';

function MilestoneBody({ description, bullets }: { description: string; bullets: string[] }) {
  return (
    <div className="max-w-2xl">
      <p className="mb-6 leading-relaxed text-gray-400">{description}</p>
      <ul className="space-y-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-sm text-gray-300">
            <GitCommit size={16} className="mt-1 shrink-0 text-gray-600" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const ENGINEERING_TITLES = ['Newgas — LPG Distribution ERP', 'Officeous — HRMS'];
const PRODUCT_TITLES = ['Kiggidi', 'Smart Kirana'];

const ENGINEERING_PROJECTS = PROJECTS.filter((p) => ENGINEERING_TITLES.includes(p.title));
const PRODUCT_PROJECTS = PROJECTS.filter((p) => PRODUCT_TITLES.includes(p.title));

export default function AboutSection() {
  const [origin, learning, present] = JOURNEY_CHAPTERS;

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

      <ChapterSection number={origin.number} title={origin.title} subtitle={origin.subtitle}>
        <MilestoneBody description={origin.description} bullets={origin.bullets} />
      </ChapterSection>

      <ChapterSection number={learning.number} title={learning.title} subtitle={learning.subtitle}>
        <MilestoneBody description={learning.description} bullets={learning.bullets} />
      </ChapterSection>

      <ChapterSection number="03" title="Engineering" subtitle="Enterprise Systems & Architecture">
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

      <ChapterSection number="04" title="Products" subtitle="Kiggidi & The Rest">
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

      <ChapterSection number={present.number} title={present.title} subtitle={present.subtitle}>
        <div className="space-y-12">
          <MilestoneBody description={present.description} bullets={present.bullets} />

          <div className="border-t border-white/5 pt-10">
            <p className="mb-1 text-xs font-mono uppercase tracking-wider text-yellow-400">
              {RECOGNITION.tag} — {RECOGNITION.date}
            </p>
            <h3 className="mb-4 text-xl font-bold text-white">{RECOGNITION.title}</h3>
            <MilestoneBody description={RECOGNITION.description} bullets={RECOGNITION.bullets} />
          </div>

          <div className="border-t border-white/5 pt-10">
            <p className="mb-1 text-xs font-mono uppercase tracking-wider text-violet-400">
              {SPEAKING.tag} — {SPEAKING.date}
            </p>
            <h3 className="mb-4 text-xl font-bold text-white">{SPEAKING.title}</h3>
            <MilestoneBody description={SPEAKING.description} bullets={SPEAKING.bullets} />
          </div>
        </div>
      </ChapterSection>
    </div>
  );
}
