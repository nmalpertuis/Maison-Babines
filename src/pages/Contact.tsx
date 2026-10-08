import { useState, type FormEvent } from 'react';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Instagram, Mail, MapPin, Music2, Phone, Pin, Siren } from 'lucide-react';
import { enregistrerMessage } from '@/lib/crm';
import { isoJour } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { Checkbox, FileUpload, Input, Select, Textarea } from '@/components/form/Field';
import { Tonnerre } from '@/components/brand/illustrations';
import { FAQ } from '@/data/faq';

const SUJETS = ['Conseil taille', 'Ma réservation', 'Offre Pro', 'Presse et partenariats', 'Autre'];
const PRESELECTION: Record<string, string> = { pro: 'Offre Pro', taille: 'Conseil taille', reservation: 'Ma réservation', presse: 'Presse et partenariats' };
const MANQUE = 'Il manque un petit quelque chose ici.';

interface V { nom: string; email: string; tel: string; sujet: string; chien: string; date: string; resa: string; message: string; consent: boolean }

function valider(k: keyof V, v: V): string | undefined {
  switch (k) {
    case 'nom': return v.nom.trim().length < 2 ? MANQUE : undefined;
    case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()) ? undefined : 'Cette adresse e-mail ne semble pas valide.';
    case 'tel': return v.tel && !/^\d{10}$/.test(v.tel.replace(/[\s.]/g, '')) ? 'Indiquez un numéro à 10 chiffres.' : undefined;
    case 'sujet': return v.sujet ? undefined : MANQUE;
    case 'date': return v.date && v.date <= isoJour(new Date()) ? 'Choisissez une date à venir.' : undefined;
    case 'message': return v.message.trim().length < 20 ? '20 caractères minimum.' : undefined;
    case 'consent': return v.consent ? undefined : 'Merci de cocher cette case pour que l\'on puisse vous répondre.';
    default: return undefined;
  }
}

function PlanIllustre() {
  return (
    <svg viewBox="0 0 400 260" role="img" aria-label="Plan illustré : l'Atelier Maison Babines, 12 rue des Petits-Chiens, Lyon 2e, entre Rhône et Saône" className="h-auto w-full">
      <rect width="400" height="260" fill="#FFF6EA" />
      <path d="M-10 40 C60 60 80 120 60 280" fill="none" stroke="#3DB8F5" strokeWidth="34" />
      <path d="M330 -10 C300 80 360 160 340 280" fill="none" stroke="#3DB8F5" strokeWidth="40" />
      <text x="20" y="250" fontSize="13" fontWeight="800" fill="#1E1430" transform="rotate(-80 20 250)">Saône</text>
      <text x="352" y="210" fontSize="13" fontWeight="800" fill="#1E1430" transform="rotate(-80 352 210)">Rhône</text>
      {[[90, 30, 90, 70], [200, 30, 110, 60], [90, 120, 60, 80], [170, 120, 140, 50], [170, 190, 70, 60], [260, 190, 50, 50]].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill={['#FFC93C', '#2BC48A', '#FF6B4A', '#FFB3D1', '#FFC93C', '#2BC48A'][i]} stroke="#1E1430" strokeWidth="3" opacity=".9" />
      ))}
      <path d="M70 108 H320 M160 20 V250" stroke="#1E1430" strokeWidth="6" strokeLinecap="round" opacity=".25" />
      <text x="174" y="104" fontSize="11" fontWeight="800" fill="#1E1430">rue des Petits-Chiens</text>
      {/* pin en forme d'os */}
      <g transform="translate(210 66)">
        <path d="M0 40 L-10 18 H10Z" fill="#6B1E3F" stroke="#1E1430" strokeWidth="3" strokeLinejoin="round" />
        <rect x="-22" y="4" width="44" height="14" rx="6" fill="#FF4F9A" stroke="#1E1430" strokeWidth="3" />
        {[[-22, 4], [-22, 18], [22, 4], [22, 18]].map(([cx, cy]) => <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="8" fill="#FF4F9A" stroke="#1E1430" strokeWidth="3" />)}
        <rect x="-20" y="6" width="40" height="10" fill="#FF4F9A" />
      </g>
      <rect x="150" y="214" width="110" height="30" rx="15" fill="#6B1E3F" stroke="#1E1430" strokeWidth="3" />
      <text x="205" y="234" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FFF6EA">L'Atelier · Lyon 2e</text>
    </svg>
  );
}

export default function Contact() {
  const [params] = useSearchParams();
  const [v, setV] = useState<V>({ nom: '', email: '', tel: '', sujet: PRESELECTION[params.get('sujet') ?? ''] ?? '', chien: '', date: '', resa: '', message: '', consent: false });
  const [err, setErr] = useState<Partial<Record<keyof V, string>>>({});
  const [touche, setTouche] = useState<Partial<Record<keyof V, boolean>>>({});
  const [etat, setEtat] = useState<'idle' | 'envoi' | 'ok'>('idle');

  const set = <K extends keyof V>(k: K, val: V[K]) => {
    const n = { ...v, [k]: val };
    setV(n);
    if (touche[k]) setErr((e) => ({ ...e, [k]: valider(k, n) }));
  };
  const blur = (k: keyof V) => { setTouche((t) => ({ ...t, [k]: true })); setErr((e) => ({ ...e, [k]: valider(k, v) })); };
  const ok = (k: keyof V) => !!touche[k] && !valider(k, v) && !!v[k];

  const envoyer = async (e: FormEvent) => {
    e.preventDefault();
    const champs: (keyof V)[] = ['nom', 'email', 'tel', 'sujet', 'date', 'message', 'consent'];
    const errs = Object.fromEntries(champs.map((k) => [k, valider(k, v)]).filter(([, x]) => x));
    setErr(errs);
    setTouche(Object.fromEntries(champs.map((k) => [k, true])));
    if (Object.keys(errs).length) { document.getElementById(`ct-${Object.keys(errs)[0]}`)?.focus(); return; }
    setEtat('envoi');
    try {
      await Promise.all([
        enregistrerMessage({ nom: v.nom.trim(), email: v.email.trim(), telephone: v.tel, sujet: v.sujet, chien: v.chien || undefined, date_evenement: v.date || null, numero_reservation: v.resa || undefined, message: v.message.trim() }),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
    } catch { /* le message reste confirmé côté visiteur */ }
    setEtat('ok');
  };

  const top3 = [FAQ[1].questions[0], FAQ[2].questions[1], FAQ[4].questions[0]];

  return (
    <>
      <Seo titre="La Réception — Contact · Maison Babines" description="Un conseil taille ou une urgence ? Notre équipe répond sous 24 h ouvrées." />
      <PageHeader
        fond="bg-vert" couleurFeston="var(--vert)" surtitre="La Réception"
        miettes={[{ label: 'Accueil', to: '/' }, { label: 'Contact' }]}
        titre="Sonnez, on arrive"
        sousTitre="Une question, un conseil taille, une urgence de dernière minute ? Le personnel du Grand Hôtel vous répond sous 24 h ouvrées."
        illustration={<Tonnerre pose="comptoir" className="w-full" />}
      />

      <div className="conteneur grid gap-10 pb-16 pt-20 lg:grid-cols-[1.4fr_1fr]">
        <div aria-live="polite">
          <AnimatePresence mode="wait">
            {etat === 'ok' ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center overflow-hidden rounded-rayon border-[3px] border-noir bg-creme p-8 text-center shadow-dure lg:p-12" role="status">
                <motion.div initial={{ x: -300 }} animate={{ x: [-300, 0, 20, 0] }} transition={{ duration: 1.2, ease: 'easeOut' }} className="w-56">
                  <Tonnerre pose="court" className="w-full" />
                </motion.div>
                <p className="mt-6 font-titre text-3xl font-black">Message reçu ! Monsieur Tonnerre court le porter à la réception.</p>
                <p className="mt-3 text-lg">Réponse sous 24 h ouvrées.</p>
              </motion.div>
            ) : (
              <motion.form key="f" onSubmit={envoyer} noValidate exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-5 rounded-rayon border-[3px] border-noir bg-creme p-6 shadow-dure lg:p-8">
                <SplitTitle className="text-[32px] lg:text-[40px]" texte="Écrire à la Réception" />
                <p className="text-sm text-noir/70">Les champs marqués d'un * sont obligatoires.</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input id="ct-nom" label="Prénom et nom" obligatoire autoComplete="name" value={v.nom} onChange={(e) => set('nom', e.target.value)} onBlur={() => blur('nom')} erreur={err.nom} succes={ok('nom')} />
                  <Input id="ct-email" label="E-mail" type="email" obligatoire autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} onBlur={() => blur('email')} erreur={err.email} succes={ok('email')} />
                  <Input id="ct-tel" label="Téléphone" type="tel" autoComplete="tel" value={v.tel} onChange={(e) => set('tel', e.target.value)} onBlur={() => blur('tel')} erreur={err.tel} succes={ok('tel')} />
                  <Select id="ct-sujet" label="Sujet" obligatoire value={v.sujet} onChange={(e) => set('sujet', e.target.value)} onBlur={() => blur('sujet')} erreur={err.sujet}>
                    <option value="">Choisir un sujet</option>
                    {SUJETS.map((s) => <option key={s}>{s}</option>)}
                  </Select>
                  <Input id="ct-chien" label="Nom et race du chien" value={v.chien} onChange={(e) => set('chien', e.target.value)} />
                  <Input id="ct-date" label="Date de l'événement" type="date" min={isoJour(new Date())} value={v.date} onChange={(e) => set('date', e.target.value)} onBlur={() => blur('date')} erreur={err.date} />
                </div>
                <AnimatePresence>
                  {v.sujet === 'Ma réservation' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Input id="ct-resa" label="N° de réservation" placeholder="MB-2026-XXXX" value={v.resa} onChange={(e) => set('resa', e.target.value)} />
                    </motion.div>
                  )}
                  {v.sujet === 'Conseil taille' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <FileUpload label="Photo du chien (pour le conseil taille)" aide="Image, 5 Mo max" onFichier={() => undefined} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Textarea id="ct-message" label="Message" obligatoire maxLength={1000} value={v.message} onChange={(e) => set('message', e.target.value)} onBlur={() => blur('message')} erreur={err.message} succes={ok('message')} />
                <Checkbox id="ct-consent" obligatoire checked={v.consent} onChange={(e) => set('consent', e.target.checked)} erreur={err.consent} label={<span>J'accepte que mes données soient utilisées pour traiter ma demande (<Link to="/confidentialite" className="lien">confidentialité</Link>)</span>} />
                <Button type="submit" taille="lg" className="self-start" chargement={etat === 'envoi'}>{etat === 'envoi' ? 'On repasse le nœud pap\'…' : 'Envoyer à la Réception'}</Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <aside className="flex flex-col gap-6" aria-label="Coordonnées">
          <Reveal>
            <ul className="flex flex-col gap-4 rounded-rayon border-[3px] border-noir bg-white p-6">
              <li className="flex gap-3"><MapPin className="shrink-0" strokeWidth={2.5} aria-hidden /><span><strong>Adresse de l'Atelier :</strong> 12 rue des Petits-Chiens, 69002 Lyon. Visites et essayages sur rendez-vous.</span></li>
              <li className="flex gap-3"><Mail className="shrink-0" strokeWidth={2.5} aria-hidden /><a href="mailto:bonjour@maisonbabines.fr" className="lien">bonjour@maisonbabines.fr</a></li>
              <li className="flex gap-3"><Phone className="shrink-0" strokeWidth={2.5} aria-hidden /><a href="tel:+33400000000" className="lien">04 00 00 00 00</a></li>
              <li className="flex gap-3"><Clock className="shrink-0" strokeWidth={2.5} aria-hidden /><span>Du lundi au vendredi de 9 h à 19 h, le samedi de 10 h à 17 h.</span></li>
              <li className="flex gap-3"><Mail className="shrink-0" strokeWidth={2.5} aria-hidden /><span>Presse et partenariats : <a href="mailto:presse@maisonbabines.fr" className="lien">presse@maisonbabines.fr</a></span></li>
            </ul>
            <p className="mt-2 text-xs text-noir/60">Coordonnées fictives.</p>
          </Reveal>
          <Reveal delai={0.1}>
            <div className="rounded-rayon border-[3px] border-noir bg-orange p-6 shadow-dure">
              <p className="flex items-center gap-2 font-titre text-2xl font-black"><Siren strokeWidth={2.5} aria-hidden /> SOS Tenue</p>
              <p className="mt-2">Un problème la veille du grand jour ? Ligne d'urgence le vendredi et le samedi jusqu'à 21 h : <a href="tel:+33400000001" className="font-extrabold underline">04 00 00 00 01</a>.</p>
            </div>
          </Reveal>
          <Reveal delai={0.15}>
            <div className="overflow-hidden rounded-rayon border-[3px] border-noir shadow-dure"><PlanIllustre /></div>
          </Reveal>
          <ul className="flex gap-3" aria-label="Réseaux sociaux">
            {[[Instagram, 'Instagram'], [Music2, 'TikTok'], [Pin, 'Pinterest']].map(([I, n]) => {
              const Icone = I as typeof Instagram;
              return <li key={n as string}><a href="#" aria-label={`${n} (lien factice)`} className="grid h-12 w-12 place-items-center rounded-full border-[3px] border-noir bg-creme transition hover:-translate-y-1 hover:bg-rose"><Icone size={20} strokeWidth={2.5} aria-hidden /></a></li>;
            })}
          </ul>
        </aside>
      </div>

      <section className="conteneur pb-24" aria-labelledby="top3">
        <SplitTitle id="top3" className="text-[32px] lg:text-[40px]" texte="Les 3 questions les plus posées" />
        <Accordion className="mt-6" items={top3.map((x, i) => ({ id: String(i), titre: x.q, contenu: <p>{x.r}</p> }))} />
        <Link to="/faq" className="lien mt-6 inline-block">Toutes les réponses à la Conciergerie</Link>
      </section>
    </>
  );
}
