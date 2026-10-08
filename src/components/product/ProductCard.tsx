import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';
import type { Product } from '@/data/types';
import { gammeLabel } from '@/data/products';
import { useFavorites } from '@/context/FavoritesContext';
import { euros, cx } from '@/lib/format';
import { ProductImage } from '@/components/ui/ProductImage';
import { RatingStars } from '@/components/ui/RatingStars';
import { QuickView } from './QuickView';

export const BADGES: Record<NonNullable<Product['badge']>, { label: string; couleur: string; angle: number }> = {
  nouveau: { label: 'Nouveau !', couleur: 'bg-jaune', angle: -6 },
  'coup-de-coeur': { label: 'Coup de cœur du Baron', couleur: 'bg-rose', angle: -4 },
  'derniere-taille': { label: 'Dernière taille', couleur: 'bg-orange', angle: -5 },
};

export function ProductCard({ produit, compact, apercu = true, onAjoutRapide }: { produit: Product; compact?: boolean; apercu?: boolean; onAjoutRapide?: () => void }) {
  const { estFavori, basculer } = useFavorites();
  const [qv, setQv] = useState(false);
  const reduit = useReducedMotion();
  const fav = estFavori(produit.id);
  const badge = produit.badge ? BADGES[produit.badge] : null;

  return (
    <motion.article
      className="group relative flex h-full flex-col rounded-rayon border-[3px] border-noir bg-creme shadow-dure transition-shadow duration-200 hover:shadow-survol"
      whileHover={reduit ? undefined : { rotate: -2, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
    >
      <div className="relative">
        <Link to={`/produit/${produit.slug}`} tabIndex={-1} aria-hidden className="block">
          <div className="relative aspect-square overflow-hidden rounded-t-[21px] border-b-[3px] border-noir">
            <ProductImage src={produit.images[0]} alt={produit.alt} couleur={produit.couleurFond} className="absolute inset-0" imgClassName="group-hover:scale-105" />
            {/* 2e photo au survol */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <ProductImage src={produit.images[1]} alt="" couleur={produit.couleurFond} className="absolute inset-0" />
            </div>
          </div>
        </Link>
        {badge && (
          <span className={cx('absolute left-3 top-3 z-10 rounded-pilule border-[3px] border-noir px-3 py-1 font-accent text-sm shadow-petite', badge.couleur)} style={{ rotate: `${badge.angle}deg` }}>
            {badge.label}
          </span>
        )}
        <motion.button
          type="button" onClick={() => basculer(produit.id)} aria-pressed={fav}
          aria-label={fav ? `Retirer ${produit.nom} de mes favoris` : `Ajouter ${produit.nom} à mes favoris`}
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full border-[3px] border-noir bg-creme"
          whileTap={reduit ? undefined : { scale: 1.35 }}
        >
          <Heart size={20} strokeWidth={2.5} className={fav ? 'fill-rose text-noir' : ''} />
        </motion.button>
        {apercu && (
          <button
            type="button" onClick={() => setQv(true)}
            className="absolute bottom-3 left-1/2 z-10 hidden min-h-[44px] -translate-x-1/2 translate-y-2 items-center gap-2 whitespace-nowrap rounded-pilule border-[3px] border-noir bg-creme px-4 text-sm font-extrabold opacity-0 shadow-petite transition-all duration-200 focus:translate-y-0 focus:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 lg:inline-flex"
          >
            <Eye size={16} strokeWidth={2.5} aria-hidden /> Aperçu rapide
          </button>
        )}
      </div>
      <div className={cx('flex flex-1 flex-col', compact ? 'gap-1 p-4' : 'gap-1.5 p-5')}>
        <p className="surtitre text-[12px] text-bordeaux">{gammeLabel(produit.gamme)}</p>
        <h3 className={cx('font-titre font-black leading-tight', compact ? 'text-xl' : 'text-2xl')}>
          <Link to={`/produit/${produit.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">{produit.nom}</Link>
        </h3>
        <p className="flex items-center gap-2 text-sm">
          <RatingStars note={produit.note} taille={15} />
          <span className="text-noir/70">({produit.nbAvis} avis)</span>
        </p>
        <p className="mt-auto pt-2">
          <span className="font-titre text-2xl font-black">{euros(produit.prix)}</span>
          <span className="text-sm text-noir/70"> / 4 jours</span>
        </p>
        {!compact && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Tailles disponibles">
            {produit.tailles.map((t) => (
              <li key={t} className={cx('rounded-full border-2 border-noir px-2 py-0.5 text-[11px] font-extrabold', produit.taillesIndisponibles.includes(t) && 'line-through opacity-40')}>{t}</li>
            ))}
          </ul>
        )}
        {onAjoutRapide && (
          <button type="button" onClick={onAjoutRapide} className="relative z-10 mt-3 inline-flex min-h-[44px] items-center justify-center rounded-pilule border-[3px] border-noir bg-jaune px-4 text-sm font-extrabold shadow-petite transition hover:-translate-y-0.5">
            + Ajouter
          </button>
        )}
      </div>
      {apercu && <QuickView produit={produit} ouvert={qv} fermer={() => setQv(false)} />}
    </motion.article>
  );
}
