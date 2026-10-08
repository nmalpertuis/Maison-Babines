import type { CouleurPop, Occasion } from './types';
import { products } from './products';

export const OCCASIONS: { id: Occasion; label: string; court: string; titre: string; couleur: CouleurPop }[] = [
  { id: 'mariage', label: 'Mariage', court: 'Mariage', titre: 'Tenues pour un mariage', couleur: 'rose' },
  { id: 'gala', label: 'Gala et soirée', court: 'Gala', titre: 'Tenues pour un gala', couleur: 'bleu' },
  { id: 'bapteme', label: 'Baptême et communion', court: 'Baptême', titre: 'Tenues pour un baptême', couleur: 'jaune' },
  { id: 'noel', label: 'Noël et fêtes', court: 'Noël', titre: 'Tenues pour Noël', couleur: 'vert' },
  { id: 'anniversaire', label: 'Anniversaire', court: 'Anniversaire', titre: 'Tenues pour un anniversaire', couleur: 'orange' },
  { id: 'shooting', label: 'Shooting et tapis rouge', court: 'Shooting', titre: 'Tenues pour un shooting', couleur: 'bleu' },
];

export const occasionLabel = (o: Occasion) => OCCASIONS.find((x) => x.id === o)!.label;
export const occasionCourt = (o: Occasion) => OCCASIONS.find((x) => x.id === o)!.court;

/** Prix d'appel ("dès XX €") calculé depuis le catalogue. */
export const prixDesOccasion = (o: Occasion) =>
  Math.min(...products.filter((p) => p.occasions.includes(o)).map((p) => p.prix));
