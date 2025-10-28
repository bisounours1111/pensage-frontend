import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryRow from '../../components/stories/StoryRow';
import colors from '../../utils/constants/colors';
import { webnovelsApi } from '../../lib/supabaseApi';
import { getCurrentUser } from '../../lib/supabase';

const MyStoriesPage = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les histoires de l'utilisateur depuis Supabase
    useEffect(() => {
        const loadStories = async () => {
            try {
                setLoading(true);
                const user = await getCurrentUser();
                if (!user) {
                    setError('Vous devez être connecté');
                    setLoading(false);
                    return;
                }

                const userStories = await webnovelsApi.getByUser(user.id);
                
                // Transformer les données Supabase en format attendu par StoryRow
                const formattedStories = userStories.map(story => ({
                    id: story.id,
                    title: story.title || 'Sans titre',
                    cover: "https://via.placeholder.com/300x450",
                    category: story.genre || 'Non spécifié',
                    progress: 0, // TODO: calculer le progrès basé sur les épisodes
                    status: story.publish ? 'published' : story.is_over ? 'draft' : 'in-progress',
                    ...story
                }));

                setStories(formattedStories);
                setError(null);
            } catch (err) {
                console.error('Erreur lors du chargement des histoires:', err);
                setError(err.message || 'Erreur lors du chargement des histoires');
            } finally {
                setLoading(false);
            }
        };

        loadStories();
    }, []);

    const handleNewStory = () => {
        navigate('/create');
    };

    const handleFilterChange = (filterType) => {
        setFilter(filterType);
    };

    // Filtrer les histoires selon le filtre actif
    const inProgressStories = filter === 'all' || filter === 'in-progress'
        ? stories.filter(s => s.status === 'in-progress')
        : [];

    const draftStories = filter === 'all' || filter === 'draft'
        ? stories.filter(s => s.status === 'draft')
        : [];

    const publishedStories = filter === 'all' || filter === 'published'
        ? stories.filter(s => s.status === 'published')
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-b" style={{ background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` }}>
            {/* Header */}
            <header className="p-6 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-0" style={{ color: colors.text }}>
                        Mes Histoires
                    </h1>
                    <button
                        className="cursor-pointer text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:scale-105"
                        style={{ backgroundColor: colors.primary }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryLight}
                        onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
                        onClick={handleNewStory}
                    >
                        + Nouvelle Histoire
                    </button>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-3">
                    <button
                        className="cursor-pointer px-4 py-2 rounded-lg transition shadow-sm backdrop-blur-sm"
                        style={{
                            backgroundColor: filter === 'all' ? colors.primary : colors.whiteTransparent,
                            color: filter === 'all' ? colors.white : colors.text
                        }}
                        onMouseEnter={(e) => {
                            if (filter !== 'all') {
                                e.target.style.backgroundColor = colors.whiteTransparentLight;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (filter !== 'all') {
                                e.target.style.backgroundColor = colors.whiteTransparent;
                            }
                        }}
                        onClick={() => handleFilterChange('all')}
                    >
                        Tout
                    </button>
                    <button
                        className="cursor-pointer px-4 py-2 rounded-lg transition shadow-sm backdrop-blur-sm"
                        style={{
                            backgroundColor: filter === 'in-progress' ? colors.primary : colors.whiteTransparent,
                            color: filter === 'in-progress' ? colors.white : colors.text
                        }}
                        onMouseEnter={(e) => {
                            if (filter !== 'in-progress') {
                                e.target.style.backgroundColor = colors.whiteTransparentLight;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (filter !== 'in-progress') {
                                e.target.style.backgroundColor = colors.whiteTransparent;
                            }
                        }}
                        onClick={() => handleFilterChange('in-progress')}
                    >
                        En cours
                    </button>
                    <button
                        className="cursor-pointer px-4 py-2 rounded-lg transition shadow-sm backdrop-blur-sm"
                        style={{
                            backgroundColor: filter === 'draft' ? colors.primary : colors.whiteTransparent,
                            color: filter === 'draft' ? colors.white : colors.text
                        }}
                        onMouseEnter={(e) => {
                            if (filter !== 'draft') {
                                e.target.style.backgroundColor = colors.whiteTransparentLight;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (filter !== 'draft') {
                                e.target.style.backgroundColor = colors.whiteTransparent;
                            }
                        }}
                        onClick={() => handleFilterChange('draft')}
                    >
                        Terminées
                    </button>
                    <button
                        className="cursor-pointer px-4 py-2 rounded-lg transition shadow-sm backdrop-blur-sm"
                        style={{
                            backgroundColor: filter === 'published' ? colors.primary : colors.whiteTransparent,
                            color: filter === 'published' ? colors.white : colors.text
                        }}
                        onMouseEnter={(e) => {
                            if (filter !== 'published') {
                                e.target.style.backgroundColor = colors.whiteTransparentLight;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (filter !== 'published') {
                                e.target.style.backgroundColor = colors.whiteTransparent;
                            }
                        }}
                        onClick={() => handleFilterChange('published')}
                    >
                        Publiées
                    </button>
                </div>
            </header>

            {/* Message de chargement ou d'erreur */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="text-lg" style={{ color: colors.text }}>
                        Chargement de vos histoires...
                    </div>
                </div>
            )}

            {error && (
                <div className="px-6 md:px-12 py-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            )}

            {!loading && !error && (
                <div className="space-y-8 px-6 md:px-12 pb-12">
                    {/* Continuer la lecture */}
                    {inProgressStories.length > 0 && (
                        <StoryRow
                            title="En cours d'écriture"
                            stories={inProgressStories}
                            mode="manage"
                        />
                    )}

                    {/* Brouillons */}
                    {draftStories.length > 0 && (
                        <StoryRow
                            title="Terminées"
                            stories={draftStories}
                            mode="manage"
                        />
                    )}

                    {/* Publiées */}
                    {publishedStories.length > 0 && (
                        <StoryRow
                            title="Publiées"
                            stories={publishedStories}
                            mode="manage"
                        />
                    )}

                    {/* Aucune histoire */}
                    {inProgressStories.length === 0 && draftStories.length === 0 && publishedStories.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <p className="text-xl mb-4" style={{ color: colors.text }}>
                                Vous n'avez pas encore d'histoires
                            </p>
                            <button
                                className="cursor-pointer text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:scale-105"
                                style={{ backgroundColor: colors.primary }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryLight}
                                onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
                                onClick={handleNewStory}
                            >
                                Créer votre première histoire
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyStoriesPage;

