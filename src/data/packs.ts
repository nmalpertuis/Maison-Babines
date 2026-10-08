export const PACKS = [
  { id: 'mariage', nom: 'Pack Mariage "Oui, je wouf"', contenu: '1 tenue Gala + 1 porte-alliances + 1 accessoire + assurance', prix: '149 €', avantage: 'environ 20 % d\'économie' },
  { id: 'duo', nom: 'Pack Duo "Assortis"', contenu: '2 tenues de la même collection pour deux chiens', prix: '-15 % sur la 2e tenue', avantage: 'Pour les familles à plusieurs chiens' },
  { id: 'shooting', nom: 'Pack Shooting', contenu: '3 tenues au choix pendant 4 jours', prix: '159 €', avantage: 'Pour photographes et influenceurs' },
  { id: 'carnet', nom: 'Le Carnet de Bal (abonnement)', contenu: '1 location Cocktail ou Gala par mois', prix: '49 €/mois, sans engagement', avantage: 'Pour les chiens très mondains' },
  { id: 'pro', nom: 'Offre Pro', contenu: 'Wedding planners, agences, productions', prix: 'Sur devis', avantage: 'Interlocuteur dédié, facturation mensuelle' },
];

export const OPTIONS = {
  assurance: 9,
  jourSupp: 12,
  deuxiemeTaille: 10,
  express: 19.9,
  livraison: 9.9,
  seuilLivraisonOfferte: 120,
  retouche: 15,
};

export const CODES_PROMO: Record<string, number> = { BARON10: 0.1 };
