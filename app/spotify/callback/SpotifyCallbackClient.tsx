'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { completeVisitorLogin } from '@/lib/spotifyPkce';
import { useUniverseStore } from '@/store/universeStore';

export default function SpotifyCallbackClient() {
  const router = useRouter();
  const params = useSearchParams();
  const setVisitorSession = useUniverseStore((s) => s.setVisitorSession);
  const setVisitorError = useUniverseStore((s) => s.setVisitorError);

  const code = params.get('code');
  const error = params.get('error');
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

  useEffect(() => {
    if (error) {
      setVisitorError('Spotify sign-in was cancelled.');
      router.replace('/');
      return;
    }

    if (!code || !clientId) return;

    completeVisitorLogin(clientId, code).then((tokens) => {
      if (!tokens) {
        setVisitorError('Could not connect to Spotify. Please try again.');
        router.replace('/');
        return;
      }
      setVisitorSession(tokens.access_token);
      router.replace('/');
    });
  }, [code, error, clientId, router, setVisitorSession, setVisitorError]);

  const status = !code || !clientId ? 'Spotify isn’t configured yet — try again later.' : 'Connecting to Spotify…';

  return <div className="flex min-h-screen items-center justify-center bg-black text-sm text-gray-400">{status}</div>;
}
