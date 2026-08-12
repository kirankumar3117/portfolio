export function extractSpotifyTrackId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

// Shown whenever nothing is currently playing on the owner's account.
// Swap this for whatever track you'd rather greet visitors with —
// grab the ID from a track's Spotify URL: open.spotify.com/track/<id>.
export const DEFAULT_TRACK_ID = '6GyFP1nfCDB8lbD2bG0Hq9'; // "Midnight City" — M83
