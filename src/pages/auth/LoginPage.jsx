import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';
import { signIn, supabase } from '../../lib/supabase';
import AuthForm from '../../components/auth/AuthForm';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Veuillez entrer une adresse email valide';
        }

        if (!formData.password || formData.password.length < 1) {
            newErrors.password = 'Le mot de passe est requis';
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
            const result = await signIn(formData.email, formData.password);
            
            if (result.user) {
                // Connexion réussie
                console.log('Connexion réussie:', result.user);
                // Vérifier si c'est la première connexion
                const { data: userData } = await supabase
                    .from('user_extend')
                    .select('first_connexion')
                    .eq('id', result.user.id)
                    .single();
                
                // Rediriger vers onboarding si first_connexion est true
                if (userData && userData.first_connexion) {
                    navigate('/onboarding');
                } else {
                    navigate('/home');
                }
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            
            // Gérer les erreurs spécifiques de Supabase
            if (error.message.includes('Invalid login')) {
                setErrors({ general: 'Email ou mot de passe incorrect' });
            } else if (error.message.includes('email')) {
                setErrors({ general: 'Adresse email invalide' });
            } else if (error.message.includes('password')) {
                setErrors({ general: 'Mot de passe incorrect' });
            } else {
                setErrors({ general: 'Erreur lors de la connexion. Veuillez réessayer.' });
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
                mode="login"
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

export default LoginPage;

