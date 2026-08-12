'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = ['home', 'about', 'projects', 'hire'];

export default function UniverseNav() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      // A thin band near the vertical center of the viewport — whichever
      // section crosses it "wins", instead of whatever happens to fill
      // the most raw pixels (tall sections would win that unfairly).
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    const elements = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between px-6 py-6"
    >
      <a
        href="#home"
        data-cursor="hover"
        aria-label="Home"
        aria-current={activeSection === 'home' ? 'true' : undefined}
        className={`rounded-full border px-4 py-2 text-sm font-bold tracking-widest text-white backdrop-blur-xl transition ${
          activeSection === 'home' ? 'border-indigo-400/50 bg-indigo-500/20' : 'border-white/10 bg-black/50 hover:border-white/30'
        }`}
      >
        KK
      </a>

      <div className="flex items-center gap-3">
        <a
          href="#about"
          data-cursor="explore"
          aria-current={activeSection === 'about' ? 'true' : undefined}
          className={`rounded-full border px-5 py-2.5 text-sm font-medium backdrop-blur-xl transition ${
            activeSection === 'about'
              ? 'border-indigo-400/50 bg-indigo-500/20 text-white'
              : 'border-white/10 bg-black/50 text-gray-300 hover:border-white/30 hover:text-white'
          }`}
        >
          About Me
        </a>
        <a
          href="#projects"
          data-cursor="explore"
          aria-current={activeSection === 'projects' ? 'true' : undefined}
          className={`rounded-full border px-5 py-2.5 text-sm font-medium backdrop-blur-xl transition ${
            activeSection === 'projects'
              ? 'border-indigo-400/50 bg-indigo-500/20 text-white'
              : 'border-white/10 bg-black/50 text-gray-300 hover:border-white/30 hover:text-white'
          }`}
        >
          Projects
        </a>
        <a
          href="#hire"
          data-cursor="explore"
          aria-current={activeSection === 'hire' ? 'true' : undefined}
          className={`rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:scale-105 hover:bg-indigo-400 hover:text-white ${
            activeSection === 'hire' ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-black' : ''
          }`}
        >
          Hire Me
        </a>
      </div>
    </motion.nav>
  );
}
