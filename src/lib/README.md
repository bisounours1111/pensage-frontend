# 📚 Bibliothèque Supabase

Ce dossier contient la configuration et les helpers pour Supabase.

## 📁 Fichiers

- `supabase.js` - Client Supabase et fonctions helper

## 🔧 Configuration

### 1. Installation des dépendances

```bash
npm install @supabase/supabase-js
```

### 2. Configuration des variables d'environnement

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Remplissez les valeurs dans `.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key
```

### 3. Obtention des clés Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un projet ou sélectionnez votre projet existant
3. Allez dans **Settings** → **API**
4. Copiez :
   - **URL du projet** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

## 🚀 Utilisation

### Import du client

```javascript
import { supabase } from '@/lib/supabase';
```

### Fonctions disponibles

#### `getCurrentUser()`
Récupère l'utilisateur authentifié depuis `auth.users`

```javascript
const user = await getCurrentUser();
```

#### `getUserExtend(userId)`
Récupère les données étendues depuis `user_extend`

```javascript
const userExtend = await getUserExtend('user-uuid');
```

#### `getFullUser()`
Récupère l'utilisateur complet (auth + user_extend)

```javascript
const fullUser = await getFullUser();
```

#### `signUp(email, password, userData)`
Inscription d'un nouvel utilisateur

```javascript
const { user } = await signUp('email@example.com', 'password', {
  username: 'john_doe',
  name: 'John',
  lastname: 'Doe',
  age: 25
});
```

#### `signIn(email, password)`
Connexion d'un utilisateur

```javascript
const { user } = await signIn('email@example.com', 'password');
```

#### `signOut()`
Déconnexion

```javascript
await signOut();
```

#### `onAuthStateChange(callback)`
Écoute les changements d'état d'authentification

```javascript
const { data: { subscription } } = onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});

// Pour se désabonner
subscription.unsubscribe();
```

## 📖 Exemples d'utilisation

### Dans un composant React

```javascript
import { useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';

function MyComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer l'utilisateur actuel
    getCurrentUser().then(setUser);

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <div>{user ? `Bonjour ${user.email}` : 'Non connecté'}</div>;
}
```

### Requêtes sur les tables

```javascript
import { supabase } from '@/lib/supabase';

// Récupérer tous les webnovels
const { data: webnovels, error } = await supabase
  .from('webnovels')
  .select('*')
  .eq('publish', true);

// Insérer un webnovel
const { data: newWebnovel, error } = await supabase
  .from('webnovels')
  .insert({
    id_author: userId,
    title: 'Mon histoire',
    pitch: 'Un pitch captivant',
    synopsis: 'Le synopsis...',
    genre: 'Fantasy',
    characters: { hero: 'Jean', villain: 'Méchant' }
  })
  .select()
  .single();
```

## 🔐 Sécurité

- ⚠️ Ne jamais exposer les clés **service_role** dans le frontend
- ✅ Utilisez uniquement la clé **anon** dans le frontend
- ✅ Configurez les **Row Level Security (RLS)** dans Supabase
- ✅ Utilisez `signUp()` pour créer automatiquement `user_extend`

## 📝 Next Steps

1. Configurer les **RLS policies** dans Supabase Dashboard
2. Créer des fonctions helper pour les webnovels (dans `src/utils/api/`)
3. Créer un contexte React pour l'auth (dans `src/context/`)

