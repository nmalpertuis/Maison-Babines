import { useEffect } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** Défilement fluide avec inertie (désactivé si l'utilisateur réduit les animations). */
export function useSmoothScroll() {
  const loc = useLocation();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), anchors: { offset: -100 } });
    let raf = 0;
    const boucle = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(boucle); };
    raf = requestAnimationFrame(boucle);
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); lenis = null; };
  }, []);
  // Les modales et le menu mobile bloquent le défilement de la page.
  useEffect(() => {
    const obs = new MutationObserver(() => {
      if (!lenis) return;
      if (document.body.style.overflow === 'hidden') lenis.stop(); else lenis.start();
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    return () => obs.disconnect();
  }, []);
  useEffect(() => { lenis?.resize(); }, [loc.pathname]);
}
