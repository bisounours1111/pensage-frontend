import React from 'react';
import colors from '../../utils/constants/colors';

const StoryCard = ({ story, highlightProgress = false }) => {
    return (
        <div className="flex-shrink-0 w-48 md:w-56 group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg bg-white/30 backdrop-blur-sm shadow-lg aspect-[2/3] mb-2 border border-white/40">
                {/* Image de couverture */}
                <img
                    src={story.cover}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Overlay au survol */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ backgroundColor: colors.overlay }}
                >
                    <div className="text-white text-center p-4">
                        <p className="text-sm font-semibold mb-1">{story.title}</p>
                        <span className="text-xs text-white/90">{story.category}</span>
                    </div>
                </div>

                {/* Badge de statut */}
                {story.status === 'published' && (
                    <div
                        className="absolute top-2 right-2 text-xs px-2 py-1 rounded font-semibold shadow-md"
                        style={{ backgroundColor: colors.published, color: colors.text }}
                    >
                        Publiée
                    </div>
                )}
                {story.status === 'draft' && (
                    <div
                        className="absolute top-2 right-2 text-xs px-2 py-1 rounded font-semibold shadow-md"
                        style={{ backgroundColor: colors.draft, color: colors.text }}
                    >
                        Brouillon
                    </div>
                )}
            </div>

            {/* Titre */}
            <h3 className="font-medium text-sm truncate" style={{ color: colors.text }}>{story.title}</h3>

            {/* Barre de progression (pour les histoires en cours) */}
            {highlightProgress && story.progress > 0 && (
                <div className="mt-2">
                    <div className="w-full rounded-full h-1.5" style={{ backgroundColor: colors.whiteTransparent }}>
                        <div
                            className="h-1.5 rounded-full transition-all duration-300"
                            style={{
                                width: `${story.progress}%`,
                                backgroundColor: colors.primary
                            }}
                        />
                    </div>
                    <p className="text-xs mt-1 opacity-80" style={{ color: colors.text }}>{story.progress}% complété</p>
                </div>
            )}
        </div>
    );
};

export default StoryCard;

