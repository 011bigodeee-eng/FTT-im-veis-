'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useMotionValue, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import {useIntroReady} from './use-intro-ready';

const scenes = [
  { src: '/images/hero-premium.webp', label: 'Linhas que inspiram', detail: 'Arquitetura contemporânea', position: 'center 55%' },
  { src: '/images/architecture-sunset.webp', label: 'O extraordinário no cotidiano', detail: 'Espaços para novas histórias', position: 'center 55%' },
  { src: '/images/architecture-interior.webp', label: 'O conforto de pertencer', detail: 'Luz, detalhes e possibilidades', position: 'center 55%' },
];
const SLIDE_DURATION = 8000;

export function HeroBackdrop() {
  const introReady = useIntroReady();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const elapsed = useRef(0);
  const progress = useMotionValue(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const visible = useInView(sceneRef);
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);

  useEffect(() => {
    if (paused || reduced || !visible || !introReady) return;
    let previous: number | undefined;
    let frame: number;
    const tick = (now: number) => {
      if (previous !== undefined && !document.hidden) elapsed.current += Math.min(now - previous, 100);
      previous = now;
      if (elapsed.current >= SLIDE_DURATION) {
        elapsed.current = 0;
        setActive(current => (current + 1) % scenes.length);
      }
      progress.set(elapsed.current / SLIDE_DURATION);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, reduced, visible, introReady, progress]);

  function select(index: number) {
    setActive((index + scenes.length) % scenes.length);
    setPaused(true);
    elapsed.current = 0;
    progress.set(0);
  }

  return (
    <>
      <div ref={sceneRef} className={`hero-art hero-photographic ${paused ? 'is-paused' : ''}`} aria-hidden="true">
        <motion.div className="hero-parallax" style={{ y: reduced ? 0 : y }}>
          {scenes.map((scene, index) => (
            <div key={scene.src} className={`hero-photo hero-photo-${index} ${index === active ? 'is-active' : ''}`}>
              <div className="hero-photo-camera">
                <Image src={scene.src} alt="" fill sizes="100vw" priority={index === 0} style={{ objectPosition: scene.position }} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="cinema-controls" role="region" aria-label="Slideshow de arquitetura" aria-roledescription="carrossel" onFocusCapture={event => { if (!(event.target as HTMLElement).closest('.motion-toggle')) setPaused(true); }}>
        <div className="cinema-caption"><span>{String(active + 1).padStart(2, '0')} <i>/ 03</i></span><div><strong>{scenes[active].label}</strong><small>{scenes[active].detail} · Imagem ilustrativa</small></div></div>
        <div className="cinema-navigation">
          <button type="button" className="cinema-arrow" onClick={() => select(active - 1)} aria-label="Imagem anterior do slideshow"><ArrowLeft size={17} /></button>
          <div className="cinema-indicators">
            {scenes.map((scene, index) => <button key={scene.src} type="button" className={active === index ? 'active' : ''} aria-label={`Ver imagem ${index + 1}: ${scene.label}`} aria-current={active === index ? 'true' : undefined} onClick={() => select(index)}><span>{String(index + 1).padStart(2, '0')}</span><i>{active === index && <motion.b style={{ scaleX: progress }} />}</i></button>)}
          </div>
          <button type="button" className="cinema-arrow" onClick={() => select(active + 1)} aria-label="Próxima imagem do slideshow"><ArrowRight size={17} /></button>
          <button className="motion-toggle" type="button" aria-label={paused ? 'Retomar animação do fundo' : 'Pausar animação do fundo'} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>
        </div>
      </div>
    </>
  );
}

export function HeroTitle() {
  let wordIndex = 0;
  const words = (text: string) => text.split(' ').map(word => {
    const index = wordIndex++;
    return <span className="title-word-mask" key={word}><motion.span initial={false} className="ftt-hero-word" style={{ '--word-index': index } as CSSProperties}>{word}</motion.span></span>;
  });
  return <h1 className="hero-title" aria-label="Seu próximo capítulo começa no lugar certo."><span className="title-line" aria-hidden="true">{words('Seu próximo capítulo')}</span><span className="title-line" aria-hidden="true">{words('começa no')} <em>{words('lugar certo.')}</em></span></h1>;
}
