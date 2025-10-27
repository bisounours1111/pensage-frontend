import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        prenom: '',
        nom: '',
        age: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Effacer l'erreur pour ce champ
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
        }

        if (!formData.prenom) {
            newErrors.prenom = 'Le prénom est requis';
        }

        if (!formData.nom) {
            newErrors.nom = 'Le nom est requis';
        }

        if (!formData.age || formData.age < 13) {
            newErrors.age = 'Vous devez avoir au moins 13 ans';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Veuillez entrer une adresse email valide';
        }

        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Inscription:', formData);
            // Ici, vous pourrez connecter à l'API pour l'inscription
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-3 py-4"
            style={{ 
                background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` 
            }}
        >
            <div className="w-full max-w-4xl">
                {/* Formulaire */}
                <div 
                    className="bg-white/50 backdrop-blur-lg rounded-xl shadow-xl p-4 md:p-8 border border-white/40 relative"
                >
                    {/* Bouton retour */}
                    <button 
                        onClick={() => navigate('/')}
                        className="absolute mb-4 md:mb-6 text-xl md:text-2xl hover:opacity-70 transition"
                        style={{ color: colors.text }}
                    >
                        ←
                    </button>
                    {/* Titre dans le formulaire */}
                    <div className="text-center mb-4 md:mb-6">
                        <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2" style={{ color: colors.text }}>
                            Créer un compte
                        </h1>
                        <p className="text-xs md:text-sm hidden md:block" style={{ color: colors.text, opacity: 0.8 }}>
                            Commencez votre aventure d'écriture dès aujourd'hui
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                        {/* Nom d'utilisateur */}
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
                                value={formData.username}
                                onChange={handleChange}
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

                        {/* Prénom et Nom */}
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
                                    value={formData.prenom}
                                    onChange={handleChange}
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
                                    value={formData.nom}
                                    onChange={handleChange}
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

                        {/* Âge et Email */}
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
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
                                    value={formData.age}
                                    onChange={handleChange}
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
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Au moins 6 caractères"
                                    className={`w-full px-2.5 py-1.5 md:px-3 md:py-2 text-sm rounded-lg border-2 transition-all pr-8 md:pr-10 ${
                                        errors.password 
                                            ? 'border-red-400' 
                                            : 'border-white/50 focus:border-white'
                                    } focus:outline-none focus:ring-2 focus:ring-opacity-50 backdrop-blur-sm bg-white/60`}
                                    style={{ color: colors.text }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
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

                        {/* Confirmation mot de passe */}
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
                                value={formData.confirmPassword}
                                onChange={handleChange}
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

                        {/* Bouton de soumission */}
                        <div className="pt-1">
                            <button
                                type="submit"
                                className="w-full py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base text-white transition-all shadow-lg hover:shadow-xl"
                                style={{ backgroundColor: colors.primary }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = colors.primaryLight;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = colors.primary;
                                }}
                            >
                                Créer mon compte
                            </button>
                        </div>

                        {/* Lien vers la connexion */}
                        <div className="text-center text-xs pt-1 md:pt-2">
                            <p style={{ color: colors.text, opacity: 0.8 }}>
                                Déjà un compte ?{' '}
                                <a 
                                    href="/login" 
                                    className="font-semibold underline hover:opacity-80 transition"
                                    style={{ color: colors.primary }}
                                >
                                    Se connecter
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

