import { OCCASIONS } from '@/data/occasions';
import { GAMMES, TYPES } from '@/data/products';

export const MENU_CATALOGUE = [
  { titre: 'Par occasion', liens: OCCASIONS.map((o) => ({ label: o.label, to: `/catalogue?occasion=${o.id}` })) },
  { titre: 'Par type', liens: TYPES.map((t) => ({ label: t.label, to: `/catalogue?type=${t.id}` })) },
  { titre: 'Par gamme', liens: GAMMES.map((g) => ({ label: `${g.label} (dès ${g.des} €)`, to: `/catalogue?gamme=${g.id}` })) },
];

export const MENU_MAISON = [
  { label: 'Notre expertise', to: '/expertise' },
  { label: "Le Livre d'or (avis)", to: '/avis' },
  { label: 'Offre Pro', to: '/expertise#offre-pro' },
];

export const MENU_AIDE = [
  { label: 'FAQ', to: '/faq' },
  { label: 'Guide des tailles', to: '/guide-des-tailles' },
  { label: 'Conditions de location', to: '/conditions-de-location' },
  { label: 'Contact', to: '/contact' },
];
