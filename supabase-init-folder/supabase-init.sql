-- ========================================
-- INITIALISATION BASE DE DONNÉES SUPABASE
-- Pensaga - Plateforme gamifiée d'écriture
-- ========================================
-- Note: La table auth.users existe déjà nativement dans Supabase

-- Extension pour UUID (optionnel mais recommandé pour Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABLE USER_EXTEND
-- Table d'extension pour les utilisateurs Supabase
-- ========================================
CREATE TABLE IF NOT EXISTS user_extend (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    name TEXT,
    preferences JSONB,
    lastname TEXT,
    token INTEGER DEFAULT 0,
    age INTEGER,
    has_subscription BOOLEAN DEFAULT FALSE,
    xp INTEGER DEFAULT 0
);

COMMENT ON TABLE user_extend IS 'Extension de la table auth.users native de Supabase';
COMMENT ON COLUMN user_extend.id IS 'Identifiant UUID lié à auth.users';
COMMENT ON COLUMN user_extend.username IS 'Nom d''utilisateur';
COMMENT ON COLUMN user_extend.name IS 'Prénom';
COMMENT ON COLUMN user_extend.lastname IS 'Nom de famille';
COMMENT ON COLUMN user_extend.preferences IS 'Préférences utilisateur (JSON)';
COMMENT ON COLUMN user_extend.token IS 'Nombre de tokens/pièces virtuelles';
COMMENT ON COLUMN user_extend.age IS 'Âge de l''utilisateur';
COMMENT ON COLUMN user_extend.has_subscription IS 'Abonnement actif';
COMMENT ON COLUMN user_extend.xp IS 'Points d''expérience';

-- ========================================
-- TABLE QUEST
-- ========================================
CREATE TABLE IF NOT EXISTS quest (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    amount_target INTEGER NOT NULL,
    key_target TEXT,
    xp INTEGER DEFAULT 0
);

COMMENT ON TABLE quest IS 'Table des quêtes/objectifs';
COMMENT ON COLUMN quest.id IS 'Identifiant unique';
COMMENT ON COLUMN quest.title IS 'Titre de la quête';
COMMENT ON COLUMN quest.description IS 'Description de la quête';
COMMENT ON COLUMN quest.amount_target IS 'Cible de progression';
COMMENT ON COLUMN quest.key_target IS 'Clé de la cible';
COMMENT ON COLUMN quest.xp IS 'XP gagné à la validation';

-- ========================================
-- TABLE QUEST_PROGRESS
-- ========================================
CREATE TABLE IF NOT EXISTS quest_progress (
    id SERIAL PRIMARY KEY,
    id_user UUID NOT NULL REFERENCES user_extend(id) ON DELETE CASCADE,
    id_quest INTEGER NOT NULL REFERENCES quest(id) ON DELETE CASCADE,
    progression INTEGER DEFAULT 0,
    valided BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE quest_progress IS 'Progression des quêtes par utilisateur';
COMMENT ON COLUMN quest_progress.id_user IS 'Utilisateur concerné';
COMMENT ON COLUMN quest_progress.id_quest IS 'Quête concernée';
COMMENT ON COLUMN quest_progress.progression IS 'Progression actuelle';
COMMENT ON COLUMN quest_progress.valided IS 'Quête validée ou non';

-- ========================================
-- TABLE WEBNOVELS
-- ========================================
CREATE TABLE IF NOT EXISTS webnovels (
    id SERIAL PRIMARY KEY,
    id_author UUID NOT NULL REFERENCES user_extend(id) ON DELETE CASCADE,
    title TEXT,
    pitch TEXT,
    synopsis TEXT,
    characters JSONB,
    genre TEXT,
    publish BOOLEAN DEFAULT FALSE,
    is_over BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE webnovels IS 'Table des webnovels/histoires';
COMMENT ON COLUMN webnovels.id IS 'Identifiant unique';
COMMENT ON COLUMN webnovels.id_author IS 'Auteur de l''histoire';
COMMENT ON COLUMN webnovels.title IS 'Titre de l''histoire';
COMMENT ON COLUMN webnovels.pitch IS 'Pitch de l''histoire';
COMMENT ON COLUMN webnovels.synopsis IS 'Synopsis de l''histoire';
COMMENT ON COLUMN webnovels.characters IS 'Personnages (JSON)';
COMMENT ON COLUMN webnovels.genre IS 'Genre de l''histoire';
COMMENT ON COLUMN webnovels.publish IS 'Publié ou non';
COMMENT ON COLUMN webnovels.is_over IS 'Histoire terminée';

-- ========================================
-- TABLE WEBNOVELS_EPISODE
-- ========================================
CREATE TABLE IF NOT EXISTS webnovels_episode (
    id SERIAL PRIMARY KEY,
    id_webnovels INTEGER NOT NULL REFERENCES webnovels(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    content TEXT
);

COMMENT ON TABLE webnovels_episode IS 'Table des épisodes des webnovels';
COMMENT ON COLUMN webnovels_episode.id IS 'Identifiant unique';
COMMENT ON COLUMN webnovels_episode.id_webnovels IS 'Webnovel concerné';
COMMENT ON COLUMN webnovels_episode.number IS 'Numéro de l''épisode';
COMMENT ON COLUMN webnovels_episode.content IS 'Contenu de l''épisode';

-- ========================================
-- TABLE WEBNOVELS_HISTORY
-- ========================================
CREATE TABLE IF NOT EXISTS webnovels_history (
    id SERIAL PRIMARY KEY,
    id_webnovels INTEGER NOT NULL REFERENCES webnovels(id) ON DELETE CASCADE,
    id_user UUID NOT NULL REFERENCES user_extend(id) ON DELETE CASCADE,
    id_webnovels_episode INTEGER NOT NULL REFERENCES webnovels_episode(id) ON DELETE CASCADE,
    is_over BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE webnovels_history IS 'Historique de lecture des utilisateurs';
COMMENT ON COLUMN webnovels_history.id IS 'Identifiant unique';
COMMENT ON COLUMN webnovels_history.id_webnovels IS 'Webnovel lu';
COMMENT ON COLUMN webnovels_history.id_user IS 'Utilisateur lecteur';
COMMENT ON COLUMN webnovels_history.id_webnovels_episode IS 'Dernier épisode lu';
COMMENT ON COLUMN webnovels_history.is_over IS 'Lecture terminée';

-- ========================================
-- TABLE WEBNOVELS_LIKES
-- ========================================
CREATE TABLE IF NOT EXISTS webnovels_likes (
    id SERIAL PRIMARY KEY,
    id_webnovels INTEGER NOT NULL REFERENCES webnovels(id) ON DELETE CASCADE,
    id_user UUID NOT NULL REFERENCES user_extend(id) ON DELETE CASCADE,
    UNIQUE(id_webnovels, id_user)
);

COMMENT ON TABLE webnovels_likes IS 'Table des likes sur les webnovels';
COMMENT ON COLUMN webnovels_likes.id IS 'Identifiant unique';
COMMENT ON COLUMN webnovels_likes.id_webnovels IS 'Webnovel liké';
COMMENT ON COLUMN webnovels_likes.id_user IS 'Utilisateur qui like';

-- ========================================
-- TABLE WEBNOVELS_COMMENT
-- ========================================
CREATE TABLE IF NOT EXISTS webnovels_comment (
    id SERIAL PRIMARY KEY,
    id_webnovels INTEGER NOT NULL REFERENCES webnovels(id) ON DELETE CASCADE,
    id_user UUID NOT NULL REFERENCES user_extend(id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES webnovels_comment(id) ON DELETE CASCADE,
    content TEXT NOT NULL
);

COMMENT ON TABLE webnovels_comment IS 'Table des commentaires sur les webnovels';
COMMENT ON COLUMN webnovels_comment.id IS 'Identifiant unique';
COMMENT ON COLUMN webnovels_comment.id_webnovels IS 'Webnovel commenté';
COMMENT ON COLUMN webnovels_comment.id_user IS 'Auteur du commentaire';
COMMENT ON COLUMN webnovels_comment.parent_comment_id IS 'Commentaire parent (réponse)';
COMMENT ON COLUMN webnovels_comment.content IS 'Contenu du commentaire';

-- ========================================
-- TABLE SHOP_TOKEN
-- ========================================
CREATE TABLE IF NOT EXISTS shop_token (
    id SERIAL PRIMARY KEY,
    price NUMERIC(10, 2) NOT NULL,
    title TEXT NOT NULL,
    token_amount INTEGER NOT NULL
);

COMMENT ON TABLE shop_token IS 'Boutique de tokens/pièces virtuelles';
COMMENT ON COLUMN shop_token.id IS 'Identifiant unique';
COMMENT ON COLUMN shop_token.price IS 'Prix en euros';
COMMENT ON COLUMN shop_token.title IS 'Titre de l''offre';
COMMENT ON COLUMN shop_token.token_amount IS 'Nombre de tokens inclus';

-- ========================================
-- TABLE SHOP_SUBSCRIPTION
-- ========================================
CREATE TABLE IF NOT EXISTS shop_subscription (
    id SERIAL PRIMARY KEY,
    price NUMERIC(10, 2) NOT NULL,
    title TEXT NOT NULL
);

COMMENT ON TABLE shop_subscription IS 'Boutique d''abonnements';
COMMENT ON COLUMN shop_subscription.id IS 'Identifiant unique';
COMMENT ON COLUMN shop_subscription.price IS 'Prix en euros';
COMMENT ON COLUMN shop_subscription.title IS 'Titre de l''offre';

-- ========================================
-- TABLE USER_NOTIFICATION
-- ========================================
CREATE TABLE IF NOT EXISTS user_notification (
    id SERIAL PRIMARY KEY,
    id_user UUID NOT NULL REFERENCES user_extend(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE user_notification IS 'Notifications des utilisateurs';
COMMENT ON COLUMN user_notification.id IS 'Identifiant unique';
COMMENT ON COLUMN user_notification.id_user IS 'Utilisateur concerné';
COMMENT ON COLUMN user_notification.title IS 'Titre de la notification';
COMMENT ON COLUMN user_notification.message IS 'Message de la notification';
COMMENT ON COLUMN user_notification.is_read IS 'Notification lue ou non';

-- ========================================
-- TABLE TRANSACTION
-- ========================================
CREATE TABLE IF NOT EXISTS transaction (
    id SERIAL PRIMARY KEY,
    id_user UUID NOT NULL REFERENCES user_extend(id) ON DELETE CASCADE,
    id_shop_token INTEGER REFERENCES shop_token(id) ON DELETE SET NULL,
    id_shop_subscription INTEGER REFERENCES shop_subscription(id) ON DELETE SET NULL,
    status TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE
);

COMMENT ON TABLE transaction IS 'Table des transactions';
COMMENT ON COLUMN transaction.id IS 'Identifiant unique';
COMMENT ON COLUMN transaction.id_user IS 'Utilisateur concerné';
COMMENT ON COLUMN transaction.id_shop_token IS 'Token acheté (si applicable)';
COMMENT ON COLUMN transaction.id_shop_subscription IS 'Abonnement acheté (si applicable)';
COMMENT ON COLUMN transaction.status IS 'Statut de la transaction';
COMMENT ON COLUMN transaction.date IS 'Date de la transaction';

-- ========================================
-- INDEX POUR OPTIMISER LES PERFORMANCES
-- ========================================

-- Index sur les foreign keys fréquemment utilisées
CREATE INDEX IF NOT EXISTS idx_user_extend_preferences ON user_extend(preferences);
CREATE INDEX IF NOT EXISTS idx_quest_progress_user ON quest_progress(id_user);
CREATE INDEX IF NOT EXISTS idx_quest_progress_quest ON quest_progress(id_quest);
CREATE INDEX IF NOT EXISTS idx_webnovels_author ON webnovels(id_author);
CREATE INDEX IF NOT EXISTS idx_webnovels_publish ON webnovels(publish);
CREATE INDEX IF NOT EXISTS idx_webnovels_title ON webnovels(title);
CREATE INDEX IF NOT EXISTS idx_episode_webnovels ON webnovels_episode(id_webnovels);
CREATE INDEX IF NOT EXISTS idx_history_user ON webnovels_history(id_user);
CREATE INDEX IF NOT EXISTS idx_history_webnovels ON webnovels_history(id_webnovels);
CREATE INDEX IF NOT EXISTS idx_likes_webnovels ON webnovels_likes(id_webnovels);
CREATE INDEX IF NOT EXISTS idx_comment_webnovels ON webnovels_comment(id_webnovels);
CREATE INDEX IF NOT EXISTS idx_comment_parent ON webnovels_comment(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_notification_user ON user_notification(id_user);
CREATE INDEX IF NOT EXISTS idx_notification_read ON user_notification(is_read);
CREATE INDEX IF NOT EXISTS idx_transaction_user ON transaction(id_user);

-- ========================================
-- FONCTION FINALE
-- ========================================

-- Affiche un message de succès
DO $$
BEGIN
    RAISE NOTICE '✓ Initialisation de la base de données Pensaga terminée avec succès !';
    RAISE NOTICE '✓ Tables créées : 12';
    RAISE NOTICE '✓ Index créés : 16';
    RAISE NOTICE '✓ Utilise la table native auth.users de Supabase';
END $$;
