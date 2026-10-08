import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ScallopDivider } from '@/components/brand/ScallopDivider';
import { Breadcrumb, type Miette } from './Breadcrumb';
import { cx } from '@/lib/format';

/** En-tête des pages intérieures : couleur pop, sur-titre "pièce de l'hôtel", H1, illustration, festons. */
export function PageHeader({
  surtitre, titre, sousTitre, illustration, fond, couleurFeston, clair, miettes, children,
}: {
  surtitre: string; titre: ReactNode; sousTitre?: ReactNode; illustration?: ReactNode; fond: string; couleurFeston: string;
  clair?: boolean; miettes?: Miette[]; children?: ReactNode;
}) {
  const reduit = useReducedMotion();
  return (
    <header className={cx('relative', fond, clair ? 'text-creme' : 'text-noir')}>
      <div className="conteneur grid items-center gap-8 pb-12 pt-8 lg:grid-cols-[1.25fr_1fr] lg:pb-16 lg:pt-10">
        <div>
          {miettes && <Breadcrumb miettes={miettes} clair={clair} />}
          <motion.p
            className={cx('surtitre mb-3 mt-6 inline-block rounded-pilule border-[3px] px-3 py-1', clair ? 'border-creme' : 'border-noir bg-creme')}
            initial={reduit ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          >
            {surtitre}
          </motion.p>
          <motion.h1
            className="max-w-[14ch] text-[44px] sm:text-[52px] lg:text-[80px]"
            initial={reduit ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {titre}
          </motion.h1>
          {sousTitre && (
            <motion.p
              className="mt-5 max-w-xl text-lg lg:text-xl"
              initial={reduit ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}
            >
              {sousTitre}
            </motion.p>
          )}
          {children}
        </div>
        {illustration && (
          <motion.div
            className="mx-auto w-full max-w-[300px] lg:max-w-[380px]"
            initial={reduit ? false : { opacity: 0, scale: 0.85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 0.15 }}
          >
            {illustration}
          </motion.div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 translate-y-full">
        <ScallopDivider couleur={couleurFeston} />
      </div>
    </header>
  );
}
