import { getHomeRows } from '@/lib/anilist';
import { ContinueRow } from './continue-row';
import { Hero } from './hero';
import { SiteHeader } from './site-header';
import { AnimeRow } from './anime-row';
import { AccountSync } from './account-sync';

export async function Dashboard() {
  const { hero, rows } = await getHomeRows();
  return <main className="min-h-screen overflow-hidden bg-[#09090b]"><AccountSync /><SiteHeader /><Hero anime={hero} /><div className="relative z-20 -mt-8"><ContinueRow />{rows.map((row) => <AnimeRow key={row.title} row={row} />)}</div><footer className="border-t border-white/10 px-6 py-10 text-xs text-zinc-500 md:px-12"><span className="font-bold tracking-[.2em] text-zinc-300">ANIXFLIX</span><p className="mt-3">Catalog metadata provided by AniList. AnixFlix does not host video files.</p></footer></main>;
}
