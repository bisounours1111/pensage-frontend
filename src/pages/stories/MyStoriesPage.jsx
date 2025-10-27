import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StoryRow from '../../components/stories/StoryRow';
import colors from '../../utils/constants/colors';

const MyStoriesPage = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [stories] = useState([
        {
            id: 1,
            title: "Histoire 1",
            cover: "https://via.placeholder.com/300x450",
            category: "Fantasy",
            progress: 65,
            status: "in-progress",
            lastOpened: "2024-01-15"
        },
        {
            id: 2,
            title: "Histoire 2",
            cover: "https://via.placeholder.com/300x450",
            category: "Aventure",
            progress: 0,
            status: "draft",
            lastOpened: "2024-01-10"
        },
        {
            id: 3,
            title: "Histoire 3",
            cover: "https://via.placeholder.com/300x450",
            category: "Romance",
            progress: 100,
            status: "published",
            lastOpened: "2024-01-20"
        }
    ]);

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

            {/* Sections de catalogue */}
            <div className="space-y-8 px-6 md:px-12 pb-12">
                {/* Continuer la lecture */}
                {inProgressStories.length > 0 && (
                    <StoryRow
                        title="En cours d'écriture"
                        stories={inProgressStories}
                    />
                )}

                {/* Brouillons */}
                {draftStories.length > 0 && (
                    <StoryRow
                        title="Terminées"
                        stories={draftStories}
                    />
                )}

                {/* Publiées */}
                {publishedStories.length > 0 && (
                    <StoryRow
                        title="Publiées"
                        stories={publishedStories}
                    />
                )}
            </div>
        </div>
    );
};

export default MyStoriesPage;

