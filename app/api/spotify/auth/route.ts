import { NextResponse } from 'next/server';
import { getRequestOrigin } from '@/lib/requestOrigin';

const SCOPES = ['user-read-currently-playing', 'user-read-recently-played', 'user-read-playback-state'].join(' ');

/**
 * One-time owner setup route. Visit /api/spotify/auth yourself (logged into
 * your own Spotify account), approve the consent screen, and the callback
 * will hand you a refresh token to paste into SPOTIFY_OWNER_REFRESH_TOKEN.
 * Not meant for visitors — it just starts a standard OAuth redirect and
 * exposes nothing without a matching client secret on the callback.
 */
export async function GET(request: Request) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'SPOTIFY_CLIENT_ID is not set. Add it to your environment first.' },
      { status: 500 }
    );
  }

  const redirectUri = `${getRequestOrigin(request)}/api/spotify/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SCOPES,
    state: 'owner-setup',
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
