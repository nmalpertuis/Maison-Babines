import { useMemo } from 'react';
import { addDays, addMonths, isSaturday, startOfDay } from 'date-fns';
import { isoJour } from '@/lib/format';

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}

/** Dates indisponibles simulées, déterministes : ~15 % des samedis bloqués sur 6 mois. */
export function datesIndisponibles(productId: string): Set<string> {
  const res = new Set<string>();
  const debut = startOfDay(new Date());
  const fin = addMonths(debut, 6);
  for (let d = debut; d <= fin; d = addDays(d, 1)) {
    if (isSaturday(d) && hash(productId + isoJour(d)) < 0.15) res.add(isoJour(d));
  }
  return res;
}

export function useAvailability(productId: string) {
  return useMemo(() => datesIndisponibles(productId), [productId]);
}

export const estDisponible = (productId: string, iso: string) => !datesIndisponibles(productId).has(iso);
