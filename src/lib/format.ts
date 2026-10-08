import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/** Prix au format français : 89 €, 9,90 €. */
export function euros(n: number): string {
  const entier = Math.abs(n - Math.round(n)) < 0.001;
  return (
    n.toLocaleString('fr-FR', { minimumFractionDigits: entier ? 0 : 2, maximumFractionDigits: 2 }).replace(/ /g, ' ') +
    ' €'
  );
}

/** "sam. 13 juin 2026" */
export const dateLongue = (d: Date) => format(d, 'EEE d MMMM yyyy', { locale: fr });
/** "sam. 13 juin" */
export const dateCourte = (d: Date) => format(d, 'EEE d MMMM', { locale: fr });
export const isoJour = (d: Date) => format(d, 'yyyy-MM-dd');
export const depuisIso = (s: string) => {
  const [y, m, j] = s.split('-').map(Number);
  return new Date(y, m - 1, j);
};
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
