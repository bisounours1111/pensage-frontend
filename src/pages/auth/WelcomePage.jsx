import React from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div 
            className="min-h-screen flex flex-col items-center justify-center p-6"
            style={{ 
                background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` 
            }}
        >
            {/* Logo et titre */}
            <div className="text-center mb-12">
                <div className="text-8xl mb-6 animate-bounce">🪶</div>
                <h1 className="text-6xl md:text-8xl font-bold mb-4" style={{ color: colors.text }}>
                    Pensaga
                </h1>
                <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed" style={{ color: colors.text }}>
                    Votre plateforme d'écriture collaborative
                    <br />
                    <span className="text-lg">Gamification • IA • Communauté</span>
                </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                <button
                    onClick={() => navigate('/signup')}
                    className="flex-1 px-8 py-4 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    style={{ backgroundColor: colors.primary }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = colors.primaryLight;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = colors.primary;
                    }}
                >
                    S'inscrire
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="flex-1 px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border-2"
                    style={{ 
                        backgroundColor: 'transparent',
                        borderColor: colors.text,
                        color: colors.text
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = colors.whiteTransparent;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                    }}
                >
                    Se connecter
                </button>
            </div>

            {/* Footer avec caractéristiques */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
                <div className="text-center">
                    <div className="text-4xl mb-2">🎮</div>
                    <h3 className="font-bold mb-2" style={{ color: colors.text }}>Gamification</h3>
                    <p className="text-sm" style={{ color: colors.text, opacity: 0.8 }}>
                        Gagnez des points, débloquez des badges et relevez des défis créatifs
                    </p>
                </div>
                <div className="text-center">
                    <div className="text-4xl mb-2">🤖</div>
                    <h3 className="font-bold mb-2" style={{ color: colors.text }}>IA Assistante</h3>
                    <p className="text-sm" style={{ color: colors.text, opacity: 0.8 }}>
                        Écrivez mieux avec notre assistant IA pour l'écriture collaborative
                    </p>
                </div>
                <div className="text-center">
                    <div className="text-4xl mb-2">👥</div>
                    <h3 className="font-bold mb-2" style={{ color: colors.text }}>Communauté</h3>
                    <p className="text-sm" style={{ color: colors.text, opacity: 0.8 }}>
                        Partagez vos histoires et recevez des retours de la communauté
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;

