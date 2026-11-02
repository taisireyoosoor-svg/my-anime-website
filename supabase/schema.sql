-- Run this in Supabase SQL Editor. RLS keeps each account's list and progress private.
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 32),
  avatar text not null default '🦊',
  created_at timestamptz not null default now()
);

create table if not exists public.watchlist (
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  anime_id integer not null,
  title text not null,
  cover_url text not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, anime_id)
);

create table if not exists public.watch_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  anime_id integer not null,
  episode integer not null check (episode > 0),
  title text not null,
  cover_url text not null,
  position_seconds numeric not null default 0,
  duration_seconds numeric not null default 0,
  updated_at timestamptz not null default now(),
  primary key (profile_id, anime_id, episode)
);

alter table public.profiles enable row level security;
alter table public.watchlist enable row level security;
alter table public.watch_progress enable row level security;
create policy "profiles are private" on public.profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "watchlists are private" on public.watchlist for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progress is private" on public.watch_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.create_default_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (user_id, display_name) values (new.id, 'Main profile'); return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_default_profile();
