import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, getUserExtend } from '../../lib/supabase';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                
                if (!user) {
                    navigate('/login');
                    return;
                }

                const data = await getUserExtend(user.id);
                setUserData(data);

                // Si first_connexion est true ET qu'on n'est pas sur onboarding ou create
                if (data && data.first_connexion) {
                    if (location.pathname !== '/onboarding' && location.pathname !== '/create') {
                        navigate('/onboarding');
                        return;
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'authentification:', error);
                navigate('/login');
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [navigate, location.pathname]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#9333ea' }}></div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;

