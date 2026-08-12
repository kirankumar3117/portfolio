'use client';

const VERIFIER_KEY = 'spotify_pkce_verifier';

function base64UrlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generateCodeVerifier(): string {
  const bytes = new Uint8Array(64);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
}

const VISITOR_SCOPES = ['streaming', 'user-read-email', 'user-read-private', 'user-modify-playback-state'].join(' ');

/** Kicks off the visitor Authorization Code + PKCE flow — redirects to Spotify. */
export async function startVisitorLogin(clientId: string) {
  const verifier = generateCodeVerifier();
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  const challenge = await generateCodeChallenge(verifier);

  const redirectUri = `${window.location.origin}/spotify/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: VISITOR_SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

interface PkceTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
}

/** Completes the PKCE exchange from the callback page. Runs entirely client-side — no client secret involved. */
export async function completeVisitorLogin(clientId: string, code: string): Promise<PkceTokenResponse | null> {
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!verifier) return null;

  const redirectUri = `${window.location.origin}/spotify/callback`;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: verifier,
    }),
  });

  sessionStorage.removeItem(VERIFIER_KEY);
  if (!res.ok) return null;
  return res.json();
}
