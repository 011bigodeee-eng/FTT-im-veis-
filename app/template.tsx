'use client';

import { motion, useReducedMotion } from 'motion/react';

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div className="page-transition" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.45, ease: 'easeOut' }}>{children}</motion.div>;
}
