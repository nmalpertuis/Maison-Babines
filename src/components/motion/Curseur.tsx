import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/* Curseur Maison Babines : point rose précis + anneau bordeaux souple qui devient nœud pap'
   au survol des éléments cliquables, étiquette contextuelle (data-curseur) et traces de pattes.
   Uniquement sur souris / trackpad, désactivé si l'utilisateur réduit les animations. */

const INTERACTIF = 'a, button, [role="button"], label, summary, [data-curseur]';
const TEXTE = 'input, textarea, select, [contenteditable="true"]';

interface Patte { id: number; x: number; y: number; angle: number; gauche: boolean }

function PattePlante() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <ellipse cx="12" cy="15" rx="5" ry="4.2" fill="#6B1E3F" />
      <circle cx="6.5" cy="9.5" r="2.2" fill="#6B1E3F" /><circle cx="10" cy="6.5" r="2.2" fill="#6B1E3F" />
      <circle cx="14" cy="6.5" r="2.2" fill="#6B1E3F" /><circle cx="17.5" cy="9.5" r="2.2" fill="#6B1E3F" />
    </svg>
  );
}

export function Curseur() {
  const [actif, setActif] = useState(false);
  const [survol, setSurvol] = useState(false);
  const [texte, setTexte] = useState(false);
  const [etiquette, setEtiquette] = useState<string | null>(null);
  const [appui, setAppui] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pattes, setPattes] = useState<Patte[]>([]);
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const ax = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ay = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const dernier = useRef({ x: 0, y: 0, gauche: false, id: 0 });

  useEffect(() => {
    const fin = window.matchMedia('(pointer: fine)').matches;
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fin || reduit) return;
    setActif(true);
    document.documentElement.classList.add('curseur-perso');

    const bouge = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX); y.set(e.clientY);
      setVisible(true);
      const cible = e.target as Element | null;
      const champ = cible?.closest?.(TEXTE);
      const inter = !champ && cible?.closest?.(INTERACTIF);
      setTexte(!!champ);
      setSurvol(!!inter);
      setEtiquette(inter ? (inter as HTMLElement).dataset.curseur ?? null : null);

      // Trace de pattes tous les ~110 px parcourus
      const d = dernier.current;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (dx * dx + dy * dy > 110 * 110) {
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        const decal = d.gauche ? -9 : 9;
        const rad = ((angle) * Math.PI) / 180;
        const p: Patte = { id: ++d.id, x: e.clientX + Math.cos(rad) * decal, y: e.clientY + Math.sin(rad) * decal, angle, gauche: d.gauche };
        d.x = e.clientX; d.y = e.clientY; d.gauche = !d.gauche;
        setPattes((l) => [...l.slice(-7), p]);
        window.setTimeout(() => setPattes((l) => l.filter((q) => q.id !== p.id)), 900);
      }
    };
    const bas = () => setAppui(true);
    const haut = () => setAppui(false);
    const sort = () => setVisible(false);
    window.addEventListener('pointermove', bouge, { passive: true });
    window.addEventListener('pointerdown', bas);
    window.addEventListener('pointerup', haut);
    document.documentElement.addEventListener('mouseleave', sort);
    return () => {
      document.documentElement.classList.remove('curseur-perso');
      window.removeEventListener('pointermove', bouge);
      window.removeEventListener('pointerdown', bas);
      window.removeEventListener('pointerup', haut);
      document.documentElement.removeEventListener('mouseleave', sort);
    };
  }, [x, y]);

  if (!actif) return null;
  const taille = etiquette ? 84 : survol ? 58 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300]">
      {/* Traces de pattes */}
      {pattes.map((p) => (
        <motion.span
          key={p.id}
          className="absolute -ml-2 -mt-2"
          style={{ left: p.x, top: p.y, rotate: p.angle }}
          initial={{ opacity: 0.55, scale: 0.6 }} animate={{ opacity: 0, scale: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          <PattePlante />
        </motion.span>
      ))}

      {/* Anneau souple */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: ax, y: ay }}
        animate={{ opacity: visible && !texte ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-bordeaux"
          animate={{
            width: taille, height: taille,
            scale: appui ? 0.78 : 1,
            backgroundColor: etiquette ? '#FFC93C' : survol ? 'rgba(255,79,154,.22)' : 'rgba(255,79,154,0)',
            borderColor: etiquette ? '#1E1430' : '#6B1E3F',
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        >
          {etiquette ? (
            <span className="font-accent text-sm text-noir">{etiquette}</span>
          ) : survol ? (
            <motion.svg viewBox="0 0 40 22" className="w-7" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }}>
              <path d="M20 11 L4 2 L4 20Z" fill="#FF4F9A" stroke="#1E1430" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M20 11 L36 2 L36 20Z" fill="#FF4F9A" stroke="#1E1430" strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx="20" cy="11" r="4" fill="#FF4F9A" stroke="#1E1430" strokeWidth="2.5" />
            </motion.svg>
          ) : null}
        </motion.div>
      </motion.div>

      {/* Point précis */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x, y }}
        animate={{ opacity: visible && !texte && !etiquette ? 1 : 0, scale: survol ? 0 : 1 }}
        transition={{ duration: 0.12 }}
      >
        <div className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-noir bg-rose" />
      </motion.div>
    </div>
  );
}
