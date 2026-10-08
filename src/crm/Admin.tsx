import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3, CalendarClock, Download, Inbox, LogOut, Mail, MessageSquare, RefreshCw, Search, Star, Users, X, Euro, PackageCheck, Database,
} from 'lucide-react';
import { format, parseISO, isAfter, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  chargerTout, connexion, deconnexion, mettreAJour, modeDemo, reinitialiserDemo, sessionActive,
  type Donnees, type Reservation, type StatutReservation, type StatutMessage, type StatutAvis, type Client,
} from '@/lib/crm';
import { cx, euros } from '@/lib/format';
import { LogoMark } from '@/components/brand/LogoMark';
import { BaronHead } from '@/components/brand/illustrations';

/* ------------------------------------------------------------------ */

const STATUTS_RESA: { id: StatutReservation; label: string; c: string }[] = [
  { id: 'nouvelle', label: 'Nouvelle', c: 'bg-rose' },
  { id: 'preparee', label: 'Préparée', c: 'bg-jaune' },
  { id: 'expediee', label: 'Expédiée', c: 'bg-bleu' },
  { id: 'livree', label: 'Livrée', c: 'bg-vert' },
  { id: 'retournee', label: 'Retournée', c: 'bg-orange' },
  { id: 'cloturee', label: 'Clôturée', c: 'bg-noir/15' },
  { id: 'annulee', label: 'Annulée', c: 'bg-noir/10 line-through' },
];
const STATUTS_MSG: { id: StatutMessage; label: string; c: string }[] = [
  { id: 'nouveau', label: 'Nouveau', c: 'bg-rose' },
  { id: 'en_cours', label: 'En cours', c: 'bg-jaune' },
  { id: 'traite', label: 'Traité', c: 'bg-vert' },
];
const STATUTS_AVIS: { id: StatutAvis; label: string; c: string }[] = [
  { id: 'a_moderer', label: 'À modérer', c: 'bg-jaune' },
  { id: 'publie', label: 'Publié', c: 'bg-vert' },
  { id: 'refuse', label: 'Refusé', c: 'bg-noir/15' },
];

type Onglet = 'tableau' | 'reservations' | 'clients' | 'messages' | 'newsletter' | 'avis';

const d = (s?: string | null, f = 'd MMM yyyy') => (s ? format(parseISO(s), f, { locale: fr }) : '—');

function Pastille({ c, children }: { c: string; children: ReactNode }) {
  return <span className={cx('inline-flex items-center rounded-full border-2 border-noir px-2.5 py-0.5 text-xs font-extrabold', c)}>{children}</span>;
}

function exportCsv(nom: string, lignes: Record<string, unknown>[]) {
  if (!lignes.length) return;
  const cols = Object.keys(lignes[0]);
  const esc = (v: unknown) => `"${String(typeof v === 'object' && v !== null ? JSON.stringify(v) : v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(';'), ...lignes.map((l) => cols.map((c) => esc(l[c])).join(';'))].join('\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: `${nom}-${format(new Date(), 'yyyy-MM-dd')}.csv` });
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/* Connexion                                                           */
/* ------------------------------------------------------------------ */
function Connexion({ ok }: { ok: () => void }) {
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const go = async (e: FormEvent) => {
    e.preventDefault();
    setEnvoi(true); setErr(null);
    try { await connexion(email, mdp); ok(); } catch { setErr('Identifiants incorrects.'); } finally { setEnvoi(false); }
  };
  return (
    <div className="grid min-h-screen place-items-center bg-bordeaux p-4">
      <form onSubmit={go} className="w-full max-w-sm rounded-rayon border-[3px] border-noir bg-creme p-8 shadow-dure">
        <LogoMark className="mx-auto h-24 w-24" />
        <h1 className="mt-4 text-center text-[32px]">Espace équipe</h1>
        <p className="mt-1 text-center text-sm text-noir/70">Le registre du Grand Hôtel</p>
        <label className="etiquette mt-6" htmlFor="a-email">{modeDemo ? 'Identifiant' : 'E-mail'}</label>
        <input id="a-email" type={modeDemo ? 'text' : 'email'} autoComplete="username" autoCapitalize="none" className="champ" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="etiquette mt-4" htmlFor="a-mdp">Mot de passe</label>
        <input id="a-mdp" type="password" autoComplete="current-password" className="champ" value={mdp} onChange={(e) => setMdp(e.target.value)} required />
        {err && <p className="mt-3 text-sm font-bold text-bordeaux" role="alert">{err}</p>}
        <button disabled={envoi} className="mt-6 min-h-[48px] w-full rounded-pilule border-[3px] border-noir bg-rose font-extrabold shadow-dure disabled:opacity-60">{envoi ? 'Connexion…' : 'Entrer'}</button>
        <Link to="/" className="lien mt-4 block text-center text-sm">Retour au site</Link>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tableau de bord                                                     */
/* ------------------------------------------------------------------ */
function TableauDeBord({ data, aller }: { data: Donnees; aller: (o: Onglet) => void }) {
  const actives = data.reservations.filter((r) => r.statut !== 'annulee');
  const ca = actives.reduce((s, r) => s + r.total, 0);
  const panier = actives.length ? ca / actives.length : 0;
  const aujourdhui = startOfDay(new Date());
  const aVenir = actives.filter((r) => r.date_livraison && isAfter(parseISO(r.date_livraison), aujourdhui) && ['nouvelle', 'preparee'].includes(r.statut))
    .sort((a, b) => a.date_livraison.localeCompare(b.date_livraison));
  const nouveauxMsg = data.messages.filter((m) => m.statut === 'nouveau').length;
  const parStatut = STATUTS_RESA.map((s) => ({ ...s, n: data.reservations.filter((r) => r.statut === s.id).length }));
  const max = Math.max(1, ...parStatut.map((s) => s.n));
  const topProduits = Object.entries(
    actives.flatMap((r) => r.articles).reduce<Record<string, number>>((acc, a) => ({ ...acc, [a.nom]: (acc[a.nom] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const kpis = [
    { l: 'Chiffre d\'affaires', v: euros(ca), i: Euro, c: 'bg-vert' },
    { l: 'Réservations', v: String(actives.length), i: PackageCheck, c: 'bg-rose' },
    { l: 'Panier moyen', v: euros(Math.round(panier * 100) / 100), i: BarChart3, c: 'bg-jaune' },
    { l: 'Clients', v: String(data.clients.length), i: Users, c: 'bg-bleu' },
    { l: 'Messages à traiter', v: String(nouveauxMsg), i: Inbox, c: 'bg-orange', o: 'messages' as Onglet },
    { l: 'Abonnés Gazette', v: String(data.newsletter.length), i: Mail, c: 'bg-creme', o: 'newsletter' as Onglet },
  ];

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k, i) => (
          <motion.li key={k.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <button type="button" onClick={() => k.o && aller(k.o)} className={cx('flex h-full w-full flex-col gap-2 rounded-2xl border-[3px] border-noir p-4 text-left shadow-petite transition', k.c, k.o && 'hover:-translate-y-0.5')}>
              <k.i size={22} strokeWidth={2.5} aria-hidden />
              <span className="font-titre text-3xl font-black">{k.v}</span>
              <span className="text-sm font-bold">{k.l}</span>
            </button>
          </motion.li>
        ))}
      </ul>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border-[3px] border-noir bg-white p-5">
          <h2 className="font-titre text-2xl font-black">Réservations par statut</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {parStatut.map((s) => (
              <li key={s.id} className="flex items-center gap-3 text-sm font-bold">
                <span className="w-24">{s.label}</span>
                <span className="h-6 flex-1 overflow-hidden rounded-lg border-2 border-noir bg-creme">
                  <motion.span className={cx('block h-full', s.c)} initial={{ width: 0 }} animate={{ width: `${(s.n / max) * 100}%` }} transition={{ duration: 0.8 }} />
                </span>
                <span className="w-6 text-right">{s.n}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border-[3px] border-noir bg-white p-5">
          <h2 className="flex items-center gap-2 font-titre text-2xl font-black"><CalendarClock strokeWidth={2.5} aria-hidden /> Livraisons à préparer</h2>
          {aVenir.length === 0 ? <p className="mt-4 text-noir/70">Rien à préparer. Le Baron fait la sieste.</p> : (
            <ul className="mt-4 divide-y-2 divide-noir/10">
              {aVenir.slice(0, 6).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span><strong>{d(r.date_livraison, 'EEE d MMM')}</strong> · {r.chien} · {r.articles.map((a) => `${a.nom} (${a.taille})`).join(', ')}</span>
                  <Pastille c={STATUTS_RESA.find((s) => s.id === r.statut)!.c}>{STATUTS_RESA.find((s) => s.id === r.statut)!.label}</Pastille>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl border-[3px] border-noir bg-white p-5 lg:col-span-2">
          <h2 className="font-titre text-2xl font-black">Tenues les plus louées</h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-5">
            {topProduits.map(([n, c], i) => (
              <li key={n} className="rounded-xl border-2 border-noir bg-creme p-3 text-sm"><span className="font-titre text-xl font-black">#{i + 1}</span><br /><strong>{n}</strong><br />{c} location{c > 1 ? 's' : ''}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Réservations                                                        */
/* ------------------------------------------------------------------ */
function FicheReservation({ r, fermer, maj }: { r: Reservation; fermer: () => void; maj: (champs: Partial<Reservation>) => void }) {
  const [notes, setNotes] = useState(r.notes ?? '');
  return (
    <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }} className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l-[3px] border-noir bg-creme p-6 shadow-[-8px_0_0_rgba(30,20,48,.15)]" aria-label={`Réservation ${r.numero}`}>
      <button type="button" onClick={fermer} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border-[3px] border-noir" aria-label="Fermer"><X size={18} strokeWidth={2.5} /></button>
      <p className="surtitre text-bordeaux">Réservation</p>
      <h2 className="mt-1 text-[32px]">{r.numero}</h2>
      <p className="text-sm text-noir/70">Créée le {d(r.created_at, 'd MMM yyyy à HH:mm')}</p>
      <label className="etiquette mt-5" htmlFor="st">Statut</label>
      <select id="st" className="champ" value={r.statut} onChange={(e) => maj({ statut: e.target.value as StatutReservation })}>
        {STATUTS_RESA.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      <dl className="mt-5 grid grid-cols-[130px_1fr] gap-x-3 gap-y-2 text-sm">
        <dt className="font-bold">Client</dt><dd>{r.client_nom}</dd>
        <dt className="font-bold">E-mail</dt><dd><a className="lien" href={`mailto:${r.client_email}`}>{r.client_email}</a></dd>
        <dt className="font-bold">Téléphone</dt><dd>{r.telephone || '—'}</dd>
        <dt className="font-bold">Chien</dt><dd>{r.chien}</dd>
        <dt className="font-bold">Livraison</dt><dd>{r.mode_livraison} · {r.adresse}</dd>
        <dt className="font-bold">À livrer le</dt><dd>{d(r.date_livraison, 'EEEE d MMMM')}</dd>
        <dt className="font-bold">Événement</dt><dd>{d(r.date_evenement, 'EEEE d MMMM')}</dd>
      </dl>
      <h3 className="mt-6 font-titre text-xl font-black">Articles</h3>
      <ul className="mt-2 divide-y-2 divide-noir/10 rounded-xl border-2 border-noir bg-white px-3">
        {r.articles.map((a, i) => <li key={i} className="flex justify-between py-2 text-sm"><span>{a.nom} · {a.taille}{a.options.length > 0 && ` · ${a.options.join(', ')}`}</span><strong>{euros(a.prix)}</strong></li>)}
      </ul>
      <dl className="mt-3 grid grid-cols-2 gap-1 text-sm">
        <dt>Sous-total</dt><dd className="text-right">{euros(r.sous_total)}</dd>
        {r.remise > 0 && <><dt>Remise {r.code_promo}</dt><dd className="text-right">-{euros(r.remise)}</dd></>}
        <dt>Livraison</dt><dd className="text-right">{r.livraison ? euros(r.livraison) : 'Offerte'}</dd>
        <dt className="font-extrabold">Total</dt><dd className="text-right font-extrabold">{euros(r.total)}</dd>
        <dt>Caution (empreinte)</dt><dd className="text-right">{euros(r.caution)}</dd>
      </dl>
      <label className="etiquette mt-6" htmlFor="notes">Notes internes</label>
      <textarea id="notes" className="champ min-h-[110px]" value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== (r.notes ?? '') && maj({ notes })} placeholder="Retouche, demande particulière…" />
    </motion.aside>
  );
}

function Reservations({ data, maj }: { data: Donnees; maj: (id: string, c: Partial<Reservation>) => void }) {
  const [q, setQ] = useState('');
  const [statut, setStatut] = useState<string>('');
  const [ouverte, setOuverte] = useState<string | null>(null);
  const liste = data.reservations.filter((r) =>
    (!statut || r.statut === statut) &&
    (!q || `${r.numero} ${r.client_nom} ${r.client_email} ${r.chien}`.toLowerCase().includes(q.toLowerCase())));
  const r = data.reservations.find((x) => x.id === ouverte);
  return (
    <div>
      <Barre q={q} setQ={setQ} placeholder="N°, client, chien…">
        <select className="champ w-auto" value={statut} onChange={(e) => setStatut(e.target.value)} aria-label="Filtrer par statut">
          <option value="">Tous les statuts</option>
          {STATUTS_RESA.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <BoutonCsv onClick={() => exportCsv('reservations', liste as unknown as Record<string, unknown>[])} />
      </Barre>
      <Tableau entetes={['N°', 'Client', 'Chien', 'Événement', 'Livraison', 'Total', 'Statut']}>
        {liste.map((x) => {
          const s = STATUTS_RESA.find((y) => y.id === x.statut)!;
          return (
            <tr key={x.id} onClick={() => setOuverte(x.id)} className="cursor-pointer border-t-2 border-noir/10 hover:bg-jaune/30">
              <td className="px-3 py-3 font-bold"><button type="button" className="underline" onClick={() => setOuverte(x.id)}>{x.numero}</button></td>
              <td className="px-3 py-3">{x.client_nom}<br /><span className="text-xs text-noir/60">{x.client_email}</span></td>
              <td className="px-3 py-3">{x.chien}</td>
              <td className="px-3 py-3">{d(x.date_evenement)}</td>
              <td className="px-3 py-3">{d(x.date_livraison)}</td>
              <td className="px-3 py-3 font-bold">{euros(x.total)}</td>
              <td className="px-3 py-3"><Pastille c={s.c}>{s.label}</Pastille></td>
            </tr>
          );
        })}
      </Tableau>
      {liste.length === 0 && <Vide />}
      <AnimatePresence>{r && <FicheReservation key={r.id} r={r} fermer={() => setOuverte(null)} maj={(c) => maj(r.id, c)} />}</AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Clients                                                             */
/* ------------------------------------------------------------------ */
function Clients({ data, maj }: { data: Donnees; maj: (id: string, c: Partial<Client>) => void }) {
  const [q, setQ] = useState('');
  const [seg, setSeg] = useState('');
  const stats = useMemo(() => {
    const m: Record<string, { n: number; ca: number; derniere?: string }> = {};
    for (const r of data.reservations) {
      if (r.statut === 'annulee') continue;
      const k = r.client_email.toLowerCase();
      m[k] ??= { n: 0, ca: 0 };
      m[k].n++; m[k].ca += r.total;
      if (!m[k].derniere || r.created_at > m[k].derniere!) m[k].derniere = r.created_at;
    }
    return m;
  }, [data.reservations]);
  const abonnes = new Set(data.newsletter.map((a) => a.email.toLowerCase()));
  const liste = data.clients.filter((c) => (!seg || c.segment === seg) && (!q || `${c.prenom} ${c.nom} ${c.email} ${c.ville}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <Barre q={q} setQ={setQ} placeholder="Nom, e-mail, ville…">
        <select className="champ w-auto" value={seg} onChange={(e) => setSeg(e.target.value)} aria-label="Segment">
          <option value="">Tous les segments</option><option value="particulier">Particuliers</option><option value="pro">Pro</option><option value="influenceur">Influenceurs</option>
        </select>
        <BoutonCsv onClick={() => exportCsv('clients', liste as unknown as Record<string, unknown>[])} />
      </Barre>
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {liste.map((c) => {
          const s = stats[c.email.toLowerCase()];
          return (
            <li key={c.id} className="flex flex-col gap-2 rounded-2xl border-[3px] border-noir bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-titre text-xl font-black">{[c.prenom, c.nom].filter(Boolean).join(' ') || c.email}</p>
                  <p className="text-sm text-noir/70">{c.email}{c.telephone && ` · ${c.telephone}`}</p>
                  {c.ville && <p className="text-sm text-noir/70">{c.ville}</p>}
                </div>
                <select className="rounded-full border-2 border-noir bg-creme px-2 py-1 text-xs font-extrabold" value={c.segment} onChange={(e) => maj(c.id, { segment: e.target.value })} aria-label="Segment">
                  <option value="particulier">Particulier</option><option value="pro">Pro</option><option value="influenceur">Influenceur</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Pastille c="bg-rose">{s?.n ?? 0} réservation{(s?.n ?? 0) > 1 ? 's' : ''}</Pastille>
                <Pastille c="bg-vert">{euros(s?.ca ?? 0)}</Pastille>
                {abonnes.has(c.email.toLowerCase()) && <Pastille c="bg-jaune">Gazette</Pastille>}
                <Pastille c="bg-creme">Source : {c.source}</Pastille>
              </div>
              <textarea className="champ min-h-[70px] text-sm" defaultValue={c.notes ?? ''} placeholder="Notes (chien, préférences, historique…)" onBlur={(e) => e.target.value !== (c.notes ?? '') && maj(c.id, { notes: e.target.value })} aria-label={`Notes sur ${c.email}`} />
              <p className="text-xs text-noir/60">Client depuis le {d(c.created_at)}{s?.derniere && ` · dernière réservation le ${d(s.derniere)}`}</p>
            </li>
          );
        })}
      </ul>
      {liste.length === 0 && <Vide />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Messages, newsletter, avis                                          */
/* ------------------------------------------------------------------ */
function Messages({ data, maj }: { data: Donnees; maj: (id: string, c: { statut: StatutMessage }) => void }) {
  const [filtre, setFiltre] = useState<string>('');
  const liste = data.messages.filter((m) => !filtre || m.statut === filtre);
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {[{ id: '', label: 'Tous' }, ...STATUTS_MSG].map((s) => (
          <button key={s.id} type="button" aria-pressed={filtre === s.id} onClick={() => setFiltre(s.id)} className="pastille">{s.label} ({s.id ? data.messages.filter((m) => m.statut === s.id).length : data.messages.length})</button>
        ))}
      </div>
      <ul className="flex flex-col gap-4">
        {liste.map((m) => (
          <li key={m.id} className={cx('rounded-2xl border-[3px] border-noir bg-white p-5', m.statut === 'nouveau' && 'shadow-dure')}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-extrabold">{m.nom} <span className="font-normal text-noir/60">· {m.email}{m.telephone && ` · ${m.telephone}`}</span></p>
                <p className="text-sm"><Pastille c="bg-bleu">{m.sujet}</Pastille> {m.chien && <span className="ml-2">{m.chien}</span>} {m.numero_reservation && <span className="ml-2 font-bold">{m.numero_reservation}</span>} {m.date_evenement && <span className="ml-2">Événement : {d(m.date_evenement)}</span>}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-noir/60">{d(m.created_at, 'd MMM, HH:mm')}</span>
                <select className="rounded-full border-2 border-noir bg-creme px-2 py-1 text-xs font-extrabold" value={m.statut} onChange={(e) => maj(m.id, { statut: e.target.value as StatutMessage })} aria-label="Statut du message">
                  {STATUTS_MSG.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line">{m.message}</p>
            <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re : ${m.sujet} — Maison Babines`)}`} className="lien mt-3 inline-block text-sm">Répondre par e-mail</a>
          </li>
        ))}
      </ul>
      {liste.length === 0 && <Vide />}
    </div>
  );
}

function Newsletter({ data }: { data: Donnees }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="font-bold">{data.newsletter.length} abonné{data.newsletter.length > 1 ? 's' : ''} à la Gazette</p>
        <BoutonCsv onClick={() => exportCsv('gazette', data.newsletter as unknown as Record<string, unknown>[])} />
      </div>
      <Tableau entetes={['E-mail', 'Source', 'Inscription']}>
        {data.newsletter.map((a) => (
          <tr key={a.id} className="border-t-2 border-noir/10"><td className="px-3 py-3 font-bold">{a.email}</td><td className="px-3 py-3">{a.source}</td><td className="px-3 py-3">{d(a.created_at)}</td></tr>
        ))}
      </Tableau>
    </div>
  );
}

function Avis({ data, maj }: { data: Donnees; maj: (id: string, c: { statut: StatutAvis }) => void }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {data.avis.map((a) => (
        <li key={a.id} className="flex flex-col gap-2 rounded-2xl border-[3px] border-noir bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="font-extrabold">{a.prenom} · {a.chien}{a.race && `, ${a.race}`}</p>
            <span className="inline-flex" aria-label={`${a.note} sur 5`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} strokeWidth={2.2} fill={i < a.note ? 'var(--or)' : 'transparent'} aria-hidden />)}</span>
          </div>
          <p className="text-sm text-noir/70">{a.tenue} · {a.occasion} · {d(a.created_at)}</p>
          <p className="font-titre text-lg">« {a.texte} »</p>
          <div className="mt-auto flex gap-2 pt-2">
            {STATUTS_AVIS.map((s) => (
              <button key={s.id} type="button" aria-pressed={a.statut === s.id} onClick={() => maj(a.id, { statut: s.id })} className={cx('rounded-full border-2 border-noir px-3 py-1 text-xs font-extrabold', a.statut === s.id ? s.c : 'bg-creme')}>{s.label}</button>
            ))}
          </div>
        </li>
      ))}
      {data.avis.length === 0 && <Vide />}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Briques                                                             */
/* ------------------------------------------------------------------ */
function Barre({ q, setQ, placeholder, children }: { q: string; setQ: (s: string) => void; placeholder: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <Search size={18} strokeWidth={2.5} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label="Rechercher" className="champ pl-10" />
      </div>
      {children}
    </div>
  );
}
function BoutonCsv({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="inline-flex min-h-[48px] items-center gap-2 rounded-pilule border-[3px] border-noir bg-creme px-4 font-extrabold shadow-petite"><Download size={18} strokeWidth={2.5} aria-hidden /> Export CSV</button>;
}
function Tableau({ entetes, children }: { entetes: string[]; children: ReactNode }) {
  return (
    <div className="scroll-x rounded-2xl border-[3px] border-noir bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-bordeaux text-creme"><tr>{entetes.map((e) => <th key={e} scope="col" className="px-3 py-3 font-extrabold">{e}</th>)}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function Vide() {
  return <div className="mt-8 flex flex-col items-center text-center text-noir/70"><BaronHead className="h-16 w-16" /><p className="mt-2 font-semibold">Rien par ici.</p></div>;
}

/* ------------------------------------------------------------------ */
/* Application                                                         */
/* ------------------------------------------------------------------ */
export default function Admin() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [data, setData] = useState<Donnees | null>(null);
  const [onglet, setOnglet] = useState<Onglet>('tableau');
  const [err, setErr] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const charger = useCallback(async () => {
    setChargement(true); setErr(null);
    try { setData(await chargerTout()); } catch (e) { setErr((e as Error).message || 'Impossible de charger les données.'); } finally { setChargement(false); }
  }, []);

  useEffect(() => { sessionActive().then(setAuth); }, []);
  useEffect(() => { if (auth) charger(); }, [auth, charger]);

  const maj = <T extends keyof Donnees>(table: T) => async (id: string, champs: Partial<Donnees[T][number]>) => {
    setData((dd) => dd && ({ ...dd, [table]: (dd[table] as { id: string }[]).map((x) => (x.id === id ? { ...x, ...champs } : x)) }));
    try { await mettreAJour(table, id, champs); } catch (e) { setErr((e as Error).message); charger(); }
  };

  if (auth === null) return <div className="grid min-h-screen place-items-center"><BaronHead className="h-20 w-20 animate-bounce" /></div>;
  if (!auth) return <Connexion ok={() => setAuth(true)} />;

  const nb = (o: Onglet) => !data ? 0 : o === 'messages' ? data.messages.filter((m) => m.statut === 'nouveau').length : o === 'reservations' ? data.reservations.filter((r) => r.statut === 'nouvelle').length : o === 'avis' ? data.avis.filter((a) => a.statut === 'a_moderer').length : 0;
  const ONGLETS: { id: Onglet; label: string; i: typeof Users }[] = [
    { id: 'tableau', label: 'Tableau de bord', i: BarChart3 },
    { id: 'reservations', label: 'Réservations', i: PackageCheck },
    { id: 'clients', label: 'Clients', i: Users },
    { id: 'messages', label: 'Messages', i: MessageSquare },
    { id: 'newsletter', label: 'Gazette', i: Mail },
    { id: 'avis', label: 'Avis', i: Star },
  ];

  return (
    <div className="min-h-screen bg-creme lg:grid lg:grid-cols-[260px_1fr]">
      <Helmet><title>Registre du Grand Hôtel · CRM Maison Babines</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <aside className="flex flex-col gap-6 bg-bordeaux p-5 text-creme lg:sticky lg:top-0 lg:h-screen">
        <Link to="/" className="flex items-center gap-3"><LogoMark className="h-12 w-12" /><span className="font-titre text-xl font-black italic leading-tight">Registre du<br />Grand Hôtel</span></Link>
        <nav aria-label="CRM" className="scroll-x -mx-5 px-5 lg:mx-0 lg:px-0">
          <ul className="flex gap-2 lg:flex-col">
            {ONGLETS.map((o) => (
              <li key={o.id}>
                <button type="button" onClick={() => setOnglet(o.id)} aria-current={onglet === o.id ? 'page' : undefined} className={cx('flex min-h-[44px] w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 font-bold transition', onglet === o.id ? 'bg-creme text-noir' : 'hover:bg-creme/10')}>
                  <o.i size={18} strokeWidth={2.5} aria-hidden /> {o.label}
                  {nb(o.id) > 0 && <span className="ml-auto grid h-6 min-w-[24px] place-items-center rounded-full border-2 border-noir bg-rose px-1 text-xs text-noir">{nb(o.id)}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto hidden flex-col gap-2 text-sm lg:flex">
          <p className="flex items-center gap-2 text-creme/80"><Database size={16} aria-hidden /> {modeDemo ? 'Mode démo (local)' : 'Connecté à Supabase'}</p>
          <button type="button" onClick={async () => { await deconnexion(); setAuth(false); }} className="flex items-center gap-2 font-bold hover:underline"><LogOut size={16} aria-hidden /> Se déconnecter</button>
          <Link to="/" className="hover:underline">← Retour au site</Link>
        </div>
      </aside>
      <main className="min-w-0 p-5 lg:p-10">
        {modeDemo && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-[3px] border-noir bg-jaune p-4 text-sm font-semibold">
            <p><strong>Mode démo :</strong> données d'exemple stockées dans ce navigateur. Les réservations, messages et inscriptions faits sur le site s'ajoutent ici. Pour une vraie base partagée, renseignez Supabase dans <code>.env.local</code> (voir <code>CRM.md</code>).</p>
            <button type="button" onClick={() => { reinitialiserDemo(); charger(); }} className="rounded-full border-2 border-noir bg-creme px-3 py-1 font-extrabold">Réinitialiser la démo</button>
          </div>
        )}
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-[40px] lg:text-[56px]">{ONGLETS.find((o) => o.id === onglet)!.label}</h1>
          <button type="button" onClick={charger} aria-label="Actualiser" className="grid h-12 w-12 place-items-center rounded-full border-[3px] border-noir bg-creme shadow-petite"><RefreshCw size={20} strokeWidth={2.5} className={chargement ? 'animate-spin' : ''} /></button>
        </div>
        {err && <p role="alert" className="mb-6 rounded-2xl border-[3px] border-noir bg-orange p-4 font-bold">{err}</p>}
        {data && (
          <AnimatePresence mode="wait">
            <motion.div key={onglet} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {onglet === 'tableau' && <TableauDeBord data={data} aller={setOnglet} />}
              {onglet === 'reservations' && <Reservations data={data} maj={maj('reservations')} />}
              {onglet === 'clients' && <Clients data={data} maj={maj('clients')} />}
              {onglet === 'messages' && <Messages data={data} maj={maj('messages')} />}
              {onglet === 'newsletter' && <Newsletter data={data} />}
              {onglet === 'avis' && <Avis data={data} maj={maj('avis')} />}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
