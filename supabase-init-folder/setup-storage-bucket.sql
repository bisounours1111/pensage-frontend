-- ========================================
-- Script de vérification et configuration du bucket
-- ========================================

-- 1. Vérifier que le bucket existe
SELECT * FROM storage.buckets WHERE id = 'pensaga-bucket';

-- 2. Si le bucket n'existe pas, le créer
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pensaga-bucket', 
  'pensaga-bucket', 
  true, 
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 3. Vérifier les politiques RLS existantes
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%pensaga%';

-- 4. Supprimer les anciennes politiques si elles existent (optionnel)
-- DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated users to delete their images" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;

-- Créer les nouvelles politiques
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pensaga-bucket' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'covers'
);

CREATE POLICY "Allow public read access to images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'pensaga-bucket'
  AND (storage.foldername(name))[1] = 'covers'
);

CREATE POLICY "Allow authenticated users to delete their images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'pensaga-bucket' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'covers'
);

CREATE POLICY "Allow authenticated users to update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'pensaga-bucket' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'covers'
);

-- 6. Vérifier la configuration finale
SELECT 
  'Bucket Configuration' as check_type,
  id as identifier,
  public as public_access,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'pensaga-bucket';

-- Vérifier les politiques créées
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%pensaga%';
