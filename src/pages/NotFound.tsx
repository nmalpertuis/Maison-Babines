import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Seo } from '@/components/ui/Seo';
import { ButtonLink } from '@/components/ui/Button';
import { Baron } from '@/components/brand/illustrations';
import { SplitTitle } from '@/components/motion/SplitTitle';

export default function NotFound() {
  return (
    <>
      <Seo titre="La Chambre introuvable · Maison Babines" description="Cette chambre n'existe pas. Même le Baron s'y est perdu." />
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <section className="relative overflow-hidden bg-rose">
        {/* couloir d'hôtel en perspective */}
        <svg aria-hidden viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-25">
          <path d="M0 0 L320 180 L480 180 L800 0Z" fill="#6B1E3F" />
          <path d="M0 500 L320 320 L480 320 L800 500Z" fill="#6B1E3F" />
          {[60, 140, 220].map((x, i) => <rect key={x} x={x} y={150 - i * 10} width="40" height={200 - i * 40} fill="#FFC93C" stroke="#1E1430" strokeWidth="4" transform={`skewY(${18 - i * 4})`} />)}
          <rect x="320" y="180" width="160" height="140" fill="#FFF6EA" stroke="#1E1430" strokeWidth="4" />
          <text x="400" y="265" textAnchor="middle" fontSize="60" fontWeight="900" fontFamily="Fraunces, serif" fill="#1E1430">404</text>
        </svg>
        <div className="conteneur relative grid min-h-[75vh] items-center gap-8 py-16 lg:grid-cols-2">
          <div>
            <p className="surtitre inline-block rounded-pilule border-[3px] border-noir bg-creme px-3 py-1">La Chambre introuvable</p>
            <SplitTitle as="h1" className="mt-6 text-[52px] lg:text-[88px]" texte="Cette chambre n'existe pas" />
            <p className="mt-6 max-w-md text-xl font-semibold">Même le Baron s'y est perdu. Retournons au Grand Hall.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink to="/" variante="jaune" taille="lg">Retour à l'accueil</ButtonLink>
              <ButtonLink to="/catalogue" variante="secondaire" taille="lg">Voir le catalogue</ButtonLink>
            </div>
          </div>
          <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <Baron pose="perdu" className="w-full" />
          </motion.div>
        </div>
      </section>
    </>
  );
}
