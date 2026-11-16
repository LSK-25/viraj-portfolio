import type { CSSProperties, ReactNode } from 'react';
import { projectArtAtlas } from '@/data/project-art';

export function StudyArt({ index, className = '' }: { index: number; className?: string }) {
  return <div className={`recon-art ${className}`} style={{ backgroundImage: `url(${projectArtAtlas})`, backgroundPosition: `${index % 2 ? 100 : 0}% ${index > 1 ? 100 : 0}%` }} />;
}

export function WindowFrame({ title, label, children, className = '' }: { title: string; label: string; children: ReactNode; className?: string }) {
  return <div className={`recon-window ${className}`}><div className="recon-window-bar"><span className="recon-window-dots"><i/><i/><i/></span><span>{title}</span><b>{label}</b></div>{children}</div>;
}

export function SignalWave({ progress, quiet = false }: { progress: number; quiet?: boolean }) {
  return <div className={`recon-wave ${quiet ? 'is-quiet' : ''}`}>{Array.from({ length: 43 }, (_, index) => <i key={index} style={{ height: `${quiet ? 5 : 8 + Math.sin(index * .61 + progress * 18) ** 2 * (18 + Math.sin(index * .13) ** 2 * 30)}px` }} />)}</div>;
}

export function SceneRail({ labels, stage }: { labels: string[]; stage: number }) {
  return <div className="recon-rail">{labels.map((label, index) => <div className={index <= stage ? 'is-reached' : ''} key={label}><span>{index < stage ? '\u2713' : `0${index + 1}`}</span><b>{label}</b></div>)}</div>;
}

export function Readout({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`recon-readout ${active ? 'is-active' : ''}`}><span>{label}</span><strong>{value}</strong></div>;
}

export function SceneNote({ label, children }: { label: string; children: ReactNode }) {
  return <div className="recon-note"><span>{label}</span><p>{children}</p></div>;
}

export const sceneStyle = (progress: number): CSSProperties => ({ '--scene-progress': progress } as CSSProperties);
export const revealText = (text: string, progress: number) => text.slice(0, Math.max(1, Math.ceil(text.length * Math.min(1, progress * 2.5))));
