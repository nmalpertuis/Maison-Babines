# CRM Maison Babines — mise en route

Le CRM est intégré au site : **/admin** sur l'adresse locale affichée par `npm run dev` (ex. http://localhost:5173/admin) (lien « Espace équipe » dans le footer).

Il centralise :
- **Réservations** issues du tunnel de la malle (statut : nouvelle → préparée → expédiée → livrée → retournée → clôturée, notes internes, export CSV) ;
- **Clients** (créés automatiquement depuis les réservations et le formulaire de contact ; segment particulier / pro / influenceur, notes, CA cumulé) ;
- **Messages** du formulaire de contact (nouveau / en cours / traité, réponse par e-mail) ;
- **Abonnés** à la Gazette (export CSV) ;
- **Avis** déposés sur le Livre d'or (modération).

## Connexion

- **Mode démo** : identifiant `admin` et mot de passe définis dans `.env.local` (`VITE_ADMIN_ID`, `VITE_ADMIN_PASSWORD`). Ce fichier n'est pas envoyé sur GitHub ; votre collaboratrice crée le sien à partir de `.env.example`.
- **Avec Supabase** : e-mail et mot de passe du compte créé dans Authentication → Users.

Le mode démo est une simple barrière pour les présentations : le mot de passe est intégré au code envoyé au navigateur. La vraie sécurité vient de Supabase (connexion + règles RLS).

## Mode démo (par défaut)

Sans configuration, le CRM fonctionne avec des données d'exemple stockées dans le navigateur. Toutes les réservations, messages, inscriptions et avis faits sur le site en local s'y ajoutent. Bouton « Réinitialiser la démo » en haut de l'écran.

## Brancher la vraie base (Supabase)

1. Créer un compte et un projet sur https://supabase.com (offre gratuite suffisante).
2. Dans **SQL Editor**, coller et exécuter le contenu de `supabase/schema.sql`.
3. Dans **Authentication → Users**, cliquer **Add user** et créer le compte de l'équipe (e-mail + mot de passe). C'est ce compte qui se connectera à `/admin`.
4. Dans **Project Settings → API**, copier l'**URL** et la clé **anon public**.
5. À la racine du projet, créer `.env.local` (voir `.env.example`) :
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
6. Relancer `npm run dev`. `/admin` demande désormais la connexion.

### Sécurité
Les règles RLS du schéma autorisent le site public à **insérer** seulement (réservation, message, newsletter, avis). Lecture, modification et suppression sont réservées aux utilisateurs connectés de l'équipe. La clé `anon` peut donc être exposée côté navigateur ; ne jamais utiliser la clé `service_role` dans le site.

### Déploiement (Vercel)
Ajouter les deux variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans Project Settings → Environment Variables, puis redéployer.
