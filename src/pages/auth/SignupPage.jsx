import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';
import { signUp } from '../../lib/supabase';
import AuthForm from '../../components/auth/AuthForm';
import GenreSelectionStep from '../../components/auth/GenreSelectionStep';
import { genresList } from '../../utils/constants/genres';

const SignupPage = () => {
    const navigate = useNavigate();
    
    // État pour le stepper
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        username: '',
        prenom: '',
        nom: '',
        age: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [selectedGenres, setSelectedGenres] = useState([]);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (currentStep === 1) {
            // Validation de l'étape 1
            if (!validateForm()) {
                return;
            }
            // Passer à l'étape 2
            setCurrentStep(2);
            return;
        }

        if (currentStep === 2) {
            // Validation de l'étape 2
            if (selectedGenres.length === 0) {
                setErrors({ general: 'Veuillez sélectionner au moins un genre' });
                return;
            }
            // Passer à l'étape 3
            setCurrentStep(3);
            return;
        }

        // Étape 3 - Soumission finale

        setIsLoading(true);
        setErrors({});

        try {
            const userData = {
                username: formData.username,
                name: formData.prenom,
                lastname: formData.nom,
                age: parseInt(formData.age),
                favoriteGenres: selectedGenres
            };

            const result = await signUp(formData.email, formData.password, userData);
            
            if (result.user) {
                // Inscription réussie
                console.log('Inscription réussie:', result.user);
                // Rediriger vers la page d'accueil ou dashboard
                navigate('/home');
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            
            // Gérer les erreurs spécifiques de Supabase
            if (error.message.includes('already registered')) {
                setErrors({ general: 'Cet email est déjà utilisé' });
            } else if (error.message.includes('email')) {
                setErrors({ general: 'Adresse email invalide' });
            } else if (error.message.includes('password')) {
                setErrors({ general: 'Le mot de passe est trop faible' });
            } else {
                setErrors({ general: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenreToggle = (genreId) => {
        setSelectedGenres(prev => {
            if (prev.includes(genreId)) {
                return prev.filter(id => id !== genreId);
            } else {
                return [...prev, genreId];
            }
        });
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setErrors({});
        }
    };

    const canProceedToNextStep = () => {
        if (currentStep === 1) {
            return validateForm();
        }
        if (currentStep === 2) {
            return selectedGenres.length > 0;
        }
        return true;
    };

    const handleShowPasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div 
            className="min-h-screen flex flex-col items-center justify-center p-3 py-4"
            style={{ 
                background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` 
            }}
        >
            <div className="w-full max-w-2xl">
                {/* Contenu de l'étape */}
                <div 
                    className="bg-white/50 backdrop-blur-lg rounded-xl shadow-xl p-4 md:p-6 border border-white/40 relative"
                >
                    {/* Bouton retour */}
                    {currentStep === 1 && (
                        <button 
                            onClick={() => navigate('/')}
                            className="absolute mb-1 md:mb-2 text-xl md:text-2xl hover:opacity-70 cursor-pointer transition"
                            style={{ color: colors.text }}
                        >
                            ←
                        </button>
                    )}
                    {currentStep > 1 && (
                        <button 
                            onClick={handlePreviousStep}
                            className="absolute mb-1 md:mb-2 text-xl md:text-2xl hover:opacity-70 cursor-pointer transition"
                            style={{ color: colors.text }}
                        >
                            ←
                        </button>
                    )}

                    {/* Étape 1 : Informations */}
                    {currentStep === 1 && (
                        <div>
                            <div className="text-center mb-4">
                                <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2" style={{ color: colors.text }}>
                                    Informations personnelles
                                </h1>
                                <p className="text-xs md:text-sm" style={{ color: colors.text, opacity: 0.8 }}>
                                    Créez votre compte
                                </p>
                            </div>
                            <AuthForm
                                mode="signup"
                                formData={formData}
                                errors={errors}
                                showPassword={showPassword}
                                onChange={handleChange}
                                onShowPasswordToggle={handleShowPasswordToggle}
                                onSubmit={handleSubmit}
                                onNavigate={handleNavigate}
                                isLoading={isLoading}
                                hideLinks={true}
                                buttonText="Étape suivante"
                            />
                            {/* Lien vers la connexion */}
                            <div className="text-center text-xs pt-2 mt-4">
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
                        </div>
                    )}

                    {/* Étape 2 : Genres */}
                    {currentStep === 2 && (
                        <div className="w-full">
                            <GenreSelectionStep
                                selectedGenres={selectedGenres}
                                onGenreToggle={handleGenreToggle}
                                maxSelection={5}
                            />
                            
                            {/* Message d'erreur général */}
                            {errors.general && (
                                <div className="text-center mt-4">
                                    <p className="text-xs text-red-500">{errors.general}</p>
                                </div>
                            )}

                            {/* Boutons de navigation */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handlePreviousStep}
                                    className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl"
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        border: `2px solid ${colors.text}`,
                                        color: colors.text
                                    }}
                                >
                                    Retour
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canProceedToNextStep() || isLoading}
                                    className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    Étape suivante
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Étape 3 : Récapitulatif */}
                    {currentStep === 3 && (
                        <div className="w-full">
                            <div className="text-center mb-4">
                                <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: colors.text }}>
                                    Récapitulatif
                                </h2>
                                <p className="text-xs md:text-sm" style={{ color: colors.text, opacity: 0.8 }}>
                                    Vérifiez vos informations avant de créer votre compte
                                </p>
                            </div>

                            <div className="space-y-3 mb-4 max-h-[50vh] overflow-y-auto pr-2">
                                {/* Informations personnelles */}
                                <div className="space-y-2">
                                    <h3 className="font-bold text-sm" style={{ color: colors.primary }}>Informations personnelles</h3>
                                    <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: colors.text, opacity: 0.8 }}>Nom d'utilisateur</span>
                                            <span style={{ color: colors.text, fontWeight: 'bold' }}>{formData.username}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: colors.text, opacity: 0.8 }}>Prénom</span>
                                            <span style={{ color: colors.text, fontWeight: 'bold' }}>{formData.prenom}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: colors.text, opacity: 0.8 }}>Nom</span>
                                            <span style={{ color: colors.text, fontWeight: 'bold' }}>{formData.nom}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: colors.text, opacity: 0.8 }}>Âge</span>
                                            <span style={{ color: colors.text, fontWeight: 'bold' }}>{formData.age} ans</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span style={{ color: colors.text, opacity: 0.8 }}>Email</span>
                                            <span style={{ color: colors.text, fontWeight: 'bold' }}>{formData.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Genres sélectionnés */}
                                <div className="space-y-2">
                                    <h3 className="font-bold text-sm" style={{ color: colors.primary }}>Genres préférés</h3>
                                    <div className="bg-white/30 backdrop-blur-sm rounded-lg p-3">
                                        <div className="flex flex-wrap gap-2">
                                            {selectedGenres.map((genreId) => {
                                                // Trouver le genre dans la liste
                                                const genre = genresList.find(g => g.id === genreId);
                                                return genre ? (
                                                    <span
                                                        key={genreId}
                                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                                        style={{
                                                            backgroundColor: colors.primary,
                                                            color: colors.white
                                                        }}
                                                    >
                                                        {genre.name}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message d'erreur général */}
                            {errors.general && (
                                <div className="text-center mb-4">
                                    <p className="text-xs text-red-500">{errors.general}</p>
                                </div>
                            )}

                            {/* Boutons de navigation */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePreviousStep}
                                    className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg hover:shadow-xl"
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        border: `2px solid ${colors.text}`,
                                        color: colors.text
                                    }}
                                >
                                    Retour
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm text-white transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    {isLoading ? 'Création...' : 'Créer mon compte'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
