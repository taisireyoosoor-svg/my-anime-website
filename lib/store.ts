'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, ProfileTheme, WatchProgress } from './types';
import { createClient } from './supabase/client';

const defaultProfile: Profile = { id: 'guest', name: 'Guest', avatar: '🦊', theme: { accent: '#e50914', glow: 'rgba(229, 9, 20, .28)' } };
const defaultTheme: ProfileTheme = defaultProfile.theme as ProfileTheme;

type AnimeStore = {
  myList: number[];
  progress: WatchProgress[];
  activeProfile: Profile | null;
  profiles: Profile[];
  theme: ProfileTheme;
  toggleList: (id: number, metadata?: { title: string; cover: string }) => void;
  saveProgress: (item: WatchProgress) => void;
  hydrateAccount: () => Promise<void>;
  setProfile: (profile: Profile) => void;
  renameProfile: (id: string, name: string) => void;
  addProfile: (name: string, avatar: string) => void;
};

export const useAnimeStore = create<AnimeStore>()(persist((set) => ({
  myList: [], progress: [], activeProfile: null, profiles: [defaultProfile], theme: defaultTheme,
  toggleList: (id, metadata) => {
    set((state) => ({ myList: state.myList.includes(id) ? state.myList.filter((x) => x !== id) : [...state.myList, id] }));
    if (!metadata) return;
    void (async () => {
      const supabase = createClient(); if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).limit(1).maybeSingle(); if (!profile) return;
      if (useAnimeStore.getState().myList.includes(id)) await supabase.from('watchlist').upsert({ user_id: user.id, profile_id: profile.id, anime_id: id, title: metadata.title, cover_url: metadata.cover });
      else await supabase.from('watchlist').delete().eq('profile_id', profile.id).eq('anime_id', id);
    })();
  },
  saveProgress: (item) => {
    set((state) => ({ progress: [item, ...state.progress.filter((x) => !(x.animeId === item.animeId && x.episode === item.episode))].slice(0, 20) }));
    void (async () => {
      const supabase = createClient(); if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
      const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).limit(1).maybeSingle(); if (!profile) return;
      await supabase.from('watch_progress').upsert({ user_id: user.id, profile_id: profile.id, anime_id: item.animeId, episode: item.episode, title: item.title, cover_url: item.cover, position_seconds: item.progress, duration_seconds: item.duration, updated_at: item.updatedAt });
    })();
  },
  hydrateAccount: async () => {
    const supabase = createClient(); if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const { data: profile } = await supabase.from('profiles').select('id, display_name, avatar').eq('user_id', user.id).limit(1).maybeSingle(); if (!profile) return;
    const { data: progress } = await supabase.from('watch_progress').select('*').eq('profile_id', profile.id).order('updated_at', { ascending: false }).limit(20);
    const { data: list } = await supabase.from('watchlist').select('anime_id').eq('profile_id', profile.id);
    set({ activeProfile: { id: profile.id, name: profile.display_name, avatar: profile.avatar, theme: defaultTheme }, profiles: [{ id: profile.id, name: profile.display_name, avatar: profile.avatar, theme: defaultTheme }], theme: defaultTheme, myList: (list || []).map((item) => item.anime_id), progress: (progress || []).map((item) => ({ animeId: item.anime_id, title: item.title, cover: item.cover_url, episode: item.episode, duration: Number(item.duration_seconds), progress: Number(item.position_seconds), updatedAt: item.updated_at })) });
  },
  setProfile: (profile) => set({ activeProfile: profile, theme: profile.theme || defaultTheme }),
  renameProfile: (id, name) => set((state) => ({ profiles: state.profiles.map((profile) => profile.id === id ? { ...profile, name } : profile), activeProfile: state.activeProfile?.id === id ? { ...state.activeProfile, name } : state.activeProfile })),
  addProfile: (name, avatar) => set((state) => {
    const palette: Record<string, ProfileTheme> = { '🦊': { accent: '#e50914', glow: 'rgba(229, 9, 20, .28)' }, '🐼': { accent: '#38bdf8', glow: 'rgba(14, 165, 233, .25)' }, '🐱': { accent: '#c084fc', glow: 'rgba(168, 85, 247, .25)' }, '🐸': { accent: '#22c55e', glow: 'rgba(34, 197, 94, .22)' }, '🐯': { accent: '#f59e0b', glow: 'rgba(245, 158, 11, .25)' }, '🐙': { accent: '#fb7185', glow: 'rgba(244, 63, 94, .25)' } };
    const profile = { id: crypto.randomUUID(), name, avatar, theme: palette[avatar] || defaultTheme };
    return { profiles: [...state.profiles, profile].slice(0, 4), activeProfile: profile, theme: profile.theme };
  })
}), { name: 'anixflix-store' }));
