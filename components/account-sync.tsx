'use client';

import { useEffect } from 'react';
import { useAnimeStore } from '@/lib/store';

export function AccountSync() {
  const hydrateAccount = useAnimeStore((state) => state.hydrateAccount);
  useEffect(() => { void hydrateAccount(); }, [hydrateAccount]);
  return null;
}
