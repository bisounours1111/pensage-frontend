# 📋 Système d'Onboarding - Documentation

## 🎯 Vue d'ensemble

Le système d'onboarding redirige automatiquement les nouveaux utilisateurs vers une page dédiée lors de leur première connexion. Ils doivent créer leur première histoire avant d'accéder au reste de l'application.

## 🗂️ Fichiers modifiés/créés

### Base de données

1. **`supabase-init-folder/supabase-init.sql`**
   - Ajout du champ `first_connexion` (BOOLEAN, DEFAULT TRUE) à la table `user_extend`
   - Création de la fonction `check_first_story_quest()` 
   - Création du trigger `trigger_check_first_connexion`

2. **`supabase-init-folder/add-onboarding.sql`** (NOUVEAU)
   - Script de migration pour bases de données existantes
   - Ajoute le champ `first_connexion` si nécessaire
   - Crée la fonction et le trigger

### Frontend

3. **`src/lib/supabase.js`**
   - Modification de `signUp()` : initialise `first_connexion = true`
   - Modification de `getUserExtend()` : récupère aussi `first_connexion`

4. **`src/components/auth/ProtectedRoute.jsx`** (NOUVEAU)
   - Composant de protection des routes
   - Vérifie si l'utilisateur est connecté
   - Redirige vers `/onboarding` si `first_connexion = true`
   - Bloque l'accès aux autres pages pendant l'onboarding

5. **`src/pages/auth/OnboardingPage.jsx`** (NOUVEAU)
   - Page d'onboarding avec message de bienvenue
   - Bouton "Créer ma première histoire" qui redirige vers `/create`

6. **`src/App.jsx`**
   - Import de `OnboardingPage` et `ProtectedRoute`
   - Ajout de la route `/onboarding`
   - Protection de toutes les routes avec `ProtectedRoute`
   - Exclusion de `/onboarding` des pages d'auth (pas de Header/Navbar)

7. **`src/pages/auth/LoginPage.jsx`**
   - Vérification de `first_connexion` après connexion
   - Redirection vers `/onboarding` si `first_connexion = true`
   - Import de `supabase`

8. **`src/pages/auth/SignupPage.jsx`**
   - Redirection vers `/onboarding` au lieu de `/home` après inscription

## 🔄 Fonctionnement

### 1. Inscription
```
Utilisateur s'inscrit → first_connexion = true → Redirection vers /onboarding
```

### 2. Onboarding
```
Utilisateur voit la page d'onboarding → Clique sur "Créer ma première histoire" → Va vers /create
```

### 3. Création de l'histoire
```
Utilisateur crée son histoire → Quête validée → Trigger détecte la validation
Trigger met first_connexion = false → Utilisateur peut accéder au reste de l'app
```

### 4. Protection des routes
```
Si first_connexion = true:
  ✅ Accès autorisé à: /onboarding, /create
  ❌ Accès bloqué à: toutes les autres pages
  → Redirection automatique vers /onboarding
```

## 🚀 Installation

### Pour une nouvelle base de données

Exécutez le fichier `supabase-init-folder/supabase-init.sql` dans votre console Supabase.
Ce script créera :
- La colonne `first_connexion` dans `user_extend`
- La quête "Première histoire" 
- Le trigger sur la table `webnovels`

### Pour une base existante

⚠️ **IMPORTANT** : Si votre base de données contient déjà des données, utilisez `supabase-init-folder/add-onboarding.sql`

Exécutez ce fichier dans votre console Supabase. Ce script :
- Ajoutera la colonne `first_connexion` (sans affecter les données existantes)
- Créera la quête "Première histoire" si elle n'existe pas
- Initialisera la progression pour tous les utilisateurs existants
- Créera le trigger sur la table `webnovels`

## 📝 Trigger PostgreSQL

Le trigger `trigger_check_first_story` se déclenche automatiquement quand :

1. Une nouvelle histoire est créée dans la table `webnovels`
2. Le système vérifie si c'est la **première** histoire de cet utilisateur (COUNT = 1)
3. Si c'est la première histoire, le trigger :
   - Met à jour `quest_progress` : progression = 100, valided = TRUE
   - Ajoute l'XP de la quête à l'utilisateur (200 XP)
   - Met `first_connexion = FALSE` pour terminer l'onboarding

### Critères de validation

Le trigger utilise le **key_target** au lieu du titre. La quête "Première histoire" est identifiée par :
- `key_target = 'webnovels'`
- `amount_target = 1`

Cela signifie : "Créer 1 webnovel dans la table webnovels"

## 🎨 Personnalisation

### Message d'onboarding

Modifiez `src/pages/auth/OnboardingPage.jsx` pour personnaliser :
- Le titre de bienvenue
- Le message de description
- Le style et les couleurs

### Quête d'onboarding

La quête "Première histoire" est créée automatiquement avec :
- **title**: "Première histoire"
- **description**: "Créer ma première histoire"
- **amount_target**: 1
- **key_target**: "webnovels" (vérifie la présence dans la table webnovels)
- **xp**: 200

Le trigger surveille la table `webnovels` via `key_target` au lieu du titre. C'est plus robuste et flexible.

### Couleurs et styles

Les couleurs sont importées depuis `src/utils/constants/colors`. Modifiez ce fichier pour changer le thème visuel.

## ✅ Tests recommandés

1. **Créer un nouveau compte** → Vérifier la redirection vers l'onboarding
2. **Accéder à une page protégée** pendant l'onboarding → Vérifier la redirection
3. **Créer une histoire** → Vérifier que `first_connexion` passe à `false`
4. **Se reconnecter** → Vérifier qu'on ne passe plus par l'onboarding

## 🐛 Dépannage

### L'utilisateur reste bloqué sur l'onboarding

Vérifiez dans Supabase :
```sql
SELECT id, username, first_connexion FROM user_extend WHERE id = 'USER_ID';
```

Si `first_connexion` est toujours `true` après avoir créé une histoire :
1. Vérifiez que la quête existe : `SELECT * FROM quest WHERE key_target = 'webnovels' AND amount_target = 1`
2. Vérifiez que vous avez bien une histoire : `SELECT * FROM webnovels WHERE id_author = 'USER_ID'`
3. Vérifiez la progression : `SELECT * FROM quest_progress WHERE id_user = 'USER_ID' AND valided = true`
4. Vérifiez que le trigger existe : `SELECT * FROM pg_trigger WHERE tgname = 'trigger_check_first_story'`

### Le trigger ne fonctionne pas

Vérifiez la fonction :
```sql
SELECT prosrc FROM pg_proc WHERE proname = 'check_first_story_quest';
```

Recréez le trigger si nécessaire :
```sql
DROP TRIGGER IF EXISTS trigger_check_first_story ON webnovels;
CREATE TRIGGER trigger_check_first_story
AFTER INSERT ON webnovels
FOR EACH ROW
EXECUTE FUNCTION check_first_story_quest();
```

## 📊 Structure de données

### Table `user_extend`
```sql
id: UUID
username: TEXT
name: TEXT
preferences: JSONB
lastname: TEXT
token: INTEGER (default 0)
age: INTEGER
has_subscription: BOOLEAN (default false)
xp: INTEGER (default 0)
first_connexion: BOOLEAN (default true) ← NOUVEAU
```

### Table `quest_progress`
```sql
id: SERIAL
id_user: UUID (FK → user_extend.id)
id_quest: INTEGER (FK → quest.id)
progression: INTEGER (default 0)
valided: BOOLEAN (default false)
```

## 🎓 Notes importantes

- Le champ `first_connexion` est initialisé à `TRUE` par défaut lors de l'inscription
- Les utilisateurs existants gardent leur `first_connexion = FALSE` (modifiez le script de migration si nécessaire)
- Le trigger fonctionne de manière asynchrone : la mise à jour de `first_connexion` peut prendre quelques millisecondes
- Les pages accessibles pendant l'onboarding sont : `/onboarding` et `/create`

