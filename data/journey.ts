import { GraduationCap, Rocket, Trophy, Star, LucideIcon } from 'lucide-react';

export interface JourneyEntry {
  tag: string;
  date: string;
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
  bullets: string[];
}

// Reverse-chronological feed — newest first, same shape/order as the
// original ReleaseFeed timeline.
export const JOURNEY_FEED: JourneyEntry[] = [
  {
    tag: 'Public Speaking',
    date: 'Feb 2026',
    title: 'Speaker at VueVerse Connect 2026',
    icon: Star,
    color: 'text-violet-400',
    description:
      'Delivered a session titled "From Idea to Impact: Building a Real-World Product End to End" at VueVerse Connect 2026 in Hyderabad — covering product ideation, full-stack architecture decisions, and shipping to production.',
    bullets: [
      'Presented to a live audience of 200+ Vue.js developers in Hyderabad',
      'Covered end-to-end product lifecycle from problem discovery to production deployment',
      'Demonstrated real-world architecture patterns from Smart Kirana and SHIPLOG builds',
    ],
  },
  {
    tag: 'Lead Engineer',
    date: 'Present',
    title: 'Architecting Industrial Scale Systems',
    icon: Rocket,
    color: 'text-purple-400',
    description: 'Leading the frontend architecture for high-concurrency logistics platforms.',
    bullets: [
      "Building 'NEWGAS' ERP for 1,000+ distributors",
      'Designing Offline-First architectures with Pinia',
      'Mentoring junior developers on Vue patterns',
    ],
  },
  {
    tag: 'Recognition',
    date: 'Dec 2024',
    title: 'Employee of the Month',
    icon: Trophy,
    color: 'text-yellow-400',
    description: 'Awarded at Blue Ray Automation for exceptional delivery speed and technical leadership.',
    bullets: ['delivered critical RBAC security module ahead of schedule', 'Optimized legacy codebase reducing load times by 40%'],
  },
  {
    tag: 'Education',
    date: '2023',
    title: 'Mechanical to Software Transformation',
    icon: GraduationCap,
    color: 'text-blue-400',
    description:
      'Graduated as a Mechanical Engineer but realized my passion lay in software logic. Committed to a 1,200+ hour intensive coding bootcamp.',
    bullets: [
      'Mastered MERN Stack at Masai School',
      'Built 3 full-stack clones of major apps',
      'Top 5% of class in Data Structures & Algorithms',
    ],
  },
];
