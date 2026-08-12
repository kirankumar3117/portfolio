'use client';

import { useEffect } from 'react';
import { useUniverseStore } from '@/store/universeStore';

const POLL_INTERVAL_MS = 15_000;

interface NowPlayingResponse {
  isPlaying: boolean;
  track: {
    title: string;
    artist: string;
    albumArt?: string;
    url?: string;
  } | null;
}

/** Polls the owner's live Spotify status. Never overrides an active ambient/visitor session on the widget. */
export function useNowPlaying() {
  const setPlayback = useUniverseStore((s) => s.setPlayback);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      // The ambient player (or a connected visitor) is already driving
      // playback state — don't let a stale owner-status poll stomp on it.
      const currentSource = useUniverseStore.getState().audioSource;
      if (currentSource === 'ambient' || currentSource === 'visitor') return;

      try {
        const res = await fetch('/api/spotify/now-playing', { cache: 'no-store' });
        if (!res.ok || cancelled) return;
        const data: NowPlayingResponse = await res.json();
        if (cancelled) return;
        setPlayback(data.isPlaying, data.track, data.track ? 'owner' : null);
      } catch {
        // Spotify unavailable — leave the widget in its current graceful state.
      }
    }

    poll();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [setPlayback]);
}
