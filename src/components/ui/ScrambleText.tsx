"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ScrambleTextProps = {
  text: string;
  className?: string;
  playOnMount?: boolean;
  delay?: number;
};

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\_-+=<>";

export function ScrambleText({
  text,
  className = "",
  playOnMount = false,
  delay = 0,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const rafRef = useRef<number | null>(null);

  const scramble = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    let frame = 0;
    const revealSpeed = 1.65;
    const holdFrames = 8;
    const totalFrames = text.length * revealSpeed + holdFrames;

    function animate() {
      frame += 1;

      const output = text
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";

          const shouldReveal = frame > index * revealSpeed + holdFrames;

          if (shouldReveal) {
            return char;
          }

          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      setDisplayText(output);

      if (frame < totalFrames) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [text]);

  useEffect(() => {
    if (!playOnMount) return;

    const timer = setTimeout(() => {
      scramble();
    }, delay);

    return () => {
      clearTimeout(timer);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [playOnMount, delay, scramble]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <span
      onPointerEnter={scramble}
      onFocus={scramble}
      className={`inline-block whitespace-nowrap ${className}`}
      style={{ minWidth: `${Math.max(text.length, 1)}ch` }}
      aria-label={text}
    >
      {displayText}
    </span>
  );
}