import React from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';
import logo from '../../assets/images/pensaga.png';

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
                <img src={logo} alt="Pensaga" className="h-32 md:h-40 w-auto mx-auto mb-6" />
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
        </div>
    );
};

export default WelcomePage;

