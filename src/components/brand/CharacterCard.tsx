import { useState } from 'react';
import type { CharacterId } from '@/data/characters';
import { Baron, Meringue, Moustache, Praline, Tonnerre } from './illustrations';

const ILLU: Record<CharacterId, (p: { className?: string }) => JSX.Element> = {
  baron: (p) => <Baron pose="salue" {...p} />,
  praline: (p) => <Praline {...p} />,
  tonnerre: (p) => <Tonnerre {...p} />,
  meringue: (p) => <Meringue {...p} />,
  moustache: (p) => <Moustache {...p} />,
};

/** Personnage qui se retourne au survol (ou au clic / clavier). */
export function CharacterCard({ id, nom, role, citation, couleur }: { id: CharacterId; nom: string; role: string; citation: string; couleur: string }) {
  const [retourne, setRetourne] = useState(false);
  const Illu = ILLU[id];
  return (
    <button
      type="button"
      className="group h-[380px] w-full [perspective:1200px] text-left"
      onClick={() => setRetourne((r) => !r)}
      onMouseEnter={() => setRetourne(true)}
      onMouseLeave={() => setRetourne(false)}
      aria-pressed={retourne}
      aria-label={`${nom} : ${retourne ? 'masquer' : 'afficher'} son rôle et sa citation`}
    >
      <span
        className="relative block h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: retourne ? 'rotateY(180deg)' : 'none', transitionTimingFunction: 'cubic-bezier(.34,1.56,.64,1)' }}
      >
        <span className="absolute inset-0 flex flex-col items-center justify-between rounded-rayon border-[3px] border-noir p-5 shadow-dure [backface-visibility:hidden]" style={{ background: couleur }}>
          <Illu className="h-[250px] w-full" />
          <span className="font-titre text-2xl font-black text-center leading-tight">{nom}</span>
        </span>
        <span className="absolute inset-0 flex flex-col justify-center gap-4 rounded-rayon border-[3px] border-noir bg-bordeaux p-6 text-creme shadow-dure [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="surtitre text-jaune">{role}</span>
          <span className="font-titre text-2xl italic leading-snug">« {citation} »</span>
          <span className="font-semibold">— {nom}</span>
        </span>
      </span>
    </button>
  );
}
