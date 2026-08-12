import { Suspense } from 'react';
import SpotifyCallbackClient from './SpotifyCallbackClient';

export default function SpotifyCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-sm text-gray-400">
          Connecting to Spotify…
        </div>
      }
    >
      <SpotifyCallbackClient />
    </Suspense>
  );
}
