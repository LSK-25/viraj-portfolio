'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const seenKey = 'vp.opening-seen.v1';

export function OpeningSequence() {
  const [visible, setVisible] = useState(false);
  const dismissedRef = useRef(false);
  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setVisible(false);
    window.dispatchEvent(new Event('portfolio:intro-finished'));
  }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    try { if (sessionStorage.getItem(seenKey)) return; } catch { /* Still show a short opening when storage is unavailable. */ }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => {
      if (dismissedRef.current) return;
      try { sessionStorage.setItem(seenKey, '1'); } catch { /* The page still works without storage. */ }
      setVisible(true);
      timer = setTimeout(dismiss, 2000);
    });
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') dismiss(); };
    const hidden = () => { if (document.hidden) dismiss(); };
    const reduced = () => { if (preference.matches) dismiss(); };
    window.addEventListener('keydown', escape);
    document.addEventListener('visibilitychange', hidden);
    preference.addEventListener('change', reduced);
    return () => {
      cancelAnimationFrame(frame); if (timer) clearTimeout(timer);
      window.removeEventListener('keydown', escape);
      document.removeEventListener('visibilitychange', hidden);
      preference.removeEventListener('change', reduced);
    };
  }, [dismiss]);

  if (!visible) return null;
  return <div className="portfolio-opening" role="region" aria-label="Portfolio introduction">
    <div className="opening-grain" aria-hidden="true" />
    <div className="opening-margins" aria-hidden="true"><span>Independent portfolio</span><span>India / 2026</span></div>
    <div className="opening-iris" aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="opening-title" aria-hidden="true">
      <span className="opening-kicker">A curious mind. A considered approach.</span>
      <div className="opening-name"><span>VIRAJ</span><em>PATIL</em></div>
      <span className="opening-rule" />
      <span className="opening-disciplines">SOFTWARE <i /> INTELLIGENCE <i /> INTENT</span>
    </div>
    <div className="opening-foot"><span>Selected work / Five perspectives</span><button type="button" onClick={dismiss}>Skip intro <span aria-hidden="true">↗</span></button></div>
  </div>;
}
