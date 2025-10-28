import React from "react";
import EditableCharacterCard from "../ui/EditableCharacterCard";
import colors from "../../utils/constants/colors";

const CharactersStep = ({
  pitch,
  synopsis,
  characters,
  setCharacters,
  loading,
  onGenerateCharacters,
  onNext,
  onPrevious,
}) => {
  const [error, setError] = React.useState(null);

  const handleGenerate = async () => {
    setError(null);
    try {
      await onGenerateCharacters(pitch, synopsis);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateCharacter = (index, updatedCharacter) => {
    const newCharacters = [...characters];
    newCharacters[index] = updatedCharacter;
    setCharacters(newCharacters);
  };

  const handleNext = () => {
    if (characters.length === 0) {
      setError("Vous devez générer au moins un personnage");
      return;
    }
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
          <p className="text-sm line-clamp-2" style={{ color: colors.white }}>
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
          <p className="text-sm line-clamp-2" style={{ color: colors.white }}>
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
          border: `4px solid ${colors.primaryLight}`,
        }}
      >
        <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
          Personnages de votre histoire
        </h2>
        <p className="mb-8 text-lg" style={{ color: colors.textSecondary }}>
          {loading
            ? "L'IA crée vos personnages..."
            : characters.length > 0
            ? `${characters.length} personnage${
                characters.length > 1 ? "s" : ""
              } principal${characters.length > 1 ? "aux" : ""} créé${
                characters.length > 1 ? "s" : ""
              }`
            : "Cliquez sur le bouton ci-dessous pour générer les personnages avec l'IA"}
        </p>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div
              className="animate-spin rounded-full h-16 w-16 border-4 mb-4"
              style={{
                borderColor: colors.primaryLight,
                borderTopColor: colors.primary,
              }}
            />
            <p
              className="text-lg font-semibold"
              style={{ color: colors.primary }}
            >
              L'IA crée vos personnages...
            </p>
          </div>
        ) : characters.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character, index) => (
                <EditableCharacterCard
                  key={character.id || index}
                  character={character}
                  onUpdate={(updated) => handleUpdateCharacter(index, updated)}
                  index={index}
                />
              ))}
            </div>
            <div className="mt-6 text-center">
              <button
                className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: colors.primaryLight,
                  color: colors.white,
                }}
                onClick={handleGenerate}
                disabled={loading}
              >
                Régénérer les personnages (5 tokens)
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="mb-6 text-lg" style={{ color: colors.textSecondary }}>
              Aucun personnage généré pour le moment
            </p>
            <button
              className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: colors.primary }}
              onClick={handleGenerate}
            >
              Générer les personnages avec l'IA (5 tokens)
            </button>
          </div>
        )}
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
            border: `4px solid ${colors.primary}`,
          }}
          onClick={handleNext}
          disabled={characters.length === 0 || loading}
        >
          Finaliser →
        </button>
      </div>
    </div>
  );
};

export default CharactersStep;
