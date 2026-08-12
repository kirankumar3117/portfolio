/**
 * Next.js's dev server (Turbopack) rewrites `request.url`'s host to
 * "localhost" internally regardless of what host the client actually
 * connected through (e.g. 127.0.0.1). Since Spotify's redirect_uri must
 * match byte-for-byte, we build the origin from the raw Host header instead.
 */
export function getRequestOrigin(request: Request): string {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const isLoopback = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const proto = forwardedProto ?? (isLoopback ? 'http' : 'https');
  return `${proto}://${host}`;
}
