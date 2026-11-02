import Link from 'next/link';
import { ProfileSwitcher } from '@/components/profile-switcher';

export default function ProfilesPage() { return <main className="grid min-h-screen place-items-center bg-[#09090b] px-5"><div className="absolute left-6 top-7 text-2xl font-black tracking-[-.08em]">ANIX<span className="text-ember">FLIX</span></div><ProfileSwitcher /><Link href="/" className="absolute bottom-8 text-sm text-zinc-500 hover:text-white">Back to home</Link></main>; }
