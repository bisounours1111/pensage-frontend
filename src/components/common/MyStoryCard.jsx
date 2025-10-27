import React from 'react';
import { useNavigate } from 'react-router-dom';
import colors from '../../utils/constants/colors';

const MyStoryCard = ({ story }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // Naviguer vers l'éditeur avec l'ID de l'histoire
        navigate(`/create?id=${story.id}`);
    };

    const getStatusColor = () => {
        switch (story.status) {
            case 'published':
                return colors.published;
            case 'draft':
                return colors.draft;
            case 'in-progress':
                return colors.primary;
            default:
                return colors.whiteTransparent;
        }
    };

    const getStatusLabel = () => {
        switch (story.status) {
            case 'published':
                return 'Publiée';
            case 'draft':
                return 'Brouillon';
            case 'in-progress':
                return 'En cours';
            default:
                return '';
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



                {/* Barre de progression */}
                {story.progress !== undefined && (
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20">
                        <div
                            className="h-full transition-all"
                            style={{
                                width: `${story.progress}%`,
                                backgroundColor: colors.primary
                            }}
                        ></div>
                    </div>
                )}

                {/* Overlay au survol */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{ backgroundColor: colors.overlay }}
                >
                    <div className="text-white text-center p-4">
                        <p className="text-sm font-semibold mb-1">{story.title}</p>
                        <span className="text-xs text-white/90 mb-2 block">{story.category}</span>
                        <span className="text-xs text-white/80 block">{story.progress}% complété</span>
                        <p className="text-xs text-white/80 mt-2">Cliquez pour continuer</p>
                    </div>
                </div>
            </div>

            {/* Titre */}
            <h3 className="font-medium text-sm truncate" style={{ color: colors.text }}>{story.title}</h3>
        </div>
    );
};

export default MyStoryCard;

