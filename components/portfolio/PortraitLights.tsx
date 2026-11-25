'use client';

import { Play, Square } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import styles from './Portfolio.module.css';

const glyph = [
  '11000011',
  '11000110',
  '11001100',
  '11011000',
  '11110000',
  '11011000',
  '11001100',
  '11000110',
  '11000011',
].join('');

const motionQuery = '(prefers-reduced-motion: reduce)';
type PlaybackMode = 'auto' | 'manual' | 'stopped';

function subscribeToMotion(callback: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

function prefersReducedMotion() {
  return window.matchMedia(motionQuery).matches;
}

function serverPrefersReducedMotion() {
  return true;
}

export default function PortraitLights() {
  const screenRef = useRef<HTMLDivElement>(null);
  const [playback, setPlayback] = useState<PlaybackMode>('auto');
  const [isVisible, setIsVisible] = useState(true);
  const reduceMotion = useSyncExternalStore(
    subscribeToMotion, prefersReducedMotion, serverPrefersReducedMotion,
  );
  const lights = playback === 'stopped' || (playback === 'auto' && reduceMotion) ? undefined : playback;
  const playing = lights !== undefined;
  const paused = isVisible ? undefined : true;

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting));

    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  const ControlIcon = playing ? Square : Play;

  return (
    <>
      <div className={styles.deviceRail} aria-hidden="true">
        <span data-lights={lights} data-paused={paused} />
      </div>
      <div className={styles.devicePlate}>
        <span className={styles.deviceVents} aria-hidden="true" />
        <button
          className={styles.deviceLightToggle}
          type="button"
          onClick={() => setPlayback(playing ? 'stopped' : 'manual')}
        >
          <ControlIcon size={14} fill="currentColor" aria-hidden="true" />
          {playing ? 'Stop lights' : 'Play lights'}
        </button>
      </div>
      <div ref={screenRef} className={styles.deviceScreen} aria-hidden="true">
        <div className={styles.matrix} data-lights={lights} data-paused={paused}>
          {[...glyph].map((dot, index) => (
            <span key={index} className={dot === '1' ? styles.matrixOn : undefined} />
          ))}
        </div>
      </div>
    </>
  );
}
