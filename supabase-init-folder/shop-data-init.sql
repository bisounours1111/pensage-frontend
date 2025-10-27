-- ========================================
-- INITIALISATION DES DONNÉES BOUTIQUE
-- Pensaga - Données de test pour la boutique
-- ========================================

-- Insertion des packs de tokens
INSERT INTO shop_token (price, title, token_amount) VALUES
(0.99, 'Pack 100', 100),
(1.99, 'Pack 250', 250),
(2.99, 'Pack 500', 500),
(4.99, 'Pack 1000', 1000);

-- Insertion des abonnements
INSERT INTO shop_subscription (price, title) VALUES
(12.99, 'Abonnement Premium mensuel');

-- ========================================
-- AFFICHAGE DES DONNÉES INSÉRÉES
-- ========================================

-- Vérification des packs de tokens
SELECT 'Packs de tokens créés :' as info;
SELECT id, title, price, token_amount FROM shop_token ORDER BY token_amount ASC;

-- Vérification des abonnements
SELECT 'Abonnements créés :' as info;
SELECT id, title, price FROM shop_subscription;

-- Message de succès
DO $$
BEGIN
    RAISE NOTICE '✓ Données de la boutique initialisées avec succès !';
    RAISE NOTICE '✓ Packs de tokens : 4';
    RAISE NOTICE '✓ Abonnements : 1';
    RAISE NOTICE '';
    RAISE NOTICE 'ℹ️  Système de récompenses hebdomadaires :';
    RAISE NOTICE '   - Utilisateurs gratuits : +100 points/semaine';
    RAISE NOTICE '   - Utilisateurs Premium : +2000 points/semaine';
    RAISE NOTICE '   - Vérification automatique via la table TRANSACTION';
END $$;

