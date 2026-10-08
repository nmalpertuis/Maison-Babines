import { useId } from 'react';
import { BaronHead } from './illustrations';

/** Emblème : cartouche bordeaux, filet doré, tête du Baron, texte en cercle. */
export function LogoMark({ className, avecTexte = true }: { className?: string; avecTexte?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <path id={`cercle-${id}`} d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="#6B1E3F" stroke="#1E1430" strokeWidth="6" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#C9A227" strokeWidth="2" />
      {avecTexte && (
        <text fill="#FFF6EA" fontSize="15" fontWeight="800" letterSpacing="2.4" fontFamily="'Bricolage Grotesque', system-ui, sans-serif">
          <textPath href={`#cercle-${id}`}>MAISON BABINES · GRAND HÔTEL · DEPUIS TOUJOURS ·</textPath>
        </text>
      )}
      <circle cx="100" cy="100" r={avecTexte ? 58 : 80} fill="#FFF6EA" stroke="#C9A227" strokeWidth="3" />
      <svg x={avecTexte ? 50 : 30} y={avecTexte ? 52 : 34} width={avecTexte ? 100 : 140} height={avecTexte ? 96 : 134} viewBox="0 0 120 110">
        <BaronHead />
      </svg>
    </svg>
  );
}
