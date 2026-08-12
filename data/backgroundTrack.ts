// Powers the default "listen while you explore" player. Self-hosted audio —
// plain <audio> playback, no video decode overhead. Swap the file at
// public/audio/track.mp3 (and cover at public/audio/cover.webp) to change
// the track, and update the title/artist below to match.
export const BACKGROUND_TRACK = {
  src: '/audio/track.mp3',
  cover: '/audio/cover.webp',
  title: 'Midnight City',
  artist: 'M83',
};
