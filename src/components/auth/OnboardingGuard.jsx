import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useOnboardingStatus } from '../../hooks/useOnboardingStatus';

const OnboardingGuard = ({ children }) => {
  const { isLoading, needsOnboarding, isAuthenticated } = useOnboardingStatus();
  const location = useLocation();

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: '#3B82F6' }}></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur a besoin d'onboarding, mais qu'il essaie d'accéder à /create, le laisser passer
  if (needsOnboarding && location.pathname === '/create') {
    return children;
  }

  // Si l'utilisateur a besoin d'onboarding pour toute autre page, rediriger vers l'onboarding
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // Sinon, afficher le contenu protégé
  return children;
};

export default OnboardingGuard;
