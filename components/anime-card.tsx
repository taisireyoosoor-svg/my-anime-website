'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Plus, Check } from 'lucide-react';
import { Anime } from '@/lib/types';
import { useAnimeStore } from '@/lib/store';

export function AnimeCard({ anime }: { anime: Anime }) {
  const inList = useAnimeStore((state) => state.myList.includes(anime.id));
  const toggleList = useAnimeStore((state) => state.toggleList);
  return <motion.article whileHover={{ y: -8, scale: 1.04 }} transition={{ duration: .22, ease: 'easeOut' }} className="group relative min-w-[145px] snap-start overflow-hidden rounded-lg bg-panel shadow-lg shadow-black/20 sm:min-w-[185px] md:min-w-[215px]">
    <Link href={`/anime/${anime.id}`} className="block">
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-800"><img src={anime.cover} alt={anime.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent opacity-90" /><div className="absolute left-3 top-3 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 backdrop-blur">{anime.rating ? `★ ${anime.rating}` : 'NEW'}</div>
        <div className="absolute bottom-3 left-3 right-2"><h3 className="line-clamp-2 text-sm font-semibold text-white">{anime.title}</h3><p className="mt-1 text-xs text-zinc-300">{anime.rating ? `★ ${anime.rating}` : 'New'} {anime.seasonYear ? ` · ${anime.seasonYear}` : ''}</p></div>
      </div>
    </Link>
    <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100"><Link href={`/watch/${anime.id}`} aria-label={`Play ${anime.title}`} className="grid h-8 w-8 place-items-center rounded-full bg-white text-black"><Play size={14} fill="currentColor" /></Link><button onClick={() => toggleList(anime.id, { title: anime.title, cover: anime.cover })} aria-label={inList ? 'Remove from list' : 'Add to list'} className="grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white">{inList ? <Check size={14} /> : <Plus size={14} />}</button></div>
  </motion.article>;
}
