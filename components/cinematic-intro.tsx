import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { BrandMark } from './brand-mark';

/** Server-rendered, CSS-timed opening. Skip and completion work before hydration. */
export function CinematicIntro() {
  return <div id="ftt-intro" className="ftt-cinematic-intro" role="dialog" aria-modal="true" aria-label="Abertura da FTT Imóveis">
    <div className="ftt-intro-ambient" aria-hidden="true"/>
    <div className="ftt-intro-composition">
      <div className="ftt-intro-symbol"><BrandMark cinematic/><span className="ftt-intro-beam" aria-hidden="true"/><span className="ftt-intro-horizon" aria-hidden="true"/></div>
      <p className="ftt-intro-name"><span className="sr-only">FTT Imóveis</span><span aria-hidden="true">{Array.from('FTT IMÓVEIS').map((letter,index)=><span key={index} style={{'--letter-index':index} as CSSProperties}>{letter===' '?'\u00a0':letter}</span>)}</span></p>
      <span className="ftt-intro-rule" aria-hidden="true"/>
      <p className="ftt-intro-tagline">Seu próximo capítulo começa aqui.</p>
    </div>
    <button type="button" className="ftt-intro-skip" data-skip-intro="" aria-keyshortcuts="Escape">Pular abertura <ArrowRight size={16}/></button>
  </div>;
}
