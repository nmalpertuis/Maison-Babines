import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { addDays, isBefore, startOfDay } from 'date-fns';
import { Heart, Minus, Plus, Ruler, ShieldCheck, Sparkles, Truck, PackageOpen } from 'lucide-react';
import type { Product } from '@/data/types';
import { gammeLabel } from '@/data/products';
import { OPTIONS } from '@/data/packs';
import { useAvailability } from '@/hooks/useAvailability';
import { datesLocation, prixLigne } from '@/hooks/usePrice';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { DatePicker } from '@/components/ui/DatePicker';
import { Checkbox } from '@/components/form/Field';
import { SizeGuideModal } from '@/components/product/SizeGuide';
import { cx, dateCourte, depuisIso, euros, isoJour } from '@/lib/format';
import { SizePicker } from './SizePicker';

export function BookingPanel({ produit }: { produit: Product }) {
  const [params] = useSearchParams();
  const tailleInit = params.get('taille');
  const editDate = params.get('date');
  const [taille, setTaille] = useState<string | null>(
    tailleInit && (produit.tailles as string[]).includes(tailleInit) && !produit.taillesIndisponibles.includes(tailleInit) ? tailleInit : null,
  );
  const [date, setDate] = useState<Date | null>(editDate ? depuisIso(editDate) : null);
  const [joursSupp, setJoursSupp] = useState(Number(params.get('jours') ?? 0));
  const [assurance, setAssurance] = useState(params.get('assurance') === '1');
  const [deuxiemeTaille, setDeuxiemeTaille] = useState(params.get('deuxieme') === '1');
  const [express, setExpress] = useState(params.get('express') === '1');
  const [guide, setGuide] = useState(false);
  const indispos = useAvailability(produit.id);
  const { ajouter } = useCart();
  const { estFavori, basculer } = useFavorites();
  const { notifier } = useToast();
  const reduit = useReducedMotion();

  // Si l'option express est décochée, une date à moins de 3 jours n'est plus valable.
  useEffect(() => {
    if (date && !express && isBefore(date, addDays(startOfDay(new Date()), 3))) setDate(null);
  }, [express, date]);

  const total = prixLigne(produit.prix, { joursSupp, assurance, deuxiemeTaille, express });
  const dates = date ? datesLocation(isoJour(date), express, joursSupp) : null;
  const pret = !!taille && !!date;
  const fav = estFavori(produit.id);

  const valider = () => {
    if (!taille || !date) return;
    const nouveau = ajouter({ productId: produit.id, taille, dateEvenement: isoJour(date), joursSupp, assurance, deuxiemeTaille, express });
    notifier({
      type: 'succes',
      texte: nouveau ? `${produit.nom} est dans votre malle` : `${produit.nom} a été mis à jour dans votre malle`,
      actions: [{ label: 'Voir ma malle', to: '/malle' }, { label: 'Continuer' }],
    });
  };

  const plage = useMemo(() => (dates ? { debut: dates.livraison, fin: dates.retour } : null), [dates]);

  return (
    <div id="reservation" className="flex flex-col gap-6 scroll-mt-28">
      <div>
        <p className="surtitre text-bordeaux">{gammeLabel(produit.gamme)}</p>
        <h1 className="mt-2 text-[44px] lg:text-[60px]">{produit.nom}</h1>
        <a href="#avis" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold hover:underline">
          <RatingStars note={produit.note} /> {produit.note.toLocaleString('fr-FR')}/5 · {produit.nbAvis} avis
        </a>
      </div>

      <div>
        <p><span className="font-titre text-5xl font-black">{euros(produit.prix)}</span> <span className="font-semibold">pour 4 jours, nettoyage inclus</span></p>
        <p className="mt-1 text-sm text-noir/75">Caution de {euros(produit.caution)} par simple empreinte bancaire, non débitée.</p>
      </div>

      <p className="font-titre text-2xl italic">« {produit.accroche} »</p>

      {/* Taille */}
      <fieldset>
        <div className="mb-3 flex items-center justify-between gap-4">
          <legend className="font-extrabold">Taille {taille && <span className="font-semibold text-noir/70">: {taille}</span>}</legend>
          <button type="button" onClick={() => setGuide(true)} className="lien inline-flex items-center gap-1.5 text-sm"><Ruler size={16} strokeWidth={2.5} aria-hidden /> Guide des tailles</button>
        </div>
        <SizePicker tailles={produit.tailles} indisponibles={produit.taillesIndisponibles} valeur={taille} onChange={setTaille} />
        <p className="mt-3 flex items-center gap-2 rounded-2xl border-[3px] border-noir bg-vert/25 px-4 py-2.5 text-sm font-semibold">
          <ShieldCheck size={18} strokeWidth={2.5} aria-hidden className="shrink-0" /> Taille garantie : si ça ne va pas, échange express offert.
        </p>
      </fieldset>

      {/* Date */}
      <div>
        <p className="mb-3 font-extrabold" id="date-label">Date de l'événement</p>
        <DatePicker valeur={date} onChange={setDate} delaiMin={express ? 1 : 3} indisponibles={indispos} plage={plage} />
        <AnimatePresence>
          {dates && (
            <motion.p
              initial={reduit ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden rounded-2xl border-[3px] border-noir bg-bleu/30 px-4 py-3 text-sm font-semibold"
              aria-live="polite"
            >
              Livraison le {dateCourte(dates.livraison)} · Événement le {dateCourte(dates.evenement)} · Retour à poster le {dateCourte(dates.retour)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Durée */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-[3px] border-noir bg-white px-4 py-3">
        <div>
          <p className="font-extrabold">Durée : 4 jours inclus</p>
          <p className="text-sm text-noir/70">+ jours supplémentaires ({euros(OPTIONS.jourSupp)} par jour)</p>
        </div>
        <div className="flex items-center gap-3" role="group" aria-label="Jours supplémentaires">
          <button type="button" onClick={() => setJoursSupp((j) => Math.max(0, j - 1))} disabled={joursSupp === 0} aria-label="Retirer un jour" className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-noir bg-creme disabled:opacity-40"><Minus size={18} strokeWidth={2.5} /></button>
          <output className="w-8 text-center font-titre text-2xl font-black" aria-live="polite">{joursSupp}</output>
          <button type="button" onClick={() => setJoursSupp((j) => Math.min(7, j + 1))} disabled={joursSupp === 7} aria-label="Ajouter un jour" className="grid h-11 w-11 place-items-center rounded-full border-[3px] border-noir bg-creme disabled:opacity-40"><Plus size={18} strokeWidth={2.5} /></button>
        </div>
      </div>

      {/* Options */}
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-extrabold">Options</legend>
        <Checkbox checked={assurance} onChange={(e) => setAssurance(e.target.checked)} label={<span>Assurance "Pattes de velours" <strong>+{euros(OPTIONS.assurance)}</strong><br /><span className="text-sm text-noir/70">Couvre taches tenaces, petits accrocs, griffures</span></span>} />
        <Checkbox checked={deuxiemeTaille} onChange={(e) => setDeuxiemeTaille(e.target.checked)} label={<span>Deuxième taille "au cas où" <strong>+{euros(OPTIONS.deuxiemeTaille)}</strong><br /><span className="text-sm text-noir/70">On envoie la taille au-dessus, vous renvoyez les deux</span></span>} />
        <Checkbox checked={express} onChange={(e) => setExpress(e.target.checked)} label={<span>Livraison express J-1 <strong>+{euros(OPTIONS.express)}</strong><br /><span className="text-sm text-noir/70">Commande avant 12 h</span></span>} />
      </fieldset>

      {/* Total */}
      <div className="flex items-baseline justify-between rounded-2xl border-[3px] border-noir bg-jaune px-5 py-4 shadow-dure">
        <span className="font-extrabold">Total :</span>
        <motion.span key={total} className="font-titre text-4xl font-black" initial={reduit ? false : { scale: 1.25, color: '#6B1E3F' }} animate={{ scale: 1, color: '#1E1430' }} transition={{ type: 'spring', stiffness: 400, damping: 14 }} aria-live="polite">
          {euros(total)}
        </motion.span>
      </div>

      <div className="flex flex-col gap-3">
        <Button taille="lg" pleine disabled={!pret} onClick={valider} aria-describedby={!pret ? 'aide-ajout' : undefined}>Ajouter à la malle</Button>
        {!pret && <p id="aide-ajout" className="text-center text-sm font-semibold text-noir/70">Choisissez une taille et une date</p>}
        <Button variante="secondaire" pleine onClick={() => basculer(produit.id)} aria-pressed={fav} icone={<Heart size={18} strokeWidth={2.5} className={cx(fav && 'fill-rose')} aria-hidden />}>
          {fav ? 'Dans vos favoris' : 'Ajouter aux favoris'}
        </Button>
      </div>

      <ul className="grid grid-cols-3 gap-3 text-center text-xs font-bold sm:text-sm">
        {[
          { i: Truck, t: 'Livraison J-3' },
          { i: PackageOpen, t: 'Retour gratuit sans lavage' },
          { i: Sparkles, t: 'Nettoyage professionnel inclus' },
        ].map(({ i: I, t }) => (
          <li key={t} className="flex flex-col items-center gap-2 rounded-2xl border-[3px] border-noir bg-creme p-3">
            <I size={24} strokeWidth={2.5} aria-hidden /> {t}
          </li>
        ))}
      </ul>
      <SizeGuideModal ouvert={guide} fermer={() => setGuide(false)} />

      {/* Barre fixée en bas sur mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t-[3px] border-noir bg-creme px-4 py-3 lg:hidden">
        <div className="leading-tight">
          <p className="font-titre text-2xl font-black">{euros(total)}</p>
          <p className="text-xs text-noir/70">pour {4 + joursSupp} jours</p>
        </div>
        {pret ? (
          <Button className="flex-1" onClick={valider}>Ajouter à la malle</Button>
        ) : (
          <a href="#reservation" className="flex min-h-[48px] flex-1 items-center justify-center rounded-pilule border-[3px] border-noir bg-rose px-4 text-center text-sm font-extrabold">Choisissez une taille et une date</a>
        )}
      </div>
    </div>
  );
}
