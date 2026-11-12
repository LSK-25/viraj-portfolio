'use client';

import {useState, type CSSProperties} from 'react';

export function Loader() {
  const [finished, setFinished] = useState(false);
  if (finished) return null;
  return (
    <div className="portfolio-intro" aria-hidden="true" onAnimationEnd={event => {
      if (event.target === event.currentTarget) setFinished(true);
    }}>
      <div className="intro-wordmark">
        {'VIRAJ PATIL'.split('').map((letter, index) => (
          <span key={index} style={{'--letter-index': index} as CSSProperties}>{letter === ' ' ? '\u00a0' : letter}</span>
        ))}
      </div>
      <p>Observe / Reason / Build</p>
      <div className="intro-line" />
    </div>
  );
}
