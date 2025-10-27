# 🏗️ Architecture du projet Pensaga Frontend

## 📁 Structure des dossiers

```
src/
├── components/          # Composants réutilisables
│   ├── common/          # Composants communs (Header, Navbar, Footer)
│   ├── ui/              # Composants UI de base (Button, Card, Input, etc.)
│   ├── stories/         # Composants spécifiques aux histoires
│   ├── shop/            # Composants pour la boutique
│   └── profile/         # Composants pour le profil
│
├── pages/               # Pages de l'application
│   ├── auth/            # Pages d'authentification (Login, Signup)
│   ├── dashboard/       # Pages du tableau de bord
│   ├── stories/         # Pages des histoires
│   ├── create/          # Pages de création/édition
│   ├── shop/            # Pages de la boutique
│   ├── profile/         # Pages du profil
│   └── community/       # Pages de la communauté
│
├── routes/              # Configuration des routes React Router
│
├── context/             # Contextes React (AuthContext, UserContext, etc.)
│
├── hooks/               # Hooks personnalisés
│
├── utils/               # Utilitaires
│   ├── api/             # Fonctions d'appel API
│   └── constants/       # Constantes de l'application
│
└── assets/              # Assets statiques (images, fonts, etc.)
```

## 🎨 Configuration TailwindCSS

Le projet utilise **TailwindCSS v4** avec la nouvelle syntaxe `@import`.

Configuration dans `src/index.css` :
```css
@import "tailwindcss";
```

## 🛣️ Routes principales

| Route | Page | Description |
|-------|------|-------------|
| `/signup` | Inscription | Stepper en 3 étapes |
| `/login` | Connexion | Authentification |
| `/home` | Accueil | Page d'accueil Netflix-like |
| `/stories` | Mes histoires | Liste des créations |
| `/create` | Éditeur | Création assistée par IA |
| `/shop` | Boutique | Catalogue d'items virtuels |
| `/profile` | Profil | Progression, badges |
| `/community` | Communauté | Défis et feedbacks |
| `/publish` | Publication | Partage public/privé |

## 📦 Dépendances principales

- **React** : Bibliothèque UI
- **React Router DOM** : Gestion des routes
- **TailwindCSS** : Framework CSS utilitaire
- **Vite** : Build tool et dev server

## 🚀 Commandes disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build

# Preview du build de production
npm run preview

# Linter
npm run lint
```

## 📝 Prochaines étapes

1. Créer les composants de base dans `src/components/ui/`
2. Implémenter les pages dans `src/pages/`
3. Configurer les Context API dans `src/context/`
4. Créer les hooks personnalisés dans `src/hooks/`
5. Implémenter les appels API dans `src/utils/api/`
