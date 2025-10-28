-- ========================================
-- Migration : Ajout du champ image_url à la table webnovels
-- ========================================

-- Ajouter le champ image_url à la table webnovels
ALTER TABLE webnovels ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN webnovels.image_url IS 'URL de l''image de couverture du webnovel dans le bucket Supabase';

