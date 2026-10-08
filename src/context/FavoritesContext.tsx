import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { ecrireStockage, lireStockage } from '@/hooks/useLocalStorage';

const Ctx = createContext<{ favoris: string[]; basculer: (id: string) => void; estFavori: (id: string) => boolean } | null>(null);
const CLE = 'babines-favoris';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoris, basculer] = useReducer(
    (s: string[], id: string) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]),
    [],
    () => lireStockage<string[]>(CLE, []),
  );
  useEffect(() => ecrireStockage(CLE, favoris), [favoris]);
  return <Ctx.Provider value={{ favoris, basculer, estFavori: (id) => favoris.includes(id) }}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useFavorites hors FavoritesProvider');
  return c;
}
