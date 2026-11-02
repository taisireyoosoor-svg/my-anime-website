import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DEFAULT_CONSUMET_URL = 'https://api.consumet.org';
const DEFAULT_PROVIDER = 'zoro';

type ConsumetEpisode = { id: string; number?: number; episodeNumber?: number; title?: string };
type ConsumetSource = { url?: string; quality?: string; isM3U8?: boolean; type?: string; isDub?: boolean };
type ConsumetSubtitle = { url?: string; lang?: string; label?: string; language?: string };

function parseBoolean(value: string | null, fallback = false) {
  if (value === null) return fallback;
  return value === 'true' || value === '1';
}

async function getJson<T>(url: string) {
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Consumet returned ${response.status}`);
  return response.json() as Promise<T>;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const url = new URL(request.url);
  const episode = Number(url.searchParams.get('episode') || '1');
  const provider = url.searchParams.get('provider') || DEFAULT_PROVIDER;
  const dub = parseBoolean(url.searchParams.get('dub'));
  const server = url.searchParams.get('server');
  const animeId = Number(id);

  if (!Number.isInteger(animeId) || animeId < 1 || !Number.isInteger(episode) || episode < 1) {
    return NextResponse.json({ sources: [], subtitles: [], message: 'A valid anime ID and episode number are required.' }, { status: 400 });
  }

  const baseUrl = (process.env.CONSUMET_API_URL || DEFAULT_CONSUMET_URL).replace(/\/$/, '');
  const providerParams = new URLSearchParams({ provider, dub: String(dub), fetchFiller: 'false' });

  try {
    const episodePayload = await getJson<{ episodes?: ConsumetEpisode[] }>(
      `${baseUrl}/meta/anilist/episodes/${animeId}?${providerParams.toString()}`
    );
    const selectedEpisode = (episodePayload.episodes || []).find(
      (item) => Number(item.number ?? item.episodeNumber) === episode
    );

    if (!selectedEpisode?.id) {
      return NextResponse.json({ sources: [], subtitles: [], message: `Episode ${episode} was not found.` }, { status: 404 });
    }

    const watchParams = new URLSearchParams({ provider, dub: String(dub) });
    if (server) watchParams.set('server', server);
    const streamPayload = await getJson<{
      sources?: ConsumetSource[];
      subtitles?: ConsumetSubtitle[];
      download?: string;
    }>(`${baseUrl}/meta/anilist/watch/${encodeURIComponent(selectedEpisode.id)}?${watchParams.toString()}`);

    const sources = (streamPayload.sources || [])
      .filter((source) => source.url)
      .map((source) => ({
        url: source.url as string,
        quality: source.quality || (source.isM3U8 ? 'HLS' : 'Auto'),
        isM3U8: Boolean(source.isM3U8 || source.type?.toLowerCase() === 'hls'),
        type: source.type || (source.isM3U8 ? 'hls' : 'video'),
        isDub: source.isDub ?? dub
      }));
    const subtitles = (streamPayload.subtitles || [])
      .filter((subtitle) => subtitle.url)
      .map((subtitle) => ({
        url: subtitle.url as string,
        label: subtitle.label || subtitle.lang || subtitle.language || 'Subtitle',
        lang: subtitle.lang || subtitle.language || 'en'
      }));

    return NextResponse.json(
      { animeId, episode, episodeId: selectedEpisode.id, sources, subtitles, download: streamPayload.download || null, dub },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Streaming provider unavailable.';
    return NextResponse.json({ sources: [], subtitles: [], message }, { status: 502 });
  }
}
