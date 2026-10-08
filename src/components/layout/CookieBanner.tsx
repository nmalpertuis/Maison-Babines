import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lireStockage, ecrireStockage } from '@/hooks/useLocalStorage';
import { Checkbox } from '@/components/form/Field';

const CLE = 'babines-cookies';
const EVT = 'babines:cookies';
export const ouvrirCookies = () => window.dispatchEvent(new Event(EVT));

function Biscuit() {
  return (
    <svg viewBox="0 0 90 80" aria-hidden className="h-20 w-24 shrink-0">
      <circle cx="40" cy="44" r="30" fill="#E9A66B" stroke="#1E1430" strokeWidth="3" />
      <path d="M60 22 a12 12 0 0 0 10 16" fill="#FFF6EA" stroke="#1E1430" strokeWidth="3" />
      {[[30, 34], [46, 30], [26, 52], [44, 52], [54, 44]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="4" fill="#6B1E3F" />)}
      <g transform="translate(58 6) scale(.28)"><circle cx="50" cy="50" r="40" fill="#B5652B" stroke="#1E1430" strokeWidth="8" /><circle cx="64" cy="44" r="8" fill="#1E1430" /><circle cx="64" cy="44" r="16" fill="none" stroke="#C9A227" strokeWidth="8" /></g>
    </svg>
  );
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [perso, setPerso] = useState(false);
  const [mesure, setMesure] = useState(false);

  useEffect(() => {
    if (!lireStockage<string | null>(CLE, null)) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);
  useEffect(() => {
    const o = () => { setVisible(true); setPerso(false); };
    window.addEventListener(EVT, o);
    return () => window.removeEventListener(EVT, o);
  }, []);

  const choisir = (v: 'accepte' | 'refuse' | 'perso') => {
    ecrireStockage(CLE, v === 'perso' ? (mesure ? 'accepte' : 'refuse') : v);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          aria-label="Cookies" role="dialog"
          className="fixed bottom-4 left-4 right-4 z-[90] max-w-md rounded-rayon border-[3px] border-noir bg-creme p-5 shadow-dure sm:right-auto"
          initial={{ y: 140, opacity: 0, rotate: -3 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 140, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <div className="flex items-start gap-3">
            <Biscuit />
            <p className="text-sm leading-snug">Le Baron préfère les biscuits, mais on a aussi des cookies. Ici, seulement ceux qui font marcher votre malle.</p>
          </div>
          {perso && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border-[3px] border-noir bg-white p-4 text-sm">
              <Checkbox checked disabled label={<span><strong>Essentiels</strong> : malle, favoris, choix cookies (toujours actifs)</span>} />
              <Checkbox checked={mesure} onChange={(e) => setMesure(e.target.checked)} label={<span><strong>Mesure d'audience</strong> anonyme (aucun cookie tiers)</span>} />
              <Link to="/confidentialite" className="lien">En savoir plus</Link>
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {perso ? (
              <button type="button" onClick={() => choisir('perso')} className="col-span-2 min-h-[48px] rounded-pilule border-[3px] border-noir bg-rose font-extrabold shadow-petite">Enregistrer mes choix</button>
            ) : (
              <>
                <button type="button" onClick={() => choisir('accepte')} className="min-h-[48px] rounded-pilule border-[3px] border-noir bg-creme font-extrabold shadow-petite transition hover:-translate-y-0.5">Accepter</button>
                <button type="button" onClick={() => choisir('refuse')} className="min-h-[48px] rounded-pilule border-[3px] border-noir bg-creme font-extrabold shadow-petite transition hover:-translate-y-0.5">Refuser</button>
              </>
            )}
          </div>
          {!perso && <button type="button" onClick={() => setPerso(true)} className="lien mt-3 text-sm">Personnaliser</button>}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
