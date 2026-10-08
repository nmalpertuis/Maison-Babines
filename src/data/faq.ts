export interface FaqItem { q: string; r: string }
export interface FaqTheme { id: string; titre: string; questions: FaqItem[] }

export const FAQ: FaqTheme[] = [
  {
    id: 'reservation', titre: 'Réservation', questions: [
      { q: 'Comment fonctionne la location ?', r: 'Vous choisissez une tenue, une taille et la date de votre événement. Nous livrons 3 jours avant, vous profitez, puis vous renvoyez la tenue le lendemain avec l\'étiquette prépayée. Sans la laver.' },
      { q: 'Combien de temps à l\'avance réserver ?', r: 'Jusqu\'à 6 mois avant, et au plus tard 3 jours avant l\'événement (1 jour avec la livraison express). Pour un mariage, nous conseillons de réserver dès que la date est fixée : les belles pièces partent vite.' },
      { q: 'Puis-je louer plusieurs tenues pour comparer ?', r: 'Oui, avec l\'option "Deuxième taille au cas où" (10 €) ou le Pack Shooting (3 tenues). Vous renvoyez tout ensemble.' },
      { q: 'Puis-je annuler ?', r: 'Annulation gratuite jusqu\'à 7 jours avant la livraison. Ensuite, nous vous remettons un avoir du montant de la commande, valable un an.' },
    ],
  },
  {
    id: 'tailles', titre: 'Tailles', questions: [
      { q: 'Comment choisir la bonne taille ?', r: 'Mesurez le tour de cou, le tour de poitrine (derrière les pattes avant) et la longueur du dos (de la base du cou à la naissance de la queue), puis consultez le guide des tailles. Entre deux tailles, prenez la plus grande.' },
      { q: 'Et si la tenue ne va pas ?', r: 'C\'est notre taille garantie : appelez-nous, nous envoyons une autre taille en express, sans frais, selon la disponibilité.' },
      { q: 'Mon chien a une morphologie particulière (teckel, bouledogue, lévrier).', r: 'Nos patrons sont pensés pour ces morphologies. Envoyez-nous ses mesures et une photo : Mademoiselle Praline vous conseille gratuitement, et une retouche express est possible (15 €).' },
    ],
  },
  {
    id: 'livraison', titre: 'Livraison et retour', questions: [
      { q: 'Où livrez-vous ?', r: 'Partout en France métropolitaine, à domicile ou en point relais, ainsi que sur le lieu de l\'événement (domaine, hôtel) si quelqu\'un peut réceptionner le colis.' },
      { q: 'Combien coûte la livraison ?', r: '9,90 € en standard, offerte dès 120 €. 19,90 € en express. Le retour est toujours gratuit.' },
      { q: 'Comment renvoyer la tenue ?', r: 'Remettez-la dans sa boîte à chapeau, collez l\'étiquette prépayée et déposez le colis en point relais le lendemain de l\'événement.' },
      { q: 'Et si je renvoie en retard ?', r: 'Chaque jour de retard est facturé 12 €. Prévenez-nous, on trouve toujours une solution.' },
    ],
  },
  {
    id: 'hygiene', titre: 'Hygiène et sécurité', questions: [
      { q: 'Les tenues sont-elles vraiment propres ?', r: 'Oui. Chaque tenue est nettoyée par un professionnel avec des produits hypoallergéniques et sans parfum, puis contrôlée en 12 points avant d\'être mise sous housse.' },
      { q: 'Mon chien a la peau sensible.', r: 'Nos doublures sont en coton bio et nos produits de nettoyage sans parfum. Faites un essai de quelques minutes à réception, et en cas de doute, demandez l\'avis de votre vétérinaire.' },
      { q: 'Combien de temps mon chien peut-il porter la tenue ?', r: 'Nous conseillons des séances de 2 heures maximum, avec des pauses, de l\'eau, et jamais sans surveillance. Par forte chaleur, préférez les pièces légères (gamme Cocktail, accessoires).' },
    ],
  },
  {
    id: 'paiement', titre: 'Paiement, caution et casse', questions: [
      { q: 'Comment fonctionne la caution ?', r: 'C\'est une simple empreinte bancaire, non débitée, libérée dans les 72 heures après le contrôle du retour.' },
      { q: 'Et si la tenue est abîmée ?', r: 'Les petites traces de fête sont normales et incluses. Pour les taches tenaces, accrocs ou griffures, l\'assurance "Pattes de velours" (9 €) couvre tout. Sans assurance, la réparation est déduite de la caution, sur devis.' },
      { q: 'Mon chien a mangé le nœud pap\'.', r: 'Ça arrive aux meilleurs. Avec l\'assurance, c\'est couvert. Sans assurance, l\'accessoire est facturé à son prix de remplacement. Et surveillez votre chien : un morceau de tissu avalé nécessite d\'appeler votre vétérinaire.' },
      { q: 'Habillez-vous les chats ?', r: 'Non. Duchesse Moustache est au courant, et elle est furieuse.' },
    ],
  },
];
