import { Link, Navigate, useParams } from 'react-router-dom';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { motion } from 'framer-motion';
import { getProduct, products, typeLabel } from '@/data/products';
import { reviews } from '@/data/reviews';
import type { Review } from '@/data/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/Toast';
import { isoJour } from '@/lib/format';
import { addDays } from 'date-fns';
import { Seo } from '@/components/ui/Seo';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Accordion } from '@/components/ui/Accordion';
import { Carousel } from '@/components/ui/Carousel';
import { RatingStars } from '@/components/ui/RatingStars';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { Cascade, Reveal, enfant } from '@/components/ui/Reveal';
import { ScallopDivider } from '@/components/brand/ScallopDivider';
import { Gallery } from '@/components/product/Gallery';
import { BookingPanel } from '@/components/product/BookingPanel';
import { ProductCard } from '@/components/product/ProductCard';

/** Avis spécifiques au Smoking Baron (cahier des charges §12.4) ; les autres fiches reprennent les avis liés au produit. */
const AVIS_BARON: Review[] = [
  { id: 'pb1', client: 'Camille', ville: 'Lyon', chien: 'Pistache', race: 'carlin', note: 5, occasion: 'mariage', productId: 'MB-001', taille: 'S', texte: 'Pistache a volé la vedette à la mariée. La mariée, c\'était moi. Je ne lui en veux pas.', date: '2026-06-22', photo: 'rose', utile: 48 },
  { id: 'pb2', client: 'Antoine', ville: 'Nantes', chien: 'Sacha', race: 'cocker', note: 5, occasion: 'gala', productId: 'MB-001', taille: 'M', texte: 'Velours magnifique, taille parfaite grâce au guide. Le scratch silencieux, quel détail !', date: '2026-02-08', utile: 14 },
  { id: 'pb3', client: 'Inès', ville: 'Aix-en-Provence', chien: 'Figue', race: 'bichon', note: 4, occasion: 'mariage', productId: 'MB-001', taille: 'XS', texte: 'Superbe. Un peu chaud pour un mariage en août dans le Sud, prévoyez de l\'ombre.', date: '2026-08-24', utile: 9 },
];

/** Répartition des notes déduite de la note moyenne (fictive). */
function repartition(note: number) {
  const cinq = Math.round(Math.min(95, Math.max(55, (note - 4) * 100 + 5)));
  const quatre = Math.round((100 - cinq) * 0.7);
  const trois = Math.round((100 - cinq - quatre) * 0.7);
  const deux = Math.max(0, 100 - cinq - quatre - trois - 0);
  return { 5: cinq, 4: quatre, 3: trois, 2: deux, 1: 0 } as Record<number, number>;
}

export default function Product() {
  const { slug = '' } = useParams();
  const produit = getProduct(slug);
  const { ajouter } = useCart();
  const { notifier } = useToast();
  if (!produit) return <Navigate to="/introuvable" replace />;

  const look = produit.completerLeLook.map((s) => getProduct(s)!).filter(Boolean).slice(0, 3);
  const aussi = products.filter((p) => p.gamme === produit.gamme && p.id !== produit.id).slice(0, 4);
  const avisProduit = produit.slug === 'le-smoking-baron' ? AVIS_BARON : reviews.filter((r) => r.productId === produit.id).slice(0, 3);
  const rep = repartition(produit.note);

  const ajoutRapide = (id: string, nom: string, taille: string) => {
    ajouter({ productId: id, taille, dateEvenement: isoJour(addDays(new Date(), 14)), joursSupp: 0, assurance: false, deuxiemeTaille: false, express: false });
    notifier({ type: 'succes', texte: `${nom} est dans votre malle (date à ajuster dans la malle)`, actions: [{ label: 'Voir ma malle', to: '/malle' }, { label: 'Continuer' }] });
  };

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: produit.nom, sku: produit.id,
    description: produit.descriptionCourte, image: produit.images.map((i) => `${location.origin}${i}`),
    brand: { '@type': 'Brand', name: 'Maison Babines' },
    offers: { '@type': 'Offer', price: produit.prix, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: location.href },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: produit.note, reviewCount: produit.nbAvis },
  };

  return (
    <>
      <Seo titre={`${produit.nom} — Location à ${produit.prix} € · Maison Babines`} description={produit.descriptionCourte} image={produit.images[0]} jsonLd={jsonLd} />

      <div className="conteneur pb-16 pt-8 lg:pb-24">
        <Breadcrumb miettes={[{ label: 'Accueil', to: '/' }, { label: 'Catalogue', to: '/catalogue' }, { label: typeLabel(produit.type), to: `/catalogue?type=${produit.type}` }, { label: produit.nom }]} />
        <p className="surtitre mt-4 text-bordeaux">La Cabine d'essayage</p>

        <div className="mt-6 grid gap-10 lg:grid-cols-[55fr_45fr] lg:gap-14">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <div className="lg:sticky lg:top-32"><Gallery produit={produit} /></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <BookingPanel key={produit.id} produit={produit} />
            <div className="mt-10">
              <h2 className="mb-4 font-titre text-[28px] font-black">Détails de la tenue</h2>
              <Accordion
                unique={false}
                ouvertParDefaut={['description']}
                items={[
                  { id: 'description', titre: 'Description', contenu: <p>{produit.descriptionLongue}</p> },
                  { id: 'matieres', titre: 'Matières et coupe', contenu: <p>{produit.matieres}</p> },
                  { id: 'porte', titre: 'Porté par', contenu: <p>{produit.porteePar}</p> },
                  { id: 'entretien', titre: 'Entretien', contenu: <p>Aucun. Renvoyez-le tel quel, on s'occupe du pressing.</p> },
                  { id: 'livraison', titre: 'Livraison et retour', contenu: <p>Livraison J-3 dans sa boîte à chapeau, étiquette retour prépayée incluse, à déposer en point relais le lendemain de l'événement.</p> },
                  { id: 'hygiene', titre: 'Hygiène', contenu: <p>Nettoyage professionnel à basse température avec produits hypoallergéniques, contrôle en 12 points, mise sous housse après chaque location.</p> },
                ]}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Complétez le look */}
      {look.length > 0 && (
        <section className="relative bg-rose" aria-labelledby="look-titre">
          <ScallopDivider couleur="var(--creme)" />
          <div className="conteneur section">
            <Reveal><SplitTitle id="look-titre" texte="Complétez le look" /></Reveal>
            <Cascade as="ul" className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {look.map((p) => (
                <motion.li key={p.id} variants={enfant}>
                  <ProductCard produit={p} compact apercu={false} onAjoutRapide={() => ajoutRapide(p.id, p.nom, (p.tailles as string[]).find((t) => !p.taillesIndisponibles.includes(t))!)} />
                </motion.li>
              ))}
            </Cascade>
          </div>
        </section>
      )}

      {/* Avis */}
      <section id="avis" className="relative scroll-mt-24 bg-creme" aria-labelledby="avis-titre">
        <ScallopDivider couleur="var(--rose)" />
        <div className="conteneur section grid gap-12 lg:grid-cols-[340px_1fr]">
          <Reveal>
            <SplitTitle id="avis-titre" className="text-[36px] lg:text-[44px]" texte="Avis sur ce produit" />
            <p className="mt-4 font-titre text-6xl font-black">{produit.note.toLocaleString('fr-FR')}<span className="text-2xl">/5</span></p>
            <RatingStars note={produit.note} taille={24} className="mt-2" />
            <p className="mt-1 text-sm text-noir/70">{produit.nbAvis} avis</p>
            <Link to="/avis" className="lien mt-3 inline-block text-sm">Lire tous les avis du Livre d'or</Link>
            <ul className="mt-6 flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((n) => (
                <li key={n} className="flex items-center gap-3 text-sm font-bold">
                  <span className="w-8">{n}★</span>
                  <span className="h-3 flex-1 overflow-hidden rounded-full border-2 border-noir bg-white">
                    <motion.span className="block h-full bg-or" initial={{ width: 0 }} whileInView={{ width: `${rep[n]}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: (5 - n) * 0.1 }} />
                  </span>
                  <span className="w-10 text-right">{rep[n]} %</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Cascade as="ul" className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {avisProduit.map((a, i) => (
              <motion.li key={a.id} variants={enfant}><ReviewCard avis={a} fond={['bg-creme', 'bg-jaune/40', 'bg-bleu/30'][i % 3]} /></motion.li>
            ))}
            {avisProduit.length === 0 && <li className="text-noir/70">Les premiers avis arrivent bientôt.</li>}
          </Cascade>
        </div>
      </section>

      {/* Vous aimerez aussi */}
      {aussi.length > 0 && (
        <section className="section bg-creme pt-0 lg:pt-0" aria-labelledby="aussi-titre">
          <div className="conteneur">
            <Reveal><SplitTitle id="aussi-titre" texte="Vous aimerez aussi" /></Reveal>
            <Reveal delai={0.1} className="mt-10">
              <Carousel label="Vous aimerez aussi" largeur="w-[82%] sm:w-[46%] lg:w-[23.5%]">
                {aussi.map((p) => <ProductCard key={p.id} produit={p} compact />)}
              </Carousel>
            </Reveal>
          </div>
        </section>
      )}
      <div className="h-24 lg:h-16" />
    </>
  );
}
