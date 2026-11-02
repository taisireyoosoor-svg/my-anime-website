'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeRow as AnimeRowType } from '@/lib/types';
import { AnimeCard } from './anime-card';

export function AnimeRow({ row }: { row: AnimeRowType }) {
  if (!row.items.length) return null;
  const carouselId = `carousel-${row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return <section className="group/row relative" id={row.title.toLowerCase() === 'trending now' ? 'browse' : undefined}><div className="mb-4 flex items-center justify-between px-6 md:px-12"><div className="flex items-center gap-2"><h2 className="text-lg font-bold tracking-tight md:text-xl">{row.title}</h2><ChevronRight size={17} className="text-zinc-500 transition group-hover/row:translate-x-1" /></div><div className="hidden gap-2 opacity-0 transition group-hover/row:opacity-100 sm:flex"><button onClick={() => document.getElementById(carouselId)?.scrollBy({ left: -700, behavior: 'smooth' })} className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/50 text-zinc-300 transition hover:border-white/40 hover:text-white" aria-label={`Scroll ${row.title} left`}><ChevronLeft size={16} /></button><button onClick={() => document.getElementById(carouselId)?.scrollBy({ left: 700, behavior: 'smooth' })} className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/50 text-zinc-300 transition hover:border-white/40 hover:text-white" aria-label={`Scroll ${row.title} right`}><ChevronRight size={16} /></button></div></div><div id={carouselId} className="hide-scrollbar flex snap-x gap-3 overflow-x-auto scroll-smooth px-6 pb-3 md:gap-4 md:px-12">{row.items.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}</div></section>;
}
