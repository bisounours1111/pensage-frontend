import React from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';
import logo from '../../assets/images/pensaga.png';
import { useOnboardingStatus } from '../../hooks/useOnboardingStatus';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const { refreshOnboardingStatus } = useOnboardingStatus();

    const handleCreateStory = () => {
        navigate('/create');
    };

    const handleCheckStatus = async () => {
        await refreshOnboardingStatus();
        // Le OnboardingGuard se chargera automatiquement de rediriger si first_connexion = false
        // On peut aussi rediriger manuellement vers home pour forcer la vérification
        navigate('/home');
    };

    return (
        <div 
            className="min-h-screen flex flex-col items-center justify-center p-6"
            style={{ 
                background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` 
            }}
        >
            {/* Logo et message de bienvenue */}
            <div className="text-center mb-12">
                <img src={logo} alt="Pensaga" className="h-32 md:h-40 w-auto mx-auto mb-8" />
                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text }}>
                    Bienvenue sur Pensaga !
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-6" style={{ color: colors.text }}>
                    Votre aventure d'écriture commence maintenant !
                    <br />
                    <span className="text-base">Créez votre première histoire et découvrez toutes les fonctionnalités de notre plateforme.</span>
                </p>
            </div>

            {/* Card d'onboarding */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
                <div className="text-center">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
                            Votre première quête
                        </h2>
                        <p className="text-sm opacity-90" style={{ color: colors.text }}>
                            Créez votre première histoire pour commencer votre parcours d'écrivain et gagner vos premiers points d'expérience !
                        </p>
                    </div>

                    {/* Bouton principal */}
                    <button
                        onClick={handleCreateStory}
                        className="w-full px-8 py-4 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
                        style={{ backgroundColor: colors.primary }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = colors.primaryLight;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = colors.primary;
                        }}
                    >
                        Créer ma première histoire
                    </button>

                    {/* Bouton pour vérifier le statut */}
                    <button
                        onClick={handleCheckStatus}
                        className="w-full px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105 mb-4"
                        style={{ 
                            backgroundColor: 'transparent',
                            borderColor: colors.primary,
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            color: colors.primary
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = colors.primary + '20';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                        }}
                    >
                        Vérifier mon statut
                    </button>

                    {/* Informations supplémentaires */}
                    <div className="text-xs opacity-75" style={{ color: colors.text }}>
                        <p>Vous pourrez explorer toutes les fonctionnalités une fois votre première histoire créée</p>
                        <p className="mt-2">Après avoir créé votre histoire, cliquez sur "Vérifier mon statut" pour continuer</p>
                    </div>
                </div>
            </div>

            {/* Footer avec possibilité de skip (optionnel) */}
            <div className="mt-8 text-center">
                <button
                    onClick={() => navigate('/home')}
                    className="text-sm opacity-60 hover:opacity-100 transition-opacity underline"
                    style={{ color: colors.text }}
                >
                    Passer l'onboarding (non recommandé)
                </button>
            </div>
        </div>
    );
};

export default OnboardingPage;
