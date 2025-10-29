# 🪶 PENSAGA Frontend — React + Vite + Tailwind

Interface du projet PENSAGA, construite avec React, Vite, TailwindCSS, Supabase et Stripe.

## ⚙️ Prérequis

- Node.js 18+ (recommandé 20+)
- npm (ou pnpm/yarn)
- Clés Supabase (URL + Anon key) si appel API direct depuis le front
- Clé publique Stripe (si paiement côté front)

## 🚀 Installation et démarrage

1) Cloner le dépôt et se placer dans le dossier

```bash
git clone <URL_DU_REPO>
cd front-end
```

2) Installer les dépendances

```bash
npm install
```

3) Variables d’environnement (optionnel mais recommandé)

Créer un fichier `.env` à la racine de `front-end/` et renseigner, si nécessaire:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk...
STRIPE_SECRET_KEY=sk....
...
```

4) Démarrer en développement

```bash
npm run dev
```

5) Build et prévisualisation

```bash
npm run build
npm run preview
```

## 📁 Structure du projet (extrait)

```
front-end/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── lib/
├── public/
└── vite.config.js
```

## 🛣️ Routes principales (dans `src/App.jsx`)

- /signup, /login, /home, /stories, /create, /shop, /profile, /community, /publish

## 🤝 Contribution

1. Créer une branche de fonctionnalité
2. Commiter et pousser
3. Ouvrir une Pull Request

## 📄 Licence

Copyright (c) 2025 Yanis DAÏ, Enzo Gérardot, Carla Dupont, Théo Sauval

Ce projet a été réalisé dans un cadre strictement pédagogique dans le cadre du hackathon Ynov 2025.  
Conformément à l'article 1.4 du règlement intérieur Ynov, les droits patrimoniaux et moraux
demeurent la propriété exclusive de ses auteurs.

Toute utilisation, reproduction, modification, diffusion ou exploitation, totale ou partielle, du code
en dehors du cadre d'évaluation pédagogique est strictement interdite sans l'accord écrit
préalable des auteurs.

