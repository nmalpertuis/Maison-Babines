import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cx } from '@/lib/format';

const FOCUSABLES = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Fenêtre modale : focus piégé, fermeture Échap et clic extérieur, focus rendu au déclencheur. */
export function Modal({
  ouvert, fermer, titre, children, className, large, depuisBas,
}: { ouvert: boolean; fermer: () => void; titre: string; children: ReactNode; className?: string; large?: boolean; depuisBas?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();

  useEffect(() => {
    if (!ouvert) return;
    const precedent = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => ref.current?.querySelector<HTMLElement>(FOCUSABLES)?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); fermer(); }
      if (e.key === 'Tab' && ref.current) {
        const els = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLES)).filter((el) => el.offsetParent !== null);
        if (!els.length) return;
        const [premier, dernier] = [els[0], els[els.length - 1]];
        if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
        else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      precedent?.focus?.();
    };
  }, [ouvert, fermer]);

  return createPortal(
    <AnimatePresence>
      {ouvert && (
        <motion.div
          className={cx('fixed inset-0 z-[100] flex justify-center bg-noir/60 backdrop-blur-[2px]', depuisBas ? 'items-end sm:items-center' : 'items-center p-4')}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && fermer()}
        >
          <motion.div
            ref={ref}
            role="dialog" aria-modal="true" aria-label={titre}
            className={cx(
              'relative max-h-[92vh] w-full overflow-y-auto border-[3px] border-noir bg-creme shadow-dure',
              depuisBas ? 'rounded-t-rayon sm:rounded-rayon sm:m-4' : 'rounded-rayon',
              large ? 'max-w-4xl' : 'max-w-xl', className,
            )}
            initial={reduit ? { opacity: 0 } : depuisBas ? { y: '100%' } : { opacity: 0, y: 30, scale: 0.96 }}
            animate={reduit ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduit ? { opacity: 0 } : depuisBas ? { y: '100%' } : { opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <button
              type="button" onClick={fermer}
              className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full border-[3px] border-noir bg-creme transition-transform hover:rotate-90"
              aria-label="Fermer"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
