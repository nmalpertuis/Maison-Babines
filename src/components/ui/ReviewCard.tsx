import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BadgeCheck, ThumbsUp } from 'lucide-react';
import type { CouleurPop, Review } from '@/data/types';
import { getProductById } from '@/data/products';
import { OCCASIONS, occasionCourt } from '@/data/occasions';
import { FOND } from '@/lib/couleurs';
import { cx, depuisIso } from '@/lib/format';
import { BaronHead, SilhouetteChien } from '@/components/brand/illustrations';
import { RatingStars } from './RatingStars';

export function AvatarChien({ couleur, taille = 56 }: { couleur?: string; taille?: number }) {
  const c = (couleur as CouleurPop) ?? 'jaune';
  return (
    <span className="grid shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-noir" style={{ width: taille, height: taille, background: FOND[c] ?? FOND.jaune }} aria-hidden>
      <SilhouetteChien className={cx('h-[70%] w-[70%]', c === 'bordeaux' ? 'text-creme' : 'text-noir')} />
    </span>
  );
}

export function ReviewCard({ avis, fond = 'bg-creme', compact }: { avis: Review; fond?: string; compact?: boolean }) {
  const [utile, setUtile] = useState(avis.utile);
  const [vote, setVote] = useState(false);
  const p = avis.productId ? getProductById(avis.productId) : undefined;
  const occ = OCCASIONS.find((o) => o.id === avis.occasion)!;
  return (
    <article className={cx('flex h-full flex-col gap-3 rounded-rayon border-[3px] border-noir p-5 shadow-dure', fond)}>
      <header className="flex items-center gap-3">
        <AvatarChien couleur={avis.photo ?? occ.couleur} />
        <div className="min-w-0">
          <p className="font-extrabold leading-tight">{avis.client}, {avis.ville}</p>
          <p className="text-sm text-noir/75">{avis.chien}{avis.race && `, ${avis.race}`}</p>
        </div>
      </header>
      <div className="flex flex-wrap items-center gap-2">
        <RatingStars note={avis.note} taille={16} />
        <span className="rounded-full border-2 border-noir px-2 py-0.5 text-xs font-extrabold" style={{ background: FOND[occ.couleur] }}>{occasionCourt(avis.occasion)}</span>
        {!compact && <time dateTime={avis.date} className="text-xs text-noir/60">{format(depuisIso(avis.date), 'd MMM yyyy', { locale: fr })}</time>}
      </div>
      <blockquote className="font-titre text-lg leading-snug lg:text-xl">« {avis.texte} »</blockquote>
      <p className="mt-auto text-sm text-noir/75">
        {p ? <Link to={`/produit/${p.slug}`} className="font-bold underline underline-offset-2 hover:text-bordeaux">{p.nom}</Link> : <span className="font-bold">{avis.tenueLibre}</span>}
        {avis.taille && <>, taille {avis.taille}</>}
      </p>
      {avis.reponseMarque && (
        <div className="flex gap-3 rounded-2xl border-[3px] border-noir bg-bordeaux p-4 text-creme">
          <BaronHead className="h-12 w-12 shrink-0" />
          <p className="text-sm"><strong className="block text-jaune">Réponse du Baron</strong>{avis.reponseMarque}</p>
        </div>
      )}
      {!compact && (
        <footer className="flex items-center justify-between gap-2 border-t-2 border-noir/10 pt-3">
          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-noir/80"><BadgeCheck size={16} strokeWidth={2.5} className="text-vert" aria-hidden /> Avis vérifié</span>
          <button type="button" aria-pressed={vote} onClick={() => { setUtile((u) => u + (vote ? -1 : 1)); setVote((v) => !v); }} className={cx('inline-flex min-h-[40px] items-center gap-1.5 rounded-pilule border-2 border-noir px-3 text-xs font-extrabold transition', vote ? 'bg-jaune' : 'bg-transparent hover:bg-jaune/40')}>
            <ThumbsUp size={14} strokeWidth={2.5} aria-hidden /> Utile ({utile})
          </button>
        </footer>
      )}
    </article>
  );
}
