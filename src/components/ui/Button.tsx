import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cx } from '@/lib/format';

export type Variante = 'primaire' | 'secondaire' | 'sombre' | 'jaune' | 'lien';

const STYLES: Record<Variante, string> = {
  primaire: 'bg-rose text-noir',
  secondaire: 'bg-creme text-noir',
  sombre: 'bg-bordeaux text-creme',
  jaune: 'bg-jaune text-noir',
  lien: '',
};

export const classesBouton = (v: Variante = 'primaire', taille: 'md' | 'lg' | 'sm' = 'md', pleine = false) =>
  v === 'lien'
    ? 'lien inline-flex items-center gap-2 min-h-[44px]'
    : cx(
        'inline-flex items-center justify-center gap-2 rounded-pilule border-[3px] border-noir font-extrabold shadow-dure',
        'transition-[transform,box-shadow] duration-200 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)]',
        'hover:-translate-y-0.5 hover:shadow-survol active:translate-x-1 active:translate-y-1 active:shadow-none',
        'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-jaune focus-visible:ring-offset-2 focus-visible:ring-offset-noir',
        taille === 'lg' ? 'min-h-[56px] px-8 text-lg' : taille === 'sm' ? 'min-h-[44px] px-4 text-sm' : 'min-h-[48px] px-6',
        pleine && 'w-full',
        STYLES[v],
      );

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante; taille?: 'md' | 'lg' | 'sm'; pleine?: boolean; chargement?: boolean; icone?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variante = 'primaire', taille = 'md', pleine, chargement, icone, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx(classesBouton(variante, taille, pleine), className)} disabled={disabled || chargement} aria-busy={chargement || undefined} {...rest}>
      {chargement ? <Loader2 className="animate-spin" size={20} strokeWidth={2.5} aria-hidden /> : icone}
      {children}
    </button>
  );
});

export function ButtonLink({ variante = 'primaire', taille = 'md', pleine, className, icone, children, ...rest }: LinkProps & { variante?: Variante; taille?: 'md' | 'lg' | 'sm'; pleine?: boolean; icone?: ReactNode }) {
  return (
    <Link className={cx(classesBouton(variante, taille, pleine), className)} {...rest}>
      {icone}
      {children}
    </Link>
  );
}
