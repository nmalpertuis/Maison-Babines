import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cx } from '@/lib/format';

/** Carrousel à défilement natif (glisser au doigt / trackpad), flèches et points. */
export function Carousel({ children, label, className, largeur = 'w-[82%] sm:w-[46%] lg:w-[31.5%]', fleches = true }: { children: ReactNode; label: string; className?: string; largeur?: string; fleches?: boolean }) {
  const piste = useRef<HTMLUListElement>(null);
  const items = Children.toArray(children);
  const [actif, setActif] = useState(0);
  const [bords, setBords] = useState({ debut: true, fin: false });

  const maj = useCallback(() => {
    const el = piste.current;
    if (!el) return;
    const enfants = Array.from(el.children) as HTMLElement[];
    const g = el.scrollLeft;
    let i = 0;
    enfants.forEach((c, k) => { if (c.offsetLeft - el.offsetLeft <= g + 10) i = k; });
    setActif(i);
    setBords({ debut: g <= 4, fin: g + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    maj();
    const el = piste.current;
    el?.addEventListener('scroll', maj, { passive: true });
    window.addEventListener('resize', maj);
    return () => { el?.removeEventListener('scroll', maj); window.removeEventListener('resize', maj); };
  }, [maj]);

  const aller = (i: number) => {
    const el = piste.current;
    const c = el?.children[Math.max(0, Math.min(items.length - 1, i))] as HTMLElement | undefined;
    if (el && c) el.scrollTo({ left: c.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  return (
    <div className={cx('relative', className)} role="region" aria-roledescription="carrousel" aria-label={label}>
      <ul ref={piste} className="scroll-x -mx-6 flex snap-x snap-mandatory gap-6 px-6 pb-6 pt-2 lg:-mx-3 lg:px-3">
        {items.map((c, i) => (
          <li key={i} className={cx('shrink-0 snap-start', largeur)} aria-roledescription="diapositive" aria-label={`${i + 1} sur ${items.length}`}>
            {c}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {items.map((_, i) => (
            <button
              key={i} type="button" onClick={() => aller(i)}
              className="grid h-11 w-6 place-items-center"
              aria-label={`Aller à la diapositive ${i + 1}`} aria-current={i === actif || undefined}
            >
              <span className={cx('block h-3 rounded-full border-2 border-noir transition-all duration-300', i === actif ? 'w-6 bg-noir' : 'w-3 bg-creme')} />
            </button>
          ))}
        </div>
        {fleches && (
          <div className="flex gap-3">
            <button type="button" onClick={() => aller(actif - 1)} disabled={bords.debut} aria-label="Précédent" className="grid h-12 w-12 place-items-center rounded-full border-[3px] border-noir bg-creme shadow-petite transition hover:-translate-y-0.5 disabled:opacity-40">
              <ArrowLeft strokeWidth={2.5} size={20} />
            </button>
            <button type="button" onClick={() => aller(actif + 1)} disabled={bords.fin} aria-label="Suivant" className="grid h-12 w-12 place-items-center rounded-full border-[3px] border-noir bg-creme shadow-petite transition hover:-translate-y-0.5 disabled:opacity-40">
              <ArrowRight strokeWidth={2.5} size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
