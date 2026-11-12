"use client";

import { useEffect, useRef, useState } from "react";

export function HeartbeatSound({ quiet }: { quiet: boolean }) {
  const audio = useRef<AudioContext | null>(null);
  const volume = useRef<GainNode | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return;
    const context = audio.current;
    if (!context) return;
    const output = context.createGain();
    output.gain.value = 0;
    output.connect(context.destination);
    volume.current = output;

    function beat(delay: number, strength: number) {
      if (!context || context.state !== "running" || document.hidden) return;
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(82, start);
      oscillator.frequency.exponentialRampToValueAtTime(43, start + 0.13);
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(strength, start + 0.015);
      envelope.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
      oscillator.connect(envelope);
      envelope.connect(output);
      oscillator.start(start);
      oscillator.stop(start + 0.2);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
      };
    }

    function pulse() {
      beat(0, 1);
      beat(0.23, 0.65);
    }

    pulse();
    const timer = window.setInterval(pulse, 1050);
    return () => {
      window.clearInterval(timer);
      output.disconnect();
      volume.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    const context = audio.current;
    const output = volume.current;
    if (context && output) {
      output.gain.setTargetAtTime(quiet ? 0.004 : 0.06, context.currentTime, 0.12);
    }
  }, [enabled, quiet]);

  useEffect(() => () => {
    const context = audio.current;
    audio.current = null;
    if (context && context.state !== "closed") void context.close().catch(() => {});
  }, []);

  async function toggle() {
    if (enabled) {
      setEnabled(false);
      return;
    }
    setError("");
    try {
      const context = audio.current ?? new AudioContext();
      audio.current = context;
      await context.resume();
      if (audio.current === context && context.state === "running") setEnabled(true);
    } catch {
      setError("Sound is unavailable in this browser.");
    }
  }

  return (
    <div className="heartbeat-control">
      <button
        type="button"
        className={enabled ? "heartbeat-toggle is-on" : "heartbeat-toggle"}
        onClick={() => void toggle()}
        aria-pressed={enabled}
      >
        <span className="heartbeat-dot" aria-hidden="true" />
        Heartbeat {enabled ? "on" : "off"}
      </button>
      {error && <span role="status">{error}</span>}
    </div>
  );
}
