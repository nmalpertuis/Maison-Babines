import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/** Apparition au scroll : fondu + montée de 30 px. */
export function Reveal({ children, delai = 0, className, as = 'div' }: { children: ReactNode; delai?: number; className?: string; as?: 'div' | 'li' | 'section' }) {
  const reduit = useReducedMotion();
  const M = as === 'li' ? motion.li : as === 'section' ? motion.section : motion.div;
  return (
    <M
      className={className}
      initial={reduit ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: delai, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

export const cascade: Variants = {
  cache: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
export const enfant: Variants = {
  cache: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/** Grille dont les enfants apparaissent en cascade. */
export function Cascade({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' }) {
  const reduit = useReducedMotion();
  const M = as === 'ul' ? motion.ul : motion.div;
  return (
    <M className={className} variants={cascade} initial={reduit ? false : 'cache'} whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
      {children}
    </M>
  );
}
