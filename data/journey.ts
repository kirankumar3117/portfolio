import { GraduationCap, Rocket, Trophy, Star, LucideIcon } from 'lucide-react';

export interface JourneyChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tag: string;
  date: string;
  icon: LucideIcon;
  color: string;
  description: string;
  bullets: string[];
}

// Migrated from the old ReleaseFeed timeline — same facts, reorganised into
// the five chapters the About page tells (Origin, Learning, Engineering,
// Products, Present). Chapters 03/04 pull their substance directly from
// data/projects.ts rather than duplicating copy here.
export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  {
    id: 'origin',
    number: '01',
    title: 'Origin',
    subtitle: 'Mechanical Engineering → Software Engineering',
    tag: 'Education',
    date: '2023',
    icon: GraduationCap,
    color: 'text-blue-400',
    description:
      'Graduated as a Mechanical Engineer but realized my passion lay in software logic — the pivot that started everything.',
    bullets: ['Left mechanical engineering to pursue software full-time'],
  },
  {
    id: 'learning',
    number: '02',
    title: 'Learning',
    subtitle: 'Bootcamp · DSA · Full-Stack Development',
    tag: 'Bootcamp',
    date: '2023',
    icon: GraduationCap,
    color: 'text-blue-400',
    description: 'Committed to a 1,200+ hour intensive coding bootcamp to rebuild from first principles.',
    bullets: [
      'Mastered the MERN Stack at Masai School',
      'Built 3 full-stack clones of major apps',
      'Top 5% of class in Data Structures & Algorithms',
    ],
  },
  {
    id: 'present',
    number: '05',
    title: 'Present',
    subtitle: 'Lead Engineer · Speaker',
    tag: 'Lead Engineer',
    date: 'Present',
    icon: Rocket,
    color: 'text-purple-400',
    description: 'Leading the frontend architecture for high-concurrency logistics platforms.',
    bullets: [
      "Building 'Newgas' ERP for 1,000+ distributors",
      'Designing offline-first architectures with Pinia',
      'Mentoring junior developers on Vue patterns',
    ],
  },
];

export const RECOGNITION = {
  tag: 'Recognition',
  date: 'Dec 2024',
  title: 'Employee of the Month',
  icon: Trophy,
  color: 'text-yellow-400',
  description: 'Awarded at Blue Ray Automation for exceptional delivery speed and technical leadership.',
  bullets: [
    'Delivered critical RBAC security module ahead of schedule',
    'Optimized legacy codebase, reducing load times by 40%',
  ],
};

export const SPEAKING = {
  tag: 'Public Speaking',
  date: 'Feb 2026',
  title: 'Speaker at VueVerse Connect 2026',
  icon: Star,
  color: 'text-violet-400',
  description:
    'Delivered a session titled "From Idea to Impact: Building a Real-World Product End to End" at VueVerse Connect 2026 in Hyderabad.',
  bullets: [
    'Presented to a live audience of 200+ Vue.js developers in Hyderabad',
    'Covered end-to-end product lifecycle from problem discovery to production deployment',
    'Demonstrated real-world architecture patterns from Smart Kirana and SHIPLOG builds',
  ],
};
