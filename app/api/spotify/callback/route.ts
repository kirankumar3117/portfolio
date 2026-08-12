import { NextResponse } from 'next/server';
import { getRequestOrigin } from '@/lib/requestOrigin';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';

function htmlPage(body: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>Spotify Setup</title>
      <style>body{background:#0a0a0f;color:#e5e7eb;font-family:monospace;padding:2rem;line-height:1.6}
      code{background:#18181b;padding:.2rem .4rem;border-radius:4px;color:#a5b4fc;word-break:break-all}
      .box{max-width:640px;border:1px solid #27272a;border-radius:12px;padding:1.5rem;background:#111114}</style>
      </head><body>${body}</body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return htmlPage(`<div class="box"><h2>Spotify denied the request</h2><p>${error}</p></div>`);
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return htmlPage(
      `<div class="box"><h2>Missing configuration</h2><p>Make sure SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are set, then retry from <code>/api/spotify/auth</code>.</p></div>`
    );
  }

  const redirectUri = `${getRequestOrigin(request)}/api/spotify/callback`;

  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return htmlPage(`<div class="box"><h2>Token exchange failed</h2><pre>${text}</pre></div>`);
  }

  const data = await tokenRes.json();

  return htmlPage(`
    <div class="box">
      <h2>✅ Connected</h2>
      <p>Copy this into your environment as <code>SPOTIFY_OWNER_REFRESH_TOKEN</code>, then redeploy. Don&apos;t share this page or commit the value.</p>
      <p><code>${data.refresh_token}</code></p>
      <p>This page is only useful once — you can ignore <code>/api/spotify/auth</code> from now on.</p>
    </div>
  `);
}
