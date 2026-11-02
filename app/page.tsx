import { getHomeRows } from '@/lib/anilist';
import { AccountSync } from '@/components/account-sync';
import { AnimeRow } from '@/components/anime-row';
import { ContinueRow } from '@/components/continue-row';
import { Hero } from '@/components/hero';
import { MyListRow } from '@/components/my-list-row';
import { SiteHeader } from '@/components/site-header';
import { ProfileGate } from '@/components/profile-gate';

export default async function Home() {
  const { hero, rows } = await getHomeRows();
  const trending = rows.find((row) => row.title === 'Trending now');
  const action = rows.find((row) => row.title === 'Shonen essentials');
  return <><AccountSync /><ProfileGate><main className="min-h-screen overflow-hidden bg-[#09090b]">
    <SiteHeader />
    <Hero anime={hero} />
    <div className="relative z-20 -mt-12 space-y-10 pb-10 md:-mt-20 md:space-y-14">
      <ContinueRow />
      {trending && <AnimeRow row={{ title: 'Trending Now', items: trending.items }} />}
      {action && <AnimeRow row={{ title: 'Action & Shonen', items: action.items }} />}
      <AnimeRow row={{ title: 'Critically Acclaimed', items: rows.find((row) => row.title === 'Critically acclaimed')?.items || [] }} />
      <MyListRow catalog={rows.flatMap((row) => row.items)} />
    </div>
    <footer className="border-t border-white/10 bg-black/20 px-6 py-10 text-xs text-zinc-500 md:px-12">
      <span className="font-bold tracking-[.2em] text-zinc-300">ANIXFLIX</span>
      <p className="mt-3">Catalog metadata provided by AniList. AnixFlix does not host video files.</p>
    </footer>
  </main></ProfileGate></>;
}
