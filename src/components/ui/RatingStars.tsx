import { Star } from 'lucide-react';
import { cx } from '@/lib/format';

export function RatingStars({ note, taille = 18, className }: { note: number; taille?: number; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-0.5', className)} role="img" aria-label={`Note : ${note.toLocaleString('fr-FR')} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const rempli = Math.min(1, Math.max(0, note - i + 1));
        return (
          <span key={i} className="relative inline-block" style={{ width: taille, height: taille }} aria-hidden>
            <Star size={taille} strokeWidth={2.2} className="absolute inset-0 text-noir" fill="var(--creme)" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${rempli * 100}%` }}>
              <Star size={taille} strokeWidth={2.2} className="text-noir" fill="var(--or)" />
            </span>
          </span>
        );
      })}
    </span>
  );
}
