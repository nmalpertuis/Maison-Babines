import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ChevronRight, Heart, MessageCircle, Music2, Send, Play, MoreHorizontal } from 'lucide-react';
import { LogoMark } from '@/components/brand/LogoMark';
import { cx } from '@/lib/format';

/* Exemples de contenus prêts à publier, présentés en maquettes. Textes originaux Maison Babines. */

const img = (slug: string, n = 1) => `/images/produits/${slug}-${n}.webp`;
const mur = (n: number) => `/images/mur/babines-0${n}.webp`;

function Avatar({ taille = 32 }: { taille?: number }) {
  return <span className="grid shrink-0 place-items-center rounded-full bg-gradient-to-tr from-jaune via-rose to-bordeaux p-[2px]" style={{ width: taille, height: taille }}><LogoMark className="h-full w-full" avecTexte={false} /></span>;
}

function Telephone({ children, className, fond = 'bg-white' }: { children: ReactNode; className?: string; fond?: string }) {
  return (
    <div className={cx('mx-auto w-full max-w-[320px] break-inside-avoid rounded-[38px] border-[3px] border-noir bg-noir p-2.5 shadow-dure print:shadow-none', className)}>
      <div className={cx('relative overflow-hidden rounded-[30px]', fond)}>
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-noir" aria-hidden />
        {children}
      </div>
    </div>
  );
}

function PostInstagram({ image, legende, likes, date }: { image: string; legende: ReactNode; likes: string; date: string }) {
  return (
    <Telephone>
      <div className="pt-9 text-[13px] text-noir">
        <div className="flex items-center gap-2 px-3 py-2">
          <Avatar /><p className="flex-1 font-bold">maisonbabines</p><MoreHorizontal size={18} aria-hidden />
        </div>
        <img src={image} alt="" className="aspect-square w-full object-cover" loading="lazy" />
        <div className="flex items-center gap-3 px-3 py-2">
          <Heart size={22} aria-hidden className="fill-rose text-rose" /><MessageCircle size={22} aria-hidden /><Send size={22} aria-hidden /><Bookmark size={22} aria-hidden className="ml-auto" />
        </div>
        <p className="px-3 font-bold">{likes} J'aime</p>
        <div className="px-3 pb-2 pt-1 leading-snug"><span className="font-bold">maisonbabines </span>{legende}</div>
        <p className="px-3 pb-4 text-[11px] uppercase text-noir/50">{date}</p>
      </div>
    </Telephone>
  );
}

function Bloc({ titre, sous, children }: { titre: string; sous?: string; children: ReactNode }) {
  return (
    <div className="break-inside-avoid-page">
      <h3 className="font-titre text-[26px] font-black lg:text-[32px]">{titre}</h3>
      {sous && <p className="mt-1 text-noir/75">{sous}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

const apparition = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } as const;

export function ExemplesContenus() {
  return (
    <div className="flex flex-col gap-16">
      {/* 1. Feed Instagram */}
      <Bloc titre="1. Le feed Instagram au lancement" sous="Grille des 9 premiers posts : une couleur pop par case, alternance produit / coulisses / humour pour un feed reconnaissable d'un coup d'œil.">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <Telephone>
            <div className="px-4 pb-4 pt-10 text-[13px] text-noir">
              <div className="flex items-center gap-4">
                <Avatar taille={72} />
                <div className="grid flex-1 grid-cols-3 text-center"><p><strong className="block text-base">9</strong>posts</p><p><strong className="block text-base">1 482</strong>abonnés</p><p><strong className="block text-base">312</strong>suivis</p></div>
              </div>
              <p className="mt-3 font-bold">Maison Babines</p>
              <p className="leading-snug">Le grand soir, à quatre pattes. 🎩<br />Smokings, robes et capes à louer pour votre chien.<br />Livré J-3 · Retour sans lavage · Taille garantie<br />#BabinesDeGala</p>
              <p className="mt-1 font-semibold text-[#00376b]">maisonbabines.fr</p>
              <div className="mt-3 flex gap-2">{['Mariage', 'Atelier', 'Avis', 'Noël'].map((h) => <span key={h} className="flex flex-col items-center gap-1 text-[11px]"><span className="h-12 w-12 rounded-full border-2 border-noir/20 bg-creme" />{h}</span>)}</div>
            </div>
            <div className="grid grid-cols-3 gap-0.5">
              {[img('le-smoking-baron'), mur(2), img('la-robe-praline'), img('le-noeud-pap-velours', 2), img('la-cape-royale-duchesse'), mur(5), img('le-smoking-piscine'), img('la-chemise-flamant'), img('les-lunettes-star')].map((s, i) => (
                <img key={i} src={s} alt="" className="aspect-square w-full object-cover" loading="lazy" />
              ))}
            </div>
          </Telephone>
          <div className="grid content-start gap-3 sm:grid-cols-3">
            {[
              ['1', 'Lancement', 'Le Smoking Baron en portrait officiel. « Tenue de soirée exigée. Laisse comprise. »'],
              ['2', 'UGC', 'Premier client #BabinesDeGala reposté avec son autorisation.'],
              ['3', 'Produit', 'La Robe Praline, carrousel 4 vues.'],
              ['4', 'Détail', 'Gros plan du nœud pap\' velours : la finition main.'],
              ['5', 'Star', 'La Cape Royale : « On ne règne pas. On rayonne. »'],
              ['6', 'Coulisses', 'Contrôle qualité en 12 points (Reel).'],
              ['7', 'Produit', 'Le Smoking Piscine : « Pour les chiens qui osent. »'],
              ['8', 'Humour', 'Duchesse Moustache juge la Chemise Flamant.'],
              ['9', 'Offre', 'Les Lunettes Star dès 19 € + code BARON10.'],
            ].map(([n, t, d]) => (
              <motion.div key={n} {...apparition} className="rounded-2xl border-[3px] border-noir bg-white p-4">
                <p className="font-titre text-lg font-black">Post {n} · {t}</p>
                <p className="mt-1 text-sm">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Bloc>

      {/* 2. Posts avec légendes */}
      <Bloc titre="2. Trois posts prêts à publier" sous="Visuel, légende, hashtags et moment de publication conseillé.">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <PostInstagram
              image={img('le-smoking-baron')} likes="2 318" date="Samedi · 11 h 30"
              legende={<>Votre chien entre. La salle se tait. 🎩<br /><br />Le Smoking Baron : velours bordeaux, revers satinés, nœud pap' rose amovible. Livré 3 jours avant le grand jour, récupéré sans lavage.<br /><br />👉 89 € pour 4 jours, lien en bio.<br /><span className="text-[#00376b]">#BabinesDeGala #MariageAvecChien #ChienDHonneur #DogWedding #PorteurDAlliances</span></>}
            />
            <p className="mt-3 text-sm"><strong>Objectif :</strong> conversion mariage · <strong>Format :</strong> carrousel face / dos / détail.</p>
          </div>
          <div>
            <PostInstagram
              image={img('le-pull-de-fete-biscotte')} likes="1 904" date="Dimanche · 18 h"
              legende={<>Le pull de Noël, sans le placard toute l'année. 🎄<br /><br />Brodé de petits teckels (le Baron a validé). On le rend en janvier, on le retrouve en décembre.<br /><br />42 € les 4 jours · réservations ouvertes.<br /><span className="text-[#00376b]">#BabinesDeGala #NoelAvecMonChien #PhotoDeFamille #PullDeNoel</span></>}
            />
            <p className="mt-3 text-sm"><strong>Objectif :</strong> saison Noël · <strong>Publication :</strong> dès mi-novembre.</p>
          </div>
          <div>
            <PostInstagram
              image={img('les-lunettes-star', 2)} likes="3 077" date="Jeudi · 19 h"
              legende={<>Pas d'autographes, merci. 🕶️<br /><br />Les Lunettes Star, en rose ou en jaune, pour les anniversaires et les shootings qui comptent. Dès 19 €.<br /><br />Tague l'ami à quatre pattes qui mérite un tapis rouge 👇<br /><span className="text-[#00376b]">#BabinesDeGala #DogsOfInstagram #AnniversaireChien #Shooting</span></>}
            />
            <p className="mt-3 text-sm"><strong>Objectif :</strong> engagement (commentaires) · <strong>Mécanique :</strong> identification.</p>
          </div>
        </div>
      </Bloc>

      {/* 3. Scripts Reels / TikTok */}
      <Bloc titre="3. Deux scripts vidéo (Reels et TikTok)" sous="Format 9:16, 12 à 20 secondes, sous-titres incrustés. Prêts à tourner avec un smartphone.">
        <div className="grid gap-8">
          {[
            {
              titre: '« L\'entrée du porteur d\'alliances »', duree: '15 s', son: 'Musique de marche nuptiale, version orchestre', image: img('la-robe-meringue'),
              plans: [
                ['0-2 s', 'Plan serré sur la porte de l\'église, silence.', 'POV : le vrai invité d\'honneur arrive'],
                ['2-6 s', 'Le chien entre au ralenti en Smoking Baron, coussin d\'alliances.', 'Le Smoking Baron · 89 €'],
                ['6-9 s', 'Réactions des invités (de dos), une larme essuyée.', '(la mariée est ok avec ça)'],
                ['9-12 s', 'Gros plan sur les alliances livrées sans être mangées.', 'Mission accomplie ✅'],
                ['12-15 s', 'Logo + boîte à chapeau.', 'Livré J-3 · Retour sans lavage · maisonbabines.fr'],
              ],
            },
            {
              titre: '« Une tenue, 40 chiens »', duree: '18 s', son: 'Son tendance rythmé, coupe sur chaque temps', image: mur(3),
              plans: [
                ['0-2 s', 'Texte plein écran sur fond rose.', 'Cette tenue a été portée par 40 chiens'],
                ['2-12 s', 'Enchaînement rapide de chiens différents dans la même pièce, 1 plan par temps.', 'Mariage · Gala · Baptême · Shooting…'],
                ['12-15 s', 'Coulisses : vapeur, contrôle 12 points, mise sous housse.', 'Nettoyée et contrôlée après chaque location'],
                ['15-18 s', 'Le chien suivant reçoit sa boîte à chapeau.', 'Le luxe d\'un jour, sans le placard plein'],
              ],
            },
          ].map((v) => (
            <motion.div key={v.titre} {...apparition} className="grid gap-5 rounded-[24px] border-[3px] border-noir bg-white p-5 sm:grid-cols-[170px_1fr]">
              <div className="relative mx-auto aspect-[9/16] w-[150px] overflow-hidden rounded-2xl border-[3px] border-noir">
                <img src={v.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute inset-0 grid place-items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-creme/90"><Play size={22} aria-hidden /></span></span>
                <span className="absolute bottom-2 left-2 right-2 rounded-md bg-noir/70 px-1.5 py-1 text-[10px] font-bold text-creme">{v.plans[0][2]}</span>
              </div>
              <div>
                <p className="font-titre text-xl font-black">{v.titre}</p>
                <p className="text-sm text-noir/70">Durée {v.duree} · <Music2 size={14} className="inline" aria-hidden /> {v.son}</p>
                <table className="mt-3 w-full text-left text-[13px]">
                  <thead><tr className="border-b-2 border-noir"><th className="py-1 pr-2">Temps</th><th className="py-1 pr-2">Image</th><th className="py-1">Texte à l'écran</th></tr></thead>
                  <tbody>{v.plans.map(([t, im, tx]) => <tr key={t} className="border-b border-noir/10 align-top"><td className="py-1.5 pr-2 font-bold">{t}</td><td className="py-1.5 pr-2">{im}</td><td className="py-1.5 italic">{tx}</td></tr>)}</tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>
      </Bloc>

      {/* 4. Stories */}
      <Bloc titre="4. Séquence de stories (sondage + vente)" sous="3 stories enchaînées un mardi soir : on fait voter, on révèle, on vend.">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { image: img('le-smoking-minuit'), haut: 'Mariage en juin ?', sticker: <div className="mx-auto w-48 rounded-2xl bg-white p-3 text-center text-noir shadow-lg"><p className="text-xs font-bold">Pour le grand jour, ton chien porte…</p><div className="mt-2 grid grid-cols-2 gap-1.5 text-xs font-bold"><span className="rounded-lg bg-noir/5 py-2">🖤 Smoking</span><span className="rounded-lg bg-noir/5 py-2">🤍 Robe</span></div></div> },
            { image: img('la-robe-meringue', 2), haut: '72 % : la robe ! 🤍', sticker: <div className="mx-auto w-48 rounded-2xl bg-rose p-3 text-center text-noir shadow-lg"><p className="font-titre text-lg font-black">La Robe Meringue</p><p className="text-xs">Tulle · traîne 40 cm · voile assorti</p></div> },
            { image: img('le-porte-alliances-coussin'), haut: 'Le Pack Mariage', sticker: <div className="mx-auto w-48 rounded-2xl bg-jaune p-3 text-center text-noir shadow-lg"><p className="text-xs font-bold">Oui, je wouf · 149 € au lieu de 186 €</p><p className="mt-2 flex items-center justify-center gap-1 rounded-full bg-white py-1.5 text-xs font-bold">🔗 Réserver <ChevronRight size={14} aria-hidden /></p></div> },
          ].map((s, i) => (
            <Telephone key={i} fond="bg-noir" className="max-w-[260px]">
              <div className="relative aspect-[9/16]">
                <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-x-3 top-8 flex gap-1">{[0, 1, 2].map((k) => <span key={k} className={cx('h-0.5 flex-1 rounded-full', k <= i ? 'bg-white' : 'bg-white/40')} />)}</div>
                <div className="absolute left-3 top-11 flex items-center gap-2 text-xs font-bold text-white"><Avatar taille={24} /> maisonbabines</div>
                <p className="absolute inset-x-4 top-[22%] text-center font-titre text-2xl font-black text-white [text-shadow:0_2px_8px_rgba(0,0,0,.5)]">{s.haut}</p>
                <div className="absolute inset-x-0 bottom-10">{s.sticker}</div>
              </div>
            </Telephone>
          ))}
        </div>
      </Bloc>

      {/* 5. Publicités */}
      <Bloc titre="5. Deux publicités Meta (Instagram et Facebook)" sous="Test A/B : l'émotion (A) contre la raison (B). Même ciblage : fiancés et propriétaires de chiens, 25-45 ans, grandes villes.">
        <div className="grid gap-8 md:grid-cols-2">
          {[
            { lettre: 'A', image: img('la-robe-meringue'), texte: 'Le jour J, il y aura un invité très spécial. 🐾 Smoking ou robe de mariée pour votre chien, livrés 3 jours avant, récupérés sans lavage.', titre: 'Votre chien, témoin de mariage', cta: 'Découvrir' },
            { lettre: 'B', image: img('le-smoking-baron', 2), texte: 'Acheter une tenue de cérémonie pour un seul jour ? Louez-la jusqu\'à 70 % moins cher. Taille garantie, nettoyage inclus.', titre: 'Dès 19 € les 4 jours', cta: 'Réserver' },
          ].map((a) => (
            <motion.div key={a.lettre} {...apparition} className="overflow-hidden rounded-[20px] border-[3px] border-noir bg-white text-[14px]">
              <div className="flex items-center gap-2 p-3"><Avatar /><div><p className="font-bold leading-tight">Maison Babines</p><p className="text-xs text-noir/60">Sponsorisé</p></div><span className="ml-auto rounded-full bg-jaune px-2 py-0.5 text-xs font-extrabold">Version {a.lettre}</span></div>
              <p className="px-3 pb-3">{a.texte}</p>
              <img src={a.image} alt="" className="aspect-[4/5] w-full object-cover" loading="lazy" />
              <div className="flex items-center gap-3 bg-noir/5 p-3"><div className="flex-1"><p className="text-xs uppercase text-noir/60">maisonbabines.fr</p><p className="font-bold">{a.titre}</p></div><span className="rounded-lg bg-noir/10 px-4 py-2 font-bold">{a.cta}</span></div>
            </motion.div>
          ))}
        </div>
      </Bloc>

      {/* 6. Pinterest + Newsletter + LinkedIn */}
      <div className="grid gap-10 xl:grid-cols-3">
        <Bloc titre="6. Épingle Pinterest" sous="Format 2:3, texte incrusté, renvoie vers le catalogue filtré « mariage ».">
          <motion.div {...apparition} className="mx-auto max-w-[280px] overflow-hidden rounded-[24px] border-[3px] border-noir bg-rose">
            <div className="relative aspect-[2/3]">
              <img src={img('la-couronne-champetre')} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-noir/85 to-transparent p-5 pt-16 text-creme">
                <p className="surtitre text-jaune">Idée mariage</p>
                <p className="font-titre text-2xl font-black leading-tight">5 looks pour le chien d'honneur</p>
                <p className="mt-1 text-xs">maisonbabines.fr</p>
              </div>
            </div>
          </motion.div>
        </Bloc>
        <Bloc titre="7. Newsletter « La Gazette »" sous="Objet : Le carnet mondain d'octobre (et un secret du Baron)">
          <motion.div {...apparition} className="mx-auto max-w-[360px] overflow-hidden rounded-[20px] border-[3px] border-noir bg-creme text-[14px]">
            <div className="flex items-center justify-center gap-2 bg-bordeaux p-4 text-creme"><LogoMark className="h-10 w-10" /><p className="font-titre text-xl italic">La Gazette du Grand Hôtel</p></div>
            <div className="p-5">
              <p className="font-titre text-xl font-black">Le carnet mondain</p>
              <div className="mt-3 grid grid-cols-3 gap-1.5">{[1, 4, 6].map((n) => <img key={n} src={mur(n)} alt="" className="aspect-square w-full rounded-lg object-cover" loading="lazy" />)}</div>
              <p className="mt-3">Ce mois-ci, 212 chiens ont fait leur grand soir. Pistache a porté les alliances sans les manger : on applaudit.</p>
              <p className="mt-3 font-bold">Dans l'Atelier</p>
              <p>Mademoiselle Praline prépare la collection Hiver. Indice : il y aura du brocart.</p>
              <p className="mt-3 rounded-xl border-2 border-noir bg-jaune p-3 text-center font-bold">-10 % avec le code BARON10</p>
              <p className="mt-3 text-xs italic text-noir/70">Le mot de la Duchesse : « Toujours aucun chat. Je note. »</p>
            </div>
          </motion.div>
        </Bloc>
        <Bloc titre="8. Post LinkedIn (B2B)" sous="Cible : wedding planners et photographes.">
          <motion.div {...apparition} className="rounded-[20px] border-[3px] border-noir bg-white p-5 text-[14px]">
            <div className="flex items-center gap-2"><Avatar taille={40} /><div><p className="font-bold leading-tight">Maison Babines</p><p className="text-xs text-noir/60">Location de tenues de cérémonie pour chiens</p></div></div>
            <p className="mt-3 leading-relaxed">Un mariage sur trois accueille un chien. 🐾<br /><br />Pour les wedding planners, c'est souvent un casse-tête : la tenue, la taille, la livraison à temps.<br /><br />Nous avons créé une offre Pro : interlocuteur dédié, priorité sur le stock, ligne SOS le vendredi et le samedi, facturation mensuelle.<br /><br />Résultat avec nos 20 premiers partenaires : zéro retard le jour J.<br /><br />👉 Écrivez-nous pour recevoir le lookbook Pro.</p>
            <img src={img('la-queue-de-pie-tonnerre')} alt="" className="mt-3 aspect-video w-full rounded-xl object-cover" loading="lazy" />
          </motion.div>
        </Bloc>
      </div>
    </div>
  );
}
