'use client';

import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/universe/Scene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-[#0a0a14] to-black" />
  ),
});

export default function SceneLoader() {
  return <Scene />;
}
