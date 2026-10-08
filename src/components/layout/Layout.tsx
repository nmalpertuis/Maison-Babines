import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from './CookieBanner';
import { Chargement } from './Chargement';
import { getLenis, useSmoothScroll } from '@/components/motion/SmoothScroll';

export function Layout() {
  const loc = useLocation();
  const reduit = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progression = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  useSmoothScroll();

  // Retour en haut de page à chaque changement (sauf ancre).
  useEffect(() => {
    if (loc.hash) {
      const el = document.getElementById(loc.hash.slice(1));
      if (el) { setTimeout(() => { const l = getLenis(); if (l) l.scrollTo(el, { offset: -100 }); else el.scrollIntoView({ behavior: reduit ? 'auto' : 'smooth' }); }, 80); return; }
    }
    const l = getLenis();
    if (l) l.scrollTo(0, { immediate: true }); else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [loc.pathname, loc.hash, reduit]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenu" className="sr-only-focusable fixed left-4 top-4 z-[200] rounded-pilule border-[3px] border-noir bg-jaune px-5 py-3 font-extrabold shadow-dure">Aller au contenu</a>
      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[150] h-1 origin-left bg-rose" style={{ scaleX: progression }} />
      <AnnouncementBar />
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={loc.pathname} id="contenu" tabIndex={-1} className="flex-1 outline-none"
          initial={reduit ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={reduit ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<Chargement />}>
            <Outlet />
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CookieBanner />
    </div>
  );
}
