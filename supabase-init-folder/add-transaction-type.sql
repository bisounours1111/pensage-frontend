-- Ajouter la colonne 'type' à la table transaction
-- pour distinguer les achats, abonnements et récompenses gratuites

ALTER TABLE transaction 
ADD COLUMN type VARCHAR(20) DEFAULT 'purchase' 
CHECK (type IN ('purchase', 'subscription', 'reward'));

-- Commenter pour comprendre les types :
-- 'purchase' : Achat de pack de tokens
-- 'subscription' : Achat d'un abonnement
-- 'reward' : Récompense hebdomadaire gratuite

-- Mettre à jour les transactions existantes pour que ce soit des achats
UPDATE transaction 
SET type = 'purchase' 
WHERE type IS NULL;

