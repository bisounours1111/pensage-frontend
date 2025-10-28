import React from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';

const StoryCard = ({ story, mode = 'read' }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // mode='read' pour la lecture, mode='manage' pour la gestion
        if (mode === 'read') {
            navigate(`/read/${story.id}`);
        } else {
            navigate(`/episodes/${story.id}`);
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
        </div>
    );
};

export default StoryCard;

