'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAnimeStore } from '@/lib/store';

const avatars = ['🦊', '🐼', '🐱', '🐸', '🐯', '🐙'];
export function ProfileSwitcher() {
  const { profiles, activeProfile, setProfile, addProfile } = useAnimeStore();
  const [adding, setAdding] = useState(false); const [name, setName] = useState(''); const [avatar, setAvatar] = useState(avatars[0]);
  return <div className="w-full max-w-3xl text-center"><h1 className="text-3xl font-bold md:text-5xl">Who's watching?</h1><div className="mt-10 flex flex-wrap justify-center gap-6">{profiles.map((profile) => <button key={profile.id} onClick={() => setProfile(profile)} className={`group w-28 ${activeProfile?.id === profile.id ? 'opacity-100' : 'opacity-65 hover:opacity-100'}`}><span className="mx-auto grid h-24 w-24 place-items-center rounded-lg bg-gradient-to-br from-amber-500 to-red-700 text-5xl transition group-hover:ring-2 group-hover:ring-white">{profile.avatar}</span><span className="mt-3 block text-sm text-zinc-300">{profile.name}</span></button>)}<button onClick={() => setAdding(true)} className="group w-28"><span className="mx-auto grid h-24 w-24 place-items-center rounded-lg border-2 border-dashed border-zinc-600 text-zinc-500 transition group-hover:border-white group-hover:text-white"><Plus size={30} /></span><span className="mt-3 block text-sm text-zinc-400">Add profile</span></button></div>{adding && <form onSubmit={(event) => { event.preventDefault(); if (name.trim()) { addProfile(name.trim(), avatar); setName(''); setAdding(false); } }} className="mx-auto mt-12 max-w-sm rounded-xl border border-white/10 bg-white/5 p-5 text-left"><h2 className="font-bold">Create profile</h2><input autoFocus required value={name} onChange={(event) => setName(event.target.value)} placeholder="Profile name" className="mt-4 w-full rounded bg-black/40 p-3 text-sm outline-none" /><div className="mt-4 flex gap-2">{avatars.map((item) => <button type="button" key={item} onClick={() => setAvatar(item)} className={`grid h-9 w-9 place-items-center rounded-full ${avatar === item ? 'bg-ember' : 'bg-white/10'}`}>{item}</button>)}</div><button className="mt-5 w-full rounded bg-white py-2 text-sm font-bold text-black">Save profile</button></form>}</div>;
}
