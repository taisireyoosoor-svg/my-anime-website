import { NextResponse } from 'next/server';
import { getAnime } from '@/lib/anilist';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const anime = await getAnime(id);
  return anime ? NextResponse.json(anime) : NextResponse.json({ error: 'Anime not found' }, { status: 404 });
}
