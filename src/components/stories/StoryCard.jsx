import React from 'react';
import colors from '../../utils/constants/colors';

const StoryCard = ({ story }) => {
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
                        <span className="text-xs text-white/90 mb-2 block">{story.category}</span>
                        {story.author && (
                            <span className="text-xs text-white/80 block mb-2">par {story.author}</span>
                        )}
                        {story.likes && (
                            <div className="flex items-center justify-center gap-2 text-xs">
                                <span>❤️ {story.likes}</span>
                                {story.views && <span>👁️ {Math.round(story.views / 1000)}k</span>}
                            </div>
                        )}
                        {story.progress !== undefined && story.progress < 100 && (
                            <span className="text-xs text-white/80 block mt-2">{story.progress}% complété</span>
                        )}
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
                {story.status === 'in-progress' && (
                    <div
                        className="absolute top-2 right-2 text-xs px-2 py-1 rounded font-semibold shadow-md"
                        style={{ backgroundColor: colors.primary, color: colors.white }}
                    >
                        En cours
                    </div>
                )}
            </div>

            {/* Titre et informations */}
            <div>
                <h3 className="font-medium text-sm truncate mb-1" style={{ color: colors.text }}>{story.title}</h3>
                {story.author && (
                    <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                        {story.author}
                    </p>
                )}
                {story.likes && story.views && (
                    <div className="flex items-center gap-3 text-xs mt-1" style={{ color: colors.textSecondary }}>
                        <span>❤️ {story.likes}</span>
                        <span>👁️ {Math.round(story.views / 1000)}k</span>
                    </div>
                )}
                {story.progress !== undefined && story.progress < 100 && story.status === 'in-progress' && (
                    <div className="mt-2">
                        <div className="w-full bg-white/30 rounded-full h-1.5">
                            <div
                                className="h-1.5 rounded-full transition-all"
                                style={{
                                    width: `${story.progress}%`,
                                    backgroundColor: colors.primary
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryCard;

