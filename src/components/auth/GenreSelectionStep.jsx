import React from "react";
import { MdCheck } from "react-icons/md";
import colors from "../../utils/constants/colors";
import { genresByCategory } from "../../utils/constants/genres";

const GenreSelectionStep = ({
  selectedGenres,
  onGenreToggle,
  maxSelection = 5,
}) => {
  const isSelected = (genreId) => selectedGenres.includes(genreId);

  const canSelectMore = selectedGenres.length < maxSelection;
  const isGenreSelectable = (genreId) => !isSelected(genreId) && canSelectMore;

  const handleGenreClick = (genreId) => {
    if (isSelected(genreId)) {
      // Désélectionner
      onGenreToggle(genreId);
    } else if (canSelectMore) {
      // Sélectionner
      onGenreToggle(genreId);
    }
  };

  return (
    <div className="w-full">
      {/* Titre de l'étape */}
      <div className="text-left md:text-center mb-4 pl-10 md:pl-0">
        <h2
          className="text-xl md:text-2xl font-bold mb-2"
          style={{ color: colors.text }}
        >
          Sélectionnez vos genres préférés
        </h2>
        <p
          className="text-xs md:text-sm"
          style={{ color: colors.text, opacity: 0.8 }}
        >
          Choisissez jusqu'à {maxSelection} genres que vous aimez lire
        </p>
        {selectedGenres.length > 0 && (
          <p
            className="text-xs md:text-sm mt-1"
            style={{ color: colors.primary }}
          >
            {selectedGenres.length}/{maxSelection} sélectionnés
          </p>
        )}
      </div>

      {/* Liste des genres par catégorie */}
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {Object.entries(genresByCategory).map(([category, genres]) => (
          <div key={category} className="space-y-3">
            <h3
              className="text-sm font-bold uppercase tracking-wide"
              style={{ color: colors.primary }}
            >
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => {
                const selected = isSelected(genre.id);
                const selectable = isGenreSelectable(genre.id);

                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => handleGenreClick(genre.id)}
                    disabled={!selectable && !selected}
                    className={`
                                            px-4 py-2 rounded-full text-sm font-medium
                                            transition-all duration-200
                                            ${
                                              selected
                                                ? "shadow-lg scale-105"
                                                : selectable
                                                ? "hover:scale-105 hover:shadow-md"
                                                : "opacity-50 cursor-not-allowed"
                                            }
                                        `}
                    style={{
                      backgroundColor: selected
                        ? colors.primary
                        : colors.whiteTransparent,
                      color: selected ? colors.white : colors.text,
                      border: `2px solid ${
                        selected ? colors.primary : "rgba(255,255,255,0.3)"
                      }`,
                    }}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Message si tous les genres sont sélectionnés */}
      {!canSelectMore && (
        <div
          className="text-center mt-4 text-sm"
          style={{ color: colors.primary }}
        >
          <span className="inline-flex items-center gap-1">
            <MdCheck /> Maximum atteint ! Désélectionnez un genre pour en
            choisir un autre.
          </span>
        </div>
      )}
    </div>
  );
};

export default GenreSelectionStep;
