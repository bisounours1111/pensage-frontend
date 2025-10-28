import { useState, useEffect } from 'react';
import { getCurrentUser, getUserExtend } from '../lib/supabase';

export const useOnboardingStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userExtend, setUserExtend] = useState(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const user = await getCurrentUser();
        
        if (!user) {
          setIsAuthenticated(false);
          setNeedsOnboarding(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);
        
        // Récupérer les données étendues de l'utilisateur
        const userExtendData = await getUserExtend(user.id);
        setUserExtend(userExtendData);
        
        if (userExtendData && userExtendData.first_connexion === true) {
          setNeedsOnboarding(true);
        } else {
          setNeedsOnboarding(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut d\'onboarding:', error);
        setNeedsOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const refreshOnboardingStatus = async () => {
    setIsLoading(true);
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        setIsAuthenticated(false);
        setNeedsOnboarding(false);
        return;
      }

      setIsAuthenticated(true);
      
      const userExtendData = await getUserExtend(user.id);
      setUserExtend(userExtendData);
      
      if (userExtendData && userExtendData.first_connexion === true) {
        setNeedsOnboarding(true);
      } else {
        setNeedsOnboarding(false);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du statut d\'onboarding:', error);
      setNeedsOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    needsOnboarding,
    isAuthenticated,
    userExtend,
    refreshOnboardingStatus
  };
};
