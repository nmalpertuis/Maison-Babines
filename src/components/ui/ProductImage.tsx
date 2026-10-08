import { useCallback, useState } from 'react';
import type { CouleurPop } from '@/data/types';
import { FOND } from '@/lib/couleurs';
import { cx } from '@/lib/format';
import { SilhouetteChien } from '@/components/brand/illustrations';

/** Photo produit sur fond pop ; si l'image manque, affiche le visuel de remplacement (ImagePlaceholder). */
export function ProductImage({
  src, alt, couleur, className, eager, imgClassName,
}: { src: string; alt: string; couleur: CouleurPop; className?: string; eager?: boolean; imgClassName?: string }) {
  const [erreur, setErreur] = useState(false);
  const [charge, setCharge] = useState(false);
  // Image déjà en cache : onLoad peut partir avant que React ne l'écoute.
  const ref = useCallback((el: HTMLImageElement | null) => {
    if (el?.complete) el.naturalWidth ? setCharge(true) : setErreur(true);
  }, []);
  return (
    <div className={cx('relative overflow-hidden', className)} style={{ background: FOND[couleur] }}>
      {!erreur ? (
        <img
          ref={ref} src={src} alt={alt} width={1200} height={1200}
          loading={eager ? 'eager' : 'lazy'} decoding="async"
          onError={() => setErreur(true)} onLoad={() => setCharge(true)}
          className={cx('h-full w-full object-cover transition-[opacity,transform] duration-700', charge ? 'opacity-100' : 'opacity-0', imgClassName)}
        />
      ) : (
        <ImagePlaceholder alt={alt} couleur={couleur} />
      )}
      {!charge && !erreur && <ImagePlaceholder alt="" couleur={couleur} decoratif />}
    </div>
  );
}

export function ImagePlaceholder({ alt, couleur, decoratif }: { alt: string; couleur: CouleurPop; decoratif?: boolean }) {
  const sombre = couleur === 'bordeaux';
  return (
    <div
      role={decoratif ? undefined : 'img'} aria-label={decoratif ? undefined : alt} aria-hidden={decoratif || undefined}
      className="absolute inset-0 grid place-items-center"
      style={{ background: FOND[couleur] }}
    >
      <div className="absolute inset-[12%] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
      <SilhouetteChien className={cx('relative h-[62%] w-[62%]', sombre ? 'text-creme/80' : 'text-noir/85')} />
    </div>
  );
}
