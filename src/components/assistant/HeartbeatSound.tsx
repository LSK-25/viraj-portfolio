"use client";

import { useEffect, useRef, useState } from "react";

function pulse(context: AudioContext, destination: AudioNode, strength = 1) {
  if (context.state !== "running" || document.hidden) return;
  for (const [delay, amount] of [[0.02, 1], [.23, .66]]) {
    const start = context.currentTime + delay;
    for (const [frequency, gain] of [[115, 1], [190, .22]]) {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * .66, start + .15);
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(amount * gain * strength, start + .012);
      envelope.gain.exponentialRampToValueAtTime(.0001, start + .2);
      oscillator.connect(envelope); envelope.connect(destination);
      oscillator.start(start); oscillator.stop(start + .23);
      oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
    }
  }
}

export function HeartbeatSound({ quiet }: { quiet: boolean }) {
  const audio = useRef<AudioContext | null>(null);
  const mounted = useRef(true);
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(22);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled || !audio.current) return;
    const context = audio.current;
    const output = context.createGain();
    output.gain.value = (volume / 100) * .45 * (quiet ? .25 : 1);
    output.connect(context.destination);
    const play = () => pulse(context, output);
    play();
    const timer = window.setInterval(play, 1050);
    return () => { window.clearInterval(timer); output.disconnect(); };
  }, [enabled, volume, quiet]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      const context = audio.current;
      audio.current = null;
      if (context && context.state !== "closed") void context.close().catch(() => {});
    };
  }, []);

  async function ensureAudio() {
    const context = audio.current ?? new AudioContext();
    audio.current = context;
    await context.resume();
    if (!mounted.current || audio.current !== context || context.state !== "running") throw new Error("Audio could not start.");
    return context;
  }

  async function toggle() {
    if (enabled) { setEnabled(false); return; }
    setStarting(true); setError("");
    try { await ensureAudio(); if (mounted.current) setEnabled(true); }
    catch { if (mounted.current) setError("Sound could not start. Check the tab mute and device volume, then try Preview."); }
    finally { if (mounted.current) setStarting(false); }
  }

  async function preview() {
    setError("");
    try {
      const context = await ensureAudio();
      pulse(context, context.destination, (volume / 100) * .45);
    } catch { if (mounted.current) setError("Sound is unavailable. Check the tab mute and device volume."); }
  }

  return <div className="heartbeat-control">
    <button type="button" className={enabled ? "heartbeat-toggle is-on" : "heartbeat-toggle"} onClick={() => void toggle()} aria-pressed={enabled} disabled={starting} title="Optional ambient heartbeat sound">
      <span className="heartbeat-dot" aria-hidden="true" />{starting ? "Starting sound…" : `Heartbeat sound ${enabled ? "on" : "off"}`}
    </button>
    <div className="heartbeat-settings">
      {enabled && <svg className="heartbeat-ecg" viewBox="0 0 70 24" aria-hidden="true"><path d="M0 13H13L17 10L21 15L26 3L31 22L36 10L40 13H70" /></svg>}
      <label htmlFor="heartbeat-volume">Volume</label><input id="heartbeat-volume" type="range" min="5" max="45" value={volume} onChange={event => setVolume(Number(event.target.value))} aria-label="Heartbeat volume" /><span>{volume}%</span>
      <button type="button" className="heartbeat-preview" onClick={() => void preview()}>Preview</button>
    </div>
    <span className="heartbeat-description">Optional background sound{enabled && quiet ? " · quieter during conversation" : " · does not change NOVA’s replies"}.</span>
    {error && <span role="status">{error}</span>}
  </div>;
}
