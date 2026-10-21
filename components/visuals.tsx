'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from './site';

export function ImageReveal({ src, alt, className = '', children, sizes = '(max-width: 800px) 100vw, 45vw' }: { src: string; alt: string; className?: string; children?: ReactNode; sizes?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={`image-reveal ${className}`} initial={reduced ? false : { clipPath: 'inset(12% 0% 12% 0%)', opacity: 0 }} whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}><Image src={src} alt={alt} fill sizes={sizes} />{children}</motion.div>;
}

export function ArchitectureFeature() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-55, 55]);
  return <section className="architecture-feature" ref={ref} aria-labelledby="architecture-title"><motion.div className="architecture-feature-image" style={{ y: reduced ? 0 : y }}><Image src="/images/architecture-sunset.webp" alt="Residência contemporânea entre jardins, imagem ilustrativa gerada por IA" fill sizes="100vw" /></motion.div><div className="architecture-feature-shade" /><div className="architecture-feature-content"><Reveal><span className="eyebrow">ARQUITETURA QUE AMPLIA HORIZONTES</span><h2 id="architecture-title">Espaços extraordinários.<br /><em>Novas possibilidades.</em></h2><p>Cada imóvel representa uma oportunidade de transformar planos em conquistas.</p><Link href="/imoveis" className="button button-glass">Explorar imóveis <ArrowUpRight size={20} /></Link></Reveal><span className="architecture-feature-caption">FTT IMÓVEIS <i /> UM NOVO OLHAR PARA O SEU PATRIMÔNIO</span></div></section>;
}

export function MagneticLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  return <span ref={ref} className="magnetic-shell" onPointerMove={event => {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--magnet-x', `${(event.clientX - rect.left - rect.width / 2) * .045}px`);
    event.currentTarget.style.setProperty('--magnet-y', `${(event.clientY - rect.top - rect.height / 2) * .08}px`);
  }} onPointerLeave={event => { event.currentTarget.style.setProperty('--magnet-x', '0px'); event.currentTarget.style.setProperty('--magnet-y', '0px'); }}><Link href={href} className={className}>{children}</Link></span>;
}
