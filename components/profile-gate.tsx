'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Pencil, Plus, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useAnimeStore } from '@/lib/store';
import { Profile } from '@/lib/types';

const avatars = ['🦊', '🐼', '🐱', '🐸', '🐯', '🐙'];
const themes: Record<string, { accent: string; glow: string }> = {
  '🦊': { accent: '#e50914', glow: 'rgba(229, 9, 20, .28)' },
  '🐼': { accent: '#38bdf8', glow: 'rgba(14, 165, 233, .25)' },
  '🐱': { accent: '#c084fc', glow: 'rgba(168, 85, 247, .25)' },
  '🐸': { accent: '#22c55e', glow: 'rgba(34, 197, 94, .22)' },
  '🐯': { accent: '#f59e0b', glow: 'rgba(245, 158, 11, .25)' },
  '🐙': { accent: '#fb7185', glow: 'rgba(244, 63, 94, .25)' }
};

function Avatar({ profile, edit, onEdit }: { profile: Profile; edit: boolean; onEdit: () => void }) {
  return <button onClick={onEdit} className="group relative w-28 text-center outline-none sm:w-32">
    <span className="mx-auto grid aspect-square w-full place-items-center rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-950 text-5xl shadow-2xl ring-1 ring-white/10 transition duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-white/70 sm:text-6xl" style={{ boxShadow: `0 20px 50px ${profile.theme?.glow || 'rgba(255,255,255,.1)'}` }}>{profile.avatar}</span>
    {edit && <span className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-black/80 text-white"><Pencil size={13} /></span>}
    <span className="mt-3 block truncate text-sm text-zinc-300 transition group-hover:text-white">{profile.name}</span>
  </button>;
}

export function ProfileGate({ children }: { children: React.ReactNode }) {
  const { activeProfile, profiles, setProfile, addProfile, renameProfile } = useAnimeStore();
  const [managing, setManaging] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(avatars[0]);

  const beginEdit = (profile: Profile) => { if (!managing) { setProfile(profile); return; } setEditing(profile); setName(profile.name); setAvatar(profile.avatar); };
  const submit = (event: FormEvent) => { event.preventDefault(); if (!name.trim()) return; if (editing?.id) renameProfile(editing.id, name.trim()); else addProfile(name.trim(), avatar); setEditing(null); setName(''); };

  return <>
    <AnimatePresence mode="wait">
      {!activeProfile && <motion.section key="profile-gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: .98 }} className="fixed inset-0 z-[100] grid min-h-screen place-items-center overflow-y-auto bg-[#09090b] px-5 py-16"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(229,9,20,.14),transparent_42%)]" /><motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .1 }} className="relative w-full max-w-3xl text-center"><div className="mb-14 text-2xl font-black tracking-[-.08em]">ANIX<span className="text-ember">FLIX</span></div><h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Who&apos;s watching?</h1><p className="mt-3 text-sm text-zinc-500">Choose a profile to personalize your experience.</p><div className="mt-12 grid grid-cols-2 justify-items-center gap-x-5 gap-y-9 sm:grid-cols-4 sm:gap-x-8">{profiles.slice(0, 4).map((profile) => <Avatar key={profile.id} profile={profile} edit={managing} onEdit={() => beginEdit(profile)} />)}{!managing && profiles.length < 4 && <button onClick={() => { setEditing({ id: '', name: '', avatar, theme: themes[avatar] }); setName(''); }} className="group w-28 text-center outline-none sm:w-32"><span className="mx-auto grid aspect-square w-full place-items-center rounded-xl border border-dashed border-zinc-700 text-zinc-500 transition group-hover:border-white group-hover:bg-white/5 group-hover:text-white"><Plus size={30} /></span><span className="mt-3 block text-sm text-zinc-400">Add profile</span></button>}</div><button onClick={() => setManaging((value) => !value)} className="mt-16 rounded border border-zinc-700 px-6 py-3 text-xs font-bold uppercase tracking-[.2em] text-zinc-400 transition hover:border-white hover:text-white">{managing ? 'Done' : 'Manage Profiles'}</button></motion.div></motion.section>}
    </AnimatePresence>
    {activeProfile && <motion.div key={activeProfile.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .45 }} style={{ '--profile-accent': activeProfile.theme?.accent || '#e50914', '--profile-glow': activeProfile.theme?.glow || 'rgba(229,9,20,.28)' } as React.CSSProperties}>{children}</motion.div>}
    <AnimatePresence>{editing && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] grid place-items-center bg-black/75 px-5 backdrop-blur-md"><motion.form onSubmit={submit} initial={{ y: 15, scale: .97 }} animate={{ y: 0, scale: 1 }} className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#18181b] p-7 shadow-2xl"><button type="button" onClick={() => setEditing(null)} className="absolute right-4 top-4 text-zinc-500 hover:text-white"><X size={18} /></button><h2 className="text-xl font-bold">{editing.id ? 'Edit profile' : 'Add profile'}</h2><label className="mt-6 block text-xs font-bold uppercase tracking-wider text-zinc-500">Profile name<input autoFocus required maxLength={24} value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-sm outline-none focus:border-white/50" /></label><div className="mt-5"><p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Choose avatar</p><div className="mt-3 flex flex-wrap gap-2">{avatars.map((item) => <button type="button" key={item} onClick={() => setAvatar(item)} className={`grid h-10 w-10 place-items-center rounded-lg text-xl transition ${avatar === item ? 'bg-ember ring-2 ring-white' : 'bg-white/10 hover:bg-white/20'}`}>{item}</button>)}</div></div><button className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-bold text-black transition hover:bg-zinc-200"><Check size={16} /> Save profile</button></motion.form></motion.div>}</AnimatePresence>
  </>;
}
