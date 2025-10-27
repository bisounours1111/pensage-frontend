# 🪶 Pensaga — Hackathon Project

## 🎯 Objectif du projet
Créer **une plateforme gamifiée d’écriture collaborative** combinant **IA, créativité et progression ludique**, jusqu’à l’étape **Publication** du parcours utilisateur.

---

## 🚀 Concept global

Pensaga révolutionne l’écriture grâce à trois piliers :
- **Plateforme gamifiée** : quêtes, badges, monnaie virtuelle, XP.  
- **IA copilote** : assistance intelligente à la rédaction (sans remplacer la créativité humaine).  
- **Communauté créative** : espace collaboratif où les auteurs s’entraident et partagent leurs œuvres.

Le parcours utilisateur (jusqu’à « Publication ») comprend :
1. **Onboarding**
2. **Écriture assistée**
3. **Progression**
4. **Publication**

---

## 🧭 Le voyage d’un auteur sur Pensaga

| Étape | Description |
|-------|--------------|
| **Onboarding** | Sélection des genres favoris, des auteurs d’inspiration, et génération d’un premier défi créatif personnalisé. |
| **Écriture assistée** | Utilisation de l’IA (via Ollama) pour proposer des idées, reformulations et optimisations du texte. Interface mobile responsive. |
| **Progression** | Gain d’XP, badges, pièces virtuelles pour débloquer des éléments ou acheter dans la boutique. |
| **Publication** | Partage avec la communauté, feedbacks, défis d’écriture collectifs. |

> ⚠️ Étapes non implémentées dans cette version : Export & Marketplace.

---

## 🧩 Architecture technique

### 🖥️ Frontend
- **React.js**
- **TailwindCSS**
- **Composants principaux** :
  - `Header`
  - `Navbar`
  - `CardMesHistoires`
  - `CreationForm`
  - `FilterMesHistoires`

### ⚙️ Backend
- **Flask (Python)**
- **SQLAlchemy** (base de données)
- **Ollama** (moteur IA locale pour suggestions et génération de texte)

---

## 📱 Structure & Navigation

### 🔑 Authentification
- **Inscription (Stepper classique)** :
  1. Identité : `username`, `nom`, `prénom`, `âge`, `mail`, `mot de passe`
  2. Préférences : choix de **genres narratifs** (bulle sélectionnable)
  3. Inspirations : sélection d’**auteurs** existants (bulle sélectionnable)
- **Login** : `email / username` + `mot de passe`

---

### 🧭 Écrans principaux

#### 🏠 Home
- Page d’accueil type **Netflix-like**  
- Affiche les histoires populaires, recommandations personnalisées  
- Navigation persistante via **Header + Navbar**

#### ✍️ Mes Histoires
- Liste des créations de l’utilisateur  
- Filtres de recherche et tri avancé  
- Affichage en **2 colonnes** avec des **cards** visuelles

#### 🧑‍🎨 Édition
- Interface de création d’histoire :
  - `Pitch`, `Synopsis`, `Épisode 1`
  - Éditeur assisté par l’IA (suggestions d’idées, corrections, prolongements)
  - Bouton de publication : **privée / non répertoriée**

#### 🛍️ Boutique
- **Catalogue d’objets virtuels** :
  - Points : 100 / 250 / 500 / 1000  
  - Gratuit (pubs / hebdo : 100–2000 points)
  - Abonnement **Premium : 12,99 €**

#### 👤 Profil / Communauté
- Historique, progression (XP, badges)
- Accès à la communauté et défis d’écriture collectifs

---

## 🌐 Routes principales

| Route | Page | Description |
|-------|-------|-------------|
| `/signup` | Inscription | Stepper en 3 étapes (identité, préférences, auteurs) |
| `/login` | Connexion | Authentification utilisateur |
| `/home` | Accueil | Découverte, recommandations |
| `/stories` | Mes histoires | Liste et gestion des créations |
| `/create` | Éditeur | Création assistée par IA |
| `/shop` | Boutique | Achat d’items avec monnaie virtuelle |
| `/profile` | Profil utilisateur | Progression, badges |
| `/community` | Communauté | Accès aux défis et feedbacks |
| `/publish` | Publication | Partage public / privé de l’histoire |

---

## 🧠 IA & Gamification

| Module | Fonction |
|---------|-----------|
| **IA Copilote (Ollama)** | Suggestion de phrases, correction grammaticale, aide narrative |
| **Système XP / Badges** | Points gagnés selon les actions : défis, publication, feedbacks |
| **Pièces virtuelles** | Utilisées dans la boutique ou pour débloquer des fonctionnalités |
| **Défis créatifs** | Objectifs narratifs quotidiens ou hebdomadaires (ex. : écrire un dialogue percutant) |

---

## 🗂️ Base de données (exemple de schéma simplifié)

**Tables principales :**
- `Users(id, username, email, password, xp, coins, badges)`
- `Stories(id, user_id, title, pitch, synopsis, content, status)`
- `Genres(id, name)`
- `Authors(id, name)`
- `UserPreferences(user_id, genre_id, author_id)`
- `Challenges(id, title, description, reward)`
- `ShopItems(id, name, price, type)`

---

## 🧑‍💻 Stack Résumé

| Type | Technologie |
|------|--------------|
| **Frontend** | React, TailwindCSS |
| **Backend** | Flask, SQLAlchemy |
| **IA** | Ollama (LLM local) |
| **Base de données** | SQLite / PostgreSQL |
| **Hébergement (optionnel)** | Render / Vercel / Railway |
| **Versioning** | GitHub |

---

## ✅ Objectif de livraison Hackathon

Réaliser **jusqu’à l’étape “Publication”** :
- Inscription / Connexion fonctionnelles  
- Création d’histoire (pitch, synopsis, épisode 1)  
- Intégration IA pour assistance à l’écriture  
- Gestion de la progression (XP, badges fictifs)  
- Page de publication avec feedback communautaire (mockée)
