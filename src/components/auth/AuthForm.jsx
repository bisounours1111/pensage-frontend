import React from 'react';
import colors from '../../utils/constants/colors';

const AuthForm = ({ 
    mode = 'signup', // 'signup' ou 'login'
    formData,
    errors,
    showPassword,
    onChange,
    onShowPasswordToggle,
    onSubmit,
    onNavigate,
    isLoading = false
}) => {
    const isSignup = mode === 'signup';

    return (
        <div className="w-full max-w-4xl">
            {/* Formulaire */}
            <div 
                className="bg-white/50 backdrop-blur-lg rounded-xl shadow-xl p-4 md:p-8 border border-white/40 relative"
            >
                {/* Bouton retour */}
                <button 
                    onClick={() => onNavigate && onNavigate('/')}
                    className="absolute mb-4 md:mb-6 text-xl md:text-2xl hover:opacity-70 transition"
                    style={{ color: colors.text }}
                >
                    ←
                </button>

                {/* Titre dans le formulaire */}
                <div className="text-center mb-4 md:mb-6">
                    <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2" style={{ color: colors.text }}>
                        {isSignup ? 'Créer un compte' : 'Se connecter'}
                    </h1>
                    <p className="text-xs md:text-sm hidden md:block" style={{ color: colors.text, opacity: 0.8 }}>
                        {isSignup 
                            ? "Commencez votre aventure d'écriture dès aujourd'hui"
                            : "Retrouvez votre espace d'écriture"
                        }
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-3 md:space-y-4">
                    {/* Nom d'utilisateur (uniquement pour inscription) */}
                    {isSignup && (
                        <div>
                            <label 
                                htmlFor="username" 
                                className="block text-xs font-semibold mb-0.5"
                                style={{ color: colors.text }}
                            >
                                Nom d'utilisateur *
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username || ''}
                                onChange={onChange}
                                placeholder="Choisissez un nom d'utilisateur"
                                className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 text-sm rounded-lg border-2 transition-all ${
                                    errors.username 
                                        ? 'border-red-400' 
                                        : 'border-white/50 focus:border-white'
                                } focus:outline-none focus:ring-2 focus:ring-opacity-50 backdrop-blur-sm bg-white/60`}
                                style={{ color: colors.text }}
                            />
                            {errors.username && (
                                <p className="text-xs mt-0.5 text-red-500">{errors.username}</p>
                            )}
                        </div>
                    )}

                    {/* Prénom et Nom (uniquement pour inscription) */}
                    {isSignup && (
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            <div>
                                <label 
                                    htmlFor="prenom" 
                                    className="block text-xs font-semibold mb-0.5"
                                    style={{ color: colors.text }}
                                >
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    id="prenom"
                                    name="prenom"
                                    value={formData.prenom || ''}
                                    onChange={onChange}
                                    placeholder="Prénom"
                                    className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 text-sm rounded-lg border-2 transition-all ${
                                        errors.prenom 
                                            ? 'border-red-400' 
                                            : 'border-white/50 focus:border-white'
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-50 backdrop-blur-sm bg-white/60`}
                                    style={{ color: colors.text }}
                                />
                                {errors.prenom && (
                                    <p className="text-xs mt-0.5 text-red-500">{errors.prenom}</p>
                                )}
                            </div>

                            <div>
                                <label 
                                    htmlFor="nom" 
                                    className="block text-xs font-semibold mb-0.5"
                                    style={{ color: colors.text }}
                                >
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    value={formData.nom || ''}
                                    onChange={onChange}
                                    placeholder="Nom"
                                    className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 text-sm rounded-lg border-2 transition-all ${
                                        errors.nom 
                                            ? 'border-red-400' 
                                            : 'border-white/50 focus:border-white'
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-50 backdrop-blur-sm bg-white/60`}
                                    style={{ color: colors.text }}
                                />
                                {errors.nom && (
                                    <p className="text-xs mt-0.5 text-red-500">{errors.nom}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Âge (uniquement pour inscription) */}
                    {isSignup && (
                        <div>
                            <label 
                                htmlFor="age" 
                                className="block text-xs font-semibold mb-0.5"
                                style={{ color: colors.text }}
                            >
                                Âge *
                            </label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age || ''}
                                onChange={onChange}
                                placeholder="Âge"
                                min="13"
                                className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 text-sm rounded-lg border-2 transition-all ${
                                    errors.age 
                                        ? 'border-red-400' 
                                        : 'border-white/50 focus:border-white'
                                } focus:outline-none focus:ring-2 focus:ring-opacity-50 backdrop-blur-sm bg-white/60`}
                                style={{ color: colors.text }}
                            />
                            {errors.age && (
                                <p className="text-xs mt-0.5 text-red-500">{errors.age}</p>
                            )}
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-xs font-semibold mb-0.5"
                            style={{ color: colors.text }}
                        >
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={onChange}
                            placeholder="email@exemple.com"
                            className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 text-sm rounded-lg border-2 transition-all ${
                                errors.email 
                                    ? 'border-red-400' 
                                    : 'border-white/50 focus:border-white'
                            } focus:outline-none focus:ring-2 focus:ring-opacity-50 backdrop-blur-sm bg-white/60`}
                            style={{ color: colors.text }}
                        />
                        {errors.email && (
                            <p className="text-xs mt-0.5 text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-xs font-semibold mb-0.5"
                            style={{ color: colors.text }}
                        >
                            Mot de passe *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password || ''}
                                onChange={onChange}
                                placeholder={isSignup ? "Au moins 6 caractères" : "Votre mot de passe"}
                                className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 text-sm rounded-lg border-2 transition-all pr-8 md:pr-10 ${
                                    errors.password 
                                        ? 'border-red-400' 
                                        : 'border-white/50 focus:border-white'
                                } focus:outline-none focus:ring-2 focus:ring-opacity-50 backdrop-blur-sm bg-white/60`}
                                style={{ color: colors.text }}
                            />
                            <button
                                type="button"
                                onClick={onShowPasswordToggle}
                                className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 text-xs md:text-sm"
                                style={{ color: colors.text }}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs mt-0.5 text-red-500">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirmation mot de passe (uniquement pour inscription) */}
                    {isSignup && (
                        <div>
                            <label 
                                htmlFor="confirmPassword" 
                                className="block text-xs font-semibold mb-0.5"
                                style={{ color: colors.text }}
                            >
                                Confirmer le mot de passe *
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword || ''}
                                onChange={onChange}
                                placeholder="Confirmez votre mot de passe"
                                className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 text-sm rounded-lg border-2 transition-all ${
                                    errors.confirmPassword 
                                        ? 'border-red-400' 
                                        : 'border-white/50 focus:border-white'
                                } focus:outline-none focus:ring-2 focus:ring-opacity-50 backdrop-blur-sm bg-white/60`}
                                style={{ color: colors.text }}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs mt-0.5 text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>
                    )}

                    {/* Message d'erreur général */}
                    {errors.general && (
                        <div className="text-center">
                            <p className="text-xs text-red-500">{errors.general}</p>
                        </div>
                    )}

                    {/* Bouton de soumission */}
                    <div className="pt-1">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: colors.primary }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.target.style.backgroundColor = colors.primaryLight;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.target.style.backgroundColor = colors.primary;
                                }
                            }}
                        >
                            {isLoading ? 'Chargement...' : (isSignup ? 'Créer mon compte' : 'Se connecter')}
                        </button>
                    </div>

                    {/* Lien de navigation */}
                    <div className="text-center text-xs pt-1 md:pt-2">
                        <p style={{ color: colors.text, opacity: 0.8 }}>
                            {isSignup ? 'Déjà un compte ?' : "Pas encore de compte ?"}{' '}
                            <a 
                                href={isSignup ? "/login" : "/signup"}
                                className="font-semibold underline hover:opacity-80 transition"
                                style={{ color: colors.primary }}
                            >
                                {isSignup ? 'Se connecter' : "S'inscrire"}
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;

