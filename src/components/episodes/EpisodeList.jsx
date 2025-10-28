import React from "react";
import { MdEdit, MdDelete, MdArticle } from "react-icons/md";
import colors from "../../utils/constants/colors";

const EpisodeList = ({ episodes, onEdit, onDelete, loading }) => {
  const countWords = (text) => {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div
          className="animate-spin rounded-full h-12 w-12 border-4"
          style={{
            borderColor: colors.primaryLight,
            borderTopColor: colors.primary,
          }}
        />
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="text-center py-16">
        <div
          className="p-10 rounded-2xl inline-block"
          style={{
            backgroundColor: colors.whiteTransparent,
            backdropFilter: "blur(10px)",
          }}
        >
          <p
            className="text-xl font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Aucun épisode pour le moment
          </p>
          <p style={{ color: colors.textSecondary }}>
            Commencez par créer votre premier épisode !
          </p>
        </div>
      </div>
    );
  }

  const getContentPreview = (content) => {
    if (!content) return "Aucun contenu";
    const preview = content.substring(0, 150);
    return preview + (content.length > 150 ? "..." : "");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6" style={{ color: colors.text }}>
        Épisodes ({episodes.length})
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {episodes.map((episode) => (
          <div
            key={episode.id}
            className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-[1.02]"
            style={{
              backgroundColor: colors.white,
              border: `3px solid ${colors.primaryLight}`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.white,
                    }}
                  >
                    {episode.number}
                  </div>
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: colors.text }}
                  >
                    Épisode {episode.number}
                  </h3>
                </div>
                <p
                  className="text-base line-clamp-3 mb-4"
                  style={{ color: colors.textSecondary }}
                >
                  {getContentPreview(episode.content)}
                </p>
                <div
                  className="flex gap-4 text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  <span className="inline-flex items-center gap-1">
                    <MdArticle /> {countWords(episode.content)} mots
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: colors.primaryLight,
                    color: colors.white,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(episode);
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <MdEdit /> Modifier
                  </span>
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: "#FEE2E2",
                    color: "#991B1B",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(episode.id);
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <MdDelete /> Supprimer
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeList;
