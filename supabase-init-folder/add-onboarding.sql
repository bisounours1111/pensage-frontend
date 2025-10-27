-- ========================================
-- MIGRATION : AJOUT DU SYSTÈME D'ONBOARDING
-- ========================================
-- Ce fichier ajoute le champ first_connexion et le trigger d'onboarding
-- à une base de données déjà existante

-- Ajout du champ first_connexion si n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user_extend' 
        AND column_name = 'first_connexion'
    ) THEN
        ALTER TABLE user_extend ADD COLUMN first_connexion BOOLEAN DEFAULT TRUE;
        COMMENT ON COLUMN user_extend.first_connexion IS 'Première connexion - onboarding à compléter';
        
        -- Mettre à jour tous les utilisateurs existants pour qu'ils n'aient pas l'onboarding
        UPDATE user_extend SET first_connexion = FALSE;
        
        RAISE NOTICE '✓ Colonne first_connexion ajoutée';
    ELSE
        RAISE NOTICE 'Colonne first_connexion existe déjà';
    END IF;
END $$;

-- Créer la quête "Première histoire" si elle n'existe pas
DO $$
DECLARE
    quest_exists BOOLEAN;
    quest_id INTEGER;
BEGIN
    -- Vérifier si la quête existe
    SELECT EXISTS (
        SELECT 1 FROM quest 
        WHERE key_target = 'webnovels' 
        AND amount_target = 1
    ) INTO quest_exists;
    
    IF NOT quest_exists THEN
        -- Insérer la quête "Première histoire"
        INSERT INTO quest (title, description, amount_target, key_target, xp)
        VALUES ('Première histoire', 'Créer ma première histoire', 1, 'webnovels', 200)
        RETURNING id INTO quest_id;
        
        RAISE NOTICE '✓ Quête "Première histoire" créée avec l''ID: %', quest_id;
        
        -- Initialiser la progression pour tous les utilisateurs existants
        INSERT INTO quest_progress (id_user, id_quest, progression, valided)
        SELECT id, quest_id, 0, FALSE
        FROM user_extend
        WHERE NOT EXISTS (
            SELECT 1 FROM quest_progress 
            WHERE id_user = user_extend.id AND id_quest = quest_id
        );
        
        RAISE NOTICE '✓ Progression initialisée pour tous les utilisateurs existants';
    ELSE
        RAISE NOTICE 'Quête "Première histoire" existe déjà';
    END IF;
END $$;

-- Création de la fonction de vérification de la quête "Première histoire"
CREATE OR REPLACE FUNCTION check_first_story_quest()
RETURNS TRIGGER AS $$
DECLARE
    quest_id INTEGER;
    is_first_story BOOLEAN;
    story_count INTEGER;
    user_xp INTEGER;
    quest_xp INTEGER;
BEGIN
    -- Trouver la quête "Première histoire" via key_target
    SELECT id INTO quest_id 
    FROM quest 
    WHERE key_target = 'webnovels' 
    AND amount_target = 1;
    
    -- Si la quête existe
    IF quest_id IS NOT NULL THEN
        -- Vérifier si c'est la première histoire de cet utilisateur
        SELECT COUNT(*) INTO story_count
        FROM webnovels
        WHERE id_author = NEW.id_author;
        
        -- C'est la première histoire si le count = 1 (celle qui vient d'être créée)
        is_first_story := (story_count = 1);
        
        IF is_first_story THEN
            -- Mettre à jour quest_progress
            -- Vérifier si la progression existe déjà
            IF NOT EXISTS (
                SELECT 1 FROM quest_progress 
                WHERE id_user = NEW.id_author AND id_quest = quest_id
            ) THEN
                -- Insérer une nouvelle progression
                INSERT INTO quest_progress (id_user, id_quest, progression, valided)
                VALUES (NEW.id_author, quest_id, 100, TRUE);
            ELSE
                -- Mettre à jour la progression existante
                UPDATE quest_progress 
                SET progression = 100, valided = TRUE
                WHERE id_user = NEW.id_author AND id_quest = quest_id;
            END IF;
            
            -- Récupérer l'XP de la quête
            SELECT xp INTO quest_xp FROM quest WHERE id = quest_id;
            
            -- Récupérer l'XP actuel de l'utilisateur
            SELECT xp INTO user_xp FROM user_extend WHERE id = NEW.id_author;
            
            -- Ajouter l'XP de la quête à l'utilisateur
            UPDATE user_extend 
            SET xp = COALESCE(user_xp, 0) + COALESCE(quest_xp, 0)
            WHERE id = NEW.id_author;
            
            -- Mettre first_connexion à false pour cet utilisateur
            UPDATE user_extend 
            SET first_connexion = FALSE 
            WHERE id = NEW.id_author;
            
            RAISE NOTICE '✓ Première histoire créée pour l''utilisateur % - Quête validée, XP ajouté, onboarding terminé', NEW.id_author;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS trigger_check_first_connexion ON quest_progress;
DROP TRIGGER IF EXISTS trigger_check_first_story ON webnovels;

-- Créer le nouveau trigger sur la table webnovels
CREATE TRIGGER trigger_check_first_story
AFTER INSERT ON webnovels
FOR EACH ROW
EXECUTE FUNCTION check_first_story_quest();

COMMENT ON FUNCTION check_first_story_quest() IS 'Vérifie si une première histoire est créée et complète l''onboarding automatiquement';
COMMENT ON TRIGGER trigger_check_first_story ON webnovels IS 'Déclenche la vérification de l''onboarding lors de la création d''une histoire';

RAISE NOTICE '✓ Système d''onboarding configuré avec succès !';

