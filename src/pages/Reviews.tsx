import { useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { reviews, NOTE_GLOBALE } from '@/data/reviews';
import { OCCASIONS } from '@/data/occasions';
import { products } from '@/data/products';
import type { Occasion } from '@/data/types';
import { deposerAvis } from '@/lib/crm';
import { cx } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { RatingStars } from '@/components/ui/RatingStars';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { Reveal } from '@/components/ui/Reveal';
import { Counter } from '@/components/ui/Counter';
import { FileUpload, Input, Select, Textarea } from '@/components/form/Field';
import { Meringue, Moustache } from '@/components/brand/illustrations';

type TriAvis = 'recents' | 'notes' | 'photo';
const FONDS = ['bg-creme', 'bg-rose', 'bg-jaune', 'bg-bleu', 'bg-vert', 'bg-orange'];

function FormulaireAvis({ fermer }: { fermer: () => void }) {
  const [v, setV] = useState({ prenom: '', chien: '', race: '', occasion: 'mariage', tenue: products[0].nom, note: 0, texte: '' });
  const [survol, setSurvol] = useState(0);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [etat, setEtat] = useState<'idle' | 'envoi' | 'ok'>('idle');

  const envoyer = async (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (v.prenom.trim().length < 2) err.prenom = 'Il manque un petit quelque chose ici.';
    if (v.chien.trim().length < 2) err.chien = 'Il manque un petit quelque chose ici.';
    if (!v.note) err.note = 'Choisissez une note de 1 à 5 étoiles.';
    if (v.texte.trim().length < 20) err.texte = '20 caractères minimum, le Baron aime les détails.';
    setErreurs(err);
    if (Object.keys(err).length) return;
    setEtat('envoi');
    try {
      await Promise.all([deposerAvis({ prenom: v.prenom, chien: v.chien, race: v.race, occasion: v.occasion, tenue: v.tenue, note: v.note, texte: v.texte }), new Promise((r) => setTimeout(r, 1500))]);
    } catch { /* envoi simulé : on confirme quand même */ }
    setEtat('ok');
  };

  if (etat === 'ok') {
    return (
      <div className="flex flex-col items-center p-8 pt-16 text-center" role="status">
        <Meringue pose="signe" className="w-56" />
        <p className="mt-6 font-titre text-2xl font-black">Merci ! Votre avis rejoint le Livre d'or après vérification par le Baron.</p>
        <Button className="mt-6" onClick={fermer}>Fermer</Button>
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} noValidate className="flex flex-col gap-5 p-6 pt-16 lg:p-8 lg:pt-16">
      <h2 className="text-[32px]">Laisser un avis</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label="Prénom" obligatoire value={v.prenom} onChange={(e) => setV({ ...v, prenom: e.target.value })} erreur={erreurs.prenom} />
        <Input label="Nom du chien" obligatoire value={v.chien} onChange={(e) => setV({ ...v, chien: e.target.value })} erreur={erreurs.chien} />
        <Input label="Race" value={v.race} onChange={(e) => setV({ ...v, race: e.target.value })} />
        <Select label="Occasion" value={v.occasion} onChange={(e) => setV({ ...v, occasion: e.target.value })}>
          {OCCASIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </Select>
        <Select label="Tenue" className="sm:col-span-2" value={v.tenue} onChange={(e) => setV({ ...v, tenue: e.target.value })}>
          {products.map((p) => <option key={p.id}>{p.nom}</option>)}
        </Select>
      </div>
      <fieldset>
        <legend className="etiquette">Note <span aria-hidden className="text-bordeaux">*</span></legend>
        <div className="flex gap-1" role="radiogroup" aria-label="Note" onMouseLeave={() => setSurvol(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={v.note === n} aria-label={`${n} étoile${n > 1 ? 's' : ''}`} onMouseEnter={() => setSurvol(n)} onClick={() => setV({ ...v, note: n })} className="grid h-12 w-12 place-items-center transition-transform hover:scale-125">
              <Star size={34} strokeWidth={2.2} className="text-noir" fill={(survol || v.note) >= n ? 'var(--or)' : 'var(--creme)'} />
            </button>
          ))}
        </div>
        <p aria-live="polite" className={cx('text-sm font-bold text-bordeaux', !erreurs.note && 'sr-only')}>{erreurs.note}</p>
      </fieldset>
      <Textarea label="Votre avis" obligatoire maxLength={1000} value={v.texte} onChange={(e) => setV({ ...v, texte: e.target.value })} erreur={erreurs.texte} />
      <FileUpload label="Photo (facultative)" aide="5 Mo max" onFichier={() => undefined} />
      <Button type="submit" taille="lg" chargement={etat === 'envoi'}>{etat === 'envoi' ? 'On repasse le nœud pap\'…' : 'Envoyer mon avis'}</Button>
    </form>
  );
}

export default function Reviews() {
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [note, setNote] = useState<number | null>(null);
  const [tri, setTri] = useState<TriAvis>('recents');
  const [nb, setNb] = useState(10);
  const [form, setForm] = useState(false);

  const liste = useMemo(() => {
    const r = reviews.filter((a) => (!occasion || a.occasion === occasion) && (!note || a.note === note));
    const t = { recents: (a: typeof r[0], b: typeof r[0]) => b.date.localeCompare(a.date), notes: (a: typeof r[0], b: typeof r[0]) => b.note - a.note, photo: (a: typeof r[0], b: typeof r[0]) => Number(!!b.photo) - Number(!!a.photo) };
    return [...r].sort(t[tri]);
  }, [occasion, note, tri]);
  const visibles = liste.slice(0, nb);

  return (
    <>
      <Seo titre="Le Livre d'or — 4,8/5 sur 1 243 avis · Maison Babines" description="Mariages, galas, Noël : nos clients et leurs chiens racontent leur grand soir." />
      <PageHeader
        fond="bg-rose" couleurFeston="var(--rose)" surtitre="Le Livre d'or"
        miettes={[{ label: 'Accueil', to: '/' }, { label: 'Avis' }]}
        titre="Ils sont venus, ils ont brillé"
        illustration={<Meringue pose="signe" className="w-full" />}
      />

      {/* Synthèse */}
      <section className="conteneur pb-10 pt-20" aria-labelledby="synthese-titre">
        <h2 id="synthese-titre" className="sr-only">Synthèse des avis</h2>
        <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <Reveal className="text-center lg:text-left">
            <p className="font-titre text-[120px] font-black leading-none">4,8</p>
            <RatingStars note={NOTE_GLOBALE.note} taille={30} />
            <p className="mt-2 font-bold">1 243 avis vérifiés <span className="text-sm font-normal text-noir/60">(fictif)</span></p>
          </Reveal>
          <Reveal delai={0.1}>
            <ul className="flex flex-col gap-2.5">
              {[5, 4, 3, 2, 1].map((n) => (
                <li key={n}>
                  <button type="button" onClick={() => setNote(note === n ? null : n)} aria-pressed={note === n} className={cx('flex w-full items-center gap-3 rounded-full px-2 py-1 text-sm font-bold transition', note === n ? 'bg-jaune' : 'hover:bg-jaune/40')}>
                    <span className="w-8">{n}★</span>
                    <span className="h-4 flex-1 overflow-hidden rounded-full border-2 border-noir bg-white">
                      <motion.span className="block h-full bg-or" initial={{ width: 0 }} whileInView={{ width: `${NOTE_GLOBALE.repartition[n]}%` }} viewport={{ once: true }} transition={{ duration: 1.1, delay: (5 - n) * 0.1, ease: [0.22, 1, 0.36, 1] }} />
                    </span>
                    <span className="w-12 text-right">{NOTE_GLOBALE.repartition[n]} %</span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delai={0.2}>
            <ul className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {[['Taille juste', 96], ['Livré à temps', 99], ['Recommanderaient', 98]].map(([t, v]) => (
                <li key={t} className="rounded-2xl border-[3px] border-noir bg-vert px-4 py-3 text-center shadow-petite lg:text-left">
                  <p className="font-titre text-3xl font-black"><Counter valeur={v as number} suffixe=" %" /></p>
                  <p className="text-sm font-bold">{t}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Bulle de Duchesse Moustache, fixée sur le côté */}
      <motion.div aria-hidden className="pointer-events-none fixed bottom-6 right-4 z-30 hidden w-48 xl:block" initial={{ x: 220 }} animate={{ x: 0 }} transition={{ delay: 1.2, type: 'spring', stiffness: 120, damping: 14 }}>
        <div className="relative mb-2 rounded-[18px] border-[3px] border-noir bg-creme p-3 font-titre text-sm italic shadow-petite">
          1 243 avis et aucun chat. Je dis ça, je dis rien.
          <span className="absolute -bottom-[12px] right-10 h-5 w-5 rotate-45 border-b-[3px] border-r-[3px] border-noir bg-creme" />
        </div>
        <Moustache className="ml-auto w-32" />
      </motion.div>
      <p className="sr-only">Duchesse Moustache : « 1 243 avis et aucun chat. Je dis ça, je dis rien. »</p>

      {/* Filtres */}
      <div className="conteneur">
        <div className="flex flex-col gap-4 border-y-[3px] border-noir py-5 lg:flex-row lg:items-center lg:justify-between">
          <LayoutGroup>
            <ul className="scroll-x -mx-6 flex gap-2 px-6 lg:mx-0 lg:px-0" aria-label="Filtrer par occasion">
              {[{ id: null, label: 'Tous' }, ...OCCASIONS.map((o) => ({ id: o.id, label: o.court }))].map((o) => (
                <li key={o.label}>
                  <button type="button" aria-pressed={occasion === o.id} onClick={() => { setOccasion(o.id); setNb(10); }} className="pastille relative bg-transparent">
                    {occasion === o.id && <motion.span layoutId="avis-occ" className="absolute inset-0 rounded-full bg-rose" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                    <span className="relative">{o.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </LayoutGroup>
          <div className="flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="note-f">Note</label>
            <select id="note-f" value={note ?? ''} onChange={(e) => setNote(e.target.value ? Number(e.target.value) : null)} className="champ w-auto font-semibold">
              <option value="">Toutes les notes</option>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>)}
            </select>
            <label className="sr-only" htmlFor="tri-a">Trier</label>
            <select id="tri-a" value={tri} onChange={(e) => setTri(e.target.value as TriAvis)} className="champ w-auto font-semibold">
              <option value="recents">Plus récents</option>
              <option value="notes">Mieux notés</option>
              <option value="photo">Avec photo</option>
            </select>
            <Button onClick={() => setForm(true)}>Laisser un avis</Button>
          </div>
        </div>
      </div>

      {/* Mosaïque */}
      <section className="conteneur pb-24 pt-10" aria-label="Avis clients">
        <p className="mb-6 font-bold" aria-live="polite">{liste.length} avis affiché{liste.length > 1 ? 's' : ''} sur ce filtre</p>
        <motion.ul layout className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>li]:mb-6 [&>li]:break-inside-avoid">
          <AnimatePresence mode="popLayout">
            {visibles.map((a, i) => (
              <motion.li key={a.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}>
                <ReviewCard avis={a} fond={FONDS[i % FONDS.length]} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {visibles.length === 0 && <p className="text-center font-titre text-2xl">Aucun avis pour ce filtre… pour l'instant.</p>}
        {nb < liste.length && (
          <div className="mt-6 text-center"><Button variante="secondaire" taille="lg" onClick={() => setNb((n) => n + 6)}>Voir plus d'avis</Button></div>
        )}
      </section>

      <Modal ouvert={form} fermer={() => setForm(false)} titre="Laisser un avis" large>
        <FormulaireAvis fermer={() => setForm(false)} />
      </Modal>
    </>
  );
}
