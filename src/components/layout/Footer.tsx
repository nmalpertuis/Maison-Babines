import { Link } from 'react-router-dom';
import { Instagram, Music2, Pin } from 'lucide-react';
import { OCCASIONS } from '@/data/occasions';
import { Logo } from '@/components/brand/Logo';
import { Baron } from '@/components/brand/illustrations';
import { ScallopDivider } from '@/components/brand/ScallopDivider';
import { NewsletterForm } from './NewsletterForm';
import { ouvrirCookies } from './CookieBanner';

const COLONNES = [
  { titre: 'La Maison', liens: [['Notre expertise', '/expertise'], ['Avis', '/avis'], ['Offre Pro', '/expertise#offre-pro'], ['Contact', '/contact']] },
  { titre: 'Le Dressing', liens: OCCASIONS.map((o) => [o.label, `/catalogue?occasion=${o.id}`]) },
  { titre: 'Aide', liens: [['FAQ', '/faq'], ['Guide des tailles', '/guide-des-tailles'], ['Conditions de location', '/conditions-de-location'], ['Livraison et retours', '/faq#livraison']] },
];

export function Footer() {
  return (
    <footer className="relative mt-auto bg-bordeaux text-creme">
      <div className="absolute inset-x-0 bottom-full"><ScallopDivider couleur="var(--bordeaux)" position="haut" /></div>
      <div className="conteneur pb-8 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo clair baseline className="text-[48px]" />
            <div className="mt-8 max-w-md">
              <h2 className="font-titre text-2xl font-black lg:text-3xl">La Gazette du Grand Hôtel</h2>
              <p className="mb-4 mt-2 text-creme/85">Nouvelles collections, coulisses de l'Atelier et -10 % sur votre première location.</p>
              <NewsletterForm source="footer" clair />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLONNES.map((c) => (
              <div key={c.titre}>
                <h2 className="surtitre mb-4 text-jaune">{c.titre}</h2>
                <ul className="flex flex-col gap-1">
                  {c.liens.map(([l, to]) => (
                    <li key={to}><Link to={to} className="inline-flex min-h-[36px] items-center text-creme/90 hover:text-creme hover:underline">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <ul className="flex gap-3" aria-label="Réseaux sociaux">
            {[[Instagram, 'Instagram'], [Music2, 'TikTok'], [Pin, 'Pinterest']].map(([I, n]) => {
              const Icone = I as typeof Instagram;
              return (
                <li key={n as string}>
                  <a href="#" className="grid h-12 w-12 place-items-center rounded-full border-[3px] border-creme transition hover:-translate-y-1 hover:bg-rose hover:text-noir" aria-label={`${n} (lien factice)`}>
                    <Icone size={20} strokeWidth={2.5} aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
          <Baron pose="salue" className="w-56 sm:-mb-8 lg:w-72" />
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t-2 border-creme/20 pt-6 text-sm text-creme/80 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2026 Maison Babines (projet étudiant fictif)</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link to="/mentions-legales" className="hover:underline">Mentions légales</Link></li>
            <li><Link to="/confidentialite" className="hover:underline">Confidentialité</Link></li>
            <li><button type="button" onClick={ouvrirCookies} className="hover:underline">Gérer les cookies</button></li>
            <li><Link to="/admin" className="hover:underline">Espace équipe</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
