import { create } from 'zustand';

export interface NowPlayingTrack {
  title: string;
  artist: string;
  albumArt?: string;
  url?: string;
}

export type AudioSource = 'owner' | 'visitor' | 'ambient' | null;

interface UniverseState {
  isPlaying: boolean;
  track: NowPlayingTrack | null;
  audioSource: AudioSource;
  setPlayback: (isPlaying: boolean, track?: NowPlayingTrack | null, source?: AudioSource) => void;

  // Visitor-controlled Web Playback SDK session ("Connect Spotify" upgrade path).
  visitorAccessToken: string | null;
  visitorDeviceId: string | null;
  visitorError: string | null;
  setVisitorSession: (token: string | null) => void;
  setVisitorDeviceId: (deviceId: string | null) => void;
  setVisitorError: (message: string | null) => void;

  // Flips true once the 3D canvas has actually been created — drives the loading screen.
  sceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
}

export const useUniverseStore = create<UniverseState>((set) => ({
  isPlaying: false,
  track: null,
  audioSource: null,
  setPlayback: (isPlaying, track = null, source = null) => set({ isPlaying, track, audioSource: source }),

  visitorAccessToken: null,
  visitorDeviceId: null,
  visitorError: null,
  setVisitorSession: (token) => set({ visitorAccessToken: token }),
  setVisitorDeviceId: (deviceId) => set({ visitorDeviceId: deviceId }),
  setVisitorError: (message) => set({ visitorError: message }),

  sceneReady: false,
  setSceneReady: (ready) => set({ sceneReady: ready }),
}));
