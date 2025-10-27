import React from 'react';
import StoryCard from './StoryCard';
import colors from '../../utils/constants/colors';

const StoryRow = ({ title, stories }) => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: colors.text }}>{title}</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {stories.map(story => (
                    <StoryCard
                        key={story.id}
                        story={story}
                    />
                ))}
            </div>
        </div>
    );
};

export default StoryRow;

