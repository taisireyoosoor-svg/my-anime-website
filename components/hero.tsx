'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Info, Play } from 'lucide-react';
import { Anime } from '@/lib/types';

export function Hero({ anime }: { anime: Anime | null }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  if (!anime) return <section className="flex min-h-[650px] items-end bg-gradient-to-br from-zinc-900 to-black px-6 pb-24 md:px-12" />;
  const trailerUrl = anime.trailer?.site === 'youtube' && anime.trailer.id
    ? `https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${anime.trailer.id}&modestbranding=1`
    : null;
  return <section className="relative min-h-[680px] overflow-hidden">
    <motion.div style={{ y }} className="absolute inset-0">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${anime.banner || anime.cover})` }} />
      {trailerUrl && <iframe title={`${anime.title} trailer`} src={trailerUrl} className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-45 lg:block" allow="autoplay; encrypted-media" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" /><div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/30" />
    </motion.div>
    <div className="relative z-10 flex min-h-[680px] max-w-2xl flex-col justify-end px-6 pb-24 md:px-12 md:pb-28">
      <p className="mb-4 text-xs font-bold uppercase tracking-[.3em] text-ember">#1 in anime today</p>
      <h1 className="text-balance max-w-2xl text-5xl font-black leading-[.95] tracking-[-.06em] md:text-7xl">{anime.title}</h1>
      <div className="mt-5 flex items-center gap-3 text-sm"><span className="font-bold text-emerald-400">{anime.rating ? `${anime.rating}/10` : 'New'}</span><span className="text-zinc-300">{anime.seasonYear || '2025'}</span><span className="rounded border border-white/30 px-1.5 text-xs">HD</span><span className="text-zinc-300">{anime.episodes ? `${anime.episodes} episodes` : 'Ongoing'}</span></div>
      <p className="mt-4 line-clamp-2 max-w-xl text-sm leading-6 text-zinc-300 md:text-base">{anime.description?.replace(/<[^>]+>/g, '')}</p>
      <div className="mt-7 flex gap-3"><Link href={`/watch/${anime.id}`} className="flex items-center gap-2 rounded bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"><Play size={18} fill="currentColor" /> Watch now</Link><Link href={`/anime/${anime.id}`} className="flex items-center gap-2 rounded bg-white/20 px-6 py-3 text-sm font-bold backdrop-blur transition hover:bg-white/30"><Info size={18} /> More info</Link></div>
    </div>
  </section>;
}
