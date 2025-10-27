-- Ajouter la colonne created_at à la table webnovels_comment
ALTER TABLE webnovels_comment
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Commentaire pour la colonne
COMMENT ON COLUMN webnovels_comment.created_at IS 'Date de création du commentaire';

