import { cx } from '@/lib/format';
import { LogoMark } from './LogoMark';

/** Nœud papillon rose qui remplace le point du "i". */
function Noeud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 22" aria-hidden="true" className={className}>
      <path d="M20 11 L4 2 L4 20Z" fill="#FF4F9A" stroke="#1E1430" strokeWidth="3" strokeLinejoin="round" />
      <path d="M20 11 L36 2 L36 20Z" fill="#FF4F9A" stroke="#1E1430" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="20" cy="11" r="4.5" fill="#FF4F9A" stroke="#1E1430" strokeWidth="3" />
    </svg>
  );
}

interface Props {
  className?: string;
  /** clair = texte crème sur fond bordeaux */
  clair?: boolean;
  avecEmbleme?: boolean;
  baseline?: boolean;
  empile?: boolean;
}

/** Logo horizontal (emblème + wordmark) ou wordmark seul. */
export function Logo({ className, clair, avecEmbleme = true, baseline = false, empile = false }: Props) {
  return (
    <span className={cx('inline-flex items-center gap-3 select-none', empile && 'flex-col', className)}>
      {avecEmbleme && <LogoMark className={empile ? 'h-24 w-24' : 'h-[1.9em] w-[1.9em] shrink-0'} />}
      <span className={cx('flex flex-col leading-none', empile && 'items-center', clair ? 'text-creme' : 'text-noir')}>
        <span className="font-texte text-[0.32em] font-extrabold tracking-[0.5em] pl-[0.5em] text-center">MAISON</span>
        <span className="font-titre italic font-black text-[1em] tracking-[-0.01em] -mt-[0.04em]">
          Bab
          <span className="relative inline-block">
            ı
            <Noeud className="absolute left-1/2 -translate-x-1/2 top-[0.02em] w-[0.5em]" />
          </span>
          nes
        </span>
        {baseline && (
          <span className="font-texte text-[0.22em] font-extrabold tracking-[0.18em] mt-[0.2em] text-center uppercase">
            Haute couture canine en location
          </span>
        )}
      </span>
    </span>
  );
}
