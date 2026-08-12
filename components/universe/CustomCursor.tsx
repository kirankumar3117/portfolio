'use client';

import { useEffect, useRef, useState } from 'react';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';

type CursorState = 'default' | 'hover' | 'explore' | 'play';

export default function CustomCursor() {
  const { isCoarsePointer, prefersReducedMotion } = useDeviceCapability();
  const dotRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>('default');
  const [visible, setVisible] = useState(false);
  const disabled = isCoarsePointer || prefersReducedMotion;

  useEffect(() => {
    if (disabled) return;

    document.body.style.cursor = 'none';

    const handleMove = (e: MouseEvent) => {
      setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      const target = e.target as HTMLElement;
      const explicit = target.closest<HTMLElement>('[data-cursor]');
      if (explicit) {
        setState((explicit.dataset.cursor as CursorState) || 'default');
      } else if (target.closest('a, button, [role="button"], input, textarea')) {
        setState('hover');
      } else {
        setState('default');
      }
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, [disabled]);

  if (disabled) return null;

  const label = state === 'explore' ? 'EXPLORE' : state === 'play' ? 'PLAY' : '';

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[2000] transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`flex items-center justify-center rounded-full border transition-all duration-200 ease-out ${
          label
            ? 'h-16 w-16 border-white/60 bg-black/50 backdrop-blur-sm'
            : state === 'hover'
              ? 'h-9 w-9 border-white/50 bg-white/10 backdrop-blur-sm'
              : 'h-2.5 w-2.5 border-transparent bg-[#8b93ff] shadow-[0_0_12px_2px_rgba(124,108,240,0.85)]'
        }`}
      >
        {label && <span className="text-[10px] font-bold tracking-widest text-white">{label}</span>}
      </div>
    </div>
  );
}
