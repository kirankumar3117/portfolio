export type SkillCategory = 'frontend' | 'backend' | 'database' | 'infrastructure' | 'architecture';

export interface SkillNode {
  id: string;
  label: string;
  category: SkillCategory;
  description: string;
}

export const SKILL_CATEGORIES: Record<SkillCategory, { label: string; color: string }> = {
  frontend: { label: 'Frontend', color: '#818cf8' },
  backend: { label: 'Backend', color: '#34d399' },
  database: { label: 'Database', color: '#f59e0b' },
  infrastructure: { label: 'Infrastructure', color: '#38bdf8' },
  architecture: { label: 'Architecture', color: '#f472b6' },
};

// Grounded in the real stacks used across Kiggidi, Newgas, Officeous, and
// Smart Kirana (see data/projects.ts) — nothing here is aspirational.
export const SKILL_NODES: SkillNode[] = [
  { id: 'react', label: 'React', category: 'frontend', description: 'Primary UI library across Officeous, Smart Kirana, and this portfolio.' },
  { id: 'nextjs', label: 'Next.js', category: 'frontend', description: 'App Router + Server Components powering Kiggidi and Smart Kirana web.' },
  { id: 'vue', label: 'Vue.js', category: 'frontend', description: "Powers Nova Web Admin, Newgas's enterprise ERP." },
  { id: 'nuxt', label: 'Nuxt.js', category: 'frontend', description: 'Multi-tab state persistence for distributor workflows at Newgas.' },
  { id: 'typescript', label: 'TypeScript', category: 'frontend', description: 'Strict mode across every production codebase.' },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'frontend', description: 'Design-system-driven styling, dark-mode-first.' },
  { id: 'nodejs', label: 'Node.js', category: 'backend', description: 'Officeous HRMS API layer with JWT auth and audit middleware.' },
  { id: 'fastapi', label: 'FastAPI', category: 'backend', description: 'High-performance Python backend for Kiggidi and Smart Kirana.' },
  { id: 'postgresql', label: 'PostgreSQL', category: 'database', description: 'Spatial queries and relational core for every backend.' },
  { id: 'supabase', label: 'Supabase', category: 'database', description: 'Auth, real-time subscriptions, and Postgres hosting for Kiggidi.' },
  { id: 'docker', label: 'Docker', category: 'infrastructure', description: 'Containerised deployment for the Smart Kirana service ecosystem.' },
  { id: 'cicd', label: 'CI/CD', category: 'infrastructure', description: 'GitHub Actions gate every push on lint, type-check, and build.' },
  { id: 'pwa', label: 'PWA / Service Workers', category: 'infrastructure', description: 'Offline-first architecture with background sync for Kiggidi.' },
  { id: 'rbac', label: 'RBAC', category: 'architecture', description: 'Resource- and field-level permission engines for Officeous and Newgas.' },
  { id: 'rest', label: 'REST APIs', category: 'architecture', description: 'Contract-first API design across every backend integration.' },
  { id: 'state', label: 'State Management', category: 'architecture', description: 'Zustand (React) and Pinia (Vue) for predictable, tree-shakeable state.' },
  { id: 'audit', label: 'Audit Logging', category: 'architecture', description: 'Immutable audit trails for every sensitive mutation at Officeous.' },
];
