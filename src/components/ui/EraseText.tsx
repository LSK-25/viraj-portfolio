"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type EraseTextProps = {
  lines: string[];
  className?: string;
  restoreDelay?: number;
};

type LetterData = {
  char: string;
  key: string;
  index: number;
};

export function EraseText({
  lines,
  className = "",
  restoreDelay = 3000,
}: EraseTextProps) {
  const reducedMotion = useReducedMotion();
  const [erasedLetters, setErasedLetters] = useState<Set<number>>(new Set());
  const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const preparedLines = useMemo(() => {
    return lines.map((line, lineIndex) =>
      line.split("").map((char, charIndex): LetterData => {
        return {
          char,
          key: `${lineIndex}-${charIndex}`,
          index: lineIndex * 1000 + charIndex,
        };
      }),
    );
  }, [lines]);

  function eraseLetter(index: number, isSpace: boolean) {
    if (isSpace || reducedMotion) return;

    setErasedLetters((previous) => {
      const next = new Set(previous);
      next.add(index);
      return next;
    });

    if (timersRef.current[index]) {
      clearTimeout(timersRef.current[index]);
    }

    timersRef.current[index] = setTimeout(() => {
      setErasedLetters((previous) => {
        const next = new Set(previous);
        next.delete(index);
        return next;
      });

      delete timersRef.current[index];
    }, restoreDelay);
  }

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      Object.values(timers).forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  return (
    <span className={`erase-text ${className}`}>
      <span className="sr-only">{lines.join(' ')}</span>
      <span aria-hidden="true">
      {preparedLines.map((line, lineIndex) => (
        <span key={lineIndex} className="block overflow-visible whitespace-nowrap">
          {line.map((letter) => {
            const isSpace = letter.char === " ";
            const isErased = erasedLetters.has(letter.index);

            return (
              <motion.span
                key={letter.key}
                onPointerEnter={event => {if(event.pointerType === 'mouse') eraseLetter(letter.index, isSpace);}}
                className="relative inline-block whitespace-pre"
                animate={
                  isErased && !reducedMotion
                    ? {
                        opacity: 0,
                        scale: 0.35,
                        y: -18,
                        filter: "blur(12px)",
                      }
                    : {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        filter: "blur(0px)",
                      }
                }
                transition={{
                  duration: reducedMotion ? 0 : isErased ? 0.18 : 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {isSpace ? "\u00A0" : letter.char}

                {!isSpace && (
                  <motion.span
                    className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-white"
                    animate={
                      isErased
                        ? {
                            opacity: [0, 1, 0],
                            scale: [0, 1.8, 0],
                            x: "-50%",
                            y: "-50%",
                            boxShadow: [
                              "0 0 0px rgba(255,255,255,0)",
                              "0 0 22px rgba(255,255,255,0.95)",
                              "0 0 0px rgba(255,255,255,0)",
                            ],
                          }
                        : {
                            opacity: 0,
                            scale: 0,
                            x: "-50%",
                            y: "-50%",
                          }
                    }
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                )}
              </motion.span>
            );
          })}
        </span>
      ))}
      </span>
    </span>
  );
}
