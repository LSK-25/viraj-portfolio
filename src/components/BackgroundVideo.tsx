"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/Icons";

export function BackgroundVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const wantsPlayback = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const player = video.current;
    const container = frame.current;
    if (!player || !container) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    wantsPlayback.current = !preference.matches;
    let visible = true;
    let disposed = false;

    function syncPlayback() {
      if (!player || disposed) return;
      if (!wantsPlayback.current || document.hidden || !visible) {
        player.pause();
        return;
      }
      void player.play().catch(() => {
        // The play control remains available when autoplay is blocked.
      });
    }

    function updatePreference() {
      wantsPlayback.current = !preference.matches;
      syncPlayback();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(container);
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();

    return () => {
      disposed = true;
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", syncPlayback);
      player.pause();
    };
  }, []);

  function togglePlayback() {
    const player = video.current;
    if (!player) return;
    wantsPlayback.current = player.paused;
    if (wantsPlayback.current) {
      void player.play().catch(() => setPlaying(false));
    } else {
      player.pause();
    }
  }

  return (
    <>
      <div className="hero-film" ref={frame}>
        <div className="hero-film-image" aria-hidden="true" />
        <video
          ref={video}
          className={failed ? "hero-film-video is-unavailable" : "hero-film-video"}
          src="/videos/leon-loop.mp4"
          poster="/images/0db89ff0d3923a0faa425262dcedd137.png"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
        <div className="hero-film-shade" aria-hidden="true" />
      </div>
      <div className="film-controls">
        <a
          className="film-reference"
          href="https://www.youtube.com/watch?v=gTPsGjDC-gU"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Visual inspiration</span>
          <strong>Leon S. Kennedy <ArrowIcon width={13} height={13} /></strong>
        </a>
        {!failed && (
          <button
            type="button"
            className="film-toggle"
            onClick={togglePlayback}
            aria-label={playing ? "Pause background video" : "Play background video"}
          >
            <span className={playing ? "film-pause-icon" : "film-play-icon"} aria-hidden="true" />
            {playing ? "Pause film" : "Play film"}
          </button>
        )}
      </div>
    </>
  );
}
