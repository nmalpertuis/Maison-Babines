import { useEffect, useState } from 'react';

export function lireStockage<T>(cle: string, defaut: T): T {
  try {
    const v = window.localStorage.getItem(cle);
    return v ? (JSON.parse(v) as T) : defaut;
  } catch {
    return defaut;
  }
}

export function ecrireStockage<T>(cle: string, valeur: T) {
  try {
    window.localStorage.setItem(cle, JSON.stringify(valeur));
  } catch {
    /* stockage indisponible : on continue sans persistance */
  }
}

export function useLocalStorage<T>(cle: string, defaut: T) {
  const [valeur, setValeur] = useState<T>(() => lireStockage(cle, defaut));
  useEffect(() => ecrireStockage(cle, valeur), [cle, valeur]);
  return [valeur, setValeur] as const;
}
