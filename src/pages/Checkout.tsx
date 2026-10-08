import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Home as HomeIcon, Lock, MapPin, PartyPopper } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { datesLocation, recapMalle } from '@/hooks/usePrice';
import { enregistrerReservation } from '@/lib/crm';
import { lireStockage } from '@/hooks/useLocalStorage';
import { cx, isoJour } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { Button } from '@/components/ui/Button';
import { Stepper } from '@/components/ui/Stepper';
import { Checkbox, Input } from '@/components/form/Field';
import { useToast } from '@/components/ui/Toast';
import { CLE_CODE, Recap } from './Cart';

const RELAIS = [
  { id: 'r1', nom: 'Relais Le Petit Bouledogue', adresse: '8 place des Terreaux, 69001 Lyon' },
  { id: 'r2', nom: 'Tabac-Presse du Parc', adresse: '41 cours Vitton, 69006 Lyon' },
  { id: 'r3', nom: 'Fleuriste Les Pétales', adresse: '15 rue Saint-Jean, 69005 Lyon' },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MESSAGE_ERREUR = 'Il manque un petit quelque chose ici.';

interface Coord { prenom: string; nom: string; email: string; tel: string; chien: string; mode: 'domicile' | 'relais' | 'evenement'; adresse: string; cp: string; ville: string; relais: string; cgl: boolean }

export const CLE_CONFIRMATION = 'babines-confirmation';

export default function Checkout() {
  const { items, vider } = useCart();
  const nav = useNavigate();
  const { notifier } = useToast();
  const [etape, setEtape] = useState<1 | 2>(1);
  const [envoi, setEnvoi] = useState(false);
  const [c, setC] = useState<Coord>({ prenom: '', nom: '', email: '', tel: '', chien: '', mode: 'domicile', adresse: '', cp: '', ville: '', relais: 'r1', cgl: false });
  const [erreurs, setErreurs] = useState<Partial<Record<keyof Coord, string>>>({});
  const code = lireStockage<string | null>(CLE_CODE, null);

  if (items.length === 0 && !envoi) return <Navigate to="/malle" replace />;

  const valider = (champ: keyof Coord, v = c[champ]): string | undefined => {
    const s = String(v).trim();
    switch (champ) {
      case 'prenom': case 'nom': case 'chien': return s.length < 2 ? MESSAGE_ERREUR : undefined;
      case 'email': return EMAIL.test(s) ? undefined : 'Cette adresse e-mail ne semble pas valide.';
      case 'tel': return /^0\d{9}$/.test(s.replace(/\s/g, '')) ? undefined : 'Indiquez un numéro à 10 chiffres.';
      case 'adresse': return c.mode !== 'relais' && s.length < 5 ? MESSAGE_ERREUR : undefined;
      case 'cp': return c.mode !== 'relais' && !/^\d{5}$/.test(s) ? 'Code postal à 5 chiffres.' : undefined;
      case 'ville': return c.mode !== 'relais' && s.length < 2 ? MESSAGE_ERREUR : undefined;
      case 'cgl': return v ? undefined : 'Merci d\'accepter les conditions de location.';
      default: return undefined;
    }
  };
  const sortie = (champ: keyof Coord) => setErreurs((e) => ({ ...e, [champ]: valider(champ) }));
  const set = <K extends keyof Coord>(k: K, v: Coord[K]) => {
    setC((x) => ({ ...x, [k]: v }));
    if (erreurs[k]) setErreurs((e) => ({ ...e, [k]: valider(k, v) }));
  };

  const etape1 = (e: FormEvent) => {
    e.preventDefault();
    const champs: (keyof Coord)[] = ['prenom', 'nom', 'email', 'tel', 'chien', 'adresse', 'cp', 'ville', 'cgl'];
    const errs = Object.fromEntries(champs.map((k) => [k, valider(k)]).filter(([, v]) => v));
    setErreurs(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`co-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setEtape(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmer = async () => {
    setEnvoi(true);
    const r = recapMalle(items, code ?? undefined);
    const premier = [...items].sort((a, b) => a.dateEvenement.localeCompare(b.dateEvenement))[0];
    const d = datesLocation(premier.dateEvenement, premier.express);
    const numero = `MB-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const relais = RELAIS.find((x) => x.id === c.relais)!;
    const adresse = c.mode === 'relais' ? `${relais.nom}, ${relais.adresse}` : `${c.adresse}, ${c.cp} ${c.ville}`;
    const reservation = {
      numero, client_email: c.email.trim(), client_nom: `${c.prenom.trim()} ${c.nom.trim()}`, telephone: c.tel.replace(/\s/g, ''),
      chien: c.chien.trim(), mode_livraison: c.mode, adresse,
      date_evenement: premier.dateEvenement, date_livraison: isoJour(d.livraison),
      articles: r.lignes.map((l) => ({
        productId: l.produit.id, nom: l.produit.nom, taille: l.item.taille, prix: l.prix,
        options: [l.item.assurance && 'Assurance', l.item.deuxiemeTaille && '2e taille', l.item.express && 'Express', l.item.joursSupp > 0 && `+${l.item.joursSupp} j`].filter(Boolean) as string[],
      })),
      sous_total: r.sousTotal, remise: r.remise, livraison: r.livraison, total: r.total, caution: r.caution, code_promo: code,
    };
    try {
      await Promise.all([enregistrerReservation(reservation), new Promise((res) => setTimeout(res, 1500))]);
    } catch {
      // La confirmation reste affichée au client ; l'erreur est signalée sans bloquer le parcours simulé.
      notifier({ type: 'erreur', texte: 'La réservation n\'a pas pu être transmise au registre. Le Baron la notera à la main.' });
    }
    sessionStorage.setItem(CLE_CONFIRMATION, JSON.stringify({ numero, chien: reservation.chien, dateEvenement: premier.dateEvenement, dateLivraison: reservation.date_livraison, total: r.total, caution: r.caution, articles: reservation.articles }));
    vider();
    localStorage.removeItem(CLE_CODE);
    nav('/confirmation');
  };

  return (
    <>
      <Seo titre="Réservation · Maison Babines" description="Vos coordonnées pour la livraison de votre tenue." />
      <div className="conteneur pb-24 pt-10">
        <Link to="/malle" className="lien inline-flex items-center gap-1.5 text-sm"><ArrowLeft size={16} strokeWidth={2.5} aria-hidden /> Retour à la malle</Link>
        <h1 className="mt-4 text-[44px] lg:text-[72px]">{etape === 1 ? 'Vos coordonnées' : 'Paiement'}</h1>
        <Stepper etape={1} className="mt-8" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          <AnimatePresence mode="wait">
            {etape === 1 ? (
              <motion.form key="c" onSubmit={etape1} noValidate initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="flex flex-col gap-8 rounded-rayon border-[3px] border-noir bg-creme p-6 shadow-dure lg:p-8">
                <fieldset className="grid gap-5 sm:grid-cols-2">
                  <legend className="mb-4 font-titre text-2xl font-black">Vous</legend>
                  <Input id="co-prenom" label="Prénom" obligatoire autoComplete="given-name" value={c.prenom} onChange={(e) => set('prenom', e.target.value)} onBlur={() => sortie('prenom')} erreur={erreurs.prenom} succes={!!c.prenom && !valider('prenom')} />
                  <Input id="co-nom" label="Nom" obligatoire autoComplete="family-name" value={c.nom} onChange={(e) => set('nom', e.target.value)} onBlur={() => sortie('nom')} erreur={erreurs.nom} succes={!!c.nom && !valider('nom')} />
                  <Input id="co-email" label="E-mail" type="email" obligatoire autoComplete="email" value={c.email} onChange={(e) => set('email', e.target.value)} onBlur={() => sortie('email')} erreur={erreurs.email} succes={!!c.email && !valider('email')} />
                  <Input id="co-tel" label="Téléphone" type="tel" obligatoire autoComplete="tel" value={c.tel} onChange={(e) => set('tel', e.target.value)} onBlur={() => sortie('tel')} erreur={erreurs.tel} succes={!!c.tel && !valider('tel')} />
                  <Input id="co-chien" label="Nom du chien" obligatoire className="sm:col-span-2" value={c.chien} onChange={(e) => set('chien', e.target.value)} onBlur={() => sortie('chien')} erreur={erreurs.chien} aide="Il figurera sur sa carte d'invitation." succes={!!c.chien && !valider('chien')} />
                </fieldset>

                <fieldset>
                  <legend className="mb-4 font-titre text-2xl font-black">Livraison</legend>
                  <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Mode de livraison">
                    {([['domicile', 'À domicile', HomeIcon], ['relais', 'En point relais', MapPin], ['evenement', "Sur le lieu de l'événement", PartyPopper]] as const).map(([v, l, I]) => (
                      <label key={v} className={cx('flex cursor-pointer flex-col items-start gap-2 rounded-2xl border-[3px] border-noir p-4 font-bold transition', c.mode === v ? 'bg-rose shadow-petite' : 'bg-white hover:bg-jaune/30')}>
                        <input type="radio" name="mode" value={v} checked={c.mode === v} onChange={() => set('mode', v)} className="sr-only" />
                        <I size={22} strokeWidth={2.5} aria-hidden /> {l}
                      </label>
                    ))}
                  </div>
                  <div className="mt-5">
                    {c.mode === 'relais' ? (
                      <div className="flex flex-col gap-3" role="radiogroup" aria-label="Point relais">
                        {RELAIS.map((r) => (
                          <label key={r.id} className={cx('flex cursor-pointer items-start gap-3 rounded-2xl border-[3px] border-noir p-4 transition', c.relais === r.id ? 'bg-jaune' : 'bg-white')}>
                            <input type="radio" name="relais" checked={c.relais === r.id} onChange={() => set('relais', r.id)} className="mt-1 h-5 w-5 accent-[#FF4F9A]" />
                            <span><strong className="block">{r.nom}</strong><span className="text-sm">{r.adresse}</span> <span className="text-xs text-noir/60">(fictif)</span></span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="grid gap-5 sm:grid-cols-[1fr_140px_1fr]">
                        <Input id="co-adresse" label={c.mode === 'evenement' ? "Adresse du lieu (domaine, hôtel…)" : 'Adresse'} obligatoire className="sm:col-span-3" autoComplete="street-address" value={c.adresse} onChange={(e) => set('adresse', e.target.value)} onBlur={() => sortie('adresse')} erreur={erreurs.adresse} />
                        <Input id="co-cp" label="Code postal" obligatoire inputMode="numeric" autoComplete="postal-code" value={c.cp} onChange={(e) => set('cp', e.target.value)} onBlur={() => sortie('cp')} erreur={erreurs.cp} />
                        <Input id="co-ville" label="Ville" obligatoire className="sm:col-span-2" autoComplete="address-level2" value={c.ville} onChange={(e) => set('ville', e.target.value)} onBlur={() => sortie('ville')} erreur={erreurs.ville} />
                      </div>
                    )}
                  </div>
                </fieldset>

                <Checkbox id="co-cgl" obligatoire checked={c.cgl} onChange={(e) => set('cgl', e.target.checked)} erreur={erreurs.cgl} label={<span>J'accepte les <Link to="/conditions-de-location" target="_blank" className="lien">conditions de location</Link></span>} />
                <Button type="submit" taille="lg" className="self-start">Continuer vers le paiement</Button>
              </motion.form>
            ) : (
              <motion.div key="p" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="flex flex-col gap-6 rounded-rayon border-[3px] border-noir bg-creme p-6 shadow-dure lg:p-8">
                <p className="flex items-start gap-3 rounded-2xl border-[3px] border-noir bg-jaune p-4 font-extrabold">
                  <Lock size={22} strokeWidth={2.5} aria-hidden className="shrink-0" /> Projet étudiant : aucun paiement réel n'est effectué.
                </p>
                <fieldset disabled className="grid gap-5 opacity-60 sm:grid-cols-2">
                  <legend className="mb-4 font-titre text-2xl font-black">Carte bancaire (désactivé)</legend>
                  <Input label="Numéro de carte" placeholder="•••• •••• •••• ••••" className="sm:col-span-2" readOnly />
                  <Input label="Expiration" placeholder="MM / AA" readOnly />
                  <Input label="Cryptogramme" placeholder="•••" readOnly />
                </fieldset>
                <p className="text-sm text-noir/75">La caution reste une simple empreinte bancaire, non débitée, libérée sous 72 h après contrôle du retour.</p>
                <div className="flex flex-wrap gap-3">
                  <Button variante="secondaire" onClick={() => setEtape(1)} disabled={envoi}>Modifier mes coordonnées</Button>
                  <Button taille="lg" onClick={confirmer} chargement={envoi}>{envoi ? 'On repasse le nœud pap\'…' : 'Confirmer ma réservation'}</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Recap code={code} />
        </div>
      </div>
    </>
  );
}
