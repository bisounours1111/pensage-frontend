import React from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';
import '../../assets/images/pensaga.png';

const OnboardingPage = () => {
    const navigate = useNavigate();

    const handleCreateFirstStory = () => {
        navigate('/create');
    };

    return (
        <div 
            className="min-h-screen flex flex-col items-center justify-center p-6"
            style={{ 
                background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` 
            }}
        >
            <div className="w-full max-w-2xl">
                <div 
                    className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 border border-white/50 text-center"
                >
                    {/* Logo ou icône */}
                    <div className="mb-6">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                             style={{ backgroundColor: colors.primary }}>
                            <svg 
                                className="w-12 h-12 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Titre */}
                    <h1 
                        className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ color: colors.text }}
                    >
                        Bienvenue sur Pensaga !
                    </h1>

                    {/* Message de description */}
                    <p 
                        className="text-lg mb-8 leading-relaxed"
                        style={{ color: colors.text, opacity: 0.8 }}
                    >
                        Nous sommes ravis de vous accueillir dans cette aventure créative.
                        <br />
                        Pour commencer, réussissez votre première quête !
                    </p>

                    {/* CTA principal */}
                    <div className="space-y-4">
                        <h2 
                            className="text-2xl md:text-3xl font-bold mb-6"
                            style={{ color: colors.primary }}
                        >
                            Créer votre première histoire
                        </h2>
                        
                        <p 
                            className="text-base mb-8"
                            style={{ color: colors.text, opacity: 0.7 }}
                        >
                            Laissez libre cours à votre imagination et créez une histoire unique qui vous ressemble.
                        </p>

                        <button
                            onClick={handleCreateFirstStory}
                            className="w-full py-4 px-8 rounded-xl font-bold text-lg text-white transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
                            style={{ backgroundColor: colors.primary }}
                        >
                            🎨 Créer ma première histoire
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 pt-8 border-t border-white/30">
                        <p 
                            className="text-sm"
                            style={{ color: colors.text, opacity: 0.6 }}
                        >
                            ⚡ Une fois votre histoire créée, vous pourrez accéder à toutes les fonctionnalités de Pensaga !
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;

