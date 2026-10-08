import { cx } from '@/lib/format';

/** Pastilles de taille ; les tailles indisponibles sont barrées avec infobulle. */
export function SizePicker({
  tailles, indisponibles = [], valeur, onChange, label = 'Taille', compact,
}: { tailles: readonly string[]; indisponibles?: string[]; valeur: string | null; onChange: (t: string) => void; label?: string; compact?: boolean }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {tailles.map((t) => {
        const off = indisponibles.includes(t);
        const actif = valeur === t;
        return (
          <span key={t} className="group relative">
            <button
              type="button" role="radio" aria-checked={actif} aria-disabled={off}
              aria-label={off ? `${t}, déjà réservée pour un autre grand soir` : t}
              onClick={() => !off && onChange(t)}
              className={cx(
                'grid place-items-center rounded-full border-[3px] border-noir font-extrabold transition-[transform,background-color] duration-200',
                compact ? 'h-11 min-w-[44px] px-2 text-sm' : 'h-12 min-w-[52px] px-3',
                off ? 'cursor-not-allowed bg-noir/5 text-noir/40 line-through decoration-2' : 'hover:-translate-y-0.5',
                actif ? 'bg-rose shadow-petite' : !off && 'bg-white',
              )}
            >
              {t}
            </button>
            {off && (
              <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[200px] -translate-x-1/2 rounded-xl border-2 border-noir bg-noir px-3 py-1.5 text-xs font-semibold text-creme opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                Déjà réservée pour un autre grand soir.
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
