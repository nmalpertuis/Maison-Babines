import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ecrireStockage, lireStockage } from '@/hooks/useLocalStorage';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type StatutReservation = 'nouvelle' | 'preparee' | 'expediee' | 'livree' | 'retournee' | 'cloturee' | 'annulee';
export type StatutMessage = 'nouveau' | 'en_cours' | 'traite';
export type StatutAvis = 'a_moderer' | 'publie' | 'refuse';

export interface ArticleReservation {
  productId: string; nom: string; taille: string; prix: number; options: string[];
}
export interface Reservation {
  id: string; numero: string; client_email: string; client_nom: string; telephone?: string;
  chien: string; mode_livraison: string; adresse?: string;
  date_evenement: string; date_livraison: string; articles: ArticleReservation[];
  sous_total: number; remise: number; livraison: number; total: number; caution: number;
  code_promo?: string | null; statut: StatutReservation; notes?: string | null; created_at: string;
}
export interface Message {
  id: string; nom: string; email: string; telephone?: string; sujet: string; chien?: string;
  date_evenement?: string | null; numero_reservation?: string; message: string; statut: StatutMessage; created_at: string;
}
export interface Client {
  id: string; email: string; prenom?: string; nom?: string; telephone?: string; ville?: string;
  source: string; segment: string; notes?: string | null; created_at: string;
}
export interface Abonne { id: string; email: string; source: string; created_at: string }
export interface Avis {
  id: string; prenom: string; chien?: string; race?: string; occasion?: string; tenue?: string;
  note: number; texte: string; statut: StatutAvis; created_at: string;
}

export interface Donnees {
  reservations: Reservation[]; messages: Message[]; clients: Client[]; newsletter: Abonne[]; avis: Avis[];
}

/* ------------------------------------------------------------------ */
/* Connexion                                                           */
/* ------------------------------------------------------------------ */

const url = import.meta.env.VITE_SUPABASE_URL;
const cle = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && cle ? createClient(url, cle) : null;
/** true quand aucune base n'est configurée : le CRM fonctionne sur des données locales de démonstration. */
export const modeDemo = !supabase;

/* ------------------------------------------------------------------ */
/* Mode démo (localStorage)                                            */
/* ------------------------------------------------------------------ */

const CLE_DEMO = 'babines-crm-demo';
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
const ilYa = (jours: number) => new Date(Date.now() - jours * 864e5).toISOString();
const dansJours = (jours: number) => new Date(Date.now() + jours * 864e5).toISOString().slice(0, 10);

function donneesInitiales(): Donnees {
  const clients: Client[] = [
    { id: uid(), email: 'camille.hugo@exemple.fr', prenom: 'Camille', nom: 'Martin', telephone: '0600000001', ville: 'Lyon', source: 'site', segment: 'particulier', notes: 'Mariage en juin, carlin Pistache. Smoking assorti au costume d\'Hugo.', created_at: ilYa(40) },
    { id: uid(), email: 'sophie.d@exemple.fr', prenom: 'Sophie', nom: 'Delorme', telephone: '0600000002', ville: 'Paris', source: 'newsletter', segment: 'particulier', notes: 'Gaston, bouvier bernois, XXL. Revient chaque Noël.', created_at: ilYa(300) },
    { id: uid(), email: 'lea@planner-bordeaux.fr', prenom: 'Léa', nom: 'Roux', telephone: '0600000003', ville: 'Bordeaux', source: 'pro', segment: 'pro', notes: 'Wedding planner, 25 mariages/an. Facturation mensuelle.', created_at: ilYa(120) },
    { id: uid(), email: 'nadia.pixel@exemple.fr', prenom: 'Nadia', nom: 'Benali', ville: 'Strasbourg', source: 'site', segment: 'influenceur', notes: 'Compte Instagram de Pixel (chihuahua).', created_at: ilYa(75) },
    { id: uid(), email: 'pierre.r@exemple.fr', prenom: 'Pierre', nom: 'Le Goff', ville: 'Rennes', source: 'site', segment: 'particulier', notes: 'Assurance offerte sur la prochaine location (geste Baron).', created_at: ilYa(200) },
  ];
  const res = (n: number, c: Client, chien: string, statut: StatutReservation, evt: number, articles: ArticleReservation[], creee: number): Reservation => {
    const sous = articles.reduce((s, a) => s + a.prix, 0);
    const liv = sous >= 120 ? 0 : 9.9;
    return {
      id: uid(), numero: `MB-2026-${String(n).padStart(4, '0')}`, client_email: c.email, client_nom: `${c.prenom} ${c.nom}`,
      telephone: c.telephone, chien, mode_livraison: 'domicile', adresse: `${c.ville}`, date_evenement: dansJours(evt),
      date_livraison: dansJours(evt - 3), articles, sous_total: sous, remise: 0, livraison: liv, total: sous + liv,
      caution: articles.length * 200, statut, created_at: ilYa(creee),
    };
  };
  const reservations = [
    res(1042, clients[0], 'Pistache', 'preparee', 9, [
      { productId: 'MB-001', nom: 'Le Smoking Baron', taille: 'S', prix: 98, options: ['Assurance'] },
      { productId: 'MB-017', nom: 'Le Porte-Alliances Coussin', taille: 'S', prix: 29, options: [] },
    ], 12),
    res(1043, clients[2], 'Oslo (client Durand)', 'nouvelle', 18, [
      { productId: 'MB-004', nom: 'La Queue-de-Pie Tonnerre', taille: 'L', prix: 139, options: [] },
    ], 1),
    res(1039, clients[1], 'Gaston', 'retournee', -6, [
      { productId: 'MB-014', nom: 'Le Pull de Fête Biscotte', taille: 'XXL', prix: 42, options: [] },
    ], 25),
    res(1041, clients[3], 'Pixel', 'livree', 1, [
      { productId: 'MB-010', nom: 'La Cape Tapis Rouge', taille: 'XXS', prix: 129, options: [] },
      { productId: 'MB-020', nom: 'Les Lunettes Star', taille: 'S', prix: 19, options: [] },
    ], 8),
    res(1036, clients[4], 'Hercule', 'cloturee', -40, [
      { productId: 'MB-002', nom: 'Le Smoking Minuit', taille: 'XXL', prix: 79, options: [] },
    ], 60),
  ];
  return {
    clients,
    reservations,
    messages: [
      { id: uid(), nom: 'Malik Haddad', email: 'malik@exemple.fr', sujet: 'Conseil taille', chien: 'Oslo, berger australien', message: 'Bonjour, Oslo fait 64 cm de tour de poitrine et 47 cm de dos. L ou XL pour la Queue-de-Pie ?', statut: 'nouveau', created_at: ilYa(0.2) },
      { id: uid(), nom: 'Agence Lumière', email: 'contact@agence-lumiere.fr', sujet: 'Offre Pro', message: 'Nous préparons une campagne pour une marque de croquettes et cherchons 6 tenues de gala pour un tournage en novembre.', statut: 'en_cours', created_at: ilYa(2) },
      { id: uid(), nom: 'Camille Martin', email: 'camille.hugo@exemple.fr', sujet: 'Ma réservation', numero_reservation: 'MB-2026-1042', message: 'Peut-on livrer directement au domaine plutôt qu\'à la maison ? Merci !', statut: 'traite', created_at: ilYa(5) },
    ],
    newsletter: [
      { id: uid(), email: 'sophie.d@exemple.fr', source: 'footer', created_at: ilYa(300) },
      { id: uid(), email: 'julie.b@exemple.fr', source: 'accueil', created_at: ilYa(14) },
      { id: uid(), email: 'thomas.rocky@exemple.fr', source: 'accueil', created_at: ilYa(3) },
    ],
    avis: [
      { id: uid(), prenom: 'Margaux', chien: 'Ziggy', race: 'shih tzu', occasion: 'anniversaire', tenue: 'Les Lunettes Star', note: 5, texte: 'Ziggy a refusé de les enlever pour souffler ses bougies.', statut: 'a_moderer', created_at: ilYa(1) },
    ],
  };
}

function lireDemo(): Donnees {
  const d = lireStockage<Donnees | null>(CLE_DEMO, null);
  if (d) return d;
  const init = donneesInitiales();
  ecrireStockage(CLE_DEMO, init);
  return init;
}
function majDemo(f: (d: Donnees) => void) {
  const d = lireDemo();
  f(d);
  ecrireStockage(CLE_DEMO, d);
}
export function reinitialiserDemo() {
  ecrireStockage(CLE_DEMO, donneesInitiales());
}

/* ------------------------------------------------------------------ */
/* Écritures depuis le site public                                     */
/* ------------------------------------------------------------------ */

async function upsertClient(email: string, prenom: string, nom: string, telephone: string, source: string) {
  if (supabase) {
    await supabase.rpc('upsert_client', { p_email: email, p_prenom: prenom, p_nom: nom, p_telephone: telephone, p_source: source });
    return;
  }
  majDemo((d) => {
    const c = d.clients.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (c) Object.assign(c, { prenom: prenom || c.prenom, nom: nom || c.nom, telephone: telephone || c.telephone });
    else d.clients.unshift({ id: uid(), email, prenom, nom, telephone, source, segment: source === 'pro' ? 'pro' : 'particulier', created_at: new Date().toISOString() });
  });
}

export async function enregistrerReservation(r: Omit<Reservation, 'id' | 'created_at' | 'statut'>) {
  const [prenom, ...reste] = r.client_nom.split(' ');
  await upsertClient(r.client_email, prenom, reste.join(' '), r.telephone ?? '', 'site').catch(() => undefined);
  if (supabase) {
    const { error } = await supabase.from('reservations').insert({ ...r, statut: 'nouvelle' });
    if (error) throw error;
    return;
  }
  majDemo((d) => d.reservations.unshift({ ...r, id: uid(), statut: 'nouvelle', created_at: new Date().toISOString() }));
}

export async function enregistrerMessage(m: Omit<Message, 'id' | 'created_at' | 'statut'>) {
  const [prenom, ...reste] = m.nom.split(' ');
  await upsertClient(m.email, prenom, reste.join(' '), m.telephone ?? '', m.sujet === 'Offre Pro' ? 'pro' : 'contact').catch(() => undefined);
  if (supabase) {
    const { error } = await supabase.from('messages').insert({ ...m, statut: 'nouveau' });
    if (error) throw error;
    return;
  }
  majDemo((d) => d.messages.unshift({ ...m, id: uid(), statut: 'nouveau', created_at: new Date().toISOString() }));
}

export async function inscrireNewsletter(email: string, source: string) {
  if (supabase) {
    const { error } = await supabase.from('newsletter').insert({ email: email.toLowerCase(), source });
    // Doublon (23505) : déjà inscrit, on considère que c'est un succès.
    if (error && error.code !== '23505') throw error;
    return;
  }
  majDemo((d) => {
    if (!d.newsletter.some((a) => a.email === email.toLowerCase()))
      d.newsletter.unshift({ id: uid(), email: email.toLowerCase(), source, created_at: new Date().toISOString() });
  });
}

export async function deposerAvis(a: Omit<Avis, 'id' | 'created_at' | 'statut'>) {
  if (supabase) {
    const { error } = await supabase.from('avis').insert({ ...a, statut: 'a_moderer' });
    if (error) throw error;
    return;
  }
  majDemo((d) => d.avis.unshift({ ...a, id: uid(), statut: 'a_moderer', created_at: new Date().toISOString() }));
}

/* ------------------------------------------------------------------ */
/* Lectures et mises à jour (back-office)                              */
/* ------------------------------------------------------------------ */

type Table = keyof Donnees;
const TABLES: Record<Table, string> = { reservations: 'reservations', messages: 'messages', clients: 'clients', newsletter: 'newsletter', avis: 'avis' };

export async function chargerTout(): Promise<Donnees> {
  if (!supabase) return lireDemo();
  const lire = async <T,>(t: string) => {
    const { data, error } = await supabase.from(t).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as T[];
  };
  const [reservations, messages, clients, newsletter, avis] = await Promise.all([
    lire<Reservation>('reservations'), lire<Message>('messages'), lire<Client>('clients'), lire<Abonne>('newsletter'), lire<Avis>('avis'),
  ]);
  return {
    reservations: reservations.map((r) => ({ ...r, sous_total: +r.sous_total, remise: +r.remise, livraison: +r.livraison, total: +r.total, caution: +r.caution })),
    messages, clients, newsletter, avis,
  };
}

export async function mettreAJour<T extends Table>(table: T, id: string, champs: Partial<Donnees[T][number]>) {
  if (supabase) {
    const { error } = await supabase.from(TABLES[table]).update(champs as Record<string, unknown>).eq('id', id);
    if (error) throw error;
    return;
  }
  majDemo((d) => {
    const ligne = (d[table] as { id: string }[]).find((x) => x.id === id);
    if (ligne) Object.assign(ligne, champs);
  });
}

export async function supprimer(table: Table, id: string) {
  if (supabase) {
    const { error } = await supabase.from(TABLES[table]).delete().eq('id', id);
    if (error) throw error;
    return;
  }
  majDemo((d) => {
    (d[table] as { id: string }[]) = (d[table] as { id: string }[]).filter((x) => x.id !== id);
  });
}

/* ------------------------------------------------------------------ */
/* Authentification de l'équipe                                        */
/* ------------------------------------------------------------------ */

export async function connexion(email: string, motDePasse: string) {
  if (!supabase) return;
  const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
  if (error) throw error;
}
export async function deconnexion() {
  if (supabase) await supabase.auth.signOut();
}
export async function sessionActive() {
  if (!supabase) return true;
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}
