# 🪶 Pensaga Frontend

Plateforme gamifiée d'écriture collaborative - Frontend React

## 🚀 Démarrage rapide

```bash
# Installer les dépendances (déjà fait)
npm install

# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build

# Preview de la production
npm run preview
```

## 📁 Structure du projet

Consultez le fichier [`ARCHITECTURE.md`](./ARCHITECTURE.md) pour comprendre la structure des dossiers.

## 🎨 TailwindCSS

Consultez le fichier [`TAILWIND_GUIDE.md`](./TAILWIND_GUIDE.md) pour apprendre à utiliser TailwindCSS dans ce projet.

## 🛣️ Routes configurées

Les routes suivantes sont déjà configurées dans `src/App.jsx` :

- `/signup` - Inscription
- `/login` - Connexion
- `/home` - Accueil
- `/stories` - Mes histoires
- `/create` - Éditeur
- `/shop` - Boutique
- `/profile` - Profil
- `/community` - Communauté
- `/publish` - Publication

## 📦 Dépendances

- **React** ^19.1.1
- **React Router DOM** ^7.9.4
- **TailwindCSS** ^4.1.16
- **Vite** ^7.1.7

## 📝 Prochaines étapes

1. Créer les composants UI de base dans `src/components/ui/`
2. Implémenter les pages dans `src/pages/`
3. Configurer le contexte d'authentification dans `src/context/`
4. Créer les appels API dans `src/utils/api/`

## 🎯 Fonctionnalités à implémenter

Selon `Pensaga_Resume_Projet.md` :

- [ ] Onboarding (stepper 3 étapes)
- [ ] Authentification (Login/Signup)
- [ ] Interface d'écriture assistée par IA
- [ ] Système de progression (XP, badges, pièces)
- [ ] Publication d'histoires
- [ ] Boutique virtuelle
- [ ] Communauté et défis
