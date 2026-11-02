import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAnime } from '@/lib/anilist';
import { VideoPlayer } from '@/components/video-player';
import { SiteHeader } from '@/components/site-header';

export default async function WatchPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ episode?: string }> }) {
  const { id } = await params; const query = await searchParams; const episode = Math.max(1, Number(query.episode || 1)); const anime = await getAnime(id);
  if (!anime) return <main className="grid min-h-screen place-items-center bg-[#09090b]">Unable to load this title.</main>;
  const next = anime.episodes && episode < anime.episodes ? episode + 1 : episode;
  return <main className="min-h-screen bg-[#09090b]"><SiteHeader /><div className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:px-10"><div className="mb-5 flex items-center justify-between"><Link href={`/anime/${anime.id}`} className="text-sm text-zinc-400 hover:text-white"><ChevronLeft className="mr-1 inline" size={16} /> {anime.title}</Link><span className="text-sm text-zinc-400">Episode {episode}{anime.episodes ? ` / ${anime.episodes}` : ''}</span></div><VideoPlayer anime={anime} episode={episode} /><div className="mt-5 flex items-center justify-between"><div><h1 className="text-xl font-bold">{anime.title}</h1><p className="mt-1 text-sm text-zinc-500">Episode {episode} · Select a source or quality from the player controls</p></div>{next !== episode && <Link href={`/watch/${anime.id}?episode=${next}`} className="flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-bold text-black">Next episode <ChevronRight size={16} /></Link>}</div><div className="mt-8"><h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-zinc-400">Episodes</h2><div className="flex flex-wrap gap-2">{Array.from({ length: anime.episodes || 12 }, (_, index) => index + 1).map((number) => <Link key={number} href={`/watch/${anime.id}?episode=${number}`} className={`grid h-10 w-10 place-items-center rounded text-sm ${number === episode ? 'bg-ember font-bold' : 'bg-white/10 hover:bg-white/20'}`}>{number}</Link>)}</div></div></div></main>;
}
