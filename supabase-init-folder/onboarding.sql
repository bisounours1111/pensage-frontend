
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
