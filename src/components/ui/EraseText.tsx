"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type EraseTextProps = {
  lines: string[];
  className?: string;
  restoreDelay?: number;
};

export function EraseText({ lines, className = "", restoreDelay = 1400 }: EraseTextProps) {
  const reducedMotion = useReducedMotion();
  const [erased, setErased] = useState<Set<string>>(new Set());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => { pending.forEach(clearTimeout); pending.clear(); };
  }, []);

  function erase(key: string, pointerType: string) {
    if (pointerType !== "mouse" || reducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setErased(previous => previous.has(key) ? previous : new Set(previous).add(key));
    const previous = timers.current.get(key);
    if (previous) clearTimeout(previous);
    timers.current.set(key, setTimeout(() => {
      setErased(current => { const next = new Set(current); next.delete(key); return next; });
      timers.current.delete(key);
    }, restoreDelay));
  }

  return <span className={`erase-text ${lines.length === 1 ? "erase-single" : ""} ${className}`}>
    <span className="sr-only">{lines.join(" ")}</span>
    <span aria-hidden="true">{lines.map((line, lineIndex) => <span className="erase-line" key={lineIndex}>
      {line.split(/(\s+)/).map((word, wordIndex) => /^\s+$/.test(word) ? word : <span className="erase-word" key={wordIndex}>
        {Array.from(word).map((character, index) => {
          const key = `${lineIndex}-${wordIndex}-${index}`;
          return <span key={key} className="erase-letter" onPointerEnter={event => erase(key, event.pointerType)} onPointerMove={event => erase(key, event.pointerType)}>
            <span className={`erase-ink ${erased.has(key) && !reducedMotion ? "is-erased" : ""}`}>{character}</span>
          </span>;
        })}
      </span>)}
    </span>)}</span>
  </span>;
}
