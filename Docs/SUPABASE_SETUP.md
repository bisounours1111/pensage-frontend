# 🚀 Configuration Supabase - Pensaga

## 📋 Étapes d'installation

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau compte ou connectez-vous
3. Créez un nouveau projet
4. Attendez que le projet soit prêt (2-3 minutes)

### 2. Configurer les variables d'environnement

1. Copiez le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```

2. Dans Supabase Dashboard, allez dans **Settings** → **API**

3. Copiez les valeurs suivantes :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

4. Modifiez le fichier `.env` avec vos valeurs :
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_API_URL=http://localhost:8000
   ```

### 3. Initialiser la base de données

1. Dans Supabase Dashboard, allez dans **SQL Editor**

2. Ouvrez le fichier `supabase-init-folder/supabase-init.sql`

3. Copiez tout le contenu et collez-le dans l'éditeur SQL

4. Cliquez sur **RUN** pour exécuter le script

5. Vérifiez que les tables sont créées dans **Database** → **Tables**

### 4. Configurer les Row Level Security (RLS)

Pour sécuriser vos données, activez le RLS sur certaines tables.

#### Activer RLS sur user_extend

```sql
ALTER TABLE user_extend ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own data"
ON user_extend
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
ON user_extend
FOR UPDATE
USING (auth.uid() = id);
```

#### Activer RLS sur webnovels

```sql
ALTER TABLE webnovels ENABLE ROW LEVEL SECURITY;

-- Les webnovels publiés sont visibles par tous
CREATE POLICY "Published webnovels are visible to everyone"
ON webnovels
FOR SELECT
USING (publish = true);

-- Les auteurs peuvent voir et modifier leurs propres webnovels
CREATE POLICY "Authors can manage their own webnovels"
ON webnovels
FOR ALL
USING (auth.uid() = id_author);
```

#### Activer RLS sur webnovels_episode

```sql
ALTER TABLE webnovels_episode ENABLE ROW LEVEL SECURITY;

-- Les épisodes des webnovels publiés sont visibles
CREATE POLICY "Episodes of published webnovels are visible"
ON webnovels_episode
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM webnovels
    WHERE webnovels.id = webnovels_episode.id_webnovels
    AND webnovels.publish = true
  )
);

-- Les auteurs peuvent modifier les épisodes de leurs webnovels
CREATE POLICY "Authors can manage episodes of their webnovels"
ON webnovels_episode
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM webnovels
    WHERE webnovels.id = webnovels_episode.id_webnovels
    AND webnovels.id_author = auth.uid()
  )
);
```

#### Activer RLS sur les autres tables

```sql
-- user_notification
ALTER TABLE user_notification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications"
ON user_notification
FOR SELECT
USING (auth.uid() = id_user);

CREATE POLICY "Users can update their own notifications"
ON user_notification
FOR UPDATE
USING (auth.uid() = id_user);

-- webnovels_likes
ALTER TABLE webnovels_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can like public webnovels"
ON webnovels_likes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM webnovels
    WHERE webnovels.id = webnovels_likes.id_webnovels
    AND webnovels.publish = true
  )
);

-- webnovels_comment
ALTER TABLE webnovels_comment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can comment on public webnovels"
ON webnovels_comment
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM webnovels
    WHERE webnovels.id = webnovels_comment.id_webnovels
    AND webnovels.publish = true
  )
);
```

### 5. Utiliser Supabase dans votre code

Importez le client dans vos composants :

```javascript
import { supabase } from '@/lib/supabase';

// Dans votre composant
const { data, error } = await supabase
  .from('webnovels')
  .select('*');
```

Utilisez les fonctions helper :

```javascript
import { signUp, signIn, getCurrentUser } from '@/lib/supabase';
import { webnovelsApi } from '@/lib/supabaseApi';

// Inscription
await signUp('email@example.com', 'password', {
  username: 'john_doe',
  name: 'John',
  lastname: 'Doe'
});

// Récupérer les webnovels
const webnovels = await webnovelsApi.getAllPublished();
```

## 📚 Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🔧 Dépannage

### Erreur : "Variables d'environnement Supabase manquantes"

Vérifiez que votre fichier `.env` existe et contient les bonnes valeurs.

### Erreur : "Table doesn't exist"

Exécutez le script `supabase-init.sql` dans l'éditeur SQL de Supabase.

### Les données ne s'affichent pas

Vérifiez que le RLS est configuré correctement et que vos policies permettent l'accès.

