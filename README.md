# Maison Babines — Le grand soir, à quatre pattes.

Site de location de tenues de cérémonie pour chiens (projet fictif), CRM intégré et stratégie marketing.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir l'adresse affichée par `npm run dev` (par défaut http://localhost:5173) :
- **Site** : `/`
- **CRM** : `/admin` (voir `CRM.md`)
- **Stratégie marketing** : `/strategie` (uniquement en local, exclue de la version publiée)

`npm run build` produit la version de production dans `dist/`.

## Stack
Vite, React 18, TypeScript strict, Tailwind CSS, Framer Motion, React Router, date-fns (fr), react-helmet-async, lucide-react, Supabase (CRM).

## Documents
- `Cahier des charges — Maison Babines.pdf` : source de vérité.
- `DECISIONS.md` : choix faits là où le cahier était muet.
- `CRM.md` : brancher la base Supabase.
- `public/images/CREDITS.md` : crédits photos.
