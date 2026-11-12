'use client';

import {useCallback, useEffect, useRef, useState} from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_-+';
export function ScrambleText({text, className = '', playOnMount = false, delay = 0}: {text: string; className?: string; playOnMount?: boolean; delay?: number}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const scramble = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(frame.current);
    const started = performance.now();
    function animate(now: number) {
      const progress = Math.min(1, (now - started) / 650);
      setDisplay(text.split('').map((char, index) => char === ' ' || index < progress * (text.length + 3) - 3 ? char : characters[Math.floor(Math.random() * characters.length)]).join(''));
      if (progress < 1) frame.current = requestAnimationFrame(animate);
      else setDisplay(text);
    }
    frame.current = requestAnimationFrame(animate);
  }, [text]);
  useEffect(() => {
    const timer = playOnMount ? setTimeout(scramble, delay) : undefined;
    return () => {clearTimeout(timer); cancelAnimationFrame(frame.current);};
  }, [playOnMount, delay, scramble]);
  return <span className={'scramble-text ' + className} onPointerEnter={event => {if (event.pointerType === 'mouse') scramble();}}>
    <span className="sr-only">{text}</span><span className="scramble-source" aria-hidden="true">{text}</span><span className="scramble-display" aria-hidden="true">{display}</span>
  </span>;
}
