import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Crown, Gift, Heart, Sparkles } from 'lucide-react';
import { getProduct } from '@/data/products';
import { euros } from '@/lib/format';
import { getLenis } from './SmoothScroll';

/* Séquence épinglée : la tenue tourne et grossit au fil du scroll pendant que les textes défilent,
   avec une navigation latérale par icônes. */

const ACTES = [
  { slug: 'le-smoking-baron', surtitre: 'Acte I · Le mariage', titre: 'Le smoking qui fait taire la salle', texte: 'Velours bordeaux, revers satinés, nœud pap\' rose amovible. Livré trois jours avant le « oui », récupéré sans lavage.', fond: '#6B1E3F', texteClair: true, icone: Heart },
  { slug: 'la-robe-meringue', surtitre: 'Acte II · La cérémonie', titre: 'Trois couches de tulle et une traîne de 40 cm', texte: 'La robe de mariée canine : voile assorti, coupe pensée pour marcher, s\'asseoir et voler la vedette.', fond: '#FF4F9A', texteClair: false, icone: Sparkles },
  { slug: 'la-cape-royale-duchesse', surtitre: 'Acte III · Le tapis rouge', titre: 'Une cape royale pour les shootings', texte: 'Velours, col en fausse hermine et couronne assortie. Les flashs crépitent, votre chien ne cligne même pas.', fond: '#FFC93C', texteClair: false, icone: Crown },
  { slug: 'le-pull-de-fete-biscotte', surtitre: 'Acte IV · Les fêtes', titre: 'La photo de famille de l\'année', texte: 'Le pull de Noël brodé de petits teckels. On le rend en janvier, on le retrouve en décembre.', fond: '#2BC48A', texteClair: false, icone: Gift },
];

export function ScrollStory() {
  const ref = useRef<HTMLElement>(null);
  const reduit = useReducedMotion();
  const [actif, setActif] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useMotionValueEvent(scrollYProgress, 'change', (v) => setActif(Math.min(ACTES.length - 1, Math.floor(v * ACTES.length * 0.999))));

  // Rotation et échelle continues, comme un objet qu'on fait tourner entre ses doigts.
  const rotate = useTransform(p, [0, 0.25, 0.5, 0.75, 1], reduit ? [0, 0, 0, 0, 0] : [-14, 8, -6, 10, -4]);
  const scale = useTransform(p, [0, 0.12, 0.5, 0.88, 1], reduit ? [1, 1, 1, 1, 1] : [0.82, 1, 1.08, 1, 0.94]);
  const y = useTransform(p, [0, 1], reduit ? [0, 0] : [40, -40]);
  const barre = useTransform(p, [0, 1], ['0%', '100%']);
  const acte = ACTES[actif];
  const produit = getProduct(acte.slug)!;

  const aller = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const cible = el.offsetTop + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / ACTES.length);
    const l = getLenis();
    if (l) l.scrollTo(cible, { duration: 1.2 }); else window.scrollTo({ top: cible, behavior: 'smooth' });
  };

  return (
    <section ref={ref} aria-label="La garde-robe en quatre actes" className="relative" style={{ height: `${ACTES.length * 100 + 40}vh` }}>
      <motion.div
        className="sticky top-0 flex h-screen items-center overflow-hidden border-y-[3px] border-noir"
        animate={{ backgroundColor: acte.fond }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* grand titre en filigrane */}
        <motion.p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-titre text-[22vw] font-black italic leading-none opacity-[0.09]"
          style={{ x: useTransform(p, [0, 1], ['10%', '-30%']) }}
        >
          Babines Babines
        </motion.p>

        <div className="conteneur relative grid h-full items-center gap-6 py-24 lg:grid-cols-[1fr_1.1fr_auto] lg:gap-10">
          {/* Texte de l'acte */}
          <div className={acte.texteClair ? 'text-creme' : 'text-noir'} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={actif} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <p className="surtitre inline-flex rounded-pilule border-[3px] border-current px-3 py-1">{acte.surtitre}</p>
                <h3 className="mt-5 text-[34px] font-black leading-[1.02] lg:text-[60px]">{acte.titre}</h3>
                <p className="mt-5 max-w-md text-lg">{acte.texte}</p>
                <Link to={`/produit/${produit.slug}`} className="mt-7 inline-flex min-h-[48px] items-center gap-3 rounded-pilule border-[3px] border-noir bg-creme px-6 font-extrabold text-noir shadow-dure transition hover:-translate-y-0.5">
                  {produit.nom} · {euros(produit.prix)}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Objet héros : la tenue qui tourne */}
          <motion.div className="relative mx-auto aspect-square w-[min(78vw,520px)]" style={{ rotate, scale, y }}>
            <div className="absolute inset-[-6%] rounded-full border-[3px] border-dashed border-noir/40" aria-hidden />
            <div className="relative h-full w-full overflow-hidden rounded-full border-[4px] border-noir bg-creme shadow-[14px_14px_0_var(--noir)]">
              <AnimatePresence initial={false}>
                <motion.img
                  key={produit.slug}
                  src={produit.images[0]} alt={produit.alt} width={1200} height={1200}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.15, rotate: 6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
            </div>
            <motion.span
              key={`prix-${actif}`}
              className="absolute -right-2 top-6 rounded-pilule border-[3px] border-noir bg-jaune px-4 py-2 font-accent text-lg shadow-petite"
              initial={{ scale: 1.4, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 6 }} transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.2 }}
            >
              dès {euros(produit.prix)}
            </motion.span>
          </motion.div>

          {/* Navigation latérale */}
          <nav aria-label="Actes" className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 lg:static lg:translate-x-0 lg:flex-col">
            {ACTES.map((a, i) => (
              <button
                key={a.slug} type="button" onClick={() => aller(i)} aria-current={i === actif || undefined} aria-label={a.surtitre}
                className={`grid h-12 w-12 place-items-center rounded-full border-[3px] border-noir transition-all duration-300 ${i === actif ? 'scale-110 bg-creme shadow-petite' : 'bg-creme/40 hover:bg-creme/80'}`}
              >
                <a.icone size={20} strokeWidth={2.5} aria-hidden />
              </button>
            ))}
          </nav>
        </div>

        {/* progression */}
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-noir/15" aria-hidden>
          <motion.div className="h-full bg-noir" style={{ width: barre }} />
        </div>
      </motion.div>
    </section>
  );
}
