'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import { useAnimeStore } from '@/lib/store';

export function ContinueRow() {
  const progress = useAnimeStore((state) => state.progress);
  if (!progress.length) return null;
  return <section className="relative"><div className="mb-4 px-6 md:px-12"><h2 className="text-lg font-bold tracking-tight md:text-xl">Continue Watching</h2></div><div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto scroll-smooth px-6 pb-3 md:px-12">{progress.map((item) => <Link href={`/watch/${item.animeId}?episode=${item.episode}`} key={`${item.animeId}-${item.episode}`} className="group relative min-w-[255px] snap-start overflow-hidden rounded-lg bg-panel shadow-lg shadow-black/20 transition hover:-translate-y-1 sm:min-w-[310px]"><div className="relative aspect-video"><img src={item.cover} alt={item.title} className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90" /><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" /><span className="absolute bottom-4 left-4 grid h-9 w-9 place-items-center rounded-full bg-white text-black"><Play size={15} fill="currentColor" /></span><span className="absolute bottom-4 right-4 text-xs font-bold">EP {item.episode}</span></div><div className="h-1 bg-zinc-700"><div className="h-full bg-ember" style={{ width: `${Math.min(100, item.progress / Math.max(item.duration, 1) * 100)}%` }} /></div><p className="p-3 text-sm font-medium">{item.title}</p></Link>)}</div></section>;
}
