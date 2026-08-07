"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { navItems } from "@/data/site";

export function Header() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-8 py-8">
      <nav className="mx-auto flex max-w-[1500px] items-center justify-between text-[10px] uppercase tracking-[0.38em] text-white/58">
        <a
          href="#"
          className="font-semibold text-white/72 transition duration-300 hover:text-white"
        >
          Viraj Patil
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
              className="relative py-2 transition duration-300 hover:text-white"
            >
              {hovered === item.label && (
                <motion.span
                  layoutId="nav-line"
                  className="absolute -bottom-1 left-0 h-px w-full bg-white/70"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}

              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="transition duration-300 hover:text-white"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}