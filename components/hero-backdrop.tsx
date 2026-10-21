'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Pause, Play } from 'lucide-react';

const scenes = [
  { src: '/images/hero.jpg', position: 'center 56%' },
  { src: '/images/property-5.jpg', position: 'center 55%' },
  { src: '/images/interior.jpg', position: 'center 55%' },
];

/** Photographic camera movement with crossfades; no external video or player. */
export function HeroBackdrop() {
  const [paused, setPaused] = useState(false);

  return (
    <>
      <div className={`hero-art hero-photographic ${paused ? 'is-paused' : ''}`} aria-hidden="true">
        {scenes.map((scene, index) => (
          <div key={scene.src} className={`hero-photo hero-photo-${index}`}>
            <div className="hero-photo-camera">
              <Image
                src={scene.src}
                alt=""
                fill
                sizes="100vw"
                priority={index === 0}
                style={{ objectPosition: scene.position }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="motion-toggle"
        type="button"
        aria-label={paused ? 'Retomar animação do fundo' : 'Pausar animação do fundo'}
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play size={12} /> : <Pause size={12} />}
        <span>{paused ? 'Retomar movimento' : 'Pausar movimento'}</span>
      </button>
    </>
  );
}
