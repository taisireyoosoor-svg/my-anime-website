'use client';

import Hls from 'hls.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Maximize, Pause, Play, Settings, Volume2, VolumeX } from 'lucide-react';
import { Anime } from '@/lib/types';
import { useAnimeStore } from '@/lib/store';

type StreamSource = {
  url: string;
  quality?: string;
  isM3U8?: boolean;
  type?: string;
  isDub?: boolean;
};

type SubtitleTrack = { url: string; label: string; lang: string };
type StreamResponse = { sources?: StreamSource[]; subtitles?: SubtitleTrack[]; message?: string };

export function VideoPlayer({ anime, episode }: { anime: Anime; episode: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const lastSavedAt = useRef(0);
  const [sources, setSources] = useState<StreamSource[]>([]);
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>([]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [mode, setMode] = useState<'sub' | 'dub'>('sub');
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const saveProgress = useAnimeStore((state) => state.saveProgress);

  const currentSource = sources[sourceIndex];
  const isEmbed = currentSource?.type === 'iframe' || currentSource?.type === 'embed';

  const recordProgress = useCallback(() => {
    const element = video.current;
    if (!element || !Number.isFinite(element.duration) || element.duration <= 0) return;
    saveProgress({
      animeId: anime.id,
      title: anime.title,
      cover: anime.cover,
      episode,
      duration: element.duration,
      progress: element.currentTime,
      updatedAt: new Date().toISOString()
    });
  }, [anime.cover, anime.id, anime.title, episode, saveProgress]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setSources([]);
    setSubtitles([]);
    setSourceIndex(0);
    setSubtitleIndex(0);

    fetch(`/api/stream/${anime.id}?episode=${episode}&dub=${mode === 'dub'}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as StreamResponse;
        if (!response.ok) throw new Error(payload.message || 'Unable to load this episode.');
        setSources(payload.sources || []);
        setSubtitles(payload.subtitles || []);
        if (!payload.sources?.length) setError(payload.message || 'No playable source was returned.');
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setError(reason instanceof Error ? reason.message : 'Unable to load this episode.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [anime.id, episode, mode]);

  useEffect(() => {
    const element = video.current;
    if (!element || !currentSource || isEmbed) return;
    let hls: Hls | null = null;
    const resume = useAnimeStore.getState().progress.find((item) => item.animeId === anime.id && item.episode === episode);
    const restorePosition = () => {
      if (resume && resume.progress > 5 && resume.progress < element.duration - 5) element.currentTime = resume.progress;
    };

    if (currentSource.isM3U8 && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, maxBufferLength: 30 });
      hls.loadSource(currentSource.url);
      hls.attachMedia(element);
      hls.on(Hls.Events.MANIFEST_PARSED, restorePosition);
      hls.on(Hls.Events.ERROR, (_event, data) => { if (data.fatal) setError('This HLS source could not be played. Try another quality.'); });
    } else {
      element.src = currentSource.url;
      element.addEventListener('loadedmetadata', restorePosition, { once: true });
      element.load();
    }

    return () => { hls?.destroy(); element.removeAttribute('src'); element.load(); };
  }, [anime.id, currentSource, episode, isEmbed]);

  useEffect(() => {
    const handleExit = () => recordProgress();
    window.addEventListener('beforeunload', handleExit);
    return () => { window.removeEventListener('beforeunload', handleExit); recordProgress(); };
  }, [recordProgress]);

  const togglePlay = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) { void element.play(); setPaused(false); } else { element.pause(); setPaused(true); }
  };

  return <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
    {isEmbed ? <iframe title={`${anime.title} episode ${episode}`} src={currentSource.url} className="h-full w-full" allow="autoplay; encrypted-media; fullscreen" allowFullScreen /> : sources.length > 0 ? <video
      ref={video}
      className="h-full w-full"
      controls
      playsInline
      onPlay={() => setPaused(false)}
      onPause={() => { setPaused(true); recordProgress(); }}
      onEnded={recordProgress}
      onTimeUpdate={() => {
        const currentTime = video.current?.currentTime || 0;
        if (currentTime - lastSavedAt.current >= 10) { lastSavedAt.current = currentTime; recordProgress(); }
      }}
      onError={() => setError('This source could not be played. Try another quality.')}>
      {subtitles[subtitleIndex] && <track kind="subtitles" src={subtitles[subtitleIndex].url} srcLang={subtitles[subtitleIndex].lang} label={subtitles[subtitleIndex].label} default />}
    </video> : <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-900 to-black px-6 text-center"><AlertCircle className="text-amber-400" /><p className="font-semibold">{loading ? 'Loading stream…' : error || 'No playable source was returned.'}</p><p className="max-w-md text-xs text-zinc-500">{error.includes('provider') ? 'Check the configured Consumet instance or try another provider.' : 'The provider did not return a playable episode source.'}</p>{anime.trailer?.site === 'youtube' && <a className="mt-2 text-sm text-red-400 hover:underline" href={`https://youtube.com/watch?v=${anime.trailer.id}`} target="_blank" rel="noreferrer">Watch official trailer on YouTube</a>}</div>}
    {sources.length > 0 && !isEmbed && <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/90 to-transparent px-4 pb-4 pt-12"><button onClick={togglePlay} aria-label={paused ? 'Play' : 'Pause'}>{paused ? <Play fill="white" size={19} /> : <Pause size={19} />}</button><button onClick={() => { setMuted((value) => !value); if (video.current) video.current.muted = !muted; }} aria-label="Toggle sound">{muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button><span className="flex-1" /><label className="flex items-center gap-2 text-xs"><Settings size={15} /><select value={sourceIndex} onChange={(event) => setSourceIndex(Number(event.target.value))} className="bg-black/60 p-1 outline-none" aria-label="Video quality">{sources.map((source, index) => <option key={`${source.url}-${index}`} value={index}>{source.quality || 'Auto'}</option>)}</select></label><select value={mode} onChange={(event) => setMode(event.target.value as 'sub' | 'dub')} className="bg-black/60 p-1 text-xs outline-none" aria-label="Audio language"><option value="sub">Sub</option><option value="dub">Dub</option></select>{subtitles.length > 0 && <select value={subtitleIndex} onChange={(event) => setSubtitleIndex(Number(event.target.value))} className="max-w-24 bg-black/60 p-1 text-xs outline-none" aria-label="Subtitle language">{subtitles.map((subtitle, index) => <option key={`${subtitle.url}-${index}`} value={index}>{subtitle.label}</option>)}</select>}<button onClick={() => video.current?.requestFullscreen()} aria-label="Fullscreen"><Maximize size={17} /></button></div>}
    {error && sources.length > 0 && <div className="absolute left-3 top-3 rounded bg-black/75 px-3 py-2 text-xs text-amber-300">{error}</div>}
  </div>;
}
