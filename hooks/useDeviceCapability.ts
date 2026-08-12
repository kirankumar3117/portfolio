'use client';

import { useEffect, useState } from 'react';

export interface DeviceCapability {
  /** True when the device should get reduced particle counts / simpler 3D. */
  isLowPower: boolean;
  prefersReducedMotion: boolean;
  isCoarsePointer: boolean;
}

const DEFAULT_CAPABILITY: DeviceCapability = {
  isLowPower: false,
  prefersReducedMotion: false,
  isCoarsePointer: false,
};

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>(DEFAULT_CAPABILITY);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: coarse)');

    const evaluate = () => {
      const cores = navigator.hardwareConcurrency ?? 8;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      const isCoarsePointer = pointerQuery.matches;
      const prefersReducedMotion = motionQuery.matches;
      const isLowPower = cores <= 4 || memory <= 4 || isCoarsePointer;

      setCapability({ isLowPower, prefersReducedMotion, isCoarsePointer });
    };

    evaluate();
    motionQuery.addEventListener('change', evaluate);
    pointerQuery.addEventListener('change', evaluate);

    return () => {
      motionQuery.removeEventListener('change', evaluate);
      pointerQuery.removeEventListener('change', evaluate);
    };
  }, []);

  return capability;
}
