import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cx } from '@/lib/format';

const ETAPES = ['Malle', 'Coordonnées', 'Confirmation'];

export function Stepper({ etape, className }: { etape: number; className?: string }) {
  return (
    <nav aria-label="Étapes de la réservation" className={className}>
      <ol className="flex items-center gap-2 sm:gap-4">
        {ETAPES.map((e, i) => {
          const fait = i < etape, actif = i === etape;
          return (
            <li key={e} className="flex flex-1 items-center gap-2 sm:gap-4 last:flex-none" aria-current={actif ? 'step' : undefined}>
              <span className="flex items-center gap-2">
                <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-full border-[3px] border-noir font-extrabold transition-colors', fait ? 'bg-vert' : actif ? 'bg-rose' : 'bg-creme')}>
                  {fait ? <Check size={18} strokeWidth={3} aria-hidden /> : i + 1}
                </span>
                <span className={cx('hidden text-sm font-extrabold sm:inline', !actif && !fait && 'text-noir/50')}>{e}</span>
                <span className="sr-only">{fait ? ' (terminée)' : actif ? ' (en cours)' : ''}</span>
              </span>
              {i < ETAPES.length - 1 && (
                <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-noir/15">
                  <motion.span className="absolute inset-y-0 left-0 bg-noir" initial={false} animate={{ width: fait ? '100%' : '0%' }} transition={{ duration: 0.6 }} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
