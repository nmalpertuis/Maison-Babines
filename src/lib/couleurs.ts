import type { CouleurPop, Teinte } from '@/data/types';

export const FOND: Record<CouleurPop, string> = {
  bordeaux: 'var(--bordeaux)', rose: 'var(--rose)', jaune: 'var(--jaune)',
  bleu: 'var(--bleu)', orange: 'var(--orange)', vert: 'var(--vert)',
};
/** Couleur de texte lisible sur un fond donné (règles de contraste 6.2). */
export const TEXTE_SUR: Record<CouleurPop, string> = {
  bordeaux: 'var(--creme)', rose: 'var(--noir)', jaune: 'var(--noir)',
  bleu: 'var(--noir)', orange: 'var(--noir)', vert: 'var(--noir)',
};

export const TEINTES: { id: Teinte; label: string; hex: string }[] = [
  { id: 'bordeaux', label: 'Bordeaux', hex: '#6B1E3F' },
  { id: 'noir', label: 'Noir', hex: '#1E1430' },
  { id: 'rose', label: 'Rose', hex: '#FF4F9A' },
  { id: 'rouge', label: 'Rouge', hex: '#D7263D' },
  { id: 'jaune', label: 'Jaune', hex: '#FFC93C' },
  { id: 'or', label: 'Or', hex: '#C9A227' },
  { id: 'vert', label: 'Vert', hex: '#2BC48A' },
  { id: 'bleu', label: 'Bleu', hex: '#3DB8F5' },
  { id: 'gris', label: 'Gris', hex: '#9A93A6' },
  { id: 'ivoire', label: 'Ivoire', hex: '#F4EAD5' },
  { id: 'blanc', label: 'Blanc', hex: '#FFFFFF' },
  { id: 'pastel', label: 'Pastel', hex: 'linear-gradient(135deg,#FFC4DD,#C8F0E0,#FFE7A8)' },
];
