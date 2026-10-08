# Décisions prises hors cahier des charges

- **Teintes normalisées** : ajout d'un champ `teintes` aux produits pour le filtre couleur (les « coloris » rédigés restent affichés tels quels).
- **Aperçu rapide** : la date nécessitant le calendrier de disponibilités, « Ajouter à la malle » depuis l'aperçu ouvre la fiche avec la taille présélectionnée, directement au bloc de réservation.
- **« + Ajouter » de Complétez le look** : ajoute l'accessoire avec la première taille disponible et une date à J+14, modifiable dans la malle.
- **Photos** : photos libres d'Unsplash (crédits dans `public/images/CREDITS.md` et mentions légales). Les tenues réelles de la marque ne pouvant pas exister en banque d'images, ce sont des chiens habillés au plus proche de chaque pièce, à remplacer par les vrais shootings (même nommage de fichiers). Sans photo, le visuel de remplacement s'affiche.
- **CRM** : demandé par le client en plus du cahier des charges. Back-office `/admin` branché sur Supabase, avec mode démo local tant que la base n'est pas configurée (voir `CRM.md`).
- **Stratégie marketing** : document complet consultable sur `/strategie`, exportable en PDF (bouton « Exporter en PDF »).
- **Favoris** : accessibles via l'icône cœur du header (`/catalogue?favoris=1`).
- **Répartition des notes par produit** : déduite de la note moyenne (fictive).
- **Emplacement du projet** : déplacé hors du Bureau iCloud (disque presque plein, iCloud évacuait les fichiers et bloquait la compilation). Un raccourci reste sur le Bureau.
