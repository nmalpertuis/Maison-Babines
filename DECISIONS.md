# Décisions prises hors cahier des charges

- **Teintes normalisées** : ajout d'un champ `teintes` aux produits pour le filtre couleur (les « coloris » rédigés restent affichés tels quels).
- **Aperçu rapide** : la date nécessitant le calendrier de disponibilités, « Ajouter à la malle » depuis l'aperçu ouvre la fiche avec la taille présélectionnée, directement au bloc de réservation.
- **« + Ajouter » de Complétez le look** : ajoute l'accessoire avec la première taille disponible et une date à J+14, modifiable dans la malle.
- **Visuels produits** : les photos de banque d'images ne pouvaient pas correspondre aux tenues (fictives) de la marque. Les 20 produits sont donc illustrés par des portraits officiels générés en SVG (`node scripts/generer-visuels.mjs`) : race du chien modèle, tenue et couleurs conformes à la fiche, fond pop. 3 vues : face, pose (clin d'œil), détail. Le jour où le vrai shooting existe, il suffit de déposer les photos sous le même nom (en changeant l'extension dans `src/data/products.ts`).
- **Photos réelles** conservées pour le mur #BabinesDeGala (photos clients) et l'atelier (Unsplash, crédits dans `public/images/CREDITS.md`).
- **CRM** : demandé par le client en plus du cahier des charges. Back-office `/admin` branché sur Supabase, avec mode démo local tant que la base n'est pas configurée (voir `CRM.md`).
- **Stratégie marketing** : document interne consultable uniquement en local (`npm run dev` puis `/strategie`), exclu de la version publiée ; exportable en PDF.
- **Favoris** : accessibles via l'icône cœur du header (`/catalogue?favoris=1`).
- **Répartition des notes par produit** : déduite de la note moyenne (fictive).
- **Emplacement du projet** : déplacé hors du Bureau iCloud (disque presque plein, iCloud évacuait les fichiers et bloquait la compilation). Un raccourci reste sur le Bureau.
