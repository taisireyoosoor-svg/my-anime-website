'use client';

import { Check, Plus } from 'lucide-react';
import { useAnimeStore } from '@/lib/store';

export function ListButton({ id, title, cover }: { id: number; title: string; cover: string }) {
  const inList = useAnimeStore((state) => state.myList.includes(id));
  const toggleList = useAnimeStore((state) => state.toggleList);
  return <button onClick={() => toggleList(id, { title, cover })} className="flex items-center gap-2 rounded border border-white/30 px-4 py-3 text-sm font-semibold transition hover:border-white hover:bg-white/10">{inList ? <Check size={17} /> : <Plus size={17} />}{inList ? 'In My List' : 'My List'}</button>;
}
