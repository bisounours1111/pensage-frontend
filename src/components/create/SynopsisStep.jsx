import React from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdAutoAwesome,
  MdHourglassTop,
} from "react-icons/md";
import colors from "../../utils/constants/colors";

const SynopsisStep = ({
  pitch,
  synopsis,
  setSynopsis,
  loading,
  onGenerateSynopsis,
  onNext,
  onPrevious,
}) => {
  const [error, setError] = React.useState(null);

  const handleGenerate = async () => {
    setError(null);
    try {
      await onGenerateSynopsis(pitch);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNext = () => {
    if (!synopsis.trim()) {
      setError("Le synopsis ne peut pas être vide");
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div
        className="p-4 lg:p-6 rounded-xl shadow-lg"
        style={{
          backgroundColor: colors.primary,
          border: `4px solid ${colors.primary}`,
          color: colors.white,
        }}
      >
        <h3 className="text-base lg:text-lg font-bold mb-2" style={{ color: colors.white }}>
          Mon pitch
        </h3>
        <p className="text-sm lg:text-base" style={{ color: colors.white }}>{pitch}</p>
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
        <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: colors.text }}>
          Synopsis de votre histoire
        </h2>
        <p className="mb-6 text-base lg:text-lg" style={{ color: colors.textSecondary }}>
          Écrivez votre synopsis détaillé ou laissez l'IA le générer pour vous
          (5 tokens)
        </p>

        <textarea
          className="w-full p-4 lg:p-6 rounded-xl border-3 resize-none text-base lg:text-lg outline-none"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.white,
            color: colors.text,
            minHeight: "200px",
            borderWidth: "3px",
          }}
          placeholder="Écrivez ici le synopsis détaillé de votre histoire..."
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
          disabled={loading}
        />

        <div className="mt-4 flex justify-center lg:justify-end">
          <button
            className="px-4 lg:px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm lg:text-base w-full lg:w-auto"
            style={{ backgroundColor: colors.primaryLight }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2 justify-center">
                <MdHourglassTop className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Génération...</span>
                <span className="sm:hidden">Génération</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 justify-center">
                <MdAutoAwesome className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">Générer avec l'IA (5 tokens)</span>
                <span className="sm:hidden">IA (5 tokens)</span>
              </span>
            )}
          </button>
        </div>

        {loading && (
          <div className="mt-8 flex flex-col justify-center items-center py-8">
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
              L'IA rédige votre synopsis...
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <button
          className="px-6 lg:px-8 py-4 lg:py-4 rounded-xl font-bold text-lg lg:text-lg transition-all hover:scale-105 shadow-lg"
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
          className="flex-1 px-6 lg:px-8 py-4 lg:py-4 rounded-xl font-bold text-lg lg:text-lg text-white transition-all hover:scale-105 disabled:opacity-50 shadow-lg"
          style={{
            backgroundColor: colors.primary,
            border: `4px solid ${colors.primary}`,
          }}
          onClick={handleNext}
          disabled={!synopsis.trim() || loading}
        >
          <span className="inline-flex items-center gap-2 justify-center">
            <span className="hidden sm:inline">Continuer vers les personnages</span>
            <span className="sm:hidden">Continuer</span>
            <MdArrowForward className="w-5 h-5 lg:w-6 lg:h-6" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default SynopsisStep;
