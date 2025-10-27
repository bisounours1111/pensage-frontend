import React from "react";
import colors from "../../utils/constants/colors";

const TitleGenreStep = ({ pitch, synopsis, storyTitle, setStoryTitle, selectedGenre, setSelectedGenre, onNext, onPrevious }) => {
  const genres = ["Romance", "Fantastique", "Action", "Drame", "Comédie", "Thriller", "Mystère", "Science-Fiction", "Horreur", "Slice of Life", "Sport", "Historique"];
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="p-4 rounded-xl shadow-lg"
          style={{
            backgroundColor: colors.primary,
            border: `4px solid ${colors.primary}`,
            color: colors.white,
          }}
        >
          <h3
            className="text-sm font-bold mb-2"
            style={{ color: colors.white }}
          >
            Pitch
          </h3>
          <p
            className="text-sm line-clamp-2"
            style={{ color: colors.white }}
          >
            {pitch}
          </p>
        </div>
        <div
          className="p-4 rounded-xl shadow-lg"
          style={{
            backgroundColor: colors.primary,
            border: `4px solid ${colors.primary}`,
            color: colors.white,
          }}
        >
          <h3
            className="text-sm font-bold mb-2"
            style={{ color: colors.white }}
          >
            Synopsis
          </h3>
          <p
            className="text-sm line-clamp-2"
            style={{ color: colors.white }}
          >
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
        className="p-8 rounded-xl shadow-lg"
        style={{ 
          backgroundColor: colors.white,
          border: `4px solid ${colors.primaryLight}`
        }}
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: colors.text }}
        >
          Titre de votre histoire
        </h2>
        <p
          className="mb-6 text-lg"
          style={{ color: colors.textSecondary }}
        >
          Choisissez un titre accrocheur pour votre histoire
        </p>

        <input
          type="text"
          className="w-full p-6 rounded-xl border-3 text-lg outline-none"
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
        className="p-8 rounded-xl shadow-lg"
        style={{ 
          backgroundColor: colors.white,
          border: `4px solid ${colors.primaryLight}`
        }}
      >
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: colors.text }}
        >
          Choisissez le genre de votre histoire
        </h2>
        <p
          className="mb-6 text-lg"
          style={{ color: colors.textSecondary }}
        >
          Sélectionnez le genre principal de votre histoire
        </p>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`p-4 rounded-xl font-semibold transition-all hover:scale-105 border-4 ${
                selectedGenre === genre ? 'shadow-lg' : 'shadow-md'
              }`}
              style={{
                backgroundColor: selectedGenre === genre ? colors.primary : colors.white,
                color: selectedGenre === genre ? colors.white : colors.text,
                borderColor: colors.primary,
              }}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
          style={{
            backgroundColor: colors.white,
            color: colors.primary,
            border: `4px solid ${colors.primary}`,
          }}
          onClick={onPrevious}
        >
          ← Retour
        </button>
        <button
          className="flex-1 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 disabled:opacity-50 shadow-lg"
          style={{ 
            backgroundColor: colors.primary,
            border: `4px solid ${colors.primary}`
          }}
          onClick={handleNext}
          disabled={!storyTitle.trim() || !selectedGenre}
        >
          Finaliser →
        </button>
      </div>
    </div>
  );
};

export default TitleGenreStep;

