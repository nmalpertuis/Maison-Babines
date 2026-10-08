import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cx } from '@/lib/format';

export interface AccordionItem { id: string; titre: ReactNode; contenu: ReactNode }

/** Accordéon accessible. `unique` : une seule section ouverte à la fois. */
export function Accordion({ items, unique = true, ouvertParDefaut = [], className, fond = 'bg-creme' }: { items: AccordionItem[]; unique?: boolean; ouvertParDefaut?: string[]; className?: string; fond?: string }) {
  const [ouverts, setOuverts] = useState<string[]>(ouvertParDefaut);
  const base = useId();
  const basculer = (id: string) =>
    setOuverts((o) => (o.includes(id) ? o.filter((x) => x !== id) : unique ? [id] : [...o, id]));

  return (
    <div className={cx('flex flex-col gap-3', className)}>
      {items.map((it) => {
        const ouvert = ouverts.includes(it.id);
        const idB = `${base}-b-${it.id}`, idP = `${base}-p-${it.id}`;
        return (
          <div key={it.id} className={cx('overflow-hidden rounded-[20px] border-[3px] border-noir transition-shadow', fond, ouvert && 'shadow-dure')}>
            <h3 className="m-0 font-texte text-base font-extrabold lg:text-lg">
              <button
                id={idB} type="button" aria-expanded={ouvert} aria-controls={idP} onClick={() => basculer(it.id)}
                className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-3 text-left"
              >
                <span>{it.titre}</span>
                <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-noir transition-[transform,background-color] duration-300', ouvert ? 'rotate-45 bg-rose' : 'bg-jaune')}>
                  <Plus size={18} strokeWidth={3} aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {ouvert && (
                <motion.div
                  id={idP} role="region" aria-labelledby={idB}
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-5 pb-5 leading-relaxed">{it.contenu}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
