import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cx } from '@/lib/format';

/** Pastille inclinée en Shrikhand qui "tamponne" à son apparition (échelle 1,3 → 1). */
export function Sticker({
  children, couleur = 'bg-jaune', angle = -4, className, tampon = true, as = 'span',
}: { children: ReactNode; couleur?: string; angle?: number; className?: string; tampon?: boolean; as?: 'span' | 'p' }) {
  const reduit = useReducedMotion();
  const M = as === 'p' ? motion.p : motion.span;
  return (
    <M
      className={cx('inline-block rounded-pilule border-[3px] border-noir px-4 py-1.5 font-accent text-noir shadow-petite leading-tight', couleur, className)}
      initial={tampon && !reduit ? { scale: 1.3, opacity: 0, rotate: angle } : { rotate: angle }}
      whileInView={{ scale: 1, opacity: 1, rotate: angle }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
    >
      {children}
    </M>
  );
}
