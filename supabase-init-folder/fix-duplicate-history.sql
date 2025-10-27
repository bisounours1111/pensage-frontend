-- Supprimer les doublons d'historique de lecture
-- Garde uniquement la première entrée pour chaque combinaison (user, webnovel, episode)
WITH ranked_history AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY id_user, id_webnovels, id_webnovels_episode 
      ORDER BY id ASC
    ) as rn
  FROM webnovels_history
)
DELETE FROM webnovels_history
WHERE id IN (
  SELECT id FROM ranked_history WHERE rn > 1
);

-- Ajouter une contrainte unique pour éviter les doublons à l'avenir
-- Note: Cette contrainte peut échouer si des doublons existent encore
-- Si c'est le cas, exécutez d'abord la requête ci-dessus
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'webnovels_history_unique_user_episode'
  ) THEN
    ALTER TABLE webnovels_history
    ADD CONSTRAINT webnovels_history_unique_user_episode
    UNIQUE(id_user, id_webnovels, id_webnovels_episode);
  END IF;
END $$;

-- Commentaire pour la contrainte
COMMENT ON CONSTRAINT webnovels_history_unique_user_episode ON webnovels_history IS 
'Garantit qu''un utilisateur ne peut avoir qu''une seule entrée par épisode';

