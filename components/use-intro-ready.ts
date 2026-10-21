'use client';
import { useEffect, useState } from 'react';

/** Synchronizes the hero with the pre-hydration CSS timeline, including slow hydration. */
export function useIntroReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const reveal = () => setReady(true);
    if (document.documentElement.dataset.fttIntro !== 'playing') reveal();
    window.addEventListener('ftt:intro-reveal', reveal);
    window.addEventListener('ftt:intro-ready', reveal);
    return () => {
      window.removeEventListener('ftt:intro-reveal', reveal);
      window.removeEventListener('ftt:intro-ready', reveal);
    };
  }, []);
  return ready;
}
