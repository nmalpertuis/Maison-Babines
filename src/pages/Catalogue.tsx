import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { addDays, addMonths } from 'date-fns';
import { PackageOpen, Ruler, ShieldCheck, SlidersHorizontal, Sparkles, Truck, X } from 'lucide-react';
import { OCCASIONS, occasionLabel } from '@/data/occasions';
import { GAMMES, TYPES, gammeLabel, typeLabel } from '@/data/products';
import { TAILLES } from '@/data/sizes';
import type { Teinte } from '@/data/types';
import { useFilters, PRIX_MAX, PRIX_MIN, TRIS } from '@/hooks/useFilters';
import { useFavorites } from '@/context/FavoritesContext';
import { TEINTES } from '@/lib/couleurs';
import { cx, dateCourte, depuisIso, isoJour } from '@/lib/format';
import { Seo } from '@/components/ui/Seo';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Checkbox, CHEVRON } from '@/components/form/Field';
import { Modal } from '@/components/ui/Modal';
import { Baron, Praline } from '@/components/brand/illustrations';
import { ProductCard } from '@/components/product/ProductCard';
import { SizeGuideModal } from '@/components/product/SizeGuide';

function Groupe({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <fieldset className="border-b-2 border-noir/10 pb-6">
      <legend className="mb-3 font-titre text-xl font-black">{titre}</legend>
      {children}
    </fieldset>
  );
}

function PriceRange({ min, max, onChange }: { min: number; max: number; onChange: (min: number, max: number) => void }) {
  const pct = (v: number) => ((v - PRIX_MIN) / (PRIX_MAX - PRIX_MIN)) * 100;
  const curseur = 'pointer-events-none absolute inset-x-0 top-1/2 h-0 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-noir [&::-webkit-slider-thumb]:bg-rose [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-noir [&::-moz-range-thumb]:bg-rose';
  return (
    <div>
      <div className="relative h-10">
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full border-2 border-noir bg-white" />
        <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-noir" style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }} />
        <input type="range" min={PRIX_MIN} max={PRIX_MAX} value={min} aria-label="Prix minimum" onChange={(e) => onChange(Math.min(Number(e.target.value), max - 5), max)} className={curseur} />
        <input type="range" min={PRIX_MIN} max={PRIX_MAX} value={max} aria-label="Prix maximum" onChange={(e) => onChange(min, Math.max(Number(e.target.value), min + 5))} className={curseur} />
      </div>
      <p className="mt-1 flex justify-between text-sm font-extrabold"><span>{min} €</span><span>{max} €</span></p>
    </div>
  );
}

export default function Catalogue() {
  const { favoris } = useFavorites();
  const { f, maj, basculer, toutEffacer, resultats, nbActifs } = useFilters(favoris);
  const [panneau, setPanneau] = useState(false);
  const [guide, setGuide] = useState(false);
  const occ = OCCASIONS.find((o) => o.id === f.occasion);

  const filtres = (
    <div className="flex flex-col gap-6">
      <Groupe titre="Type">
        <div className="flex flex-col gap-2.5">
          {TYPES.map((t) => <Checkbox key={t.id} label={t.label} checked={f.types.includes(t.id)} onChange={() => basculer('type', t.id, f.types)} />)}
        </div>
      </Groupe>
      <Groupe titre="Gamme">
        <div className="flex flex-col gap-2.5">
          {GAMMES.map((g) => <Checkbox key={g.id} label={<span>{g.label} <span className="text-sm text-noir/60">dès {g.des} €</span></span>} checked={f.gammes.includes(g.id)} onChange={() => basculer('gamme', g.id, f.gammes)} />)}
        </div>
      </Groupe>
      <Groupe titre="Taille">
        <div className="flex flex-wrap gap-2">
          {TAILLES.map((t) => (
            <button key={t} type="button" aria-pressed={f.tailles.includes(t)} onClick={() => basculer('taille', t, f.tailles)} className={cx('h-11 min-w-[48px] rounded-full border-[3px] border-noir px-2 text-sm font-extrabold transition', f.tailles.includes(t) ? 'bg-rose shadow-petite' : 'bg-white hover:bg-jaune/40')}>{t}</button>
          ))}
        </div>
        <button type="button" onClick={() => setGuide(true)} className="lien mt-3 inline-flex items-center gap-1.5 text-sm"><Ruler size={16} strokeWidth={2.5} aria-hidden /> Quelle taille pour mon chien ?</button>
      </Groupe>
      <Groupe titre="Couleur">
        <div className="flex flex-wrap gap-2.5">
          {TEINTES.map((c) => {
            const actif = f.couleurs.includes(c.id);
            return (
              <button key={c.id} type="button" aria-pressed={actif} aria-label={c.label} title={c.label} onClick={() => basculer('couleur', c.id, f.couleurs as Teinte[])}
                className={cx('h-11 w-11 rounded-full border-[3px] border-noir transition', actif ? 'scale-110 ring-[3px] ring-noir ring-offset-2 ring-offset-creme' : 'hover:scale-110')}
                style={{ background: c.hex }}
              />
            );
          })}
        </div>
      </Groupe>
      <Groupe titre="Prix (4 jours)">
        <PriceRange min={f.prixMin} max={f.prixMax} onChange={(a, b) => maj({ min: a, max: b })} />
      </Groupe>
      <Groupe titre="Disponible le">
        <input type="date" aria-label="Disponible le" value={f.date ?? ''} min={isoJour(addDays(new Date(), 3))} max={isoJour(addMonths(new Date(), 6))} onChange={(e) => maj({ date: e.target.value || null })} className="champ" />
        <p className="mt-2 text-sm text-noir/70">Masque les tenues déjà réservées ce jour-là.</p>
      </Groupe>
      <Button variante="secondaire" onClick={toutEffacer} disabled={nbActifs === 0}>Tout effacer</Button>
    </div>
  );

  const etiquettes: { label: string; retirer: () => void }[] = [
    ...f.types.map((t) => ({ label: typeLabel(t), retirer: () => basculer('type', t, f.types) })),
    ...f.gammes.map((g) => ({ label: gammeLabel(g), retirer: () => basculer('gamme', g, f.gammes) })),
    ...f.tailles.map((t) => ({ label: `Taille ${t}`, retirer: () => basculer('taille', t, f.tailles) })),
    ...f.couleurs.map((c) => ({ label: TEINTES.find((x) => x.id === c)?.label ?? c, retirer: () => basculer('couleur', c, f.couleurs) })),
    ...(f.prixMin !== PRIX_MIN || f.prixMax !== PRIX_MAX ? [{ label: `${f.prixMin} € – ${f.prixMax} €`, retirer: () => maj({ min: null, max: null }) }] : []),
    ...(f.date ? [{ label: `Libre le ${dateCourte(depuisIso(f.date))}`, retirer: () => maj({ date: null }) }] : []),
    ...(f.favoris ? [{ label: 'Mes favoris', retirer: () => maj({ favoris: null }) }] : []),
  ];

  const grille = resultats.flatMap((p, i) => {
    const carte = (
      <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
        <ProductCard produit={p} />
      </motion.li>
    );
    if (i === 5) {
      return [carte, (
        <motion.li key="conseil" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="sm:col-span-2 xl:col-span-1">
          <div className="flex h-full flex-col items-start justify-between gap-6 rounded-rayon border-[3px] border-noir bg-bordeaux p-7 text-creme shadow-dure">
            <Baron pose="salue" className="w-full max-w-[260px]" />
            <div>
              <p className="font-titre text-3xl font-black leading-tight">Vous hésitez ? Le Baron vous conseille gratuitement</p>
              <ButtonLink to="/contact?sujet=taille" variante="jaune" className="mt-5">Demander conseil</ButtonLink>
            </div>
          </div>
        </motion.li>
      )];
    }
    return [carte];
  });

  return (
    <>
      <Seo titre="Le Grand Dressing — Tenues de cérémonie pour chien à louer" description="20 tenues d'exception pour mariage, gala, baptême ou Noël, à louer dès 19 € pour 4 jours." />
      <PageHeader
        fond="bg-jaune" couleurFeston="var(--jaune)" surtitre="Le Grand Dressing"
        miettes={[{ label: 'Accueil', to: '/' }, { label: 'Catalogue', ...(occ ? { to: '/catalogue' } : {}) }, ...(occ ? [{ label: occ.label }] : [])]}
        titre={occ ? occ.titre : f.favoris ? 'Vos favoris du Grand Dressing' : 'Toute la garde-robe du Grand Hôtel'}
        sousTitre="20 pièces d'exception, à louer dès 19 € pour 4 jours."
        illustration={
          <div className="relative">
            <svg viewBox="0 0 300 60" aria-hidden className="absolute -top-2 left-0 w-full"><path d="M10 30 H290" stroke="#1E1430" strokeWidth="6" strokeLinecap="round" /><path d="M20 30 V60 M280 30 V60" stroke="#1E1430" strokeWidth="5" /></svg>
            <Praline className="relative w-full" />
          </div>
        }
      />

      <div className="conteneur pb-20 pt-14">
        {/* Barre d'occasions */}
        <nav aria-label="Occasions" className="scroll-x -mx-6 px-6 lg:mx-0 lg:px-0">
          <LayoutGroup>
            <ul className="flex gap-3 pb-2">
              {[{ id: null, label: 'Tout' }, ...OCCASIONS.map((o) => ({ id: o.id, label: o.court }))].map((o) => {
                const actif = f.occasion === o.id;
                return (
                  <li key={o.label}>
                    <button type="button" aria-pressed={actif} onClick={() => maj({ occasion: o.id })} className="pastille relative bg-transparent">
                      {actif && <motion.span layoutId="occ-active" className="absolute inset-0 -z-0 rounded-full bg-rose" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                      <span className="relative">{o.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block" aria-label="Filtres">
            <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pb-4 pr-2">{filtres}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-titre text-2xl font-black" aria-live="polite">
                <motion.span key={resultats.length} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block">{resultats.length}</motion.span>{' '}
                tenue{resultats.length > 1 ? 's' : ''} trouvée{resultats.length > 1 ? 's' : ''}
                {f.occasion && <span className="sr-only"> pour {occasionLabel(f.occasion)}</span>}
              </p>
              <div className="flex items-center gap-3">
                <Button variante="secondaire" className="lg:hidden" onClick={() => setPanneau(true)} icone={<SlidersHorizontal size={18} strokeWidth={2.5} aria-hidden />}>Filtrer ({nbActifs})</Button>
                <label htmlFor="tri" className="sr-only">Trier par</label>
                <select id="tri" value={f.tri} onChange={(e) => maj({ tri: e.target.value })} className="champ w-auto appearance-none bg-[length:20px] bg-[right_14px_center] bg-no-repeat pr-11 font-semibold" style={{ backgroundImage: CHEVRON }}>
                  {TRIS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
            </div>

            {etiquettes.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Filtres actifs">
                <AnimatePresence>
                  {etiquettes.map((e) => (
                    <motion.li key={e.label} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
                      <button type="button" onClick={e.retirer} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-[3px] border-noir bg-jaune pl-3 pr-2 text-sm font-extrabold" aria-label={`Retirer le filtre ${e.label}`}>
                        {e.label} <X size={16} strokeWidth={3} aria-hidden />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
                <li><button type="button" onClick={toutEffacer} className="lien min-h-[40px] text-sm">Tout effacer</button></li>
              </ul>
            )}

            {resultats.length > 0 ? (
              <motion.ul layout className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">{grille}</AnimatePresence>
              </motion.ul>
            ) : (
              <div className="mt-10 flex flex-col items-center rounded-rayon border-[3px] border-dashed border-noir bg-white/60 p-10 text-center">
                <Baron pose="loupe" className="w-full max-w-sm" />
                <p className="mt-6 max-w-md font-titre text-2xl font-black">Aucune tenue ne correspond. Même le Baron a cherché sous le tapis.</p>
                <Button className="mt-6" onClick={toutEffacer}>Effacer les filtres</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Réassurance */}
      <section aria-label="Nos garanties" className="border-y-[3px] border-noir bg-bleu">
        <ul className="conteneur grid grid-cols-2 gap-6 py-10 text-center font-extrabold lg:grid-cols-4">
          {[[Truck, 'Livraison J-3'], [PackageOpen, 'Retour gratuit'], [Sparkles, 'Nettoyage inclus'], [ShieldCheck, 'Taille garantie']].map(([I, t]) => {
            const Icone = I as typeof Truck;
            return (
              <li key={t as string} className="flex flex-col items-center gap-3">
                <span className="grid h-16 w-16 place-items-center rounded-full border-[3px] border-noir bg-creme shadow-petite"><Icone size={28} strokeWidth={2.5} aria-hidden /></span>
                {t as string}
              </li>
            );
          })}
        </ul>
      </section>
      <div className="h-24 bg-creme" />

      <Modal ouvert={panneau} fermer={() => setPanneau(false)} titre="Filtres" depuisBas>
        <div className="p-6 pt-16">
          <h2 className="mb-6 text-[32px]">Filtrer</h2>
          {filtres}
          <Button pleine className="sticky bottom-0 mt-6" onClick={() => setPanneau(false)}>Voir {resultats.length} tenue{resultats.length > 1 ? 's' : ''}</Button>
        </div>
      </Modal>
      <SizeGuideModal ouvert={guide} fermer={() => setGuide(false)} />
      <p className="sr-only"><Link to="/guide-des-tailles">Guide des tailles</Link></p>
    </>
  );
}
