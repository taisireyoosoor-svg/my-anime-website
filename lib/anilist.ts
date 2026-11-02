import { Anime, AnimeRow } from './types';

const ANILIST_ENDPOINT = 'https://graphql.anilist.co';

export const ANILIST_MEDIA_FIELDS = `
  id
  title { romaji english native }
  description(asHtml: false)
  coverImage { extraLarge large }
  bannerImage
  averageScore
  meanScore
  episodes
  duration
  status
  season
  seasonYear
  genres
  trailer { id site thumbnail }
  nextAiringEpisode { episode airingAt }
`;

const MEDIA_QUERY = `
  query AnimeCatalog($page: Int!, $perPage: Int!, $genre: String, $tag: String, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      media(
        type: ANIME
        genre: $genre
        tag: $tag
        sort: $sort
        isAdult: false
      ) { ${ANILIST_MEDIA_FIELDS} }
    }
  }
`;

const DETAIL_QUERY = `
  query AnimeDetail($id: Int!) {
    Media(id: $id, type: ANIME) { ${ANILIST_MEDIA_FIELDS} }
  }
`;

type AniListMedia = {
  id: number;
  title?: { romaji?: string; english?: string; native?: string };
  description?: string | null;
  coverImage?: { extraLarge?: string | null; large?: string | null };
  bannerImage?: string | null;
  averageScore?: number | null;
  meanScore?: number | null;
  episodes?: number | null;
  duration?: number | null;
  status?: string | null;
  season?: string | null;
  seasonYear?: number | null;
  genres?: string[];
  trailer?: { id: string; site: string; thumbnail?: string | null } | null;
  nextAiringEpisode?: { episode: number; airingAt: number } | null;
};

type AniListResponse<T> = { data?: T; errors?: Array<{ message: string }> };

function mapAnime(item: AniListMedia): Anime {
  const score = item.averageScore ?? item.meanScore;
  return {
    id: item.id,
    title: item.title?.english || item.title?.romaji || item.title?.native || 'Untitled anime',
    nativeTitle: item.title?.native,
    description: item.description || '',
    cover: item.coverImage?.extraLarge || item.coverImage?.large || '',
    banner: item.bannerImage || item.coverImage?.extraLarge || item.coverImage?.large || '',
    rating: score ? Number((score / 10).toFixed(1)) : 0,
    episodes: item.episodes,
    duration: item.duration,
    status: item.status || undefined,
    season: item.season || undefined,
    seasonYear: item.seasonYear || undefined,
    genres: item.genres || [],
    trailer: item.trailer,
    nextAiringEpisode: item.nextAiringEpisode
  };
}

async function queryAniList<T>(query: string, variables: Record<string, unknown>): Promise<T | null> {
  try {
    const response = await fetch(ANILIST_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 900 }
    });
    if (!response.ok) return null;
    const payload = await response.json() as AniListResponse<T>;
    if (payload.errors?.length) return null;
    return payload.data || null;
  } catch {
    return null;
  }
}

async function fetchCategory(variables: Record<string, unknown>): Promise<Anime[]> {
  const data = await queryAniList<{ Page: { media: AniListMedia[] } }>(MEDIA_QUERY, variables);
  return data?.Page.media.map(mapAnime) || [];
}

export async function getHomeRows(): Promise<{ hero: Anime | null; rows: AnimeRow[] }> {
  const categories = [
    ['Trending now', { page: 1, perPage: 12, sort: ['TRENDING_DESC'] }],
    ['Shonen essentials', { page: 1, perPage: 12, genre: 'Action', sort: ['SCORE_DESC'] }],
    ['Isekai worlds', { page: 1, perPage: 12, tag: 'Isekai', sort: ['POPULARITY_DESC'] }],
    ['Critically acclaimed', { page: 1, perPage: 12, sort: ['SCORE_DESC'] }]
  ] as const;
  const results = await Promise.all(categories.map(([, variables]) => fetchCategory(variables)));
  const rows = categories.map(([title], index) => ({ title, items: results[index] }));
  const hero = rows[0]?.items.find((anime) => anime.banner) || rows.flatMap((row) => row.items)[0] || null;
  return { hero, rows };
}

export async function getAnime(id: string): Promise<Anime | null> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId < 1) return null;
  const data = await queryAniList<{ Media: AniListMedia | null }>(DETAIL_QUERY, { id: numericId });
  return data?.Media ? mapAnime(data.Media) : null;
}
