import React from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';

const IndependentStoryCard = ({ story, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick(story);
        } else {
            // Par défaut, naviguer vers la page de lecture
            navigate(`/create?id=${story.id}`);
        }
    };

    return (
        <div
            className="flex-shrink-0 w-48 md:w-56 group cursor-pointer"
            onClick={handleClick}
        >
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
                        {story.progress !== undefined && story.progress < 100 && (
                            <span className="text-xs text-white/80 block mt-2">{story.progress}% complété</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Titre et informations */}
            <div>
                <h3 className="font-medium text-sm truncate mb-1" style={{ color: colors.text }}>{story.title}</h3>
                {story.author && (
                    <p className="text-xs truncate" style={{ color: colors.textSecondary }}>
                        {story.author}
                    </p>
                )}
            </div>
        </div>
    );
};

export default IndependentStoryCard;

