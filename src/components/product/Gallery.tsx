import { useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import type { Product } from '@/data/types';
import { ProductImage } from '@/components/ui/ProductImage';
import { Modal } from '@/components/ui/Modal';
import { cx } from '@/lib/format';
import { BADGES } from './ProductCard';

const VUES = ['face', 'pose', 'détail'];

/** Galerie : grande photo, 3 miniatures, zoom au survol, balayage au doigt, plein écran au clic. */
export function Gallery({ produit }: { produit: Product }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [plein, setPlein] = useState(false);
  const toucheX = useRef<number | null>(null);
  const n = produit.images.length;
  const aller = (k: number) => setI((k + n) % n);
  const alt = (k: number) => `${produit.alt}, vue de ${VUES[k]}`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const onTouchStart = (e: TouchEvent) => (toucheX.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (toucheX.current === null) return;
    const dx = e.changedTouches[0].clientX - toucheX.current;
    if (Math.abs(dx) > 40) aller(i + (dx < 0 ? 1 : -1));
    toucheX.current = null;
  };
  const badge = produit.badge ? BADGES[produit.badge] : null;

  return (
    <div>
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-rayon border-[3px] border-noir shadow-dure"
        onMouseMove={onMove} onMouseLeave={() => setZoom(null)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
        onClick={() => setPlein(true)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} data-zoom-img className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <ProductImage
              src={produit.images[i]} alt={alt(i)} couleur={produit.couleurFond} eager={i === 0} className="absolute inset-0"
              imgClassName={cx('duration-200', zoom && 'lg:scale-[2]')}
            />
          </motion.div>
        </AnimatePresence>
        {zoom && <style>{`@media (min-width:1024px){[data-zoom-img] img{transform-origin:${zoom.x}% ${zoom.y}%}}`}</style>}
        {badge && (
          <span className={cx('absolute left-4 top-4 z-10 rounded-pilule border-[3px] border-noir px-4 py-1.5 font-accent shadow-petite', badge.couleur)} style={{ rotate: `${badge.angle}deg` }}>
            {badge.label}
          </span>
        )}
        <button type="button" onClick={(e) => { e.stopPropagation(); setPlein(true); }} aria-label="Afficher la photo en plein écran" className="absolute bottom-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full border-[3px] border-noir bg-creme">
          <Expand size={18} strokeWidth={2.5} />
        </button>
      </div>
      <ul className="mt-5 grid grid-cols-3 gap-4" aria-label="Miniatures">
        {produit.images.map((src, k) => (
          <li key={src}>
            <button
              type="button" onClick={() => setI(k)} aria-label={`Voir la vue de ${VUES[k]}`} aria-current={k === i || undefined}
              className={cx('block w-full overflow-hidden rounded-2xl border-[3px] border-noir transition', k === i ? 'shadow-dure -translate-y-1' : 'opacity-75 hover:opacity-100')}
            >
              <ProductImage src={src} alt="" couleur={produit.couleurFond} className="aspect-square" />
            </button>
          </li>
        ))}
      </ul>
      <Modal ouvert={plein} fermer={() => setPlein(false)} titre={`Photos : ${produit.nom}`} large className="bg-noir">
        <div className="relative aspect-square" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <ProductImage src={produit.images[i]} alt={alt(i)} couleur={produit.couleurFond} className="absolute inset-0" />
          <button type="button" onClick={() => aller(i - 1)} aria-label="Photo précédente" className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-[3px] border-noir bg-creme"><ChevronLeft strokeWidth={2.5} /></button>
          <button type="button" onClick={() => aller(i + 1)} aria-label="Photo suivante" className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border-[3px] border-noir bg-creme"><ChevronRight strokeWidth={2.5} /></button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-pilule border-[3px] border-noir bg-creme px-4 py-1 text-sm font-extrabold">{i + 1} / {n}</p>
        </div>
      </Modal>
    </div>
  );
}
