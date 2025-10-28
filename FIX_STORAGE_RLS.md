# Résolution du problème RLS pour l'upload d'images

## Problème
```
StorageApiError: new row violates row-level security policy
```

## Solution

### 1. Exécuter le script de configuration
Dans votre console Supabase SQL, exécutez le contenu du fichier `setup-storage-bucket.sql` :

```sql
-- Créer le bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pensaga-bucket', 
  'pensaga-bucket', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Créer les politiques RLS
CREATE POLICY IF NOT EXISTS "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pensaga-bucket' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'covers'
);

CREATE POLICY IF NOT EXISTS "Allow public read access to images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'pensaga-bucket'
  AND (storage.foldername(name))[1] = 'covers'
);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete their images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'pensaga-bucket' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'covers'
);

CREATE POLICY IF NOT EXISTS "Allow authenticated users to update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'pensaga-bucket' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'covers'
);
```

### 2. Vérifier la configuration
```sql
-- Vérifier le bucket
SELECT * FROM storage.buckets WHERE id = 'pensaga-bucket';

-- Vérifier les politiques
SELECT policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%pensaga%';
```

### 3. Alternative rapide (temporaire)
Si vous voulez tester rapidement, vous pouvez désactiver temporairement RLS :

```sql
-- ATTENTION: Ceci désactive la sécurité, à utiliser uniquement pour les tests
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

**⚠️ Important :** Réactivez RLS après les tests avec :
```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

## Explication
- **RLS (Row Level Security)** : Système de sécurité de Supabase qui contrôle l'accès aux données
- **Bucket public** : Permet la lecture publique, mais pas forcément l'écriture
- **Politiques** : Règles qui définissent qui peut faire quoi sur quelles données
- **Authentification requise** : Seuls les utilisateurs connectés peuvent uploader/supprimer

## Test
Après avoir exécuté le script, testez l'upload d'image dans votre application.
