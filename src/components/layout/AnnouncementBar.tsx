import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const MESSAGES = ['Livraison offerte dès 120 €', 'Retour gratuit', 'Taille garantie'];
const CLE = 'babines-annonce-fermee';

export function AnnouncementBar() {
  const [ferme, setFerme] = useState(() => {
    try { return sessionStorage.getItem(CLE) === '1'; } catch { return false; }
  });
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((k) => (k + 1) % MESSAGES.length), 3000);
    return () => clearInterval(t);
  }, []);
  if (ferme) return null;
  const fermer = () => {
    setFerme(true);
    try { sessionStorage.setItem(CLE, '1'); } catch { /* rien */ }
  };
  return (
    <div className="relative z-50 flex h-10 items-center justify-center border-b-[3px] border-noir bg-jaune px-12 text-sm font-extrabold" role="region" aria-label="Annonce">
      <p className="hidden sm:block">{MESSAGES.join(' · ')}</p>
      <p className="relative h-5 w-full overflow-hidden text-center sm:hidden" aria-live="off">
        <AnimatePresence mode="wait">
          <motion.span key={i} className="absolute inset-0" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}>
            {MESSAGES[i]}
          </motion.span>
        </AnimatePresence>
      </p>
      <button type="button" onClick={fermer} className="absolute right-1 grid h-10 w-10 place-items-center rounded-full hover:bg-noir/10" aria-label="Fermer l'annonce">
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
