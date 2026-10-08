import type { Taille } from './types';

export const TAILLES: Taille[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

export interface LigneTaille {
  taille: Taille;
  cou: [number, number];
  poitrine: [number, number];
  dos: [number, number];
  poids: string;
  races: string;
}

export const GUIDE_TAILLES: LigneTaille[] = [
  { taille: 'XXS', cou: [18, 22], poitrine: [26, 32], dos: [18, 22], poids: '1 à 3 kg', races: 'Chihuahua, yorkshire' },
  { taille: 'XS', cou: [22, 27], poitrine: [32, 40], dos: [22, 28], poids: '3 à 5 kg', races: 'Bichon, teckel nain, pinscher nain' },
  { taille: 'S', cou: [27, 32], poitrine: [40, 50], dos: [28, 34], poids: '5 à 9 kg', races: 'Carlin, shih tzu, jack russell' },
  { taille: 'M', cou: [32, 38], poitrine: [50, 60], dos: [34, 42], poids: '9 à 15 kg', races: 'Bouledogue français, cocker, whippet' },
  { taille: 'L', cou: [38, 45], poitrine: [60, 72], dos: [42, 52], poids: '15 à 25 kg', races: 'Border collie, berger australien' },
  { taille: 'XL', cou: [45, 52], poitrine: [72, 85], dos: [52, 62], poids: '25 à 40 kg', races: 'Labrador, golden retriever' },
  { taille: 'XXL', cou: [52, 62], poitrine: [85, 100], dos: [62, 75], poids: '40 kg et plus', races: 'Bouvier bernois, dogue allemand' },
];

type Mesure = 'cou' | 'poitrine' | 'dos';

export function tailleDepuis(mesure: Mesure, valeur: number): Taille | null {
  if (!valeur || valeur <= 0) return null;
  const premier = GUIDE_TAILLES[0][mesure][0];
  if (valeur < premier) return 'XXS';
  for (const l of GUIDE_TAILLES) if (valeur <= l[mesure][1]) return l.taille;
  return 'XXL';
}
