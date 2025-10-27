import React, { useState } from 'react';
import colors from '../../utils/constants/colors';
import ContinueReadingCard from '../../components/common/ContinueReadingCard';
import TrendingStoryCard from '../../components/common/TrendingStoryCard';
import RecommendedStoryCard from '../../components/common/RecommendedStoryCard';

const HomePage = () => {
    const [stories] = useState([
        // Histoires en cours
        {
            id: 8,
            title: "Mon Histoire",
            cover: "https://via.placeholder.com/300x450",
            category: "Fantasy",
            progress: 65,
            status: "in-progress",
            lastOpened: "2024-01-15"
        },
        {
            id: 9,
            title: "Mon Deuxième Projet",
            cover: "https://via.placeholder.com/300x450",
            category: "Romance",
            progress: 30,
            status: "in-progress",
            lastOpened: "2024-01-20"
        },
        // Histoires populaires
        {
            id: 1,
            title: "L'Épopée du Temps",
            cover: "https://via.placeholder.com/300x450",
            category: "Fantasy",
            progress: 100,
            status: "published",
            likes: 2500,
            views: 12000,
            author: "Sophie Martin"
        },
        {
            id: 2,
            title: "Lunes Mystiques",
            cover: "https://via.placeholder.com/300x450",
            category: "Aventure",
            progress: 100,
            status: "published",
            likes: 1800,
            views: 8500,
            author: "Lucas Dubois"
        },
        {
            id: 3,
            title: "Le Jardin Secret",
            cover: "https://via.placeholder.com/300x450",
            category: "Romance",
            progress: 100,
            status: "published",
            likes: 3200,
            views: 15000,
            author: "Emma Bernard"
        },
        // Tendances
        {
            id: 4,
            title: "Au-delà du Réel",
            cover: "https://via.placeholder.com/300x450",
            category: "Science-Fiction",
            progress: 100,
            status: "published",
            likes: 2100,
            views: 9800,
            author: "Antoine Leroy"
        },
        {
            id: 10,
            title: "Chroniques Célestes",
            cover: "https://via.placeholder.com/300x450",
            category: "Fantasy",
            progress: 100,
            status: "published",
            likes: 1900,
            views: 9200,
            author: "Camille Dubois"
        },
        // Recommandations
        {
            id: 5,
            title: "Les Souvenirs d'Azura",
            cover: "https://via.placeholder.com/300x450",
            category: "Fantasy",
            progress: 75,
            status: "published",
            likes: 890,
            views: 4200,
            author: "Chloé Moreau"
        },
        {
            id: 6,
            title: "Rêves d'Étoiles",
            cover: "https://via.placeholder.com/300x450",
            category: "Aventure",
            progress: 100,
            status: "published",
            likes: 1200,
            views: 6500,
            author: "Tom Durand"
        },
        {
            id: 7,
            title: "Les Secrets de Montclair",
            cover: "https://via.placeholder.com/300x450",
            category: "Romance",
            progress: 100,
            status: "published",
            likes: 980,
            views: 4800,
            author: "Léa Rousseau"
        }
    ]);

    // Séparer les histoires par catégorie
    const continueReading = stories.filter(s => s.status === 'in-progress');
    const popularStories = stories.filter(s => s.status === 'published' && s.views > 8000);
    const trendingStories = stories.filter(s => s.status === 'published' && s.views >= 8500 && s.views < 15000);
    const recommendedStories = stories.filter(s => s.status === 'published' && s.views <= 8000 && s.views >= 4000);

    return (
        <div className="min-h-screen bg-gradient-to-b pt-24" style={{ background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` }}>
            {/* Hero Section */}
            <div className="px-6 md:px-12 py-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-2" style={{ color: colors.text }}>
                    Bienvenue sur Pensaga
                </h1>
                <p className="text-lg md:text-xl" style={{ color: colors.textSecondary }}>
                    Découvrez des histoires extraordinaires
                </p>
            </div>

            {/* Sections de catalogue */}
            <div className="space-y-12 px-6 md:px-12 pb-24">
                {/* Continue ta lecture */}
                {continueReading.length > 0 && (
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: colors.text }}>
                            Continue ta lecture
                        </h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                            {continueReading.map(story => (
                                <ContinueReadingCard key={story.id} story={story} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Tendances */}
                {trendingStories.length > 0 && (
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: colors.text }}>
                            🔥 Tendances maintenant
                        </h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                            {trendingStories.map(story => (
                                <TrendingStoryCard key={story.id} story={story} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Recommandations pour vous */}
                {recommendedStories.length > 0 && (
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: colors.text }}>
                            ✨ Recommandé pour vous
                        </h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                            {recommendedStories.map(story => (
                                <RecommendedStoryCard key={story.id} story={story} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Message si pas d'histoires */}
                {continueReading.length === 0 && trendingStories.length === 0 && recommendedStories.length === 0 && (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.text }}>
                            Commencez votre aventure
                        </h2>
                        <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
                            Créez votre première histoire et rejoignez notre communauté d'auteurs
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
