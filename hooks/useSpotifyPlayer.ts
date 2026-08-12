'use client';

import { useEffect, useRef } from 'react';
import { useUniverseStore } from '@/store/universeStore';
import { DEFAULT_TRACK_ID } from '@/lib/spotifyEmbed';

interface SpotifyDeviceReadyPayload {
  device_id: string;
}

interface SpotifyErrorPayload {
  message: string;
}

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

interface SpotifyPlaybackState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: { current_track: SpotifyTrack };
}

interface SpotifyPlayerInstance {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  togglePlay: () => Promise<void>;
  addListener(event: 'ready' | 'not_ready', cb: (payload: SpotifyDeviceReadyPayload) => void): void;
  addListener(
    event: 'initialization_error' | 'authentication_error' | 'account_error' | 'playback_error',
    cb: (payload: SpotifyErrorPayload) => void
  ): void;
  addListener(event: 'player_state_changed', cb: (state: SpotifyPlaybackState | null) => void): void;
}

interface SpotifyPlayerConstructorOptions {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume?: number;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: {
      Player: new (options: SpotifyPlayerConstructorOptions) => SpotifyPlayerInstance;
    };
  }
}

const SDK_URL = 'https://sdk.scdn.co/spotify-player.js';
let sdkLoadPromise: Promise<void> | null = null;

function loadSdk(): Promise<void> {
  if (sdkLoadPromise) return sdkLoadPromise;
  sdkLoadPromise = new Promise((resolve) => {
    if (window.Spotify) {
      resolve();
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => resolve();
    const script = document.createElement('script');
    script.src = SDK_URL;
    script.async = true;
    document.body.appendChild(script);
  });
  return sdkLoadPromise;
}

async function startRepeatingDefaultTrack(accessToken: string, deviceId: string, setVisitorError: (msg: string | null) => void) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const playRes = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ uris: [`spotify:track:${DEFAULT_TRACK_ID}`] }),
  });

  if (!playRes.ok && playRes.status !== 204) {
    setVisitorError(
      playRes.status === 403
        ? 'This needs a Spotify Premium account.'
        : 'Could not start playback on this device.'
    );
    return;
  }

  // Loop the single track until the visitor picks something else.
  await fetch(`https://api.spotify.com/v1/me/player/repeat?state=track&device_id=${deviceId}`, {
    method: 'PUT',
    headers,
  });
}

/** Lazily loads the Web Playback SDK, connects it, and starts the default track on repeat. */
export function useSpotifyPlayer() {
  const accessToken = useUniverseStore((s) => s.visitorAccessToken);
  const setPlayback = useUniverseStore((s) => s.setPlayback);
  const setVisitorDeviceId = useUniverseStore((s) => s.setVisitorDeviceId);
  const setVisitorError = useUniverseStore((s) => s.setVisitorError);
  const playerRef = useRef<SpotifyPlayerInstance | null>(null);

  const togglePlay = () => {
    playerRef.current?.togglePlay();
  };

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    loadSdk().then(() => {
      if (cancelled || !window.Spotify) return;

      const player = new window.Spotify.Player({
        name: "Kiran's Portfolio",
        getOAuthToken: (cb) => cb(accessToken),
        volume: 0.6,
      });

      player.addListener('ready', ({ device_id }) => {
        setVisitorDeviceId(device_id);
        startRepeatingDefaultTrack(accessToken, device_id, setVisitorError);
      });
      player.addListener('not_ready', () => setVisitorDeviceId(null));
      player.addListener('initialization_error', ({ message }) => setVisitorError(message));
      player.addListener('authentication_error', ({ message }) => setVisitorError(message));
      player.addListener('account_error', () => setVisitorError('This needs a Spotify Premium account.'));
      player.addListener('playback_error', ({ message }) => setVisitorError(message));

      player.addListener('player_state_changed', (state) => {
        if (!state) return;
        const item = state.track_window.current_track;
        setPlayback(
          !state.paused,
          {
            title: item.name,
            artist: item.artists.map((a) => a.name).join(', '),
            albumArt: item.album.images?.[0]?.url,
          },
          'visitor'
        );
      });

      player.connect();
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      playerRef.current?.disconnect();
      playerRef.current = null;
    };
  }, [accessToken, setPlayback, setVisitorDeviceId, setVisitorError]);

  return { togglePlay };
}
