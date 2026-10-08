import { createContext, useCallback, useContext, useEffect, useReducer, useState, type ReactNode } from 'react';
import type { CartItem } from '@/data/types';
import { ecrireStockage, lireStockage } from '@/hooks/useLocalStorage';

type Action =
  | { type: 'ajouter'; item: Omit<CartItem, 'key'> }
  | { type: 'retirer'; key: string }
  | { type: 'vider' };

const cleDe = (i: Pick<CartItem, 'productId' | 'taille' | 'dateEvenement'>) => `${i.productId}|${i.taille}|${i.dateEvenement}`;

function reducer(state: CartItem[], a: Action): CartItem[] {
  switch (a.type) {
    case 'ajouter': {
      const key = cleDe(a.item);
      // Même produit, même taille, même date : on remplace les options au lieu de dupliquer.
      const sans = state.filter((i) => i.key !== key);
      return [...sans, { ...a.item, key }];
    }
    case 'retirer':
      return state.filter((i) => i.key !== a.key);
    case 'vider':
      return [];
  }
}

interface CartCtx {
  items: CartItem[];
  ajouter: (item: Omit<CartItem, 'key'>) => boolean;
  retirer: (key: string) => void;
  vider: () => void;
  saut: number;
}

const Ctx = createContext<CartCtx | null>(null);
const CLE = 'babines-malle';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, [], () => lireStockage<CartItem[]>(CLE, []));
  const [saut, setSaut] = useState(0);
  useEffect(() => ecrireStockage(CLE, items), [items]);

  const ajouter = useCallback(
    (item: Omit<CartItem, 'key'>) => {
      const existe = items.some((i) => i.key === cleDe(item));
      dispatch({ type: 'ajouter', item });
      setSaut((s) => s + 1);
      return !existe;
    },
    [items],
  );

  return (
    <Ctx.Provider
      value={{ items, ajouter, retirer: (key) => dispatch({ type: 'retirer', key }), vider: () => dispatch({ type: 'vider' }), saut }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart hors CartProvider');
  return c;
}
