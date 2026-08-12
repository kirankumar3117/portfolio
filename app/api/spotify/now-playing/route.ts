import { NextResponse } from 'next/server';
import { fetchOwnerNowPlaying } from '@/lib/spotify';

export async function GET() {
  const result = await fetchOwnerNowPlaying();
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
