import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Gamme, Occasion, Product, Teinte, TypeProduit } from '@/data/types';
import { products } from '@/data/products';
import { estDisponible } from './useAvailability';

export type Tri = 'coups-de-coeur' | 'prix-asc' | 'prix-desc' | 'nouveautes' | 'notes';

export const TRIS: { id: Tri; label: string }[] = [
  { id: 'coups-de-coeur', label: 'Nos coups de cœur' },
  { id: 'prix-asc', label: 'Prix croissant' },
  { id: 'prix-desc', label: 'Prix décroissant' },
  { id: 'nouveautes', label: 'Nouveautés' },
  { id: 'notes', label: 'Mieux notées' },
];

export const PRIX_MIN = 19;
export const PRIX_MAX = 189;

const liste = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);

/** Filtres du catalogue synchronisés avec l'URL (?occasion=mariage&type=robes&taille=s…). */
export function useFilters(favoris: string[] = []) {
  const [params, setParams] = useSearchParams();

  const f = {
    occasion: (params.get('occasion') as Occasion | null) ?? null,
    types: liste(params.get('type')) as TypeProduit[],
    gammes: liste(params.get('gamme')) as Gamme[],
    tailles: liste(params.get('taille')).map((t) => t.toUpperCase()),
    couleurs: liste(params.get('couleur')) as Teinte[],
    prixMin: Number(params.get('min') ?? PRIX_MIN),
    prixMax: Number(params.get('max') ?? PRIX_MAX),
    date: params.get('date'),
    favoris: params.get('favoris') === '1',
    tri: (params.get('tri') as Tri | null) ?? 'coups-de-coeur',
  };

  const maj = (champs: Record<string, string | string[] | number | null>) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(champs)) {
      const val = Array.isArray(v) ? v.join(',') : v === null ? '' : String(v);
      const defaut = (k === 'min' && val === String(PRIX_MIN)) || (k === 'max' && val === String(PRIX_MAX)) || (k === 'tri' && val === 'coups-de-coeur');
      if (!val || defaut) p.delete(k);
      else p.set(k, k === 'taille' ? val.toLowerCase() : val);
    }
    setParams(p, { replace: true, preventScrollReset: true });
  };

  const basculer = (cle: 'type' | 'gamme' | 'taille' | 'couleur', valeur: string, actuel: string[]) =>
    maj({ [cle]: actuel.includes(valeur) ? actuel.filter((x) => x !== valeur) : [...actuel, valeur] });

  const toutEffacer = () => setParams(new URLSearchParams(f.tri !== 'coups-de-coeur' ? { tri: f.tri } : {}), { replace: true, preventScrollReset: true });

  const resultats = useMemo(() => {
    const r = products.filter((p: Product) =>
      (!f.occasion || p.occasions.includes(f.occasion)) &&
      (!f.types.length || f.types.includes(p.type)) &&
      (!f.gammes.length || f.gammes.includes(p.gamme)) &&
      (!f.tailles.length || f.tailles.some((t) => (p.tailles as string[]).includes(t) && !p.taillesIndisponibles.includes(t))) &&
      (!f.couleurs.length || f.couleurs.some((c) => p.teintes.includes(c))) &&
      p.prix >= f.prixMin && p.prix <= f.prixMax &&
      (!f.date || estDisponible(p.id, f.date)) &&
      (!f.favoris || favoris.includes(p.id)),
    );
    const score = (p: Product) => (p.badge === 'coup-de-coeur' ? 3 : p.badge === 'nouveau' ? 2 : p.badge === 'derniere-taille' ? 1 : 0) + p.note / 10;
    const tris: Record<Tri, (a: Product, b: Product) => number> = {
      'coups-de-coeur': (a, b) => score(b) - score(a),
      'prix-asc': (a, b) => a.prix - b.prix,
      'prix-desc': (a, b) => b.prix - a.prix,
      nouveautes: (a, b) => b.dateAjout.localeCompare(a.dateAjout),
      notes: (a, b) => b.note - a.note || b.nbAvis - a.nbAvis,
    };
    return [...r].sort(tris[f.tri]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString(), favoris.join()]);

  const nbActifs =
    f.types.length + f.gammes.length + f.tailles.length + f.couleurs.length +
    (f.prixMin !== PRIX_MIN || f.prixMax !== PRIX_MAX ? 1 : 0) + (f.date ? 1 : 0) + (f.favoris ? 1 : 0);

  return { f, maj, basculer, toutEffacer, resultats, nbActifs };
}
