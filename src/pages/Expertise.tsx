import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { useRef } from 'react';
import { Check, Droplets, Heart, Recycle, Scissors, Shield, Sparkles, Shirt, Search, Wind, Package, Ruler, Factory, HandHeart } from 'lucide-react';
import { Seo } from '@/components/ui/Seo';
import { PageHeader } from '@/components/ui/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { Cascade, Reveal, enfant } from '@/components/ui/Reveal';
import { ImagePlaceholder, ProductImage } from '@/components/ui/ProductImage';
import { ScallopDivider } from '@/components/brand/ScallopDivider';
import { Baron, Praline, SilhouetteChien } from '@/components/brand/illustrations';
import { cx } from '@/lib/format';

const SAVOIR = [
  { t: 'La coupe', d: 'Des patrons développés pour 7 tailles et adaptés aux morphologies : torse large du bouledogue, dos long du teckel, finesse du lévrier.', c: 'bg-rose', i: Scissors },
  { t: 'Les matières', d: 'Velours, satin, tulle et brocart choisis pour leur tenue et leur douceur ; doublures respirantes, aucune étiquette qui gratte.', c: 'bg-jaune', i: Shirt },
  { t: 'Le confort', d: 'Scratchs silencieux, coutures plates, ouverture pour le harnais, liberté de mouvement testée sur nos chiens essayeurs.', c: 'bg-bleu', i: Heart },
  { t: 'La sécurité', d: 'Aucun petit élément qui se détache, fermoirs de sécurité sur les bijoux, colorants certifiés.', c: 'bg-vert', i: Shield },
];

const PARCOURS = [
  { t: 'Retour à l\'Atelier et inspection.', i: Search },
  { t: 'Nettoyage professionnel à basse température, produits hypoallergéniques et sans parfum.', i: Droplets },
  { t: 'Séchage et repassage vapeur.', i: Wind },
  { t: 'Contrôle qualité en 12 points (coutures, fermetures, accessoires, odeurs, poils).', i: Check },
  { t: 'Retouche si besoin par nos couturières.', i: Ruler },
  { t: 'Mise sous housse, boîte à chapeau, prête pour le prochain grand soir.', i: Package },
];

const EQUIPE = [
  { n: 'Margot', r: 'Cofondatrice et directrice de la création', chien: 'avec Biscotte, teckel', c: 'rose' },
  { n: 'Léon', r: 'Cofondateur et maître couturier', chien: 'avec Câline, carlin', c: 'jaune' },
  { n: 'Yasmine', r: 'Responsable de l\'Atelier', chien: 'avec Sirius, lévrier', c: 'bleu' },
  { n: 'Théo', r: 'Conciergerie et service client', chien: 'avec Pompon, bichon', c: 'vert' },
] as const;

function Frise() {
  const ref = useRef<HTMLDivElement>(null);
  const reduit = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], reduit ? ['0%', '0%'] : ['0%', '-62%']);
  const barre = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const couleurs = ['bg-rose', 'bg-bleu', 'bg-jaune', 'bg-vert', 'bg-orange', 'bg-creme'];
  const carte = (e: (typeof PARCOURS)[number], i: number) => (
    <div className={cx('flex h-full flex-col gap-4 rounded-rayon border-[3px] border-noir p-7 shadow-dure', couleurs[i])}>
      <span className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-noir bg-creme"><e.i size={28} strokeWidth={2.5} aria-hidden /></span>
      <p className="font-titre text-[64px] font-black leading-none">0{i + 1}</p>
      <p className="text-lg font-semibold">{e.t}</p>
    </div>
  );
  return (
    <>
      {/* Mobile et tablette : liste verticale */}
      <ol className="mt-12 grid gap-6 lg:hidden">
        {PARCOURS.map((e, i) => <Reveal as="li" key={i} delai={i * 0.05}>{carte(e, i)}</Reveal>)}
      </ol>
      {/* Ordinateur : frise horizontale épinglée */}
      <div ref={ref} className="relative mt-4 hidden lg:block" style={{ height: '260vh' }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.ol className="flex w-max gap-8 pl-[max(48px,calc((100vw-1280px)/2+48px))]" style={{ x }}>
            {PARCOURS.map((e, i) => <li key={i} className="h-[420px] w-[380px] shrink-0">{carte(e, i)}</li>)}
          </motion.ol>
          <div className="mx-auto mt-10 h-1.5 w-full max-w-[1184px] overflow-hidden rounded-full bg-noir/15" aria-hidden>
            <motion.div className="h-full bg-noir" style={{ width: barre }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function Expertise() {
  return (
    <>
      <Seo titre="L'Atelier — Notre savoir-faire · Maison Babines" description="Coupe, matières, hygiène : découvrez comment nos tenues sont conçues et contrôlées." />
      <PageHeader
        fond="bg-bordeaux" couleurFeston="var(--bordeaux)" clair surtitre="L'Atelier"
        miettes={[{ label: 'Accueil', to: '/' }, { label: 'Notre expertise' }]}
        titre="Du sérieux sous les paillettes"
        sousTitre="Chaque tenue est dessinée, coupée et contrôlée comme une pièce de haute couture. Seul le client a quatre pattes."
        illustration={<Praline pose="couture" className="w-full" />}
      />

      {/* Notre histoire */}
      <section className="section bg-creme pt-24 lg:pt-32" aria-labelledby="histoire-titre">
        <div className="conteneur grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <motion.div whileHover={{ rotate: -1 }} className="rotate-2 overflow-hidden rounded-rayon border-[3px] border-noir shadow-[10px_10px_0_var(--noir)]">
              <ProductImage src="/images/hero/atelier.webp" alt="L'atelier de couture Maison Babines à Lyon" couleur="jaune" className="aspect-[4/3]" />
            </motion.div>
          </Reveal>
          <Reveal delai={0.1}>
            <SplitTitle id="histoire-titre" texte="Notre histoire" />
            <p className="mt-6 text-lg leading-relaxed">
              Tout a commencé au mariage de Margot, en 2024. Son teckel, Biscotte, portait un nœud pap' acheté la veille, trois tailles trop grand. Le soir même, avec Léon, couturier de métier, ils dessinaient le premier smoking pour chien qui se loue. Biscotte est devenu Baron, et l'Atelier a ouvert ses portes à Lyon.
            </p>
            <p className="mt-3 text-sm text-noir/60">(histoire et fondateurs fictifs)</p>
          </Reveal>
        </div>
      </section>

      {/* Savoir-faire */}
      <section className="section bg-creme pt-0 lg:pt-0" aria-labelledby="sf-titre">
        <div className="conteneur">
          <Reveal><SplitTitle id="sf-titre" texte="Nos savoir-faire" /></Reveal>
          <Cascade as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SAVOIR.map((s) => (
              <motion.li key={s.t} variants={enfant} whileHover={{ y: -6, rotate: -1 }} className={cx('rounded-rayon border-[3px] border-noir p-6 shadow-dure', s.c)}>
                <span className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-noir bg-creme"><s.i size={26} strokeWidth={2.5} aria-hidden /></span>
                <h3 className="mt-5 text-[26px] lg:text-[28px]">{s.t}</h3>
                <p className="mt-3">{s.d}</p>
              </motion.li>
            ))}
          </Cascade>
        </div>
      </section>

      {/* Parcours d'une tenue */}
      <section className="relative bg-creme" aria-labelledby="parcours-titre">
        <div className="conteneur section pt-0 lg:pt-0">
          <Reveal><SplitTitle id="parcours-titre" texte="Le parcours d'une tenue" /></Reveal>
        </div>
        <Frise />
      </section>

      {/* Chiffres */}
      <section className="relative bg-jaune" aria-labelledby="chiffres-titre">
        <ScallopDivider couleur="var(--creme)" />
        <div className="conteneur section">
          <Reveal><SplitTitle id="chiffres-titre" className="text-center" texte="Les chiffres de l'Atelier" /></Reveal>
          <Cascade as="ul" className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { v: 3200, s: '', t: 'chiens habillés' },
              { v: 1150, s: '', t: 'mariages' },
              { v: 12, s: '', t: 'points de contrôle par tenue' },
              { v: 98, s: ' %', t: 'de tailles justes du premier coup' },
            ].map((c) => (
              <motion.li key={c.t} variants={enfant} className="rounded-rayon border-[3px] border-noir bg-creme p-6 text-center shadow-dure">
                <p className="font-titre text-[44px] font-black leading-none lg:text-[64px]"><Counter valeur={c.v} suffixe={c.s} /></p>
                <p className="mt-2 font-semibold">{c.t}</p>
              </motion.li>
            ))}
          </Cascade>
          <p className="mt-6 text-center text-sm">Chiffres fictifs.</p>
        </div>
      </section>

      {/* Engagements */}
      <section className="relative bg-creme" aria-labelledby="eng-titre">
        <ScallopDivider couleur="var(--jaune)" />
        <div className="conteneur section">
          <Reveal><SplitTitle id="eng-titre" texte="Nos engagements" /></Reveal>
          <Cascade as="ul" className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { t: 'Louer plutôt qu\'acheter', d: 'Une tenue sert en moyenne 40 fois.', i: Recycle },
              { t: 'Fabriqué en France', d: 'Ateliers partenaires à Lyon et Roanne (fictif).', i: Factory },
              { t: 'Matières recyclées', d: 'Pour les satins et doublures.', i: Sparkles },
              { t: 'Fin de vie', d: 'Les tenues retirées sont données à des refuges ou recyclées.', i: HandHeart },
            ].map((e) => (
              <motion.li key={e.t} variants={enfant} className="flex gap-5 rounded-rayon border-[3px] border-noir bg-white p-6">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-[3px] border-noir bg-vert"><e.i size={24} strokeWidth={2.5} aria-hidden /></span>
                <div><h3 className="text-[24px]">{e.t}</h3><p className="mt-1">{e.d}</p></div>
              </motion.li>
            ))}
          </Cascade>
        </div>
      </section>

      {/* Équipe */}
      <section className="section bg-creme pt-0 lg:pt-0" aria-labelledby="equipe-titre">
        <div className="conteneur">
          <Reveal><SplitTitle id="equipe-titre" texte="L'équipe" /><p className="mt-3 text-noir/70">Portraits fictifs, chacun avec son chien.</p></Reveal>
          <Cascade as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EQUIPE.map((m) => (
              <motion.li key={m.n} variants={enfant} className="overflow-hidden rounded-rayon border-[3px] border-noir bg-creme shadow-dure">
                <div className="relative aspect-square border-b-[3px] border-noir">
                  <ImagePlaceholder alt={`Portrait illustré de ${m.n} ${m.chien}`} couleur={m.c} />
                  <svg viewBox="0 0 100 100" aria-hidden className="absolute bottom-0 left-[8%] w-[46%]">
                    <circle cx="50" cy="34" r="20" fill="#E9A66B" stroke="#1E1430" strokeWidth="3" />
                    <path d="M14 100 C14 70 30 58 50 58 C70 58 86 70 86 100Z" fill="#6B1E3F" stroke="#1E1430" strokeWidth="3" />
                    <path d="M30 30 C30 10 70 10 70 30 C62 22 40 22 30 30Z" fill="#1E1430" />
                  </svg>
                </div>
                <div className="p-5">
                  <h3 className="text-[26px]">{m.n}</h3>
                  <p className="font-semibold">{m.r}</p>
                  <p className="mt-1 text-sm text-noir/70">{m.chien}</p>
                </div>
              </motion.li>
            ))}
          </Cascade>
        </div>
      </section>

      {/* Offre Pro */}
      <section id="offre-pro" className="relative scroll-mt-24 bg-bleu" aria-labelledby="pro-titre">
        <ScallopDivider couleur="var(--creme)" />
        <div className="conteneur section grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <p className="surtitre">Offre Pro</p>
            <SplitTitle id="pro-titre" className="mt-3" texte="Wedding planners, photographes, agences : travaillons ensemble." />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {['Interlocuteur dédié', 'Réservations multiples', 'Tarifs négociés', 'Facturation mensuelle'].map((x) => (
                <li key={x} className="flex items-center gap-3 rounded-2xl border-[3px] border-noir bg-creme px-4 py-3 font-bold">
                  <Check size={20} strokeWidth={3} aria-hidden className="text-vert" /> {x}
                </li>
              ))}
            </ul>
            <ButtonLink to="/contact?sujet=pro" taille="lg" className="mt-8">Demander un devis</ButtonLink>
          </Reveal>
          <Reveal delai={0.1} className="relative mx-auto w-full max-w-sm">
            <div className="rounded-rayon border-[3px] border-noir bg-creme p-6 shadow-dure">
              <SilhouetteChien className="mx-auto h-24 w-24 text-bordeaux" />
              <p className="mt-3 text-center font-titre text-2xl italic">« Fiables, réactifs, et la ligne SOS Tenue m'a sauvée un vendredi soir. »</p>
              <p className="mt-2 text-center text-sm font-bold">— Léa, wedding planner, Bordeaux</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Appel final */}
      <section className="relative bg-creme" aria-labelledby="final-titre">
        <ScallopDivider couleur="var(--bleu)" />
        <div className="conteneur section flex flex-col items-center text-center">
          <Baron pose="salue" className="w-full max-w-md" />
          <Reveal><SplitTitle id="final-titre" className="mt-6" texte="Prêt pour le grand soir ?" /></Reveal>
          <ButtonLink to="/catalogue" taille="lg" className="mt-8">Découvrir le Grand Dressing</ButtonLink>
        </div>
      </section>
    </>
  );
}
