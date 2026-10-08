import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { cx, dateLongue, depuisIso, euros } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { ButtonLink } from '@/components/ui/Button';
import { Stepper } from '@/components/ui/Stepper';
import { BaronHead } from '@/components/brand/illustrations';
import type { ArticleReservation } from '@/lib/crm';
import { CLE_CONFIRMATION } from './Checkout';

interface Conf { numero: string; chien: string; dateEvenement: string; dateLivraison: string; total: number; caution: number; articles: ArticleReservation[] }

function Os({ couleur }: { couleur: string }) {
  return (
    <svg viewBox="0 0 40 18" className="h-4 w-9" aria-hidden>
      <rect x="7" y="5" width="26" height="8" rx="3" fill={couleur} stroke="#1E1430" strokeWidth="2" />
      <circle cx="6" cy="5" r="4" fill={couleur} stroke="#1E1430" strokeWidth="2" /><circle cx="6" cy="13" r="4" fill={couleur} stroke="#1E1430" strokeWidth="2" />
      <circle cx="34" cy="5" r="4" fill={couleur} stroke="#1E1430" strokeWidth="2" /><circle cx="34" cy="13" r="4" fill={couleur} stroke="#1E1430" strokeWidth="2" />
      <rect x="8" y="6" width="24" height="6" fill={couleur} />
    </svg>
  );
}

function Confettis() {
  const reduit = useReducedMotion();
  const os = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    x: Math.random() * 100, d: Math.random() * 0.8, r: Math.random() * 720 - 360, dur: 2.4 + Math.random() * 1.6,
    c: ['#FF4F9A', '#FFC93C', '#3DB8F5', '#2BC48A', '#FF6B4A', '#FFF6EA'][i % 6],
  })), []);
  if (reduit) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      {os.map((o, i) => (
        <motion.div key={i} className="absolute -top-10" style={{ left: `${o.x}%` }} initial={{ y: -40, rotate: 0, opacity: 1 }} animate={{ y: '110vh', rotate: o.r, opacity: [1, 1, 0] }} transition={{ duration: o.dur, delay: 0.9 + o.d, ease: 'easeIn' }}>
          <Os couleur={o.c} />
        </motion.div>
      ))}
    </div>
  );
}

export default function Confirmation() {
  const [conf] = useState<Conf | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(CLE_CONFIRMATION) ?? 'null'); } catch { return null; }
  });
  const reduit = useReducedMotion();
  const [ouvert, setOuvert] = useState(!!reduit);
  useEffect(() => { const t = setTimeout(() => setOuvert(true), 600); return () => clearTimeout(t); }, []);

  if (!conf) return <Navigate to="/" replace />;

  return (
    <>
      <Seo titre="Le Carton d'invitation · Maison Babines" description="Votre réservation est confirmée." />
      <Confettis />
      <div className="bg-rose">
        <div className="conteneur pb-24 pt-10">
          <Stepper etape={3} className="mx-auto max-w-2xl" />
          <p className="surtitre mt-10 text-center">Le Carton d'invitation</p>
          <h1 className="mt-2 text-center text-[44px] lg:text-[72px]">Votre commande est confirmée.</h1>
          <p className="mt-3 text-center font-titre text-2xl italic">{conf.chien}, tu vas être sublime.</p>

          {/* Enveloppe */}
          <div className="relative mx-auto mt-14 max-w-2xl [perspective:1400px]">
            <div className="relative rounded-[20px] border-[4px] border-noir bg-bordeaux pb-6 pt-24 shadow-[10px_10px_0_var(--noir)]">
              {/* rabat */}
              <motion.div
                className="absolute inset-x-0 top-0 z-20 h-40 origin-top"
                style={{ transformStyle: 'preserve-3d' }}
                initial={false} animate={{ rotateX: ouvert ? 180 : 0 }} transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
              >
                <svg viewBox="0 0 400 140" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
                  <path d="M0 0 H400 L200 135Z" fill="#8E3A5E" stroke="#1E1430" strokeWidth="4" strokeLinejoin="round" />
                </svg>
                {/* sceau de cire */}
                <motion.div className="absolute left-1/2 top-[95px] -translate-x-1/2" animate={{ opacity: ouvert ? 0 : 1, scale: ouvert ? 0.6 : 1 }} transition={{ duration: 0.3 }}>
                  <div className="grid h-20 w-20 place-items-center rounded-full border-[4px] border-noir bg-rose shadow-petite">
                    <BaronHead className="h-12 w-12" />
                  </div>
                </motion.div>
              </motion.div>
              {/* carte */}
              <motion.div
                className="relative z-10 mx-4 rounded-2xl border-[3px] border-noir bg-creme p-6 text-center sm:mx-10 sm:p-10"
                initial={reduit ? false : { y: 60 }} animate={{ y: ouvert ? -60 : 60 }} transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.7 }}
              >
                <div className="pointer-events-none absolute inset-2 rounded-xl border-2 border-or" aria-hidden />
                <BaronHead className="mx-auto h-16 w-16" />
                <p className="mt-4 font-titre text-2xl italic leading-snug lg:text-3xl">
                  Le Baron Biscotte a l'honneur de recevoir <strong className="font-black not-italic text-bordeaux">{conf.chien}</strong> pour son grand soir du <strong className="font-black not-italic">{dateLongue(depuisIso(conf.dateEvenement))}</strong>.
                </p>
                <p className="mt-4 text-lg">Votre tenue arrivera le <strong>{dateLongue(depuisIso(conf.dateLivraison))}</strong>.</p>
                <p className="mt-6 inline-block rounded-pilule border-[3px] border-noir bg-jaune px-5 py-2 font-extrabold tracking-wide">N° de réservation : {conf.numero}</p>
              </motion.div>
            </div>
          </div>

          {/* Récapitulatif */}
          <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} aria-labelledby="recap-titre" className="mx-auto mt-10 max-w-2xl rounded-rayon border-[3px] border-noir bg-creme p-6 shadow-dure">
            <h2 id="recap-titre" className="font-titre text-2xl font-black">Récapitulatif</h2>
            <ul className="mt-4 divide-y-2 divide-noir/10">
              {conf.articles.map((a, i) => (
                <li key={i} className="flex justify-between gap-4 py-3">
                  <span><strong>{a.nom}</strong> · taille {a.taille}{a.options.length > 0 && <span className="text-sm text-noir/70"> · {a.options.join(', ')}</span>}</span>
                  <span className="font-bold">{euros(a.prix)}</span>
                </li>
              ))}
            </ul>
            <p className={cx('mt-3 flex justify-between border-t-[3px] border-noir pt-3 font-titre text-2xl font-black')}><span>Total</span><span>{euros(conf.total)}</span></p>
            <p className="mt-2 text-sm text-noir/75">Caution : {euros(conf.caution)} (empreinte bancaire, non débitée). Un e-mail de confirmation (simulé) vous a été envoyé.</p>
          </motion.section>

          <div className="mt-10 text-center"><ButtonLink to="/" variante="jaune" taille="lg">Retour au Grand Hall</ButtonLink></div>
        </div>
      </div>
    </>
  );
}
