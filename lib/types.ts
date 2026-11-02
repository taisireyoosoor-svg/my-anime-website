export type Anime = {
  id: number;
  title: string;
  nativeTitle?: string;
  description?: string;
  cover: string;
  banner?: string;
  rating: number;
  episodes?: number | null;
  duration?: number | null;
  status?: string;
  season?: string;
  seasonYear?: number;
  genres: string[];
  trailer?: { id: string; site: string } | null;
  nextAiringEpisode?: { episode: number; airingAt: number } | null;
};

export type AnimeRow = { title: string; items: Anime[] };

export type WatchProgress = {
  animeId: number;
  title: string;
  cover: string;
  episode: number;
  duration: number;
  progress: number;
  updatedAt: string;
};

export type ProfileTheme = { accent: string; glow: string };
export type Profile = { id: string; name: string; avatar: string; theme?: ProfileTheme };
