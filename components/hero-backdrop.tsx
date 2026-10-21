'use client';

import { useState } from 'react';
import { Pause, Play } from 'lucide-react';

/** Lightweight, locally rendered animation: no video download or external service. */
export function HeroBackdrop() {
  const [paused, setPaused] = useState(false);

  return (
    <>
      <div className={`hero-art ${paused ? 'is-paused' : ''}`} aria-hidden="true">
        <div className="hero-art-grid" />
        <div className="hero-glow hero-glow-gold" />
        <div className="hero-glow hero-glow-blue" />
        <div className="hero-art-orbit orbit-one" />
        <div className="hero-art-orbit orbit-two" />
        <svg className="hero-architecture" viewBox="0 0 1600 1000" fill="none">
          <defs>
            <linearGradient id="glass" x1="650" y1="150" x2="1450" y2="900" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8ba4b4" stopOpacity=".23" />
              <stop offset=".55" stopColor="#24425b" stopOpacity=".07" />
              <stop offset="1" stopColor="#e9aa36" stopOpacity=".12" />
            </linearGradient>
            <linearGradient id="edge" x1="600" y1="100" x2="1400" y2="900" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e9aa36" stopOpacity=".15" />
              <stop offset=".5" stopColor="#f3d7a0" stopOpacity=".8" />
              <stop offset="1" stopColor="#e9aa36" stopOpacity=".1" />
            </linearGradient>
          </defs>
          <g className="architecture-distant" stroke="#658194" strokeOpacity=".23">
            <path d="M790 1000V330L1080 190L1330 285V1000M790 330L1040 435L1330 285M1040 435V1000" />
            <path d="M830 1000V400M880 1000V420M930 1000V440M980 1000V460M1090 1000V440M1140 1000V410M1190 1000V380M1240 1000V350" />
          </g>
          <g className="architecture-main" stroke="url(#edge)" strokeWidth="1.2">
            <path fill="url(#glass)" d="M650 860V350L1145 120L1510 295V900L1015 1130Z" />
            <path d="M650 350L1015 525L1510 295M1015 525V1130M650 450L1015 625L1510 395M650 550L1015 725L1510 495M650 650L1015 825L1510 595M650 750L1015 925L1510 695M650 850L1015 1025L1510 795" />
            <path d="M740 395V905M830 438V950M920 481V995M1114 480V1080M1213 434V1035M1312 388V990M1411 342V945" strokeOpacity=".4" />
            <path className="architecture-trace" d="M650 860V350L1145 120L1510 295L1015 525L650 350M1015 525V1130" stroke="#efc67e" strokeWidth="2" />
          </g>
          <g className="architecture-floor" stroke="#b9945b" strokeOpacity=".2">
            <path d="M200 1000L1050 600L1600 860M400 1000L1150 650L1600 860M600 1000L1250 700L1600 860M800 1000L1350 750L1600 860M400 910L1400 910M500 860L1550 860" />
          </g>
          <circle className="architecture-point" cx="1145" cy="120" r="5" fill="#efc67e" stroke="none" />
          <circle className="architecture-point point-second" cx="650" cy="350" r="4" fill="#efc67e" stroke="none" />
        </svg>
        <div className="hero-light-sweep" />
        <span className="hero-art-coordinate">FTT / PERSPECTIVAS EM MOVIMENTO</span>
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
