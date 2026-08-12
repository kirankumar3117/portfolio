'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc3, Music, Pause, Play, Repeat, X } from 'lucide-react';
import { useUniverseStore } from '@/store/universeStore';
import { useNowPlaying } from '@/hooks/useNowPlaying';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { startVisitorLogin } from '@/lib/spotifyPkce';
import AmbientPlayer from '@/components/universe/AmbientPlayer';

const CAPTION = 'Something to listen to while you explore.';

export default function NowPlaying() {
  const [collapsed, setCollapsed] = useState(false);
  const [connecting, setConnecting] = useState(false);
  useNowPlaying();
  const { togglePlay } = useSpotifyPlayer();

  const isPlaying = useUniverseStore((s) => s.isPlaying);
  const track = useUniverseStore((s) => s.track);
  const audioSource = useUniverseStore((s) => s.audioSource);
  const visitorDeviceId = useUniverseStore((s) => s.visitorDeviceId);
  const visitorAccessToken = useUniverseStore((s) => s.visitorAccessToken);
  const visitorError = useUniverseStore((s) => s.visitorError);
  const setVisitorError = useUniverseStore((s) => s.setVisitorError);

  const isVisitorConnected = audioSource === 'visitor' && Boolean(visitorDeviceId);
  const isConnecting = Boolean(visitorAccessToken) && !isVisitorConnected;

  const handleConnect = () => {
    setVisitorError(null);
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    if (!clientId) {
      setVisitorError('Spotify integration is tuning up — check back soon.');
      setTimeout(() => setVisitorError(null), 3000);
      return;
    }
    setConnecting(true);
    startVisitorLogin(clientId);
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        data-cursor="play"
        aria-label="Show the music player"
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-semibold text-gray-300 backdrop-blur-xl transition hover:border-white/30 hover:text-white"
      >
        <Music size={14} className="text-indigo-300" />
        Listen
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed bottom-6 left-1/2 z-40 w-[92vw] max-w-sm -translate-x-1/2"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-xs font-medium text-gray-400">
          {isVisitorConnected ? 'Playing on repeat — your session' : CAPTION}
        </p>
        <button
          onClick={() => setCollapsed(true)}
          aria-label="Hide the music player"
          className="text-gray-500 transition hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      {isVisitorConnected ? (
        <div className="rounded-2xl border border-indigo-400/30 bg-black/60 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-indigo-500/30 to-cyan-400/20">
              {track?.albumArt ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={track.albumArt} alt="" className="h-full w-full object-cover" />
              ) : (
                <Disc3 size={20} className="text-indigo-200" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{track?.title ?? 'Loading…'}</p>
              <p className="truncate text-xs text-gray-400">{track?.artist}</p>
            </div>
            <button
              data-cursor="play"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-indigo-300">
            <Repeat size={12} /> On repeat until you close this
          </p>
        </div>
      ) : (
        <>
          <AmbientPlayer />

          <button
            data-cursor="hover"
            onClick={handleConnect}
            disabled={isConnecting || connecting}
            className="mt-2 w-full rounded-full border border-white/10 bg-white/5 py-2 text-xs font-semibold text-gray-300 transition hover:border-indigo-400/50 hover:text-white disabled:opacity-50"
          >
            {isConnecting || connecting ? 'Connecting…' : 'Prefer your own Spotify? Connect →'}
          </button>
        </>
      )}

      <AnimatePresence>
        {visitorError && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-center text-[11px] text-gray-500"
          >
            {visitorError}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
