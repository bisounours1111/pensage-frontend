import React, { useState } from "react";
import colors from "../../utils/constants/colors";

const PitchStep = ({ pitch, setPitch, loading, onGeneratePitch, onNext }) => {
  const [pitchOptions, setPitchOptions] = useState([]);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePitchOptions = async () => {
    if (!pitch.trim()) {
      setError("Veuillez entrer une description pour votre histoire");
      return;
    }

    setError(null);

    try {
      const pitchArray = await onGeneratePitch(pitch);
      if (pitchArray.length === 0) {
        setError("Aucun pitch n'a pu être extrait. Veuillez réessayer.");
      } else {
        setPitchOptions(pitchArray);
        setShowAIOptions(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectPitchOption = (selectedOption) => {
    setPitch(selectedOption);
    setPitchOptions([]);
    setShowAIOptions(false);
    setError(null);
  };

  const handleNext = () => {
    if (!pitch.trim()) {
      setError("Veuillez entrer ou sélectionner un pitch");
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <div className="space-y-8">
      <div
        className="p-10 rounded-2xl shadow-2xl"
        style={{
          backgroundColor: colors.white,
          border: `4px solid ${colors.primary}`,
        }}
      >
        <div className="text-center mb-8">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Créez votre pitch
          </h2>
          <p className="text-xl" style={{ color: colors.textSecondary }}>
            Écrivez votre pitch ou inspirez-vous de suggestions générées par
            l'IA
          </p>
        </div>

        <textarea
          className="w-full p-6 rounded-xl border-3 resize-none text-lg outline-none"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.white,
            color: colors.text,
            minHeight: "200px",
            borderWidth: "3px",
          }}
          placeholder="Écrivez ici votre pitch (résumé de votre histoire)..."
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          disabled={loading}
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            💡 Besoin d'aide ? Laissez l'IA générer des suggestions
          </p>
          <button
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{ backgroundColor: colors.primaryLight }}
            onClick={handleGeneratePitchOptions}
            disabled={loading || !pitch.trim()}
          >
            {loading ? "⏳ Génération..." : "✨ Suggestions IA (5 tokens)"}
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
              className="text-xl font-semibold"
              style={{ color: colors.primary }}
            >
              L'IA génère vos pitchs...
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              Cela peut prendre quelques secondes
            </p>
          </div>
        )}
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

      {showAIOptions && pitchOptions.length > 0 && !loading && (
        <div className="space-y-6">
          <div
            className="p-6 rounded-xl border-3 text-center shadow-lg"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              borderWidth: "4px",
              color: colors.white,
            }}
          >
            <p className="font-bold text-2xl" style={{ color: colors.white }}>
              {pitchOptions.length} pitchs générés avec succès
            </p>
            <p className="mt-2 text-lg" style={{ color: colors.white }}>
              Sélectionnez votre préféré pour continuer
            </p>
          </div>

          <h3
            className="text-3xl font-bold text-center"
            style={{ color: colors.text }}
          >
            Choisissez votre pitch
          </h3>

          <div className="grid grid-cols-1 gap-5">
            {pitchOptions.map((pitch, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl shadow-lg"
                style={{
                  backgroundColor: colors.white,
                  border: `4px solid ${colors.primaryLight}`,
                }}
                onClick={() => handleSelectPitchOption(pitch)}
              >
                <div className="flex items-start gap-6">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-2xl shadow-lg"
                    style={{
                      backgroundColor: colors.white,
                      color: colors.primary,
                      border: `3px solid ${colors.white}`,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-lg leading-relaxed"
                      style={{ color: colors.text }}
                    >
                      {pitch}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="w-full px-8 py-6 rounded-xl font-bold text-xl text-white transition-all hover:scale-105 disabled:opacity-50 shadow-xl"
            style={{ backgroundColor: colors.primaryLight }}
            onClick={() => {
              setShowAIOptions(false);
              setPitchOptions([]);
            }}
          >
            Annuler les suggestions
          </button>
        </div>
      )}

      <div className="mt-8">
        <button
          className="w-full px-8 py-6 rounded-xl font-bold text-xl text-white transition-all hover:scale-105 disabled:opacity-50 shadow-xl"
          style={{ backgroundColor: colors.primary }}
          onClick={handleNext}
          disabled={!pitch.trim() || loading}
        >
          Continuer vers le synopsis →
        </button>
      </div>
    </div>
  );
};

export default PitchStep;
