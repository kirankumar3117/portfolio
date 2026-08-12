'use client';

import { useState } from 'react';
import ProjectConstellation from '@/components/universe/ProjectConstellation';
import ProjectDeepDive from '@/components/ProjectDeepDive';
import { Project } from '@/data/projects';

export default function ProjectsExperience() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <ProjectConstellation onExplore={setSelected} />
      <ProjectDeepDive project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
