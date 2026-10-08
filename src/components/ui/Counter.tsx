import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/** Chiffre animé déclenché au scroll. */
export function Counter({ valeur, prefixe = '', suffixe = '', duree = 1.8 }: { valeur: number; prefixe?: string; suffixe?: string; duree?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });
  const reduit = useReducedMotion();
  const [n, setN] = useState(reduit ? valeur : 0);
  useEffect(() => {
    if (!visible || reduit) return;
    const c = animate(0, valeur, { duration: duree, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [visible, valeur, duree, reduit]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefixe}{n.toLocaleString('fr-FR').replace(/ /g, ' ')}{suffixe}
    </span>
  );
}
