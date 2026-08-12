'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { BACKGROUND_TRACK } from '@/data/backgroundTrack';
import { useUniverseStore } from '@/store/universeStore';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AmbientPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const setPlayback = useUniverseStore((s) => s.setPlayback);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onPlay = () => {
      setIsPlaying(true);
      setPlayback(true, { title: BACKGROUND_TRACK.title, artist: BACKGROUND_TRACK.artist }, 'ambient');
    };
    const onPause = () => {
      setIsPlaying(false);
      setPlayback(false, { title: BACKGROUND_TRACK.title, artist: BACKGROUND_TRACK.artist }, 'ambient');
    };
    const onError = () => setUnavailable(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, [setPlayback]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setUnavailable(true));
    else audio.pause();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/60 p-3 shadow-2xl backdrop-blur-xl">
      <audio ref={audioRef} src={BACKGROUND_TRACK.src} loop preload="metadata" />

      {unavailable ? (
        <p className="p-2 text-center text-xs text-gray-500">
          Track unavailable — check <code className="text-gray-400">public/audio/track.mp3</code> exists.
        </p>
      ) : (
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BACKGROUND_TRACK.cover} alt="" className="h-full w-full object-cover" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{BACKGROUND_TRACK.title}</p>
            <p className="truncate text-xs text-gray-400">{BACKGROUND_TRACK.artist}</p>

            <div
              onClick={handleSeek}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={progress}
              tabIndex={0}
              className="mt-2 h-1 w-full cursor-pointer rounded-full bg-white/10"
            >
              <div className="h-full rounded-full bg-indigo-400" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-gray-500">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <button
            data-cursor="play"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
        </div>
      )}
    </div>
  );
}
