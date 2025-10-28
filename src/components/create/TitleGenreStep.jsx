import React from "react";
import { MdArrowBack, MdArrowForward, MdCheck } from "react-icons/md";
import colors from "../../utils/constants/colors";
import { genresByCategory } from "../../utils/constants/genres";

const TitleGenreStep = ({
  pitch,
  synopsis,
  storyTitle,
  setStoryTitle,
  selectedGenre,
  setSelectedGenre,
  onNext,
  onPrevious,
}) => {
  const [error, setError] = React.useState(null);

  const handleNext = () => {
    if (!storyTitle.trim()) {
      setError("Veuillez entrer un titre pour votre histoire");
      return;
    }
    if (!selectedGenre) {
      setError("Veuillez sélectionner un genre");
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="p-4 lg:p-6 rounded-xl shadow-lg"
          style={{
            backgroundColor: colors.primary,
            border: `4px solid ${colors.primary}`,
            color: colors.white,
          }}
        >
          <h3
            className="text-sm lg:text-base font-bold mb-2"
            style={{ color: colors.white }}
          >
            Pitch
          </h3>
          <p className="text-xs lg:text-sm line-clamp-2" style={{ color: colors.white }}>
            {pitch}
          </p>
        </div>
        <div
          className="p-4 lg:p-6 rounded-xl shadow-lg"
          style={{
            backgroundColor: colors.primary,
            border: `4px solid ${colors.primary}`,
            color: colors.white,
          }}
        >
          <h3
            className="text-sm lg:text-base font-bold mb-2"
            style={{ color: colors.white }}
          >
            Synopsis
          </h3>
          <p className="text-xs lg:text-sm line-clamp-2" style={{ color: colors.white }}>
            {synopsis.substring(0, 100)}...
          </p>
        </div>
      </div>

      {error && (
        <div
          className="mb-6 p-4 rounded-lg"
          style={{
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
            border: "1px solid #FCA5A5",
          }}
        >
          {error}
        </div>
      )}

      <div
        className="p-6 lg:p-8 rounded-xl shadow-lg"
        style={{
          backgroundColor: colors.white,
          border: `4px solid ${colors.primaryLight}`,
        }}
      >
        <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: colors.text }}>
          Titre de votre histoire
        </h2>
        <p className="mb-6 text-base lg:text-lg" style={{ color: colors.textSecondary }}>
          Choisissez un titre accrocheur pour votre histoire
        </p>

        <input
          type="text"
          className="w-full p-4 lg:p-6 rounded-xl border-3 text-base lg:text-lg outline-none"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.white,
            color: colors.text,
            borderWidth: "3px",
          }}
          placeholder="Ex: Le Secret de la Montagne Perdue..."
          value={storyTitle}
          onChange={(e) => setStoryTitle(e.target.value)}
        />
      </div>

      <div
        className="p-6 lg:p-8 rounded-xl shadow-lg"
        style={{
          backgroundColor: colors.white,
          border: `4px solid ${colors.primaryLight}`,
        }}
      >
        <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: colors.text }}>
          Choisissez le genre de votre histoire
        </h2>
        <p className="mb-6 text-base lg:text-lg" style={{ color: colors.textSecondary }}>
          Sélectionnez le genre principal de votre histoire
        </p>

        {/* Style exact de la page profil */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {Object.entries(genresByCategory).map(([category, genres]) => (
            <div key={category} className="space-y-2">
              <h3
                className="text-sm font-bold uppercase tracking-wide"
                style={{ color: colors.primary }}
              >
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => {
                  const selected = selectedGenre === genre.name;

                  return (
                    <button
                      key={genre.id}
                      onClick={() => setSelectedGenre(genre.name)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium
                        transition-all duration-200 border-2
                        ${selected
                          ? "shadow-lg scale-105"
                          : "hover:scale-105 hover:shadow-md"
                        }
                      `}
                      style={{
                        backgroundColor: selected
                          ? colors.primary
                          : colors.whiteTransparent,
                        color: selected ? colors.white : colors.text,
                        border: `2px solid ${selected
                          ? colors.primary
                          : colors.primaryLight
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

        {/* Message de sélection comme dans la page profil */}
        <div className="text-center mt-4 text-sm" style={{ color: colors.primary }}>
          {selectedGenre ? (
            <span className="inline-flex items-center gap-1">
              <MdCheck /> Genre sélectionné : {selectedGenre}
            </span>
          ) : (
            "Sélectionnez votre genre préféré"
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <button
          className="px-6 lg:px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
          style={{
            backgroundColor: colors.white,
            color: colors.primary,
            border: `4px solid ${colors.primary}`,
          }}
          onClick={onPrevious}
        >
          <span className="inline-flex items-center gap-2 justify-center">
            <MdArrowBack className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="hidden sm:inline">Retour</span>
            <span className="sm:hidden">Retour</span>
          </span>
        </button>
        <button
          className="flex-1 px-6 lg:px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 disabled:opacity-50 shadow-lg"
          style={{
            backgroundColor: colors.primary,
            border: `4px solid ${colors.primary}`,
          }}
          onClick={handleNext}
          disabled={!storyTitle.trim() || !selectedGenre}
        >
          <span className="inline-flex items-center gap-2 justify-center">
            <span className="hidden sm:inline">Finaliser</span>
            <span className="sm:hidden">Finaliser</span>
            <MdArrowForward className="w-5 h-5 lg:w-6 lg:h-6" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default TitleGenreStep;
