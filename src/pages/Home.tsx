import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { addDays, addMonths } from 'date-fns';
import { ArrowRight, Hash, Search } from 'lucide-react';
import { OCCASIONS, prixDesOccasion } from '@/data/occasions';
import { products } from '@/data/products';
import { reviews, NOTE_GLOBALE } from '@/data/reviews';
import { CHARACTERS } from '@/data/characters';
import { TAILLES } from '@/data/sizes';
import { FOND } from '@/lib/couleurs';
import { cx, isoJour } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { Button, ButtonLink, classesBouton } from '@/components/ui/Button';
import { Carousel } from '@/components/ui/Carousel';
import { Counter } from '@/components/ui/Counter';
import { RatingStars } from '@/components/ui/RatingStars';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { ProductImage } from '@/components/ui/ProductImage';
import { Cascade, Reveal, enfant } from '@/components/ui/Reveal';
import { CHEVRON } from '@/components/form/Field';
import { Sticker } from '@/components/brand/Sticker';
import { Marquee } from '@/components/brand/Marquee';
import { ScallopDivider } from '@/components/brand/ScallopDivider';
import { CharacterCard } from '@/components/brand/CharacterCard';
import { Baron, Flamant, Hibou, Homard, Moustache, Tonnerre } from '@/components/brand/illustrations';
import { ProductCard } from '@/components/product/ProductCard';
import { SizeGuideModal } from '@/components/product/SizeGuide';
import { NewsletterForm } from '@/components/layout/NewsletterForm';
import { ScrollStory } from '@/components/motion/ScrollStory';
import { SplitTitle } from '@/components/motion/SplitTitle';

const TITRE = ['Le', 'grand', 'soir,', 'à', 'quatre', 'pattes.'];

/* ------------------------------------------------------------------ */
/* 2. Hero                                                             */
/* ------------------------------------------------------------------ */
function Hero() {
  const nav = useNavigate();
  const reduit = useReducedMotion();
  const [occasion, setOccasion] = useState('');
  const [date, setDate] = useState('');
  const [taille, setTaille] = useState('');
  const [guide, setGuide] = useState(false);
  const { scrollY } = useScroll();
  const yBaron = useTransform(scrollY, [0, 600], [0, reduit ? 0 : 80]);
  const rotRayons = useTransform(scrollY, [0, 600], [0, reduit ? 0 : 40]);

  const chercher = (e: FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (occasion) p.set('occasion', occasion);
    if (taille && taille !== 'inconnue') p.set('taille', taille.toLowerCase());
    if (date) p.set('date', date);
    nav(`/catalogue${p.toString() ? `?${p}` : ''}`);
  };

  const champ = 'h-[52px] w-full rounded-[14px] border-[3px] border-noir bg-white px-4 font-semibold focus:outline-none focus:ring-[3px] focus:ring-jaune';
  const etiquette = 'mb-2 block h-6 text-[15px] font-extrabold leading-6';

  return (
    <section className="relative overflow-hidden bg-rose" aria-labelledby="hero-titre">
      {/* damier discret en bas */}
      <div aria-hidden className="damier absolute inset-x-0 bottom-0 h-40 opacity-[0.12] [mask-image:linear-gradient(to_top,black,transparent)]" />
      <div className="conteneur relative grid min-h-[calc(100svh-116px)] items-center gap-6 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:pb-20">
        {/* Illustration : au-dessus du titre sur mobile */}
        <motion.div className="relative mx-auto w-full max-w-[220px] sm:max-w-[320px] lg:col-start-2 lg:row-start-1 lg:max-w-[560px]" style={{ y: yBaron }}>
          <div className="relative aspect-square">
            <motion.svg viewBox="0 0 400 400" aria-hidden className="rayons absolute inset-0 h-full w-full" style={{ rotate: rotRayons }}>
              <circle cx="200" cy="200" r="190" fill="#FFC93C" stroke="#1E1430" strokeWidth="4" />
              {Array.from({ length: 16 }, (_, i) => (
                <path key={i} d="M200 200 L190 12 L210 12Z" fill="#FFF6EA" transform={`rotate(${i * 22.5} 200 200)`} />
              ))}
              <circle cx="200" cy="200" r="190" fill="none" stroke="#1E1430" strokeWidth="4" />
            </motion.svg>
            <div className="damier absolute bottom-[8%] left-[6%] right-[6%] h-[22%] rounded-[50%] border-[4px] border-noir" aria-hidden />
            <motion.div
              className="absolute inset-x-[-4%] bottom-[12%]"
              initial={reduit ? false : { x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.5 }}
            >
              <Baron className="w-full drop-shadow-[6px_6px_0_rgba(30,20,48,0.25)]" />
            </motion.div>
            {[
              { t: 'Taille garantie', c: 'bg-bleu', cls: 'left-[2%] top-[4%]', a: -8, d: 0 },
              { t: 'Nettoyage inclus', c: 'bg-vert', cls: 'right-[-2%] top-[0%]', a: 6, d: 0.8 },
              { t: 'Dès 19 €', c: 'bg-jaune', cls: 'right-[6%] bottom-[0%]', a: -4, d: 1.6 },
            ].map((s) => (
              <motion.span
                key={s.t}
                className={cx('flotte absolute z-10 rounded-pilule border-[3px] border-noir px-4 py-1.5 text-sm font-extrabold uppercase tracking-wide shadow-petite lg:text-base', s.c, s.cls)}
                style={{ ['--r' as string]: `${s.a}deg`, animationDelay: `${s.d}s` }}
                initial={reduit ? false : { scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 16, delay: 1 + s.d / 2 }}
              >
                {s.t}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 lg:col-start-1 lg:row-start-1">
          <Sticker couleur="bg-jaune" angle={-5} className="text-lg lg:text-2xl" as="p">Bienvenue au Grand Hôtel</Sticker>
          <h1 id="hero-titre" className="mt-6 text-[56px] leading-[0.95] sm:text-[72px] lg:text-[96px] xl:text-[108px]">
            {TITRE.map((m, i) => (
              <motion.span
                key={i} className={cx('mr-[0.22em] inline-block', m === 'pattes.' && 'italic')}
                initial={reduit ? false : { opacity: 0, y: 50, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.15 + i * 0.12 }}
              >
                {m}
              </motion.span>
            ))}
          </h1>
          <motion.p className="mt-6 max-w-xl text-lg font-semibold lg:text-xl" initial={reduit ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95, duration: 0.5 }}>
            Smokings, robes de mariée et capes royales à louer pour votre chien. Livrés 3 jours avant, récupérés sans lavage.
          </motion.p>
        </div>

        {/* Moteur de recherche : tous les champs alignés sur la même ligne de base */}
        <motion.form
          onSubmit={chercher} role="search" aria-label="Trouver une tenue"
          className="relative z-10 rounded-rayon border-[3px] border-noir bg-creme p-5 shadow-dure lg:col-span-2 lg:p-6"
          initial={reduit ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 1.1 }}
        >
          <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <div>
              <label htmlFor="h-occ" className={etiquette}>Mon occasion</label>
              <select id="h-occ" value={occasion} onChange={(e) => setOccasion(e.target.value)} className={cx(champ, 'appearance-none bg-[length:20px] bg-[right_14px_center] bg-no-repeat pr-11')} style={{ backgroundImage: CHEVRON }}>
                <option value="">Toutes les occasions</option>
                {OCCASIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="h-date" className={etiquette}>Date de l'événement</label>
              <input id="h-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={isoJour(addDays(new Date(), 3))} max={isoJour(addMonths(new Date(), 6))} className={cx(champ, !date && 'text-noir/60')} />
            </div>
            <div>
              <label htmlFor="h-taille" className={etiquette}>Taille de mon chien</label>
              <select
                id="h-taille" value={taille}
                onChange={(e) => { if (e.target.value === 'inconnue') { setGuide(true); setTaille(''); } else setTaille(e.target.value); }}
                className={cx(champ, 'appearance-none bg-[length:20px] bg-[right_14px_center] bg-no-repeat pr-11')} style={{ backgroundImage: CHEVRON }}
              >
                <option value="">Toutes les tailles</option>
                {TAILLES.map((t) => <option key={t} value={t}>{t}</option>)}
                <option value="inconnue">Je ne sais pas</option>
              </select>
            </div>
            <Button type="submit" className="h-[52px] min-h-0 sm:col-span-2 lg:col-span-1" icone={<Search size={18} strokeWidth={2.75} aria-hidden />}>Trouver sa tenue</Button>
          </div>
        </motion.form>
        <div className="relative z-10 -mt-2 lg:col-span-2">
          <a href="#comment-ca-marche" className={classesBouton('secondaire')}>Comment ça marche ?</a>
        </div>
      </div>
      <SizeGuideModal ouvert={guide} fermer={() => setGuide(false)} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Comment ça marche                                                */
/* ------------------------------------------------------------------ */
const ETAPES = [
  { t: 'Choisissez', d: 'Une tenue, une taille, une date. Le Baron s\'occupe du reste.', pose: 'debout' },
  { t: 'Recevez', d: 'Livraison 3 jours avant le jour J, dans sa boîte à chapeau.', pose: 'court' },
  { t: 'Brillez', d: 'Photos, applaudissements, éventuellement quelques larmes.', pose: 'debout' },
  { t: 'Renvoyez', d: 'Sans lavage, avec l\'étiquette prépayée. On s\'occupe du pressing.', pose: 'court' },
];

function CommentCaMarche() {
  return (
    <section id="comment-ca-marche" className="section scroll-mt-24 bg-creme" aria-labelledby="ccm-titre">
      <div className="conteneur">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SplitTitle id="ccm-titre" texte="Quatre étapes, zéro stress" />
        </Reveal>
        <Cascade as="ul" className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ETAPES.map((e, i) => (
            <motion.li key={e.t} variants={enfant} className="relative">
              <div className="group flex h-full flex-col rounded-rayon border-[3px] border-noir bg-bleu p-6 shadow-dure transition hover:-translate-y-1 hover:rotate-1 hover:shadow-survol">
                <span className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-noir bg-creme font-titre text-3xl font-black">{i + 1}</span>
                <Tonnerre pose={e.pose} className={cx('mx-auto -mb-2 mt-2 h-44 transition-transform duration-300 group-hover:scale-105', i % 2 === 1 && 'scale-x-[-1] group-hover:scale-x-[-1.05]')} />
                <h3 className="mt-2 text-[28px] lg:text-[30px]">{e.t}</h3>
                <p className="mt-2">{e.d}</p>
              </div>
            </motion.li>
          ))}
        </Cascade>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Par occasion                                                     */
/* ------------------------------------------------------------------ */
function OccasionCard({ o }: { o: (typeof OCCASIONS)[number] }) {
  return (
    <Link to={`/catalogue?occasion=${o.id}`} className="group block h-full overflow-hidden rounded-rayon border-[3px] border-noir shadow-dure transition duration-200 hover:-translate-y-1 hover:-rotate-1 hover:shadow-survol" style={{ background: FOND[o.couleur] }}>
      <ProductImage src={`/images/occasions/${o.id}.svg`} alt={`Chien habillé pour : ${o.label}`} couleur={o.couleur} className="aspect-[4/3] border-b-[3px] border-noir" imgClassName="group-hover:scale-105" />
      <div className="flex items-center justify-between gap-3 bg-creme p-5">
        <div>
          <h3 className="text-[24px] lg:text-[28px]">{o.label}</h3>
          <p className="mt-1 inline-block rounded-full border-2 border-noir bg-jaune px-2.5 py-0.5 text-sm font-extrabold">dès {prixDesOccasion(o.id)} €</p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-[3px] border-noir bg-creme transition-transform duration-300 group-hover:-rotate-45 group-hover:bg-rose" aria-hidden>
          <ArrowRight strokeWidth={2.75} size={20} />
        </span>
      </div>
    </Link>
  );
}

function ParOccasion() {
  return (
    <section className="section bg-creme pt-0 lg:pt-0" aria-labelledby="occ-titre">
      <div className="conteneur">
        <Reveal><SplitTitle id="occ-titre" className="text-center" texte="Pour quelle grande occasion ?" /></Reveal>
        <Cascade className="mt-12 hidden gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((o) => <motion.div key={o.id} variants={enfant}><OccasionCard o={o} /></motion.div>)}
        </Cascade>
        <div className="mt-10 sm:hidden">
          <Carousel label="Occasions" largeur="w-[82%]" fleches={false}>
            {OCCASIONS.map((o) => <OccasionCard key={o.id} o={o} />)}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Les stars du moment                                              */
/* ------------------------------------------------------------------ */
function Stars() {
  const stars = ['le-smoking-baron', 'le-pull-de-fete-biscotte', 'la-robe-meringue', 'la-cape-tapis-rouge', 'la-chemise-flamant', 'le-porte-alliances-coussin']
    .map((s) => products.find((p) => p.slug === s)!);
  return (
    <section className="relative bg-jaune" aria-labelledby="stars-titre">
      <ScallopDivider couleur="var(--creme)" />
      <div className="conteneur section">
        <Reveal className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SplitTitle id="stars-titre" className="max-w-2xl" texte="Les pièces qui font tourner les têtes" />
          <Link to="/catalogue" className="hidden items-center gap-2 font-extrabold hover:underline lg:inline-flex">Tout voir <ArrowRight size={18} strokeWidth={2.5} aria-hidden /></Link>
        </Reveal>
        <Reveal delai={0.1} className="mt-12">
          <Carousel label="Les pièces qui font tourner les têtes">
            {stars.map((p) => <ProductCard key={p.id} produit={p} />)}
          </Carousel>
        </Reveal>
        <div className="mt-10 text-center">
          <ButtonLink to="/catalogue" variante="secondaire" taille="lg">Voir tout le Grand Dressing</ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Pack Mariage                                                     */
/* ------------------------------------------------------------------ */
function PackMariage() {
  const reduit = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-bordeaux text-creme" aria-labelledby="pack-titre">
      <ScallopDivider couleur="var(--jaune)" />
      <div className="conteneur section grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="surtitre text-jaune">Pack Mariage · 1 tenue Gala + porte-alliances + accessoire + assurance</p>
          <SplitTitle id="pack-titre" className="mt-4 text-[56px] italic lg:text-[96px]" texte="Oui, je wouf." />
          <p className="mt-6 max-w-lg text-lg lg:text-xl">
            Smoking ou robe, porte-alliances, accessoire et assurance : tout pour que votre chien ne vole pas la vedette… enfin, un peu quand même. 149 € au lieu de 186 €.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <ButtonLink to="/catalogue?occasion=mariage" taille="lg">Découvrir le pack</ButtonLink>
            <p className="font-titre text-3xl font-black"><span className="text-xl text-creme/60 line-through">186 €</span> 149 €</p>
          </div>
        </Reveal>
        <motion.div
          className="relative mx-auto w-full max-w-md"
          initial={reduit ? false : { rotate: 8, opacity: 0, y: 40 }} whileInView={{ rotate: 3, opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 90, damping: 14 }}
        >
          <div className="overflow-hidden rounded-rayon border-[3px] border-noir bg-creme p-3 shadow-[10px_10px_0_var(--noir)]">
            <ProductImage src="/images/produits/le-porte-alliances-coussin-1.svg" alt="Chien en smoking portant un coussin d'alliances" couleur="rose" className="aspect-[4/5] rounded-2xl border-[3px] border-noir" />
            <p className="px-2 pb-1 pt-3 text-center font-titre text-xl italic text-noir">Pistache, porteur d'alliances</p>
          </div>
          <Sticker couleur="bg-jaune" angle={-10} className="absolute -left-6 -top-5 text-xl">-20 %</Sticker>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Le personnel                                                     */
/* ------------------------------------------------------------------ */
function Personnel() {
  return (
    <section className="relative overflow-hidden bg-creme" aria-labelledby="perso-titre">
      <ScallopDivider couleur="var(--bordeaux)" />
      <div className="conteneur section relative">
        <Flamant className="pointer-events-none absolute -left-4 top-24 hidden w-24 -rotate-6 opacity-90 xl:block" />
        <Hibou className="pointer-events-none absolute right-6 top-16 hidden w-20 rotate-6 xl:block" />
        <Homard className="pointer-events-none absolute bottom-10 right-0 hidden w-24 xl:block" />
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="surtitre text-bordeaux">Bienvenue au Grand Hôtel</p>
          <SplitTitle id="perso-titre" className="mt-3" texte="Le personnel vous attend" />
          <p className="mt-4 text-noir/75">Survolez (ou touchez) une carte pour faire connaissance.</p>
        </Reveal>
        <Cascade as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {CHARACTERS.map((c) => (
            <motion.li key={c.id} variants={enfant}><CharacterCard {...c} /></motion.li>
          ))}
        </Cascade>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Pourquoi louer                                                   */
/* ------------------------------------------------------------------ */
function PourquoiLouer() {
  return (
    <section className="relative bg-vert" aria-labelledby="louer-titre">
      <ScallopDivider couleur="var(--creme)" />
      <div className="conteneur section">
        <Reveal><SplitTitle id="louer-titre" className="mx-auto max-w-3xl text-center" texte="Le luxe d'un jour, sans le placard plein" /></Reveal>
        <Cascade as="ul" className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { v: 70, pre: "jusqu'à ", suf: ' %', t: "moins cher qu'un achat" },
            { v: 40, pre: '', suf: '', t: 'chiens en moyenne portent chaque tenue (fictif)' },
            { v: 0, pre: '', suf: '', t: 'lavage pour vous' },
          ].map((c) => (
            <motion.li key={c.t} variants={enfant} className="rounded-rayon border-[3px] border-noir bg-creme p-8 text-center shadow-dure">
              <p className="font-titre text-[64px] font-black leading-none lg:text-[88px]">
                {c.pre && <span className="block text-lg font-semibold">{c.pre.trim()}</span>}
                <Counter valeur={c.v} suffixe={c.suf} />
              </p>
              <p className="mt-3 text-lg font-semibold">{c.t}</p>
            </motion.li>
          ))}
        </Cascade>
        <Reveal delai={0.2}>
          <p className="mx-auto mt-12 max-w-2xl text-center font-titre text-2xl italic lg:text-3xl">
            Une tenue de cérémonie sert une fois. Chez nous, elle sert des dizaines de fois, et elle est toujours impeccable.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Le Livre d'or                                                   */
/* ------------------------------------------------------------------ */
function LivreDor() {
  const extraits = [reviews[0], reviews[1], reviews[2], reviews[3]];
  const fonds = ['bg-rose', 'bg-bleu', 'bg-jaune', 'bg-orange'];
  return (
    <section className="relative bg-creme" aria-labelledby="ldo-titre">
      <ScallopDivider couleur="var(--vert)" />
      <div className="conteneur section">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <SplitTitle id="ldo-titre" texte="Ils sont venus, ils ont brillé" />
            <p className="mt-4 flex flex-wrap items-center gap-3 text-lg font-semibold">
              <RatingStars note={NOTE_GLOBALE.note} taille={26} />
              <span>4,8/5 · 1 243 avis <span className="text-sm text-noir/60">(fictif)</span></span>
            </p>
          </Reveal>
          <Reveal delai={0.15} className="flex items-end gap-3">
            <div className="relative mb-16 rounded-[20px] border-[3px] border-noir bg-creme px-4 py-3 font-titre text-lg italic shadow-petite">
              Pfff. Ils sont bien, d'accord.
              <span aria-hidden className="absolute -bottom-[14px] right-6 h-6 w-6 rotate-45 border-b-[3px] border-r-[3px] border-noir bg-creme" />
            </div>
            <Moustache className="w-32 shrink-0 lg:w-40" />
          </Reveal>
        </div>
        <Reveal delai={0.1} className="mt-10">
          <Carousel label="Avis clients" largeur="w-[86%] sm:w-[47%] lg:w-[31.5%]">
            {extraits.map((a, i) => <ReviewCard key={a.id} avis={a} fond={fonds[i]} compact />)}
          </Carousel>
        </Reveal>
        <div className="mt-8 text-center"><Link to="/avis" className="lien text-lg">Lire tous les avis</Link></div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Mur #BabinesDeGala                                              */
/* ------------------------------------------------------------------ */
function Mur() {
  const couleurs = ['rose', 'jaune', 'bleu', 'vert', 'orange', 'bordeaux', 'jaune', 'rose'] as const;
  const angles = [-4, 3, -2, 5, -5, 2, -3, 4];
  const reduit = useReducedMotion();
  return (
    <section className="section bg-creme pt-0 lg:pt-0" aria-labelledby="mur-titre">
      <div className="conteneur">
        <Reveal className="text-center">
          <p className="surtitre inline-flex items-center gap-1 text-bordeaux"><Hash size={16} strokeWidth={3} aria-hidden />BabinesDeGala</p>
          <SplitTitle id="mur-titre" className="mt-3" texte="Vos chiens, nos stars" />
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-4">
          {couleurs.map((c, i) => (
            <motion.li
              key={i}
              initial={reduit ? false : { opacity: 0, y: 40, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: angles[i] }}
              viewport={{ once: true, margin: '-40px' }} transition={{ type: 'spring', stiffness: 120, damping: 14, delay: (i % 4) * 0.08 }}
              whileHover={reduit ? undefined : { rotate: 0, scale: 1.05, zIndex: 2 }}
              className="relative rounded-md border-[3px] border-noir bg-white p-2.5 pb-10 shadow-dure"
            >
              <ProductImage src={`/images/mur/babines-0${i + 1}.webp`} alt={`Photo client #BabinesDeGala n°${i + 1} : chien habillé en fête`} couleur={c} className="aspect-square border-2 border-noir" />
              <span className="absolute bottom-2 left-3 font-accent text-sm text-bordeaux" aria-hidden>#BabinesDeGala</span>
            </motion.li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <a href="#" className={classesBouton('secondaire', 'lg')} aria-label="Partagez avec #BabinesDeGala (lien factice vers Instagram)">Partagez avec #BabinesDeGala</a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 12. Newsletter                                                      */
/* ------------------------------------------------------------------ */
function Newsletter() {
  return (
    <section className="relative bg-rose pb-28" aria-labelledby="nl-titre">
      <ScallopDivider couleur="var(--creme)" />
      <div className="conteneur section grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <SplitTitle id="nl-titre" texte="La Gazette du Grand Hôtel" />
          <p className="mt-4 max-w-lg text-lg">Nouvelles collections, coulisses de l'Atelier et -10 % sur votre première location.</p>
        </Reveal>
        <Reveal delai={0.1}>
          <div className="rounded-rayon border-[3px] border-noir bg-creme p-6 shadow-dure">
            <NewsletterForm source="accueil" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        titre="Maison Babines — Location de tenues de luxe pour chiens"
        description="Smokings, robes de mariée et capes royales à louer pour votre chien. Livraison 3 jours avant, nettoyage inclus."
        jsonLd={{
          '@context': 'https://schema.org', '@type': 'Organization', name: 'Maison Babines',
          url: typeof location !== 'undefined' ? location.origin : '', logo: '/favicon.svg', slogan: 'Le grand soir, à quatre pattes.',
          address: { '@type': 'PostalAddress', streetAddress: '12 rue des Petits-Chiens', postalCode: '69002', addressLocality: 'Lyon', addressCountry: 'FR' },
          email: 'bonjour@maisonbabines.fr',
        }}
      />
      <Hero />
      <Marquee items={['Mariage', 'Gala', 'Baptême', 'Noël', 'Anniversaire', 'Tapis rouge', 'Tenue de soirée exigée, laisse comprise']} />
      <ScrollStory />
      <CommentCaMarche />
      <ParOccasion />
      <Stars />
      <PackMariage />
      <Personnel />
      <PourquoiLouer />
      <LivreDor />
      <Mur />
      <Newsletter />
    </>
  );
}
