'use client';

import {useEffect} from 'react';

export function ScrollReveals() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-waiting');
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      }
    }, {threshold: 0.06});
    function refresh() {
      observer.disconnect();
      for (const element of elements) {
        element.classList.remove('reveal-waiting', 'reveal-visible');
        if (!motion.matches && element.getBoundingClientRect().top >= window.innerHeight) {
          element.classList.add('reveal-waiting');
          observer.observe(element);
        }
      }
    }
    refresh();
    motion.addEventListener('change', refresh);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', refresh);
      elements.forEach(element => element.classList.remove('reveal-waiting', 'reveal-visible'));
    };
  }, []);
  return null;
}
