const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

/**
 * Exchanges the owner's long-lived refresh token for a short-lived access
 * token. The refresh token never expires (unless revoked), so this runs on
 * every server request rather than caching — Spotify's token endpoint is
 * cheap and this keeps the route stateless.
 */
export async function getOwnerAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_OWNER_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const data: SpotifyTokenResponse = await res.json();
  return data.access_token;
}

export interface NormalizedTrack {
  title: string;
  artist: string;
  albumArt?: string;
  progressMs?: number;
  durationMs?: number;
  url?: string;
}

export interface NowPlayingResult {
  isPlaying: boolean;
  track: NormalizedTrack | null;
}

function normalizeTrack(item: {
  name: string;
  artists: { name: string }[];
  album?: { images?: { url: string }[] };
  duration_ms?: number;
  external_urls?: { spotify?: string };
}): NormalizedTrack {
  return {
    title: item.name,
    artist: item.artists.map((a) => a.name).join(', '),
    albumArt: item.album?.images?.[0]?.url,
    durationMs: item.duration_ms,
    url: item.external_urls?.spotify,
  };
}

export async function fetchOwnerNowPlaying(): Promise<NowPlayingResult> {
  const accessToken = await getOwnerAccessToken();
  if (!accessToken) return { isPlaying: false, track: null };

  const headers = { Authorization: `Bearer ${accessToken}` };

  const currentRes = await fetch(`${API_BASE}/me/player/currently-playing`, {
    headers,
    cache: 'no-store',
  });

  if (currentRes.status === 200) {
    const data = await currentRes.json();
    if (data?.item) {
      return {
        isPlaying: Boolean(data.is_playing),
        track: { ...normalizeTrack(data.item), progressMs: data.progress_ms },
      };
    }
  }

  // Nothing currently playing — fall back to the most recent track so the
  // card never shows an empty state for an active listener.
  const recentRes = await fetch(`${API_BASE}/me/player/recently-played?limit=1`, {
    headers,
    cache: 'no-store',
  });

  if (recentRes.status === 200) {
    const data = await recentRes.json();
    const item = data?.items?.[0]?.track;
    if (item) {
      return { isPlaying: false, track: normalizeTrack(item) };
    }
  }

  return { isPlaying: false, track: null };
}
