import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { cx } from '@/lib/format';

export function Marquee({
  items, vitesse = 35, className, fond = 'bg-noir', texte = 'text-jaune',
}: { items: string[]; vitesse?: number; className?: string; fond?: string; texte?: string }) {
  const [pause, setPause] = useState(false);
  const ligne = (cache: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={cache || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-5 font-accent text-2xl lg:text-3xl">
          {t}
          <span className="ml-10 text-xl" aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cx('marquee relative overflow-hidden border-y-[3px] border-noir py-4', fond, texte, className)} data-pause={pause}>
      <p className="sr-only">{items.join(' · ')}</p>
      <div className="marquee-piste" style={{ ['--duree' as string]: `${vitesse}s` }} aria-hidden="true">
        {ligne(true)}
        {ligne(true)}
      </div>
      <button
        type="button"
        onClick={() => setPause((p) => !p)}
        className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-[3px] border-noir bg-creme text-noir"
        aria-label={pause ? 'Relancer le bandeau défilant' : 'Mettre en pause le bandeau défilant'}
      >
        {pause ? <Play size={18} strokeWidth={2.5} /> : <Pause size={18} strokeWidth={2.5} />}
      </button>
    </div>
  );
}
