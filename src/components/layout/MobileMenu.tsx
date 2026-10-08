import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Baron } from '@/components/brand/illustrations';
import { cx } from '@/lib/format';
import { MENU_AIDE, MENU_CATALOGUE, MENU_MAISON } from './nav';

/** Menu mobile plein écran rose, sous-menus en accordéon, défilement de la page bloqué. */
export function MobileMenu({ clair }: { clair: boolean }) {
  const [ouvert, setOuvert] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const loc = useLocation();
  const bouton = useRef<HTMLButtonElement>(null);
  const reduit = useReducedMotion();

  useEffect(() => setOuvert(false), [loc.pathname, loc.search]);
  useEffect(() => {
    if (!ouvert) return;
    const o = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOuvert(false); bouton.current?.focus(); } };
    document.addEventListener('keydown', k);
    return () => { document.body.style.overflow = o; document.removeEventListener('keydown', k); };
  }, [ouvert]);

  const sections = [
    { id: 'catalogue', label: 'Catalogue', liens: [...MENU_CATALOGUE.flatMap((c) => c.liens.slice(0, c.titre === 'Par occasion' ? 6 : 0)), { label: 'Voir tout le Grand Dressing →', to: '/catalogue' }] },
    { id: 'maison', label: 'La Maison', liens: MENU_MAISON },
    { id: 'aide', label: 'Aide', liens: MENU_AIDE },
  ];

  const ligne = (on: boolean, cls: string) => (
    <span className={cx('absolute left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-current transition-all duration-300', cls, on && 'top-1/2 -translate-y-1/2')} />
  );

  return (
    <>
      <button
        ref={bouton} type="button" onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert} aria-controls="menu-mobile" aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
        className={cx('relative z-[70] h-12 w-12 rounded-full border-[3px] lg:hidden', ouvert ? 'border-noir bg-creme text-noir' : clair ? 'border-creme' : 'border-noir')}
      >
        {ligne(ouvert, ouvert ? 'rotate-45' : 'top-[14px]')}
        <span className={cx('absolute left-1/2 top-1/2 h-[3px] w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition-opacity', ouvert && 'opacity-0')} />
        {ligne(ouvert, ouvert ? '-rotate-45' : 'bottom-[14px]')}
      </button>
      {createPortal(
        <AnimatePresence>
          {ouvert && (
            <motion.div
              id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu"
              className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-rose text-noir lg:hidden"
              initial={reduit ? { opacity: 0 } : { clipPath: 'circle(0% at calc(100% - 44px) 58px)' }}
              animate={reduit ? { opacity: 1 } : { clipPath: 'circle(150% at calc(100% - 44px) 58px)' }}
              exit={reduit ? { opacity: 0 } : { clipPath: 'circle(0% at calc(100% - 44px) 58px)' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="conteneur flex h-[76px] shrink-0 items-center justify-between">
                <Link to="/" aria-label="Maison Babines, retour à l'accueil"><Logo className="text-[34px]" /></Link>
                <button type="button" onClick={() => { setOuvert(false); bouton.current?.focus(); }} aria-label="Fermer le menu" className="grid h-12 w-12 place-items-center rounded-full border-[3px] border-noir bg-creme">
                  <X size={22} strokeWidth={2.75} />
                </button>
              </div>
              <nav aria-label="Navigation mobile" className="conteneur flex-1 pb-36 pt-6">
                <ul className="flex flex-col gap-2">
                  {sections.map((s, i) => (
                    <motion.li key={s.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.07 }} className="border-b-[3px] border-noir/20">
                      <button type="button" aria-expanded={section === s.id} aria-controls={`mm-${s.id}`} onClick={() => setSection((x) => (x === s.id ? null : s.id))} className="flex w-full items-center justify-between py-3 font-titre text-[40px] font-black leading-tight">
                        {s.label}
                        <ChevronDown size={30} strokeWidth={3} aria-hidden className={cx('transition-transform', section === s.id && 'rotate-180')} />
                      </button>
                      <AnimatePresence initial={false}>
                        {section === s.id && (
                          <motion.ul id={`mm-${s.id}`} initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                            {s.liens.map((l) => (
                              <li key={l.to}><Link to={l.to} className="flex min-h-[44px] items-center text-lg font-semibold">{l.label}</Link></li>
                            ))}
                            <li className="h-3" />
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ))}
                  <motion.li initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.36 }}>
                    <Link to="/malle" className="flex py-3 font-titre text-[40px] font-black">Ma malle</Link>
                  </motion.li>
                </ul>
                <Baron pose="salue" className="mx-auto mt-6 w-64" />
              </nav>
              <div className="fixed inset-x-0 bottom-0 border-t-[3px] border-noir bg-rose p-4">
                <Link to="/catalogue" className="flex min-h-[56px] items-center justify-center rounded-pilule border-[3px] border-noir bg-jaune text-lg font-extrabold shadow-dure">Réserver une tenue</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
