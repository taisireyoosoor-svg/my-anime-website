'use client';

import { BookmarkPlus } from 'lucide-react';
import { Anime } from '@/lib/types';
import { useAnimeStore } from '@/lib/store';
import { AnimeCard } from './anime-card';

export function MyListRow({ catalog }: { catalog: Anime[] }) {
  const list = useAnimeStore((state) => state.myList);
  const items = catalog.filter((anime, index, all) => list.includes(anime.id) && all.findIndex((item) => item.id === anime.id) === index);
  const uniqueItems = items.filter((anime, index) => items.findIndex((item) => item.id === anime.id) === index);
  return <section id="my-list" className="relative px-6 md:px-12">
    <div className="mb-4 flex items-center gap-2"><h2 className="text-lg font-bold md:text-xl">My List</h2><span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-400">{list.length}</span></div>
    {uniqueItems.length ? <div className="hide-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth pb-3 md:gap-4">{uniqueItems.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}</div> : <div className="flex min-h-28 items-center gap-4 rounded-xl border border-dashed border-white/10 bg-white/[.025] px-5 text-sm text-zinc-500"><BookmarkPlus size={20} className="text-zinc-400" /><p>Add shows to My List from any card and they’ll appear here.</p></div>}
  </section>;
}
