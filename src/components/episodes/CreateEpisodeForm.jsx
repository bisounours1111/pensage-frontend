import React, { useState, useEffect } from "react";
import { MdAutoAwesome, MdHourglassTop, MdLightbulb } from "react-icons/md";
import colors from "../../utils/constants/colors";
import TextEditor from "../ui/TextEditor";
import storyApi from "../../utils/api/storyApi";
import { getCurrentUser } from "../../lib/supabase";
import { pointsApi } from "../../lib/supabaseApi";

const CreateEpisodeForm = ({
  webnovel,
  episodes,
  editingEpisode,
  onSave,
  onCancel,
  loading,
}) => {
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [content, setContent] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [points, setPoints] = useState(null);

  useEffect(() => {
    if (editingEpisode) {
      // Mode édition
      setEpisodeNumber(editingEpisode.number);
      setContent(editingEpisode.content || "");
    } else {
      // Mode création - calculer le prochain numéro d'épisode
      const nextNumber =
        episodes.length > 0
          ? Math.max(...episodes.map((ep) => ep.number)) + 1
          : 1;
      setEpisodeNumber(nextNumber);
      setContent("");
    }
  }, [editingEpisode, episodes]);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) {
        setUserId(user.id);
        try {
          const balance = await pointsApi.getBalance(user.id);
          setPoints(balance);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, []);

  const handleGenerateEpisode = async () => {
    if (!webnovel) return;

    setAiLoading(true);
    setError(null);

    try {
      // Préparer les données pour l'IA
      const pitch = webnovel.pitch || "";
      const synopsis = webnovel.synopsis || "";
      const personnages = JSON.stringify(webnovel.characters || []);

      // Récupérer le contenu des 3 derniers épisodes pour le contexte
      const recentEpisodes = episodes
        .sort((a, b) => b.number - a.number)
        .slice(0, 3)
        .map((ep) => ep.content)
        .filter((c) => c && c.trim());

      // Générer le nouvel épisode avec l'IA
      const result = await storyApi.generateEpisode(
        pitch,
        synopsis,
        personnages,
        episodeNumber,
        recentEpisodes
      );

      setContent(result.episode_content);

      // Débit 15 points par génération d'épisode
      if (userId) {
        try {
          const newBalance = await pointsApi.debit(userId, 15);
          setPoints(newBalance);
        } catch (e) {
          if (e?.code === "INSUFFICIENT_FUNDS") {
            alert("Solde insuffisant (15 tokens requis)");
          } else {
            console.error(e);
          }
        }
      }
    } catch (err) {
      console.error("Erreur lors de la génération:", err);
      setError(err.message || "Erreur lors de la génération de l'épisode");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = () => {
    if (!content.trim()) {
      setError("Le contenu de l'épisode ne peut pas être vide");
      return;
    }

    onSave({
      number: episodeNumber,
      content: content.trim(),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div
        className="p-6 rounded-2xl"
        style={{
          backgroundColor: colors.white,
          border: `4px solid ${colors.primary}`,
        }}
      >
        <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
          {editingEpisode ? "Modifier l'Épisode" : "Créer un Nouvel Épisode"}
        </h2>
        <p style={{ color: colors.textSecondary }}>
          {editingEpisode
            ? "Modifiez le contenu de l'épisode avec l'aide de l'IA"
            : "Remplissez manuellement ou laissez l'IA générer le contenu"}
        </p>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "#FEE2E2",
            color: "#991B1B",
            border: "1px solid #FCA5A5",
          }}
        >
          {error}
        </div>
      )}

      {/* Informations sur l'histoire */}
      {webnovel && (
        <div
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: colors.whiteTransparent,
            backdropFilter: "blur(10px)",
          }}
        >
          <h3
            className="text-xl font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Contexte
          </h3>
          <div
            className="space-y-2 text-sm"
            style={{ color: colors.textSecondary }}
          >
            <p>
              <strong>Pitch:</strong> {webnovel.pitch}
            </p>
            <p>
              <strong>Synopsis:</strong> {webnovel.synopsis}
            </p>
          </div>
        </div>
      )}

      {/* Numéro d'épisode */}
      <div
        className="p-6 rounded-2xl"
        style={{
          backgroundColor: colors.white,
          border: `3px solid ${colors.primaryLight}`,
        }}
      >
        <label
          className="block text-lg font-semibold mb-3"
          style={{ color: colors.text }}
        >
          Numéro de l'épisode
        </label>
        <input
          type="number"
          className="w-full p-4 rounded-lg border-3 text-center text-2xl font-bold"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.white,
            color: colors.text,
            borderWidth: "3px",
          }}
          value={editingEpisode ? episodeNumber : episodeNumber}
          onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 1)}
          min={1}
          disabled={!!editingEpisode}
        />
      </div>

      {/* Contenu de l'épisode */}
      <div
        className="p-6 rounded-2xl"
        style={{
          backgroundColor: colors.white,
          border: `3px solid ${colors.primaryLight}`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <label
            className="text-lg font-semibold"
            style={{ color: colors.text }}
          >
            Contenu de l'épisode
          </label>
          {points !== null && (
            <span
              className="px-3 py-1 rounded-lg font-semibold text-sm"
              style={{
                backgroundColor: colors.whiteTransparent,
                color: colors.text,
              }}
            >
              {points} tokens
            </span>
          )}
          {!editingEpisode && (
            <button
              className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
              style={{ backgroundColor: colors.primaryLight }}
              onClick={handleGenerateEpisode}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <span className="inline-flex items-center gap-2">
                  <MdHourglassTop /> Génération...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <MdAutoAwesome /> Générer avec l'IA (15 tokens)
                </span>
              )}
            </button>
          )}
        </div>

        {aiLoading && (
          <div className="mb-4 flex flex-col items-center py-8">
            <div
              className="animate-spin rounded-full h-12 w-12 border-4 mb-4"
              style={{
                borderColor: colors.primaryLight,
                borderTopColor: colors.primary,
              }}
            />
            <p
              className="text-lg font-semibold"
              style={{ color: colors.primary }}
            >
              Génération de l'épisode en cours...
            </p>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
              Cela peut prendre 1-2 minutes
            </p>
          </div>
        )}

        <TextEditor
          text={content}
          onTextChange={setContent}
          placeholder="Écrivez ou générez le contenu de l'épisode ici. Vous pouvez surligner du texte pour le corriger ou le reformuler."
        />

        <p
          className="mt-3 text-sm inline-flex items-center gap-2"
          style={{ color: colors.textSecondary }}
        >
          <MdLightbulb /> Astuce : Surlignez une partie du texte pour la
          corriger ou la reformuler avec l'IA
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          className="flex-1 px-8 py-6 rounded-xl font-bold text-xl text-white transition-all hover:scale-105 shadow-xl"
          style={{ backgroundColor: colors.primary }}
          onClick={handleSave}
          disabled={loading || !content.trim()}
        >
          {loading ? "Sauvegarde..." : "Sauvegarder"}
        </button>
        <button
          className="px-8 py-6 rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-xl"
          style={{
            backgroundColor: colors.whiteTransparent,
            color: colors.text,
          }}
          onClick={onCancel}
          disabled={loading}
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default CreateEpisodeForm;
