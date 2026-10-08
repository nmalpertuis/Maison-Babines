import { addDays, subDays } from 'date-fns';
import { OPTIONS, CODES_PROMO } from '@/data/packs';
import { getProductById } from '@/data/products';
import type { CartItem } from '@/data/types';
import { depuisIso } from '@/lib/format';

type Options = Pick<CartItem, 'joursSupp' | 'assurance' | 'deuxiemeTaille' | 'express'>;

/** Total = prix de base + (jours supplémentaires × 12 €) + options cochées. Caution et livraison à part. */
export function prixLigne(prixBase: number, o: Options) {
  return (
    prixBase +
    o.joursSupp * OPTIONS.jourSupp +
    (o.assurance ? OPTIONS.assurance : 0) +
    (o.deuxiemeTaille ? OPTIONS.deuxiemeTaille : 0) +
    (o.express ? OPTIONS.express : 0)
  );
}

export function datesLocation(dateEvenement: string, express: boolean, joursSupp = 0) {
  const evt = depuisIso(dateEvenement);
  return {
    livraison: subDays(evt, express ? 1 : 3),
    evenement: evt,
    retour: addDays(evt, 1 + joursSupp),
  };
}

export function recapMalle(items: CartItem[], code?: string) {
  const lignes = items.map((i) => {
    const p = getProductById(i.productId)!;
    return { item: i, produit: p, prix: prixLigne(p.prix, i) };
  });
  const sousTotal = lignes.reduce((s, l) => s + l.prix, 0);
  const taux = code ? CODES_PROMO[code.toUpperCase()] ?? 0 : 0;
  const remise = Math.round(sousTotal * taux * 100) / 100;
  const livraisonOfferte = sousTotal >= OPTIONS.seuilLivraisonOfferte;
  const livraison = items.length === 0 || livraisonOfferte ? 0 : OPTIONS.livraison;
  const caution = lignes.reduce((s, l) => s + l.produit.caution, 0);
  return {
    lignes, sousTotal, remise, livraison, livraisonOfferte, caution,
    resteAvantOffert: Math.max(0, OPTIONS.seuilLivraisonOfferte - sousTotal),
    total: Math.round((sousTotal - remise + livraison) * 100) / 100,
  };
}
