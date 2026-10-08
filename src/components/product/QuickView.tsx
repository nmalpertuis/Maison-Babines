import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '@/data/types';
import { gammeLabel } from '@/data/products';
import { Modal } from '@/components/ui/Modal';
import { ProductImage } from '@/components/ui/ProductImage';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/ui/Button';
import { euros } from '@/lib/format';
import { SizePicker } from './SizePicker';

/** Aperçu rapide : photo, prix, taille. La date se choisit sur la fiche (calendrier). */
export function QuickView({ produit, ouvert, fermer }: { produit: Product; ouvert: boolean; fermer: () => void }) {
  const [taille, setTaille] = useState<string | null>(null);
  const nav = useNavigate();
  const f = useCallback(() => fermer(), [fermer]);
  return (
    <Modal ouvert={ouvert} fermer={f} titre={`Aperçu rapide : ${produit.nom}`} large>
      <div className="grid md:grid-cols-2">
        <ProductImage src={produit.images[0]} alt={produit.alt} couleur={produit.couleurFond} className="aspect-square border-b-[3px] border-noir md:border-b-0 md:border-r-[3px]" />
        <div className="flex flex-col gap-4 p-6 md:p-8">
          <p className="surtitre text-bordeaux">{gammeLabel(produit.gamme)}</p>
          <h2 className="text-[36px] lg:text-[40px]">{produit.nom}</h2>
          <p className="flex items-center gap-2 text-sm"><RatingStars note={produit.note} /> {produit.note.toLocaleString('fr-FR')}/5 · {produit.nbAvis} avis</p>
          <p><span className="font-titre text-3xl font-black">{euros(produit.prix)}</span> <span className="text-noir/70">pour 4 jours, nettoyage inclus</span></p>
          <p>{produit.descriptionCourte}.</p>
          <div>
            <p className="etiquette">Taille</p>
            <SizePicker tailles={produit.tailles} indisponibles={produit.taillesIndisponibles} valeur={taille} onChange={setTaille} />
          </div>
          <Button
            pleine disabled={!taille}
            onClick={() => { fermer(); nav(`/produit/${produit.slug}?taille=${taille}#reservation`); }}
          >
            Ajouter à la malle
          </Button>
          <p className="text-sm text-noir/70">{taille ? 'Il ne reste qu\'à choisir la date de votre grand soir.' : 'Choisissez une taille et une date.'}</p>
          <Link to={`/produit/${produit.slug}`} onClick={fermer} className="lien text-sm">Voir la fiche complète</Link>
        </div>
      </div>
    </Modal>
  );
}
