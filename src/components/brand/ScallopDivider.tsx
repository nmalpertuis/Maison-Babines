import { useId } from 'react';
import { cx } from '@/lib/format';

/** Festons d'auvent de palace. `position="bas"` : vagues tournées vers le bas (bord inférieur d'une section). */
export function ScallopDivider({
  couleur = 'var(--creme)', position = 'bas', className, rayures,
}: { couleur?: string; position?: 'haut' | 'bas'; className?: string; rayures?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <div aria-hidden="true" className={cx('pointer-events-none relative z-[1] h-6 w-full', position === 'haut' ? '-mb-px' : '-mt-px', className)}>
      <svg width="100%" height="24" preserveAspectRatio="none" className={cx('block', position === 'haut' && 'rotate-180')}>
        <defs>
          <pattern id={`f-${id}`} width="48" height="24" patternUnits="userSpaceOnUse">
            <path d="M0 0 H48 V4 A24 20 0 0 1 0 4Z" fill={couleur} stroke="#1E1430" strokeWidth="3" />
            {rayures && <path d="M16 0 H32 V20 A24 20 0 0 1 16 20Z" fill={rayures} opacity=".9" />}
            <path d="M0 0 H48 V4 A24 20 0 0 1 0 4Z" fill="none" stroke="#1E1430" strokeWidth="3" />
          </pattern>
        </defs>
        <rect width="100%" height="24" fill={`url(#f-${id})`} />
      </svg>
    </div>
  );
}
