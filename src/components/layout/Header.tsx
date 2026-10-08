import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, Heart, LockKeyhole, Luggage } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Logo } from '@/components/brand/Logo';
import { Baron } from '@/components/brand/illustrations';
import { ScallopDivider } from '@/components/brand/ScallopDivider';
import { cx } from '@/lib/format';
import { MENU_AIDE, MENU_CATALOGUE, MENU_MAISON } from './nav';
import { MobileMenu } from './MobileMenu';

type MenuId = 'catalogue' | 'maison' | 'aide';

export function Header() {
  const [scrolle, setScrolle] = useState(false);
  const [ouvert, setOuvert] = useState<MenuId | null>(null);
  const timer = useRef<number>();
  const refs = useRef<Record<MenuId, HTMLButtonElement | null>>({ catalogue: null, maison: null, aide: null });
  const navRef = useRef<HTMLElement>(null);
  const { items, saut } = useCart();
  const { favoris } = useFavorites();
  const loc = useLocation();
  const reduit = useReducedMotion();

  useEffect(() => {
    const f = () => setScrolle(window.scrollY > 80);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  useEffect(() => setOuvert(null), [loc.pathname, loc.search]);

  useEffect(() => {
    if (!ouvert) return;
    const clic = (e: MouseEvent) => { if (!navRef.current?.contains(e.target as Node)) setOuvert(null); };
    const touche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { refs.current[ouvert]?.focus(); setOuvert(null); }
    };
    document.addEventListener('mousedown', clic);
    document.addEventListener('keydown', touche);
    return () => { document.removeEventListener('mousedown', clic); document.removeEventListener('keydown', touche); };
  }, [ouvert]);

  const entrer = (id: MenuId) => { clearTimeout(timer.current); setOuvert(id); };
  const sortir = () => { clearTimeout(timer.current); timer.current = window.setTimeout(() => setOuvert(null), 200); };

  const declencheur = (id: MenuId, label: string) => (
    <button
      ref={(el) => (refs.current[id] = el)}
      type="button"
      aria-expanded={ouvert === id}
      aria-controls={`menu-${id}`}
      onClick={() => setOuvert((o) => (o === id ? null : id))}
      className={cx('flex min-h-[44px] items-center gap-1 rounded-pilule px-4 font-extrabold transition-colors', scrolle ? 'hover:bg-creme/15' : 'hover:bg-noir/5', ouvert === id && (scrolle ? 'bg-creme/15' : 'bg-noir/5'))}
    >
      {label}
      <ChevronDown size={18} strokeWidth={2.75} aria-hidden className={cx('transition-transform duration-200', ouvert === id && 'rotate-180')} />
    </button>
  );

  const panneau = (id: MenuId, children: ReactNode, large = false) => (
    <AnimatePresence>
      {ouvert === id && (
        <motion.div
          id={`menu-${id}`}
          className={cx(
            'absolute top-full z-50 border-[3px] border-noir bg-creme text-noir shadow-dure',
            large ? 'left-0 right-0 mt-3 rounded-rayon' : 'left-1/2 mt-3 w-64 -translate-x-1/2 rounded-[20px]',
          )}
          initial={reduit ? { opacity: 0 } : { opacity: 0, y: -12, scaleY: 0.96 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: 'spring', stiffness: 520, damping: 26 }}
          style={{ transformOrigin: 'top' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const listeSimple = (liens: { label: string; to: string }[]) => (
    <ul className="p-2">
      {liens.map((l) => (
        <li key={l.to}>
          <Link to={l.to} className="flex min-h-[44px] items-center justify-between rounded-xl px-4 font-semibold transition hover:bg-jaune">
            {l.label} <ArrowRight size={16} strokeWidth={2.5} aria-hidden className="opacity-50" />
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <header className={cx('sticky top-0 z-40 transition-colors duration-300', scrolle ? 'bg-bordeaux text-creme' : 'bg-creme text-noir')}>
      <div className="conteneur relative flex h-[76px] items-center justify-between gap-4 lg:h-[84px]">
        <Link to="/" className="shrink-0 rounded-xl" aria-label="Maison Babines, retour à l'accueil">
          <motion.span className="block origin-left" animate={{ scale: scrolle ? 0.8 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
            <Logo clair={scrolle} className="text-[34px] lg:text-[40px]" />
          </motion.span>
        </Link>

        <nav ref={navRef} aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li className="static" onMouseEnter={() => entrer('catalogue')} onMouseLeave={sortir}>
              {declencheur('catalogue', 'Catalogue')}
              {panneau('catalogue', (
                <div className="p-8">
                  <div className="grid grid-cols-4 gap-8">
                    {MENU_CATALOGUE.map((col) => (
                      <div key={col.titre}>
                        <p className="surtitre mb-3 text-bordeaux">{col.titre}</p>
                        <ul className="flex flex-col">
                          {col.liens.map((l) => (
                            <li key={l.to}>
                              <Link to={l.to} className="group/l inline-flex min-h-[36px] items-center gap-2 font-semibold hover:text-bordeaux">
                                <span className="h-2 w-2 scale-0 rounded-full bg-rose transition-transform group-hover/l:scale-100" aria-hidden />
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link to="/catalogue?occasion=mariage" className="group/p relative flex flex-col justify-between overflow-hidden rounded-rayon border-[3px] border-noir bg-rose p-5 shadow-dure transition hover:-translate-y-1 hover:shadow-survol">
                      <span className="surtitre">Mis en avant</span>
                      <span className="font-titre text-2xl font-black leading-tight">Pack Mariage<br /><em>Oui, je wouf</em> — 149 €</span>
                      <Baron pose="salue" className="-mb-4 -mr-6 ml-auto mt-2 w-44 transition-transform group-hover/p:-rotate-3" />
                    </Link>
                  </div>
                  <Link to="/catalogue" className="mt-6 inline-flex items-center gap-2 border-t-[3px] border-noir/10 pt-5 font-extrabold hover:text-bordeaux">
                    Voir tout le Grand Dressing <ArrowRight size={18} strokeWidth={2.5} aria-hidden />
                  </Link>
                </div>
              ), true)}
            </li>
            <li className="relative" onMouseEnter={() => entrer('maison')} onMouseLeave={sortir}>
              {declencheur('maison', 'La Maison')}
              {panneau('maison', listeSimple(MENU_MAISON))}
            </li>
            <li className="relative" onMouseEnter={() => entrer('aide')} onMouseLeave={sortir}>
              {declencheur('aide', 'Aide')}
              {panneau('aide', listeSimple(MENU_AIDE))}
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink to="/catalogue" className={cx('hidden min-h-[48px] items-center rounded-pilule border-[3px] border-noir bg-rose px-5 font-extrabold text-noir shadow-petite transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none lg:inline-flex')}>
            Réserver une tenue
          </NavLink>
          <Link to="/admin" className={cx('relative hidden h-12 items-center gap-2 rounded-pilule border-[3px] px-4 text-sm font-extrabold transition hover:-translate-y-0.5 md:inline-flex', scrolle ? 'border-creme' : 'border-noir')} aria-label="Espace pro : CRM de l'équipe">
            <LockKeyhole size={18} strokeWidth={2.5} aria-hidden /> <span className="hidden xl:inline">Espace pro</span>
          </Link>
          <Link to="/catalogue?favoris=1" className={cx('relative hidden h-12 w-12 place-items-center rounded-full border-[3px] sm:grid', scrolle ? 'border-creme' : 'border-noir')} aria-label={`Mes favoris (${favoris.length})`}>
            <Heart size={20} strokeWidth={2.5} aria-hidden />
            {favoris.length > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-6 min-w-[24px] place-items-center rounded-full border-2 border-noir bg-jaune px-1 text-xs font-extrabold text-noir">{favoris.length}</span>}
          </Link>
          <Link to="/malle" className={cx('relative grid h-12 w-12 place-items-center rounded-full border-[3px]', scrolle ? 'border-creme' : 'border-noir')} aria-label={`Ma malle (${items.length} article${items.length > 1 ? 's' : ''})`}>
            <span key={saut} className={saut ? 'saute' : undefined}><Luggage size={22} strokeWidth={2.5} aria-hidden /></span>
            <AnimatePresence>
              {items.length > 0 && (
                <motion.span key={items.length} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 15 }} className="absolute -right-1.5 -top-1.5 grid h-6 min-w-[24px] place-items-center rounded-full border-2 border-noir bg-rose px-1 text-xs font-extrabold text-noir">
                  {items.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <MobileMenu clair={scrolle} />
        </div>
      </div>
      <div className="absolute inset-x-0 top-full">
        <ScallopDivider couleur={scrolle ? 'var(--bordeaux)' : 'var(--creme)'} />
      </div>
    </header>
  );
}
