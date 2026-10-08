import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Printer, ArrowUp } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Baron, Meringue, Moustache, Praline, Tonnerre } from '@/components/brand/illustrations';
import { cx } from '@/lib/format';
import { ExemplesContenus } from './ExemplesContenus';

/* ------------------------------------------------------------------ */
/* Briques de mise en page                                             */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  ['synthese', 'Synthèse'],
  ['diagnostic', 'Diagnostic marché'],
  ['swot', 'SWOT'],
  ['cibles', 'Cibles et personas'],
  ['plateforme', 'Plateforme de marque'],
  ['offre', 'Mix marketing'],
  ['funnel', 'Parcours et acquisition'],
  ['social', 'Réseaux sociaux'],
  ['calendrier', 'Calendrier éditorial'],
  ['exemples', 'Exemples de contenus'],
  ['influence', 'Influence et UGC'],
  ['seo', 'SEO et contenu'],
  ['crm', 'CRM et e-mailing'],
  ['b2b', 'Partenariats B2B'],
  ['saison', 'Saisonnalité'],
  ['lancement', 'Plan de lancement'],
  ['budget', 'Budget'],
  ['kpi', 'Objectifs et KPI'],
  ['risques', 'Risques'],
  ['kit', 'Kit opérationnel'],
] as const;

function Section({ id, num, titre, intro, children, fond }: { id: string; num: number; titre: string; intro?: ReactNode; children: ReactNode; fond?: string }) {
  return (
    <section id={id} className={cx('scroll-mt-8 break-inside-avoid-page border-b-[3px] border-noir/10 py-14 print:py-8', fond)}>
      <p className="surtitre text-bordeaux">{String(num).padStart(2, '0')}</p>
      <h2 className="mt-2 text-[36px] lg:text-[48px]">{titre}</h2>
      {intro && <div className="mt-4 max-w-3xl text-lg text-noir/85">{intro}</div>}
      <div className="mt-8 flex flex-col gap-6">{children}</div>
    </section>
  );
}

function Carte({ titre, children, c = 'bg-white', className }: { titre?: ReactNode; children: ReactNode; c?: string; className?: string }) {
  return (
    <div className={cx('break-inside-avoid rounded-[20px] border-[3px] border-noir p-5 shadow-petite print:shadow-none', c, className)}>
      {titre && <h3 className="mb-3 font-titre text-[22px] font-black leading-tight">{titre}</h3>}
      <div className="flex flex-col gap-2 text-[16px] leading-relaxed [&_li]:ml-5 [&_li]:list-disc">{children}</div>
    </div>
  );
}

function Tableau({ entetes, lignes, className }: { entetes: string[]; lignes: ReactNode[][]; className?: string }) {
  return (
    <div className={cx('scroll-x break-inside-avoid rounded-[20px] border-[3px] border-noir bg-white', className)}>
      <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
        <thead className="bg-bordeaux text-creme"><tr>{entetes.map((e) => <th key={e} scope="col" className="px-4 py-3 font-extrabold">{e}</th>)}</tr></thead>
        <tbody>
          {lignes.map((l, i) => (
            <tr key={i} className={cx('border-t-2 border-noir/10 align-top', i % 2 === 1 && 'bg-creme')}>
              {l.map((c, j) => <td key={j} className={cx('px-4 py-3', j === 0 && 'font-bold')}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Chiffre({ v, l, c }: { v: string; l: string; c: string }) {
  return (
    <div className={cx('break-inside-avoid rounded-[20px] border-[3px] border-noir p-5 text-center', c)}>
      <p className="font-titre text-[40px] font-black leading-none">{v}</p>
      <p className="mt-2 text-sm font-bold">{l}</p>
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border-2 border-dashed border-noir/40 bg-jaune/20 px-4 py-3 text-sm">{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Document                                                            */
/* ------------------------------------------------------------------ */

export default function Strategie() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const [actif, setActif] = useState('synthese');

  useEffect(() => {
    const obs = new IntersectionObserver((e) => e.forEach((x) => x.isIntersecting && setActif(x.target.id)), { rootMargin: '-30% 0px -60% 0px' });
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  let n = 0;
  const num = () => ++n;

  return (
    <div className="min-h-screen bg-creme text-noir">
      <Helmet>
        <title>Stratégie marketing 2027 · Maison Babines</title>
        <meta name="robots" content="noindex,nofollow" />
        <style>{`@media print { @page { margin: 14mm; } .no-print { display:none !important } body { background:#fff } section { page-break-inside: auto } }`}</style>
      </Helmet>
      <motion.div aria-hidden className="no-print fixed inset-x-0 top-0 z-50 h-1 origin-left bg-rose" style={{ scaleX: p }} />

      {/* Couverture */}
      <header className="relative overflow-hidden bg-bordeaux text-creme print:min-h-[90vh]">
        <div className="damier absolute inset-x-0 bottom-0 h-24 opacity-20" aria-hidden />
        <div className="conteneur relative grid min-h-[80vh] items-center gap-10 py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Logo clair className="text-[44px]" />
            <p className="surtitre mt-12 text-jaune">Document stratégique · Version 1.0 · Octobre 2026</p>
            <h1 className="mt-4 text-[52px] lg:text-[88px]">Stratégie marketing &amp; communication 2027</h1>
            <p className="mt-6 max-w-xl text-xl">Le plan complet pour faire de Maison Babines le premier vestiaire de cérémonie en location pour chiens en France : positionnement, cibles, acquisition, contenus, CRM, partenariats, budget et indicateurs.</p>
            <div className="no-print mt-10 flex flex-wrap gap-3">
              <button type="button" onClick={() => window.print()} className="inline-flex min-h-[52px] items-center gap-2 rounded-pilule border-[3px] border-noir bg-jaune px-6 font-extrabold text-noir shadow-dure"><Printer size={20} strokeWidth={2.5} aria-hidden /> Exporter en PDF</button>
              <Link to="/" className="inline-flex min-h-[52px] items-center rounded-pilule border-[3px] border-creme px-6 font-extrabold">Voir le site</Link>
              <Link to="/admin" className="inline-flex min-h-[52px] items-center rounded-pilule border-[3px] border-creme px-6 font-extrabold">Ouvrir le CRM</Link>
            </div>
          </div>
          <Baron pose="salue" className="w-full" />
        </div>
      </header>

      <div className="conteneur grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Sommaire */}
        <nav aria-label="Sommaire" className="no-print hidden lg:block">
          <ol className="sticky top-6 mt-14 flex max-h-[calc(100vh-3rem)] flex-col gap-0.5 overflow-y-auto border-l-[3px] border-noir pl-4 text-sm">
            {SECTIONS.map(([id, t], i) => (
              <li key={id}>
                <a href={`#${id}`} className={cx('flex min-h-[32px] items-center rounded-lg px-2 font-semibold transition', actif === id ? 'bg-rose text-noir' : 'hover:bg-jaune/40')}>
                  <span className="mr-2 w-5 text-noir/50">{i + 1}</span>{t}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main className="min-w-0 pb-24">
          {/* 1 */}
          <Section id="synthese" num={num()} titre="Synthèse : la stratégie en une page" intro="Maison Babines vend un moment, pas un produit : le luxe d'un jour pour son chien, sans le placard plein. La stratégie s'appuie sur une idée simple : chaque tenue louée produit des photos, et chaque photo est une publicité gratuite.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Chiffre v="1" l="positionnement unique : la location de cérémonie canine" c="bg-rose" />
              <Chiffre v="3" l="cibles prioritaires : futurs mariés, familles chic, pros" c="bg-jaune" />
              <Chiffre v="4" l="leviers clés : Instagram/TikTok, Pinterest + SEO, wedding planners, UGC" c="bg-bleu" />
              <Chiffre v="12 mois" l="pour atteindre ~1 900 locations et la rentabilité marketing (hypothèse)" c="bg-vert" />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <Carte titre="Le constat" c="bg-white">
                <p>Une tenue de cérémonie pour chien sert une fois. Les acteurs existants vendent du quotidien (accessoires, manteaux) ; personne n'occupe la location pour l'événement. Le marché du mariage avec chien explose sur Instagram et Pinterest.</p>
              </Carte>
              <Carte titre="Notre réponse" c="bg-white">
                <p>Une maison de couture canine en location, avec un univers pop et drôle (le Grand Hôtel Babines) qui la rend instantanément reconnaissable et partageable, et un service sans stress : taille garantie, livraison J-3, retour sans lavage.</p>
              </Carte>
              <Carte titre="Le plan" c="bg-white">
                <ul>
                  <li>Phase 1 (M-2 à M0) : construire l'audience et la liste d'attente.</li>
                  <li>Phase 2 (M1 à M3) : lancement, saison des mariages, partenaires.</li>
                  <li>Phase 3 (M4 à M12) : fidélisation, Noël, abonnement Carnet de Bal, offre Pro.</li>
                </ul>
              </Carte>
            </div>
            <Note>Les chiffres de marché sont des ordres de grandeur à vérifier avant diffusion (sources indiquées). Les objectifs, prix et budgets sont des hypothèses de travail cohérentes avec le cahier des charges ; ils sont à ajuster avec les données réelles dès le premier mois.</Note>
          </Section>

          {/* 2 */}
          <Section id="diagnostic" num={num()} titre="Diagnostic marché" intro="Un marché de l'animal de compagnie massif et premiumisé, un marché du mariage stable, et à l'intersection une niche vide : la tenue de cérémonie canine à louer.">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Chiffre v="≈ 7,5 M" l="chiens en France (FACCO, à vérifier)" c="bg-creme" />
              <Chiffre v="≈ 240 000" l="mariages par an en France (INSEE, à vérifier)" c="bg-creme" />
              <Chiffre v="≈ 1 sur 3" l="foyers possède un chien ou un chat (ordre de grandeur)" c="bg-creme" />
              <Chiffre v="Hypothèse 5 %" l="des mariages incluent le chien du couple" c="bg-creme" />
            </div>
            <Tableau
              entetes={['Tendance', 'Ce qu\'on observe', 'Ce que ça veut dire pour Babines']}
              lignes={[
                ['Humanisation de l\'animal', 'Le chien est un membre de la famille, présent aux grands moments (mariage, Noël, photos).', 'Le besoin de tenue de cérémonie est légitime, pas gadget.'],
                ['Premiumisation', 'Croissance des marques canines haut de gamme (accessoires, alimentation).', 'Les propriétaires CSP+ acceptent de payer pour la qualité et le service.'],
                ['Économie de l\'usage', 'Location de robes, de costumes, de sacs : l\'achat pour un jour devient absurde.', 'Le modèle de location est déjà compris par la cible humaine.'],
                ['Mariages "Pinterest"', 'Mariages personnalisés, très photographiés, inspirés par Instagram et Pinterest.', 'Notre produit est photogénique par nature : chaque client devient média.'],
                ['Sobriété', 'Rejet du jetable et du placard plein.', 'Argument anti-gaspillage fort : une tenue sert ~40 chiens.'],
              ]}
            />
            <Tableau
              entetes={['Acteur', 'Modèle', 'Prix', 'Force', 'Faille exploitable']}
              lignes={[
                ['Oscar & Plume', 'Achat, accessoires premium', '~30 à 120 €', 'Finition "maison", chic parisien', 'Pas d\'offre événementielle, pas de location'],
                ['Rainkiss', 'Achat, imperméables à motifs', '~50 à 80 €', 'Couleurs et motifs reconnaissables', 'Produit du quotidien, pas de cérémonie'],
                ['Milk & Pepper', 'Achat, mode chiens et chats', '~20 à 80 €', 'Ton complice, collections saisonnières', 'Gamme accessible, pas de luxe d\'un jour'],
                ['Location de costumes génériques', 'Location déguisements', 'Variable', 'Notion de location connue', 'Qualité et hygiène incertaines, pas de taille garantie'],
                ['Couturiers sur mesure', 'Commande unique', 'Élevé', 'Pièce unique', 'Cher, délai long, achat pour un seul jour'],
              ]}
            />
            <Note>Positionnements et fourchettes de prix des concurrents donnés de mémoire dans le cahier des charges : à vérifier en ligne avant toute présentation externe.</Note>
          </Section>

          {/* 3 */}
          <Section id="swot" num={num()} titre="SWOT">
            <div className="grid gap-4 md:grid-cols-2">
              <Carte titre="Forces" c="bg-vert">
                <ul><li>Concept unique en France : location de tenues de cérémonie canines.</li><li>Univers de marque fort et mémorable (Grand Hôtel, mascottes, humour).</li><li>Service rassurant : taille garantie, livraison J-3, retour sans lavage, hygiène en 12 points.</li><li>Produit très photogénique : génère naturellement du contenu.</li><li>Marge récurrente : une tenue est louée des dizaines de fois.</li></ul>
              </Carte>
              <Carte titre="Faiblesses" c="bg-orange">
                <ul><li>Marque inconnue, besoin d'éduquer le marché ("louer pour un chien ?").</li><li>Stock limité par taille : risque de rupture les samedis de juin.</li><li>Logistique aller-retour coûteuse et sensible aux retards.</li><li>Dépendance à la saison des mariages (mai à septembre) et à Noël.</li></ul>
              </Carte>
              <Carte titre="Opportunités" c="bg-bleu">
                <ul><li>Wedding planners et photographes en recherche d'idées différenciantes.</li><li>Comptes Instagram et TikTok de chiens très suivis.</li><li>Salons du mariage, foires canines, expositions.</li><li>Extension B2B : tournages, campagnes publicitaires, marques pet food.</li><li>Abonnement (Carnet de Bal) pour lisser la saisonnalité.</li></ul>
              </Carte>
              <Carte titre="Menaces" c="bg-rose">
                <ul><li>Copie du concept par une marque installée.</li><li>Polémique bien-être animal ("habiller un chien").</li><li>Avis négatifs liés à une taille ou une livraison ratée le jour J.</li><li>Hausse des coûts de transport.</li></ul>
              </Carte>
            </div>
            <Carte titre="Réponse stratégique aux menaces" c="bg-white">
              <ul>
                <li><strong>Copie :</strong> verrouiller la marque (dépôt INPI de "Maison Babines" et du Baron Biscotte), construire la communauté avant la concurrence, contrats d'exclusivité avec 20 wedding planners.</li>
                <li><strong>Bien-être animal :</strong> charte de bien-être publiée (séances de 2 h maximum, pas de tenue en forte chaleur, matières respirantes), validée par un vétérinaire partenaire et mise en avant dans la FAQ et l'Atelier.</li>
                <li><strong>Jour J :</strong> option deuxième taille, ligne SOS Tenue, livraison J-3 par défaut, protocole de réponse aux avis sous 24 h.</li>
              </ul>
            </Carte>
          </Section>

          {/* 4 */}
          <Section id="cibles" num={num()} titre="Cibles et personas" intro="Une cible cœur qui fait le volume et l'image (les futurs mariés), deux cibles secondaires qui lissent la saison, et une cible B2B qui apporte des réservations multiples.">
            <Tableau
              entetes={['Cible', 'Profil', 'Occasions', 'Attentes', 'Panier visé', 'Priorité']}
              lignes={[
                ['Futurs mariés', '28-40 ans, CSP+, urbains, très actifs sur Instagram et Pinterest', 'Mariage, fiançailles, PACS', 'Chien assorti au thème, zéro stress taille et livraison', '120 à 180 €', 'P1'],
                ['Familles "chien chic"', '30-55 ans, revenus confortables, grandes villes', 'Noël, anniversaire, baptême, gala', 'Moment fun et photogénique sans achat', '60 à 110 €', 'P2'],
                ['Chiens influenceurs', 'Comptes Instagram/TikTok dédiés à un chien', 'Shootings, contenus saisonniers', 'Looks renouvelés et originaux', 'Abonnement', 'P2'],
                ['Professionnels (B2B)', 'Wedding planners, photographes, agences, productions', 'Mariages clients, campagnes, tournages', 'Fiabilité, délais tenus, plusieurs tailles, facture', 'Sur devis', 'P1'],
              ]}
            />
            <div className="grid gap-4 lg:grid-cols-3">
              <Carte titre="Camille et Hugo, 32 et 34 ans, Lyon" c="bg-rose">
                <p>Mariage en juin dans un domaine. Pistache, leur carlin, sera porteur d'alliances.</p>
                <p><strong>Frein :</strong> la taille le jour J.</p>
                <p><strong>Déclencheur :</strong> pack Mariage, taille garantie, livraison J-3.</p>
                <p><strong>Où les toucher :</strong> Instagram, Pinterest (tableaux "mariage chien"), wedding planners, salons du mariage.</p>
                <p><strong>Message :</strong> « Le seul invité qui ne stressera pas pour sa tenue. »</p>
              </Carte>
              <Carte titre="Sophie, 47 ans, Paris 16e" c="bg-jaune">
                <p>Organise le déjeuner de Noël. Gaston, bouvier bernois, ouvre les cadeaux pour la photo de famille.</p>
                <p><strong>Frein :</strong> acheter un pull qui finira au placard.</p>
                <p><strong>Déclencheur :</strong> prix de location face au prix d'achat, retour sans lavage.</p>
                <p><strong>Où la toucher :</strong> Facebook et Instagram (ciblage 35-55 propriétaires de chiens), newsletter, presse lifestyle.</p>
                <p><strong>Message :</strong> « Le pull de Noël, sans le placard toute l'année. »</p>
              </Carte>
              <Carte titre="Léa, 29 ans, wedding planner, Bordeaux" c="bg-bleu">
                <p>25 mariages par an, dont un tiers avec chien. Cherche un partenaire fiable à recommander.</p>
                <p><strong>Frein :</strong> le risque pour sa réputation.</p>
                <p><strong>Déclencheur :</strong> offre Pro, interlocuteur dédié, ligne SOS Tenue, commission.</p>
                <p><strong>Où la toucher :</strong> LinkedIn, prospection directe, salons professionnels, groupes Facebook de planners.</p>
                <p><strong>Message :</strong> « Un détail de plus que vos mariés n'oublieront jamais, zéro risque pour vous. »</p>
              </Carte>
            </div>
          </Section>

          {/* 5 */}
          <Section id="plateforme" num={num()} titre="Plateforme de marque" intro="Tout ce qui est publié par Maison Babines doit pouvoir se relier à cette page.">
            <div className="grid gap-4 lg:grid-cols-2">
              <Carte titre="Mission" c="bg-white"><p>Permettre à chaque chien d'être sublime le jour d'un grand événement, sans que ses humains aient à acheter, stocker ou laver une tenue portée une fois.</p></Carte>
              <Carte titre="Vision" c="bg-white"><p>Devenir la maison de couture canine de référence en Europe, celle à laquelle on pense automatiquement dès qu'un chien est invité.</p></Carte>
              <Carte titre="Promesse" c="bg-rose"><p className="font-titre text-2xl italic">Le grand soir, à quatre pattes.</p><ul><li>Le grand jeu : des tenues dessinées comme pour les humains.</li><li>Zéro stress : taille garantie, livraison J-3, retour prépayé, nettoyage inclus.</li><li>Zéro gaspillage : une tenue sert des dizaines de chiens.</li></ul></Carte>
              <Carte titre="Valeurs" c="bg-jaune"><ul><li><strong>L'audace :</strong> oser le nœud pap' fuchsia.</li><li><strong>L'exigence :</strong> finitions, hygiène, délais.</li><li><strong>La générosité :</strong> service, humour, gestes commerciaux.</li><li><strong>La sobriété :</strong> louer plutôt qu'acheter.</li></ul></Carte>
            </div>
            <Tableau
              entetes={['Règle de ton', 'À faire', 'À éviter']}
              lignes={[
                ['Vouvoyer les humains, tutoyer les chiens', '« Votre commande est confirmée. Pistache, tu vas être sublime. »', 'Tutoyer le client, parler "bébé" au chien'],
                ['Vocabulaire du palace et de la couture', '« Ajouter à la malle », « Réserver la cabine », « La Gazette »', 'Jargon e-commerce : "panier", "checkout"'],
                ['Une blague par bloc maximum', 'Humour sur le chien, la Duchesse, le Baron', 'Humour sur le client, ironie sur un problème'],
                ['Infos importantes toujours nettes', 'Prix, caution, délais écrits simplement', 'Jeux de mots sur la caution ou les dates'],
              ]}
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {[
                [Baron, 'Baron Biscotte', 'Visage de la marque : annonces, service client, packaging'],
                [Praline, 'Mlle Praline', 'Tailles, conseils, coulisses Atelier'],
                [Tonnerre, 'M. Tonnerre', 'Livraison, logistique, SOS Tenue'],
                [Meringue, 'Lady Meringue', 'Nouveautés, shootings, influence'],
                [Moustache, 'Duchesse Moustache', 'Humour, réactions, community management'],
              ].map(([I, nom, role]) => {
                const Illu = I as typeof Baron;
                return (
                  <div key={nom as string} className="break-inside-avoid rounded-[20px] border-[3px] border-noir bg-white p-4 text-center">
                    <Illu className="mx-auto h-28 w-full" />
                    <p className="mt-2 font-titre text-lg font-black">{nom as string}</p>
                    <p className="text-sm">{role as string}</p>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* 6 */}
          <Section id="offre" num={num()} titre="Mix marketing (7P)">
            <Tableau
              entetes={['Levier', 'Décision', 'Pourquoi']}
              lignes={[
                ['Produit', '20 références au lancement en 4 gammes (Accessoires, Cocktail, Gala, Haute Couture), 7 tailles, collections renouvelées 2 fois par an (Printemps-Mariage, Hiver-Fêtes).', 'Couvrir toutes les occasions et créer du renouvellement pour les influenceurs.'],
                ['Prix', 'Location 4 jours de 19 à 189 €, soit 25 à 35 % du prix d\'achat. Packs : Mariage 149 €, Shooting 159 €, Duo -15 %, Carnet de Bal 49 €/mois.', 'Prix d\'appel accessible (accessoires), panier moyen tiré par les packs.'],
                ['Distribution', 'E-commerce en direct, livraison France métropolitaine, essayages à l\'Atelier de Lyon sur rendez-vous, réseau de wedding planners prescripteurs.', 'Contrôle de l\'expérience et de la marge.'],
                ['Communication', 'Social-first (Instagram, TikTok, Pinterest), UGC #BabinesDeGala, partenariats, RP lifestyle et mariage.', 'Produit visuel, cible digitale.'],
                ['Personnes', 'Conciergerie (Théo), styliste (conseil taille), interlocuteur Pro dédié.', 'Rassurer sur un achat émotionnel à forte enjeu.'],
                ['Process', 'Réservation en 3 étapes, livraison J-3, retour en point relais J+1, contrôle 12 points, CRM pour le suivi.', 'Fiabilité = bouche-à-oreille.'],
                ['Preuve physique', 'Boîte à chapeau illustrée, carte d\'invitation au nom du chien, carton de confirmation, avis vérifiés.', 'Moment d\'unboxing partageable.'],
              ]}
            />
            <Carte titre="Leviers de panier moyen à activer" c="bg-jaune">
              <ul>
                <li>Bloc « Complétez le look » sur chaque fiche (accessoire à 19-35 €).</li>
                <li>Assurance « Pattes de velours » proposée au moment du choix de date (+9 €, objectif 40 % d'attachement).</li>
                <li>Barre « Plus que X € pour la livraison offerte » dans la malle (seuil 120 €).</li>
                <li>Pack Mariage mis en avant dès qu'un filtre « mariage » est actif.</li>
              </ul>
            </Carte>
          </Section>

          {/* 7 */}
          <Section id="funnel" num={num()} titre="Parcours client et plan d'acquisition" intro="Le parcours est long pour un mariage (3 à 6 mois) et court pour Noël ou un anniversaire (2 à 3 semaines). Chaque étape a ses canaux et ses messages.">
            <Tableau
              entetes={['Étape', 'Objectif', 'Canaux', 'Contenus', 'Indicateur']}
              lignes={[
                ['Découverte', 'Faire connaître le concept "on loue, on ne possède pas"', 'TikTok, Reels Instagram, Pinterest, RP, salons', 'Vidéos "entrée du chien à la cérémonie", avant/après, coulisses Atelier', 'Portée, vues, nouveaux abonnés'],
                ['Considération', 'Donner envie et rassurer', 'Site (catalogue, Atelier, FAQ), Instagram, avis, wedding planners', 'Lookbook, guide des tailles, témoignages, charte hygiène', 'Visites, temps passé, ajouts aux favoris'],
                ['Conversion', 'Réserver', 'Site, retargeting Meta, e-mails de relance, code BARON10', 'Malle, pack Mariage, livraison offerte, urgence douce ("Dernière taille")', 'Taux de conversion, panier moyen'],
                ['Expérience', 'Un jour J parfait', 'Logistique, SMS, SOS Tenue', 'Carte d\'invitation, e-mail J-3 "ta tenue arrive", conseils d\'enfilage', 'Retards, taux d\'échange, NPS'],
                ['Recommandation', 'Transformer le client en média', 'E-mail post-événement, #BabinesDeGala, parrainage', 'Demande d\'avis et de photos, concours mensuel, -15 € parrain/filleul', 'Avis, UGC, taux de parrainage'],
                ['Fidélisation', 'Revenir au prochain événement', 'Gazette, CRM, Carnet de Bal', 'Rappel anniversaire du chien, collection Noël, avant-premières', 'Taux de réachat, abonnés Carnet'],
              ]}
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <Carte titre="Publicité payante (Meta et Pinterest)" c="bg-white">
                <ul>
                  <li><strong>Prospection :</strong> audiences "fiançailles récentes" + "propriétaires de chiens" + intérêts mariage, 25-45 ans, grandes villes.</li>
                  <li><strong>Lookalike :</strong> à partir des acheteurs et des abonnés à la Gazette dès 300 contacts.</li>
                  <li><strong>Retargeting :</strong> visiteurs de fiches produits sur 30 jours, ajout à la malle sans réservation sur 7 jours.</li>
                  <li><strong>Formats :</strong> Reels 9:16 de 8 à 15 secondes, carrousels lookbook, épingles Pinterest verticales.</li>
                  <li><strong>Règle :</strong> 70 % du budget sur les créations qui marchent, 30 % sur les tests (2 nouvelles créations par semaine).</li>
                </ul>
              </Carte>
              <Carte titre="Hors ligne et événementiel" c="bg-white">
                <ul>
                  <li>Salons du mariage de Lyon, Paris, Bordeaux : stand "Cabine d'essayage" avec chiens modèles et photobooth.</li>
                  <li>Pop-up "Grand Hôtel" en décembre dans une boutique partenaire (Lyon puis Paris).</li>
                  <li>Kit vitrine pour 30 toiletteurs partenaires : affiche, flyers avec code, présentoir de nœuds pap'.</li>
                  <li>Défilé canin caritatif annuel au profit d'un refuge (RP + contenu).</li>
                </ul>
              </Carte>
            </div>
          </Section>

          {/* 8 */}
          <Section id="social" num={num()} titre="Stratégie réseaux sociaux">
            <Tableau
              entetes={['Réseau', 'Rôle', 'Fréquence', 'Formats prioritaires', 'Objectif 12 mois']}
              lignes={[
                ['Instagram', 'Vitrine de marque et conversion', '4 posts + 10 stories / semaine', 'Reels, carrousels lookbook, stories sondages, UGC', '25 000 abonnés'],
                ['TikTok', 'Notoriété virale', '4 vidéos / semaine', 'Entrées de cérémonie, "POV : tu es le Baron", tendances audio', '40 000 abonnés'],
                ['Pinterest', 'Inspiration mariage, trafic durable', '15 épingles / semaine', 'Épingles verticales, tableaux par thème de mariage', '150 000 vues mensuelles'],
                ['Facebook', 'Ciblage 35-55 ans, groupes', '2 posts / semaine', 'Album avant/après, événements pop-up', 'Support de la pub'],
                ['LinkedIn', 'B2B et marque employeur', '1 post / semaine', 'Coulisses, chiffres, cas clients Pro', '50 partenaires Pro'],
              ]}
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {[
                ['Les entrées', '35 %', 'Moments de cérémonie, révélations de tenue, réactions des invités.', 'bg-rose'],
                ['L\'Atelier', '20 %', 'Couture, contrôle 12 points, hygiène, coulisses : la preuve du sérieux.', 'bg-jaune'],
                ['Le Grand Hôtel', '20 %', 'Sketches des personnages, Duchesse Moustache qui commente, humour de marque.', 'bg-bleu'],
                ['Conseils', '15 %', 'Mesurer son chien, choisir sa tenue, bien-être le jour J.', 'bg-vert'],
                ['Communauté', '10 %', 'Repost #BabinesDeGala, concours, avis clients.', 'bg-orange'],
              ].map(([t, pc, d, c]) => (
                <Carte key={t} c={c} titre={<span>{t} <span className="text-base font-bold">· {pc}</span></span>}><p>{d}</p></Carte>
              ))}
            </div>
            <Carte titre="10 idées de contenus prêtes à tourner" c="bg-white">
              <ol className="list-decimal pl-5 [&>li]:ml-0 [&>li]:list-decimal">
                <li>« Le porteur d'alliances le plus sérieux de France » : ralenti de l'entrée d'un carlin en Smoking Baron.</li>
                <li>Unboxing de la boîte à chapeau avec la carte d'invitation au nom du chien.</li>
                <li>« Mademoiselle Praline mesure ton chien en 30 secondes » (tuto guide des tailles).</li>
                <li>Duchesse Moustache réagit aux nouveautés (voix off, sous-titres).</li>
                <li>« 1 tenue, 40 chiens » : montage des différents chiens ayant porté la même pièce.</li>
                <li>Le contrôle qualité en 12 points en accéléré (ASMR couture et vapeur).</li>
                <li>Avant/après : chien au réveil vs chien en Cape Royale.</li>
                <li>« Monsieur Tonnerre livre à J-3 » : suivi d'un colis jusqu'au domaine.</li>
                <li>Défi « Tenue de soirée exigée » : les abonnés votent le look du mois.</li>
                <li>Interview d'une wedding planner partenaire : « pourquoi j'inclus le chien ».</li>
              </ol>
            </Carte>
          </Section>

          {/* 9 */}
          <Section id="calendrier" num={num()} titre="Calendrier éditorial et commercial 2027">
            <Tableau
              entetes={['Mois', 'Temps fort', 'Action commerciale', 'Contenus phares']}
              lignes={[
                ['Janvier', 'Fiançailles des fêtes, salons du mariage', 'Pré-réservation Mariage 2027 : -10 % jusqu\'au 31/01', 'Lookbook Mariage, "réservez votre date"'],
                ['Février', 'Saint-Valentin', 'Shooting "Love" avec Lunettes Star et Chemise Flamant', 'Concours couple + chien'],
                ['Mars', 'Lancement collection Printemps', 'Avant-première pour les abonnés de la Gazette', 'Défilé vidéo, coulisses Atelier'],
                ['Avril', 'Baptêmes, communions, Pâques', 'Mise en avant gamme Cocktail', 'Tuto taille, Costume Communion'],
                ['Mai', 'Ouverture saison mariages', 'Pack Mariage en vedette, offre Pro planners', 'Entrées de cérémonie, témoignages'],
                ['Juin', 'Pic des mariages', 'SOS Tenue renforcée, stock complet en ligne', 'Repost UGC quotidien #BabinesDeGala'],
                ['Juillet', 'Mariages, chaleur', 'Mise en avant pièces légères et accessoires', 'Conseils bien-être par forte chaleur'],
                ['Août', 'Mariages, vacances', 'Offre "rentrée" pour réservations de septembre', 'Best-of de l\'été'],
                ['Septembre', 'Dernière vague de mariages', 'Lancement du Carnet de Bal (abonnement)', 'Chiens influenceurs et abonnement'],
                ['Octobre', 'Halloween, préparation Noël', 'Pré-réservation Noël, lancement collection Hiver', 'Duchesse Moustache en costume (sans tenue Babines)'],
                ['Novembre', 'Black Friday (sobriété)', '"Green Friday" : 1 location = 1 € reversé à un refuge', 'Engagements, fin de vie des tenues'],
                ['Décembre', 'Noël, réveillons', 'Pull de Fête Biscotte, Manteau Grand Hall, carte cadeau', 'Photo de famille de l\'année, pop-up'],
              ]}
            />
          </Section>

          <Section id="exemples" num={num()} titre="Exemples de contenus prêts à publier" intro="Des contenus concrets, rédigés et mis en forme, à reprendre tels quels dès le lancement : feed, posts, vidéos, stories, publicités, Pinterest, newsletter et LinkedIn.">
            <ExemplesContenus />
          </Section>

          {/* 10 */}
          <Section id="influence" num={num()} titre="Influence et contenus clients (UGC)">
            <div className="grid gap-4 lg:grid-cols-3">
              <Carte titre="Micro-influence (5 à 50 k)" c="bg-rose">
                <p>Cœur du dispositif : 10 comptes de chiens par mois, location offerte contre 1 Reel + 3 stories + droits de réutilisation 12 mois. Code personnel de -10 % pour suivre les ventes.</p>
              </Carte>
              <Carte titre="Ambassadeurs (programme « Les Habitués »)" c="bg-jaune">
                <p>6 comptes de chiens sélectionnés pour un an : Carnet de Bal offert, avant-premières, commission de 10 % sur les ventes générées. Ils incarnent les collections.</p>
              </Carte>
              <Carte titre="Créateurs mariage" c="bg-bleu">
                <p>Partenariats avec 5 comptes "mariage" (inspiration, DIY, planners) : contenu "chien d'honneur", jeu-concours Pack Mariage offert.</p>
              </Carte>
            </div>
            <Carte titre="Machine à UGC #BabinesDeGala" c="bg-white">
              <ul>
                <li>Carte dans chaque boîte à chapeau : « Poste ton grand soir avec #BabinesDeGala, la plus belle photo du mois gagne sa prochaine location. »</li>
                <li>E-mail J+2 après l'événement avec lien de dépôt photo et demande d'avis.</li>
                <li>Mur #BabinesDeGala sur la page d'accueil, mis à jour chaque semaine.</li>
                <li>Autorisation de réutilisation demandée systématiquement (réponse "#OuiBabines").</li>
                <li>Objectif : 30 % des clients partagent au moins une photo.</li>
              </ul>
            </Carte>
            <Tableau
              entetes={['Brief créateur', 'Contenu']}
              lignes={[
                ['Message clé', 'On loue, on ne possède pas : la tenue arrive J-3 et repart sans lavage.'],
                ['À montrer', 'L\'unboxing de la boîte à chapeau, la carte d\'invitation, le chien en mouvement, la réaction des humains.'],
                ['À dire', 'Le nom de la tenue, la taille garantie, le code personnel.'],
                ['À éviter', 'Chien contraint ou stressé, longue séance au soleil, tenue portée sans surveillance.'],
                ['Mentions', '#BabinesDeGala @maisonbabines + mention "partenariat" ou "collaboration commerciale" (obligation légale).'],
              ]}
            />
          </Section>

          {/* 11 */}
          <Section id="seo" num={num()} titre="SEO et marketing de contenu">
            <Tableau
              entetes={['Cluster de mots-clés', 'Exemples de requêtes', 'Page cible', 'Intention']}
              lignes={[
                ['Mariage chien', 'tenue chien mariage, chien porteur d\'alliances, smoking chien mariage', 'Catalogue filtré Mariage, Pack Mariage', 'Transactionnelle'],
                ['Location', 'location tenue chien, louer costume chien', 'Accueil, Catalogue', 'Transactionnelle'],
                ['Noël', 'pull de noël chien, tenue de noël chien grand chien', 'Catalogue Noël, Pull Biscotte', 'Saisonnière'],
                ['Tailles', 'comment mesurer son chien, taille vêtement chien', 'Guide des tailles', 'Informationnelle'],
                ['Inspiration', 'idée mariage avec chien, chien au mariage organisation', 'Articles de blog', 'Informationnelle'],
              ]}
            />
            <Carte titre="12 articles de blog à publier (1 par mois)" c="bg-white">
              <ol className="grid gap-x-8 sm:grid-cols-2 [&>li]:ml-5 [&>li]:list-decimal">
                <li>Inviter son chien à son mariage : le guide complet</li>
                <li>Porteur d'alliances : comment préparer son chien</li>
                <li>Comment mesurer son chien en 3 étapes</li>
                <li>10 thèmes de mariage et la tenue de chien qui va avec</li>
                <li>Chien et forte chaleur : le jour J sans risque</li>
                <li>Pourquoi louer plutôt qu'acheter une tenue de cérémonie</li>
                <li>Les lieux de mariage "dog friendly" autour de Lyon</li>
                <li>Shooting photo avec son chien : 12 conseils de pros</li>
                <li>La photo de Noël parfaite avec son chien</li>
                <li>Teckel, bouledogue, lévrier : habiller les morphologies particulières</li>
                <li>Dans les coulisses du contrôle qualité en 12 points</li>
                <li>Wedding planners : intégrer le chien au rétroplanning</li>
              </ol>
            </Carte>
            <Carte titre="Socle technique déjà en place sur le site" c="bg-vert">
              <ul><li>Balises title et meta description par page, Open Graph, un seul H1.</li><li>Données structurées : Organization, Product (Offer, AggregateRating), FAQPage, BreadcrumbList.</li><li>robots.txt, sitemap.xml, URL de catalogue filtrées partageables.</li><li>À faire : fiche Google Business Profile pour l'Atelier de Lyon, netlinking via planners et presse mariage.</li></ul>
            </Carte>
          </Section>

          {/* 12 */}
          <Section id="crm" num={num()} titre="CRM et e-mailing" intro="Le CRM livré avec le site (espace /admin) centralise réservations, clients, chiens, messages, abonnés et avis. Il alimente les scénarios ci-dessous.">
            <Tableau
              entetes={['Scénario', 'Déclencheur', 'Délai', 'Contenu', 'Objectif']}
              lignes={[
                ['Bienvenue Gazette', 'Inscription newsletter', 'Immédiat, J+3, J+7', 'Code -10 %, histoire du Baron, best-sellers', 'Première réservation'],
                ['Malle abandonnée', 'Ajout sans réservation', 'H+4, J+1', '« Le Baron a gardé votre malle au chaud » + rappel taille garantie', 'Récupérer 10 % des malles'],
                ['Confirmation', 'Réservation validée', 'Immédiat', 'Carton d\'invitation, récapitulatif, dates', 'Rassurer'],
                ['Pré-événement', 'Livraison J-3', 'J-4, J-1', 'Conseils d\'enfilage, rappel SOS Tenue, astuces photo', 'Zéro problème le jour J'],
                ['Post-événement', 'Événement passé', 'J+2', 'Demande d\'avis + photo #BabinesDeGala', 'Avis et UGC'],
                ['Retour', 'Date de retour', 'J+1, J+3', 'Rappel dépôt relais, confirmation libération caution', 'Retours à l\'heure'],
                ['Anniversaire', 'Date d\'anniversaire du chien (CRM)', 'J-21', '« Bon anniversaire, Pistache » + sélection Anniversaire', 'Réachat'],
                ['Réactivation', '9 mois sans réservation', '1 envoi', 'Nouveautés + avant-première Noël', 'Réachat'],
              ]}
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <Carte titre="Segmentation" c="bg-white">
                <ul><li>Par segment : particulier, pro, influenceur (champ CRM).</li><li>Par occasion de la dernière réservation.</li><li>Par taille du chien (pour les alertes de disponibilité).</li><li>Par valeur : clients &gt; 300 € cumulés = "Habitués du Grand Hôtel".</li></ul>
              </Carte>
              <Carte titre="Ligne éditoriale de la Gazette (2 envois/mois)" c="bg-white">
                <ul><li>Un "carnet mondain" : les plus belles photos clients du mois.</li><li>Une coulisse de l'Atelier.</li><li>Une pièce à la une avec disponibilités.</li><li>Le mot de la Duchesse (humour).</li></ul>
              </Carte>
            </div>
          </Section>

          {/* 13 */}
          <Section id="b2b" num={num()} titre="Partenariats et offre Pro">
            <Tableau
              entetes={['Partenaire', 'Ce qu\'on propose', 'Ce qu\'on obtient', 'Objectif 12 mois']}
              lignes={[
                ['Wedding planners', 'Commission 10 %, interlocuteur dédié, priorité stock, kit présentation', 'Prescription auprès des couples', '50 planners actifs, 25 % du CA'],
                ['Photographes de mariage et animaliers', 'Tenues prêtées pour leurs portfolios, Pack Shooting tarif pro', 'Contenu de qualité, recommandation', '30 photographes'],
                ['Domaines et lieux de réception', 'Mention "dog friendly by Babines", livraison sur place', 'Visibilité dans leurs brochures', '20 lieux'],
                ['Toiletteurs', 'Présentoir, flyers avec code, commission', 'Point de contact physique local', '30 toiletteurs'],
                ['Marques pet food et accessoires', 'Co-branding, coffrets Noël, tournages', 'Audience et revenus B2B', '3 collaborations'],
                ['Refuges', '1 € par location en novembre, tenues en fin de vie données', 'Sens, RP, engagement', '1 refuge partenaire national'],
              ]}
            />
            <Carte titre="Script d'approche wedding planner (e-mail ou DM)" c="bg-jaune">
              <p>Bonjour [Prénom], je suis [Nom] de Maison Babines, la maison lyonnaise qui loue des tenues de cérémonie pour chiens. Un tiers des mariages que vous organisez incluent sans doute un chien : nous proposons à vos couples un smoking ou une robe à leur taille, livrés 3 jours avant et récupérés sans lavage, avec une ligne SOS le vendredi et le samedi. Pour vous : un interlocuteur dédié, une priorité sur le stock et 10 % de commission. Puis-je vous envoyer notre lookbook et passer vous présenter deux pièces à l'Atelier ou en visio ?</p>
            </Carte>
          </Section>

          {/* 14 */}
          <Section id="saison" num={num()} titre="Saisonnalité et gestion du stock">
            <div className="break-inside-avoid rounded-[20px] border-[3px] border-noir bg-white p-5">
              <p className="mb-4 font-bold">Demande estimée par mois (indice, hypothèse)</p>
              <div className="flex h-48 items-end gap-2">
                {[25, 30, 35, 50, 80, 100, 90, 70, 75, 45, 60, 95].map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <motion.div className={cx('w-full rounded-t-lg border-2 border-noir', v >= 80 ? 'bg-rose' : v >= 50 ? 'bg-jaune' : 'bg-bleu')} initial={{ height: 0 }} whileInView={{ height: `${v * 1.6}px` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.04 }} />
                    <span className="text-xs font-bold">{'JFMAMJJASOND'[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <Carte titre="Règles de pilotage" c="bg-white">
              <ul>
                <li>Pré-réservations Mariage ouvertes dès janvier pour lisser et sécuriser les samedis de juin.</li>
                <li>Profondeur de stock : 6 exemplaires par taille sur les best-sellers Gala, 3 sur les autres.</li>
                <li>Badge « Dernière taille » déclenché automatiquement sous 2 exemplaires disponibles.</li>
                <li>Hors saison (janvier-mars, octobre) : Carnet de Bal, shootings B2B, tournages.</li>
              </ul>
            </Carte>
          </Section>

          {/* 15 */}
          <Section id="lancement" num={num()} titre="Plan de lancement : les 90 premiers jours, puis l'année">
            <div className="grid gap-4 lg:grid-cols-3">
              <Carte titre="J-60 à J0 : le teasing" c="bg-bleu">
                <ul><li>Comptes sociaux ouverts, 20 contenus d'avance.</li><li>Liste d'attente "Réservez votre invitation" (objectif 1 500 inscrits).</li><li>15 micro-influenceurs équipés en avant-première.</li><li>Prospection de 100 wedding planners, 20 signés.</li><li>Dossier de presse envoyé aux médias mariage et lifestyle.</li></ul>
              </Carte>
              <Carte titre="J0 à J30 : l'ouverture" c="bg-rose">
                <ul><li>Soirée de lancement "Le Grand Hôtel ouvre ses portes" à Lyon (presse, influence, planners).</li><li>Code de lancement BARON10 pour la liste d'attente.</li><li>Campagne Meta et Pinterest (60 % du budget du trimestre).</li><li>Live Instagram avec Mademoiselle Praline (conseil taille).</li></ul>
              </Carte>
              <Carte titre="J30 à J90 : l'accélération" c="bg-jaune">
                <ul><li>Analyse des premières données CRM : best-sellers, tailles en tension.</li><li>Relance des malles abandonnées et parrainage.</li><li>Premier salon du mariage.</li><li>Objectif : 150 réservations et 60 avis publiés.</li></ul>
              </Carte>
            </div>
            <Tableau
              entetes={['Trimestre', 'Priorité', 'Livrables clés']}
              lignes={[
                ['T1', 'Notoriété et pré-réservations Mariage', 'Lancement, salons, 20 planners, Gazette bimensuelle'],
                ['T2', 'Saison des mariages', 'SOS Tenue, UGC quotidien, 50 planners, collection Printemps'],
                ['T3', 'Fidélisation et abonnement', 'Carnet de Bal, programme ambassadeurs, offre Pro agences'],
                ['T4', 'Noël et pop-up', 'Collection Hiver, pop-up Lyon et Paris, carte cadeau, Green Friday'],
              ]}
            />
          </Section>

          {/* 16 */}
          <Section id="budget" num={num()} titre="Budget marketing année 1 (hypothèse)" intro="Enveloppe de travail de 48 000 € HT, soit environ 15 % du chiffre d'affaires visé. À ajuster selon les moyens réels de la marque.">
            <Tableau
              entetes={['Poste', 'Montant HT', 'Part', 'Détail']}
              lignes={[
                ['Publicité Meta (Instagram, Facebook)', '15 000 €', '31 %', 'Prospection, lookalike, retargeting'],
                ['Pinterest et TikTok Ads', '6 000 €', '13 %', 'Saison mariage et Noël'],
                ['Influence et ambassadeurs', '8 000 €', '17 %', 'Locations offertes, commissions, 2 collaborations rémunérées'],
                ['Production de contenus', '7 000 €', '15 %', '4 shootings studio, vidéos, illustrations'],
                ['Salons et événements', '6 000 €', '13 %', '2 salons du mariage, soirée de lancement, pop-up'],
                ['RP et partenariats', '3 000 €', '6 %', 'Dossier de presse, kits planners et toiletteurs'],
                ['Outils (e-mailing, CRM, planification)', '1 500 €', '3 %', 'Supabase, outil d\'e-mailing, planification sociale'],
                ['Réserve tests', '1 500 €', '3 %', 'Nouveaux canaux, opportunités'],
                [<strong key="t">Total</strong>, <strong key="m">48 000 €</strong>, '100 %', ''],
              ]}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Chiffre v="≈ 98 €" l="panier moyen visé (hors livraison)" c="bg-jaune" />
              <Chiffre v="≈ 25 €" l="coût d'acquisition client visé (CAC)" c="bg-rose" />
              <Chiffre v="≥ 4" l="ratio valeur client / CAC visé à 12 mois" c="bg-vert" />
            </div>
          </Section>

          {/* 17 */}
          <Section id="kpi" num={num()} titre="Objectifs et indicateurs de suivi">
            <Tableau
              entetes={['Domaine', 'Indicateur', 'Objectif M3', 'Objectif M12', 'Où le suivre']}
              lignes={[
                ['Ventes', 'Réservations', '150', '1 900 (cumul)', 'CRM > Tableau de bord'],
                ['Ventes', 'Panier moyen', '90 €', '98 €', 'CRM'],
                ['Ventes', 'Taux de conversion du site', '1,5 %', '2,5 %', 'Outil d\'analyse web'],
                ['Ventes', 'Attachement assurance', '30 %', '40 %', 'CRM (options)'],
                ['Acquisition', 'Abonnés Instagram / TikTok', '5 k / 8 k', '25 k / 40 k', 'Réseaux'],
                ['Acquisition', 'Abonnés Gazette', '2 500', '12 000', 'CRM > Gazette'],
                ['Acquisition', 'Coût d\'acquisition (CAC)', '35 €', '25 €', 'Pub / nouvelles réservations'],
                ['B2B', 'Wedding planners actifs', '20', '50', 'CRM > Clients (segment Pro)'],
                ['Satisfaction', 'Note moyenne', '≥ 4,7', '≥ 4,8', 'CRM > Avis'],
                ['Satisfaction', 'Taille juste du premier coup', '95 %', '98 %', 'Messages SOS / échanges'],
                ['Fidélité', 'Taux de réachat 12 mois', '—', '25 %', 'CRM'],
                ['Communauté', 'Clients qui partagent #BabinesDeGala', '20 %', '30 %', 'Réseaux'],
              ]}
            />
            <Carte titre="Rituel de pilotage" c="bg-white">
              <ul><li><strong>Chaque lundi (30 min) :</strong> réservations, messages en attente, livraisons de la semaine (CRM).</li><li><strong>Chaque mois :</strong> revue des KPI, des 3 meilleures et 3 pires créations publicitaires, ajustement du budget.</li><li><strong>Chaque trimestre :</strong> revue de la stratégie, des collections et des partenariats.</li></ul>
            </Carte>
          </Section>

          {/* 18 */}
          <Section id="risques" num={num()} titre="Risques et plans de prévention">
            <Tableau
              entetes={['Risque', 'Probabilité', 'Impact', 'Prévention', 'Si ça arrive']}
              lignes={[
                ['Tenue livrée en retard le jour J', 'Faible', 'Très fort', 'Livraison J-3 par défaut, suivi colis, transporteur premium en juin', 'SOS Tenue, envoi express, remboursement + geste'],
                ['Mauvaise taille', 'Moyenne', 'Fort', 'Guide et calculateur, option 2e taille, conseil photo', 'Échange express offert'],
                ['Bad buzz bien-être animal', 'Faible', 'Fort', 'Charte publiée, vétérinaire partenaire, modération des contenus', 'Réponse sous 2 h, transparence, prise de parole du vétérinaire'],
                ['Rupture de stock en juin', 'Moyenne', 'Moyen', 'Pré-réservations, stock profond sur best-sellers', 'Alternative proposée + accessoire offert'],
                ['Tenue abîmée', 'Moyenne', 'Faible', 'Assurance Pattes de velours, contrôle 12 points', 'Retouche Atelier, caution sur devis'],
                ['Avis négatif public', 'Moyenne', 'Moyen', 'Suivi post-événement proactif', 'Réponse du Baron sous 24 h, solution concrète'],
              ]}
            />
          </Section>

          {/* 19 */}
          <Section id="kit" num={num()} titre="Kit opérationnel : textes prêts à l'emploi">
            <div className="grid gap-4 lg:grid-cols-2">
              <Carte titre="Bio Instagram / TikTok" c="bg-rose">
                <p>Maison Babines · Le grand soir, à quatre pattes.<br />Smokings, robes et capes à louer pour votre chien.<br />Livré J-3 · Retour sans lavage · Taille garantie<br />#BabinesDeGala</p>
              </Carte>
              <Carte titre="Légende de post (lancement)" c="bg-white">
                <p>Au Grand Hôtel Babines, on ne rentre pas sans tenue de soirée. Heureusement, le Baron Biscotte prête la plus belle garde-robe canine du pays, le temps d'un grand soir. 🎩 Smoking, robe de mariée ou cape royale : livrés 3 jours avant, récupérés sans lavage. Portes ouvertes ce jeudi, lien en bio. #BabinesDeGala</p>
              </Carte>
              <Carte titre="Objet et accroche e-mail de bienvenue" c="bg-white">
                <p><strong>Objet :</strong> Le Baron vous attendait (et il a préparé -10 %)</p>
                <p><strong>Pré-en-tête :</strong> Bienvenue au Grand Hôtel Babines.</p>
                <p>Bienvenue dans la Gazette du Grand Hôtel. Ici, on vouvoie les humains et on tutoie les chiens. Pour votre première location, le Baron vous offre -10 % avec le code BARON10.</p>
              </Carte>
              <Carte titre="Réponse type à un avis négatif" c="bg-white">
                <p>Merci [Prénom] pour ce retour, et toutes nos excuses pour [problème]. Ce n'est pas l'expérience que nous voulons offrir à [Chien]. Théo, de notre Conciergerie, vous contacte aujourd'hui pour [solution]. Et le Baron vous offre l'assurance de votre prochaine location.</p>
              </Carte>
              <Carte titre="Pitch presse (3 lignes)" c="bg-jaune">
                <p>Maison Babines lance la première maison de couture canine en location : smokings, robes de mariée et capes royales pour chiens, livrés trois jours avant l'événement et récupérés sans lavage. Une réponse sobre et pleine d'humour au chien invité de plus en plus souvent aux mariages et aux fêtes de famille.</p>
              </Carte>
              <Carte titre="SMS J-1 avant l'événement" c="bg-white">
                <p>Maison Babines : demain c'est le grand soir de [Chien] ! Conseils d'enfilage : [lien]. Un souci ? SOS Tenue jusqu'à 21 h : 04 00 00 00 01.</p>
              </Carte>
            </div>
            <Carte titre="Checklist de démarrage (à cocher par la marque)" c="bg-vert">
              <ul>
                <li>Déposer la marque et le personnage du Baron à l'INPI.</li>
                <li>Créer le projet Supabase et brancher le CRM (voir CRM.md).</li>
                <li>Ouvrir les comptes Instagram, TikTok, Pinterest, LinkedIn au nom @maisonbabines.</li>
                <li>Produire le premier shooting studio (8 pièces clés, fonds de couleur pop).</li>
                <li>Configurer l'outil d'e-mailing et les 3 premiers scénarios (bienvenue, malle abandonnée, post-événement).</li>
                <li>Signer un transporteur et un réseau de points relais.</li>
                <li>Recruter 15 micro-influenceurs et 20 wedding planners.</li>
                <li>Valider la charte bien-être avec un vétérinaire.</li>
                <li>Compléter les mentions légales (éditeur, hébergeur).</li>
              </ul>
            </Carte>
          </Section>

          <footer className="flex flex-col items-center gap-4 pt-14 text-center">
            <Logo className="text-[40px]" baseline />
            <p className="max-w-xl text-sm text-noir/70">Document de stratégie établi pour Maison Babines. Données de marché à vérifier, objectifs et budgets fournis à titre d'hypothèses de travail.</p>
            <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="no-print inline-flex min-h-[48px] items-center gap-2 rounded-pilule border-[3px] border-noir bg-creme px-5 font-extrabold shadow-petite"><ArrowUp size={18} strokeWidth={2.5} aria-hidden /> Haut de page</a>
          </footer>
        </main>
      </div>
    </div>
  );
}
