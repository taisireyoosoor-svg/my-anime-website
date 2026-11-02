import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AnixFlix — Stories without limits',
  description: 'A cinematic anime discovery and streaming experience powered by AniList.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
