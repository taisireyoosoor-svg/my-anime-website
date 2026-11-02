import { NextResponse } from 'next/server';
import { getHomeRows } from '@/lib/anilist';

export async function GET() {
  const data = await getHomeRows();
  return NextResponse.json(data, { headers: { 'Cache-Control': 's-maxage=900, stale-while-revalidate=3600' } });
}
