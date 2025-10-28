-- ========================================
-- Politiques RLS pour le bucket pensaga-bucket
-- ========================================

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;

-- Politique pour permettre l'upload d'images aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pensaga-bucket' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'covers'
);

-- Politique pour permettre la lecture publique des images
CREATE POLICY "Allow public read access to images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'pensaga-bucket'
  AND (storage.foldername(name))[1] = 'covers'
);

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to delete their images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'pensaga-bucket' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'covers'
);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'pensaga-bucket' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = 'covers'
);

-- ========================================
-- Vérification des politiques
-- ========================================

-- Pour vérifier que les politiques sont bien créées :
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
