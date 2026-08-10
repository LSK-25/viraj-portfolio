"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

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
    if (isSpace) return;

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
    return () => {
      Object.values(timersRef.current).forEach((timer) => {
        clearTimeout(timer);
      });
    };
  }, []);

  return (
    <span className={className}>
      {preparedLines.map((line, lineIndex) => (
        <span key={lineIndex} className="block overflow-visible">
          {line.map((letter) => {
            const isSpace = letter.char === " ";
            const isErased = erasedLetters.has(letter.index);

            return (
              <motion.span
                key={letter.key}
                onPointerEnter={() => eraseLetter(letter.index, isSpace)}
                className="relative -mr-[0.055em] inline-block whitespace-pre"
                animate={
                  isErased
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
                  duration: isErased ? 0.18 : 0.65,
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
  );
}