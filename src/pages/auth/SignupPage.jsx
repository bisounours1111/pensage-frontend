import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';
import { signUp } from '../../lib/supabase';
import AuthForm from '../../components/auth/AuthForm';

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
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const userData = {
                username: formData.username,
                name: formData.prenom,
                lastname: formData.nom,
                age: parseInt(formData.age)
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

    const handleShowPasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center p-3 py-4"
            style={{ 
                background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` 
            }}
        >
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
            />
        </div>
    );
};

export default SignupPage;
