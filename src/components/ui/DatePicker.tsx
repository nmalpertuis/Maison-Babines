import { useMemo, useState, type KeyboardEvent } from 'react';
import {
  addDays, addMonths, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameDay, isSameMonth,
  isWithinInterval, startOfDay, startOfMonth, startOfWeek, subMonths,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cx, isoJour } from '@/lib/format';

interface Props {
  valeur: Date | null;
  onChange: (d: Date) => void;
  /** Jours minimum avant l'événement (3 standard, 1 express). */
  delaiMin?: number;
  indisponibles?: Set<string>;
  /** Plage livraison → retour à surligner. */
  plage?: { debut: Date; fin: Date } | null;
  label?: string;
}

/** Calendrier de réservation en grille ARIA, navigable au clavier. */
export function DatePicker({ valeur, onChange, delaiMin = 3, indisponibles, plage, label = 'Date de l\'événement' }: Props) {
  const aujourdhui = startOfDay(new Date());
  const min = addDays(aujourdhui, delaiMin);
  const max = addMonths(aujourdhui, 6);
  const [mois, setMois] = useState(() => startOfMonth(valeur ?? min));
  const [focus, setFocus] = useState<Date>(valeur ?? min);

  const jours = useMemo(() => {
    const debut = startOfWeek(startOfMonth(mois), { weekStartsOn: 1 });
    const fin = endOfWeek(endOfMonth(mois), { weekStartsOn: 1 });
    const l: Date[] = [];
    for (let d = debut; d <= fin; d = addDays(d, 1)) l.push(d);
    return l;
  }, [mois]);

  const desactive = (d: Date) => isBefore(d, min) || isAfter(d, max) || !!indisponibles?.has(isoJour(d));

  const deplacer = (d: Date) => {
    setFocus(d);
    if (!isSameMonth(d, mois)) setMois(startOfMonth(d));
    requestAnimationFrame(() => document.getElementById(`dp-${isoJour(d)}`)?.focus());
  };

  const onKey = (e: KeyboardEvent, d: Date) => {
    const pas: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in pas) { e.preventDefault(); deplacer(addDays(d, pas[e.key])); }
    if (e.key === 'PageUp') { e.preventDefault(); deplacer(subMonths(d, 1)); }
    if (e.key === 'PageDown') { e.preventDefault(); deplacer(addMonths(d, 1)); }
    if ((e.key === 'Enter' || e.key === ' ') && !desactive(d)) { e.preventDefault(); onChange(d); }
  };

  const peutReculer = isAfter(mois, startOfMonth(aujourdhui));
  const peutAvancer = isBefore(mois, startOfMonth(max));

  return (
    <div className="rounded-[20px] border-[3px] border-noir bg-white p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => setMois(subMonths(mois, 1))} disabled={!peutReculer} aria-label="Mois précédent" className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-noir bg-creme disabled:opacity-30">
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        <p className="font-titre text-lg font-black capitalize" aria-live="polite">{format(mois, 'MMMM yyyy', { locale: fr })}</p>
        <button type="button" onClick={() => setMois(addMonths(mois, 1))} disabled={!peutAvancer} aria-label="Mois suivant" className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-noir bg-creme disabled:opacity-30">
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
      <table role="grid" aria-label={label} className="w-full border-collapse text-center">
        <thead>
          <tr>
            {['lu', 'ma', 'me', 'je', 've', 'sa', 'di'].map((j) => (
              <th key={j} scope="col" className="pb-1 text-xs font-extrabold uppercase text-noir/60">{j}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: jours.length / 7 }, (_, s) => (
            <tr key={s}>
              {jours.slice(s * 7, s * 7 + 7).map((d) => {
                const hors = !isSameMonth(d, mois);
                const off = desactive(d);
                const choisi = valeur && isSameDay(d, valeur);
                const dansPlage = plage && isWithinInterval(d, { start: plage.debut, end: plage.fin });
                const indispo = indisponibles?.has(isoJour(d));
                return (
                  <td key={d.toISOString()} className="p-0.5">
                    {hors ? <span className="block h-10" /> : (
                      <button
                        id={`dp-${isoJour(d)}`} type="button"
                        tabIndex={isSameDay(d, focus) ? 0 : -1}
                        aria-selected={!!choisi}
                        aria-disabled={off}
                        aria-label={`${format(d, 'EEEE d MMMM yyyy', { locale: fr })}${indispo ? ', déjà réservée' : off ? ', indisponible' : ''}`}
                        onClick={() => !off && onChange(d)}
                        onKeyDown={(e) => onKey(e, d)}
                        className={cx(
                          'relative mx-auto grid h-10 w-full max-w-[44px] place-items-center rounded-xl text-sm font-bold transition',
                          off ? 'cursor-not-allowed text-noir/30' : 'hover:bg-jaune',
                          indispo && 'line-through',
                          dansPlage && !choisi && 'bg-bleu/30',
                          choisi && 'border-[3px] border-noir bg-rose text-noir',
                          isSameDay(d, aujourdhui) && !choisi && 'underline decoration-2 underline-offset-2',
                        )}
                      >
                        {format(d, 'd')}
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-noir/70">
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded border-2 border-noir bg-rose" /> Événement</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-bleu/40" /> Livraison → retour</span>
        <span className="inline-flex items-center gap-1.5"><span className="line-through">13</span> Déjà réservée</span>
      </p>
    </div>
  );
}
