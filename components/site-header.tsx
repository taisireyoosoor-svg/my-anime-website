'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bell, ChevronDown, Menu, Search, UserRound, X } from 'lucide-react';
import { useAnimeStore } from '@/lib/store';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const profile = useAnimeStore((state) => state.activeProfile);
  return <header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between bg-gradient-to-b from-black/90 to-transparent px-5 md:px-12">
    <div className="flex items-center gap-8">
      <Link href="/" className="text-2xl font-black tracking-[-.08em] text-white">ANIX<span className="text-ember">FLIX</span></Link>
      <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
        <Link className="font-medium text-white" href="/">Home</Link>
        <Link className="transition hover:text-white" href="/#browse">Browse</Link>
        <Link className="transition hover:text-white" href="/#my-list">My List</Link>
      </nav>
    </div>
    <div className="flex items-center gap-3">
      <form onSubmit={(event) => event.preventDefault()} className="hidden items-center border-b border-white/40 px-2 py-1 md:flex">
        <Search size={17} className="text-zinc-400" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Titles, genres, people" className="w-44 bg-transparent px-2 text-sm outline-none placeholder:text-zinc-500" />
      </form>
      <button aria-label="Notifications" className="hidden p-2 text-zinc-300 transition hover:text-white sm:block"><Bell size={18} /></button>
      <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-full p-1 transition hover:bg-white/10" aria-label="Open profile menu">
        <span className="grid h-8 w-8 place-items-center rounded bg-amber-600 text-lg">{profile?.avatar || '🦊'}</span><ChevronDown size={14} className="text-zinc-300" />
      </button>
      <button className="p-2 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu"><Menu size={20} /></button>
    </div>
    {open && <div className="glass absolute right-5 top-16 w-56 rounded-xl p-2 shadow-2xl md:right-12">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-3"><span className="text-sm text-zinc-300">Watching as <b className="text-white">{profile?.name || 'Guest'}</b></span><button onClick={() => setOpen(false)}><X size={15} /></button></div>
      <Link href="/profiles" className="block rounded-lg px-3 py-3 text-sm text-zinc-200 hover:bg-white/10"><UserRound size={15} className="mr-2 inline" /> Switch profile</Link>
      <Link href="/login" className="block rounded-lg px-3 py-3 text-sm text-zinc-200 hover:bg-white/10">Sign in to sync progress</Link>
    </div>}
  </header>;
}
