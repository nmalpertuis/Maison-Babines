import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { datesLocation, recapMalle } from '@/hooks/usePrice';
import { CODES_PROMO, OPTIONS } from '@/data/packs';
import { gammeLabel } from '@/data/products';
import { OCCASIONS } from '@/data/occasions';
import { cx, dateCourte, dateLongue, euros } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ProductImage } from '@/components/ui/ProductImage';
import { Stepper } from '@/components/ui/Stepper';
import { Baron } from '@/components/brand/illustrations';
import { lireStockage, ecrireStockage } from '@/hooks/useLocalStorage';

export const CLE_CODE = 'babines-code-promo';

function MalleVide() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center">
      <div className="relative w-full max-w-md">
        <Baron className="relative z-10 w-full" />
        <svg viewBox="0 0 300 120" aria-hidden className="-mt-10 w-full">
          <rect x="30" y="20" width="240" height="90" rx="14" fill="#6B1E3F" stroke="#1E1430" strokeWidth="4" />
          <path d="M30 50 H270" stroke="#C9A227" strokeWidth="4" />
          <rect x="130" y="40" width="40" height="22" rx="4" fill="#C9A227" stroke="#1E1430" strokeWidth="3" />
          <path d="M60 20 V110 M240 20 V110" stroke="#1E1430" strokeWidth="4" />
        </svg>
      </div>
      <p className="mt-8 font-titre text-3xl font-black">Votre malle est vide. Le Baron s'ennuie.</p>
      <ButtonLink to="/catalogue" taille="lg" className="mt-8">Remplir ma malle</ButtonLink>
      <p className="mt-10 font-bold">Ou commencez par une occasion :</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-3">
        {OCCASIONS.map((o) => (
          <li key={o.id}><Link to={`/catalogue?occasion=${o.id}`} className="pastille">{o.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export function Recap({ code, children, sticky = true }: { code: string | null; children?: React.ReactNode; sticky?: boolean }) {
  const { items } = useCart();
  const r = recapMalle(items, code ?? undefined);
  return (
    <aside aria-label="Récapitulatif" className={cx('rounded-rayon border-[3px] border-noir bg-creme p-6 shadow-dure', sticky && 'lg:sticky lg:top-32')}>
      <h2 className="font-titre text-[28px] font-black">Récapitulatif</h2>
      <dl className="mt-5 flex flex-col gap-3">
        <div className="flex justify-between"><dt>Sous-total</dt><dd className="font-bold">{euros(r.sousTotal)}</dd></div>
        {r.remise > 0 && <div className="flex justify-between text-bordeaux"><dt>Code {code}</dt><dd className="font-bold">-{euros(r.remise)}</dd></div>}
        <div className="flex justify-between"><dt>Livraison</dt><dd className="font-bold">{r.livraison === 0 ? 'Offerte' : euros(r.livraison)}</dd></div>
      </dl>
      <div className="mt-4">
        <div className="h-3 overflow-hidden rounded-full border-2 border-noir bg-white">
          <motion.div className="h-full bg-vert" initial={false} animate={{ width: `${Math.min(100, (r.sousTotal / OPTIONS.seuilLivraisonOfferte) * 100)}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>
        <p className="mt-2 text-sm font-semibold" aria-live="polite">
          {r.livraisonOfferte ? 'Livraison offerte : le Baron régale !' : `Plus que ${euros(r.resteAvantOffert)} pour la livraison offerte`}
        </p>
      </div>
      {children}
      <div className="mt-5 flex items-baseline justify-between border-t-[3px] border-noir pt-4">
        <span className="font-extrabold">Total</span>
        <motion.span key={r.total} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="font-titre text-4xl font-black">{euros(r.total)}</motion.span>
      </div>
      <p className="mt-3 rounded-2xl border-2 border-noir bg-jaune/40 px-3 py-2 text-sm font-semibold">Caution totale : {euros(r.caution)} (empreinte bancaire, non débitée)</p>
    </aside>
  );
}

export default function Cart() {
  const { items, retirer } = useCart();
  const nav = useNavigate();
  const [code, setCode] = useState<string | null>(() => lireStockage<string | null>(CLE_CODE, null));
  const [saisie, setSaisie] = useState(code ?? '');
  const [erreurCode, setErreurCode] = useState<string | null>(null);
  const r = recapMalle(items, code ?? undefined);

  const appliquer = (e: FormEvent) => {
    e.preventDefault();
    const c = saisie.trim().toUpperCase();
    if (CODES_PROMO[c]) { setCode(c); ecrireStockage(CLE_CODE, c); setErreurCode(null); }
    else { setErreurCode('Ce code ne figure pas dans le registre du Baron.'); }
  };

  return (
    <>
      <Seo titre="Votre malle · Maison Babines" description="Les tenues que vous avez choisies pour le grand soir." />
      <div className="conteneur pb-24 pt-10">
        <p className="surtitre text-bordeaux">La Malle</p>
        <h1 className="mt-2 text-[48px] lg:text-[80px]">Votre malle</h1>
        {items.length > 0 && <Stepper etape={0} className="mt-8" />}

        {items.length === 0 ? <MalleVide /> : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
            <ul className="flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {r.lignes.map(({ item, produit, prix }) => {
                  const d = datesLocation(item.dateEvenement, item.express, item.joursSupp);
                  const options = [item.assurance && 'Assurance "Pattes de velours"', item.deuxiemeTaille && 'Deuxième taille', item.express && 'Livraison express', item.joursSupp > 0 && `+${item.joursSupp} jour${item.joursSupp > 1 ? 's' : ''}`].filter(Boolean);
                  const lienModif = `/produit/${produit.slug}?taille=${item.taille}&date=${item.dateEvenement}&jours=${item.joursSupp}&assurance=${+item.assurance}&deuxieme=${+item.deuxiemeTaille}&express=${+item.express}#reservation`;
                  return (
                    <motion.li key={item.key} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -80, height: 0, marginBottom: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }}>
                      <article className="grid gap-5 rounded-rayon border-[3px] border-noir bg-white p-4 shadow-dure sm:grid-cols-[160px_1fr] sm:p-5">
                        <Link to={`/produit/${produit.slug}`} className="block overflow-hidden rounded-2xl border-[3px] border-noir"><ProductImage src={produit.images[0]} alt={produit.alt} couleur={produit.couleurFond} className="aspect-square" /></Link>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="surtitre text-xs text-bordeaux">{gammeLabel(produit.gamme)}</p>
                              <h2 className="font-titre text-2xl font-black"><Link to={`/produit/${produit.slug}`} className="hover:underline">{produit.nom}</Link></h2>
                            </div>
                            <p className="font-titre text-2xl font-black">{euros(prix)}</p>
                          </div>
                          <p className="text-sm"><strong>Taille :</strong> {item.taille} · <strong>Événement :</strong> {dateLongue(d.evenement)}</p>
                          <p className="text-sm text-noir/75">Livraison le {dateCourte(d.livraison)} · Retour à poster le {dateCourte(d.retour)}</p>
                          {options.length > 0 && <p className="text-sm"><strong>Options :</strong> {options.join(', ')}</p>}
                          <div className="mt-auto flex flex-wrap gap-3 pt-2">
                            <ButtonLink to={lienModif} variante="secondaire" taille="sm" icone={<Pencil size={16} strokeWidth={2.5} aria-hidden />}>Modifier</ButtonLink>
                            <Button variante="secondaire" taille="sm" onClick={() => retirer(item.key)} icone={<Trash2 size={16} strokeWidth={2.5} aria-hidden />} aria-label={`Retirer ${produit.nom} de la malle`}>Retirer</Button>
                          </div>
                        </div>
                      </article>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
            <Recap code={code}>
              <form onSubmit={appliquer} className="mt-5" noValidate>
                <label htmlFor="code" className="etiquette">Code promo</label>
                <div className="flex gap-2">
                  <input id="code" value={saisie} onChange={(e) => setSaisie(e.target.value)} className="champ flex-1 uppercase" placeholder="BARON10" aria-invalid={!!erreurCode} aria-describedby="code-msg" />
                  <button type="submit" className="min-h-[48px] rounded-pilule border-[3px] border-noir bg-jaune px-4 font-extrabold">OK</button>
                </div>
                <p id="code-msg" aria-live="polite" className={cx('mt-1.5 flex items-center gap-1.5 text-sm font-bold', erreurCode ? 'text-bordeaux' : code ? 'text-noir' : 'sr-only')}>
                  {erreurCode ? <><AlertCircle size={16} strokeWidth={2.5} aria-hidden /> {erreurCode}</> : code ? <><CheckCircle2 size={16} strokeWidth={2.5} className="text-vert" aria-hidden /> Code {code} appliqué : -{Math.round(CODES_PROMO[code] * 100)} %</> : null}
                </p>
              </form>
              <Button pleine taille="lg" className="mt-6" onClick={() => nav('/malle/reservation')}>Valider ma réservation</Button>
            </Recap>
          </div>
        )}
      </div>
    </>
  );
}
