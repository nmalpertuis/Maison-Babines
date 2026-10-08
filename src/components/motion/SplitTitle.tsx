import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType } from 'react';
import { cx } from '@/lib/format';

/** Titre révélé mot par mot : chaque mot remonte depuis un masque, en cascade, à l'entrée dans l'écran. */
export function SplitTitle({ texte, as = 'h2', className, id, delai = 0 }: { texte: string; as?: ElementType; className?: string; id?: string; delai?: number }) {
  const reduit = useReducedMotion();
  const Tag = as;
  const mots = texte.split(' ');
  return (
    <Tag id={id} className={className} aria-label={texte}>
      <motion.span
        aria-hidden
        className="inline"
        initial={reduit ? false : 'cache'}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ staggerChildren: 0.06, delayChildren: delai }}
      >
        {mots.map((m, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={cx('inline-block')}
              variants={{ cache: { y: '110%', rotate: 4 }, visible: { y: '0%', rotate: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
            >
              {m}
            </motion.span>
            {i < mots.length - 1 && ' '}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
