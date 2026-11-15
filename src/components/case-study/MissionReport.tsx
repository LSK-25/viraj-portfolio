'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import type { CaseStudy } from '@/data/case-studies';
import { briefingChapterStart, briefingDuration, briefingPosition } from '@/lib/briefing-timeline';
import { BriefingVisual } from './BriefingVisual';

const clock = (value: number) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;

export function MissionReport({ study }: { study: CaseStudy }) {
  const player = useRef<HTMLDivElement>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [narration, setNarration] = useState(true);
  const [voicePass, setVoicePass] = useState(0);
  const [notice, setNotice] = useState('');
  const reduced = useReducedMotion();
  const duration = briefingDuration(study.scenes);
  const position = briefingPosition(study.scenes, elapsed);
  const scene = study.scenes[position.index];
  const ended = elapsed >= duration;
  const active = playing && !ended;

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = performance.now();
    let pending = 0;
    const tick = (now: number) => {
      pending += Math.min((now - last) / 1000, .2); last = now;
      if (pending >= .05) { const delta = pending; pending = 0; setElapsed(value => Math.min(duration, value + delta)); }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, duration]);

  useEffect(() => {
    if (!active || !narration || !('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    const voice = new SpeechSynthesisUtterance(scene.narration);
    voice.lang = 'en-US'; voice.rate = .96; voice.pitch = .88; voice.volume = .85;
    const voices = window.speechSynthesis.getVoices().filter(item => item.lang.startsWith('en'));
    const selected = voices.find(item => /David|Mark|Daniel|Guy/i.test(item.name)) ?? voices.find(item => item.localService) ?? voices[0];
    if (selected) voice.voice = selected;
    utterance.current = voice;
    voice.onend = () => { if (utterance.current === voice) utterance.current = null; };
    voice.onerror = event => { if (utterance.current === voice) { utterance.current = null; if (!['interrupted', 'canceled'].includes(event.error)) setNotice('Narration could not play. Captions are available below.'); } };
    window.speechSynthesis.speak(voice);
    return () => { if (utterance.current === voice) { utterance.current = null; voice.onend = voice.onerror = null; window.speechSynthesis.cancel(); } };
    // Seeking within a chapter intentionally replays that chapter's narration.
  }, [active, narration, position.index, scene.narration, voicePass]);

  useEffect(() => {
    const pause = () => setPlaying(false);
    const hidden = () => { if (document.hidden) pause(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) pause(); });
    if (player.current) observer.observe(player.current);
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('portfolio:assistant', pause);
    window.addEventListener('portfolio:assistant-opened', pause);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', hidden); window.removeEventListener('portfolio:assistant', pause); window.removeEventListener('portfolio:assistant-opened', pause); };
  }, []);

  function toggle() {
    if (active) { setPlaying(false); return; }
    setNotice('');
    if (ended) { setElapsed(0); setVoicePass(value => value + 1); }
    if (narration && (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window))) setNotice('Narration is unavailable in this browser. Captions are on.');
    setPlaying(true);
  }
  function seek(value: number) { setElapsed(Math.max(0, Math.min(duration, value))); setVoicePass(pass => pass + 1); }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await player.current?.requestFullscreen(); }
    catch { setNotice('Fullscreen is unavailable here. The briefing still works in this view.'); }
  }

  return <div ref={player} className={`mission-player ${active ? 'is-playing' : 'is-paused'} ${reduced ? 'reduce-motion' : ''}`} style={{ '--report-accent': study.accent } as CSSProperties} aria-label={`${study.codename} project briefing`}>
    <div className="mission-topbar"><span><i />PROJECT BRIEFING / {study.codename}</span><span>0{position.index + 1} / 0{study.scenes.length}</span></div>
    <div className="mission-stage">
      <BriefingVisual study={study} stage={position.index} progress={position.progress} reduced={Boolean(reduced)} />
      <div className="mission-vignette" aria-hidden="true" /><div className="mission-scanlines" aria-hidden="true" />
      <div className="mission-scene-caption" key={position.index}><span>{scene.label}</span><h3>{scene.heading}</h3><div>{scene.signals.map(signal => <b key={signal}>{signal}</b>)}</div></div>
      {!active && <button type="button" className="mission-play-overlay" onClick={toggle} aria-label={ended ? 'Replay briefing' : elapsed ? 'Resume briefing' : 'Play briefing'}><span aria-hidden="true">▶</span>{ended ? 'Replay briefing' : elapsed ? 'Resume briefing' : 'Begin briefing'}</button>}
      <p className="mission-recreation">Scripted visual recreation · Not live application footage</p>
    </div>
    <div className="mission-captions" aria-live="polite" aria-atomic="true"><span>BRIEF / {scene.label}</span><p>{scene.narration}</p></div>
    <div className="mission-controls"><button type="button" onClick={toggle} aria-label={active ? 'Pause briefing' : 'Play briefing'}>{active ? 'Ⅱ Pause' : ended ? '↺ Replay' : '▶ Play'}</button><span className="mission-clock">{clock(elapsed)} / {clock(duration)}</span><label className="sr-only" htmlFor={`report-progress-${study.id}`}>Briefing progress in seconds</label><input id={`report-progress-${study.id}`} type="range" min="0" max={duration} step="0.1" value={elapsed} onChange={event => seek(Number(event.target.value))} /><button type="button" aria-pressed={narration} onClick={() => setNarration(value => !value)}>Narration {narration ? 'on' : 'off'}</button><button type="button" onClick={() => void fullscreen()} aria-label="Toggle briefing fullscreen">↗<span className="fullscreen-label"> Fullscreen</span></button></div>
    <nav className="mission-chapters" aria-label="Briefing chapters">{study.scenes.map((item, index) => <button type="button" key={item.label} aria-current={index === position.index ? 'step' : undefined} onClick={() => seek(briefingChapterStart(study.scenes, index))}><span>0{index + 1}</span>{item.label}</button>)}</nav>
    {notice && <p className="mission-notice" role="status">{notice}</p>}
    <details className="mission-transcript"><summary>Read the complete briefing</summary>{study.scenes.map(item => <p key={item.label}><strong>{item.label}</strong>{item.narration}</p>)}</details>
  </div>;
}
