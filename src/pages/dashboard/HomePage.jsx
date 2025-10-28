import React, { useState, useEffect } from "react";
import { getCurrentUser, getUserExtend } from "../../lib/supabase";
import { webnovelsApi, historyApi } from "../../lib/supabaseApi";
import StoryRow from "../../components/stories/StoryRow";
import colors from "../../utils/constants/colors";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [userExtend, setUserExtend] = useState(null);
  const [readingHistory, setReadingHistory] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        setError("Vous devez être connecté");
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Charger les données utilisateur
      const extendData = await getUserExtend(currentUser.id);
      setUserExtend(extendData);

      // Charger l'historique de lecture
      const history = await historyApi.getReadingHistory(currentUser.id);

      // Grouper par webnovel pour ne garder que le dernier épisode lu
      const historyMap = new Map();
      history.forEach((entry) => {
        const webnovelId = entry.webnovels?.id;
        if (webnovelId) {
          const existing = historyMap.get(webnovelId);
          if (!existing || entry.id > existing.historyId) {
            historyMap.set(webnovelId, {
              historyId: entry.id,
              webnovel: entry.webnovels,
              episode: entry.webnovels_episode,
              isOver: entry.is_over || false,
              episodeId: entry.id_webnovels_episode,
            });
          }
        }
      });

      const formattedHistory = Array.from(historyMap.values())
        .map((entry) => ({
          id: entry.webnovel.id,
          historyId: entry.historyId,
          title: entry.webnovel.title || "Sans titre",
          cover: entry.webnovel.image_url || "https://via.placeholder.com/300x450",
          category: entry.webnovel.genre || "Non spécifié",
          progress: 0,
          status: entry.webnovel.publish ? "published" : "draft",
          isOver: entry.isOver,
          episodeNumber: entry.episode?.number || 1,
          episodeId: entry.episodeId,
          ...entry.webnovel,
        }))
        .sort((a, b) => b.historyId - a.historyId);

      setReadingHistory(formattedHistory);

      // Charger les tendances
      const trendingData = await webnovelsApi.getTrending(10);
      const formattedTrending = trendingData.map((story) => ({
        id: story.id,
        title: story.title || "Sans titre",
        cover: story.image_url || "https://via.placeholder.com/300x450",
        category: story.genre || "Non spécifié",
        progress: 0,
        status: story.publish ? "published" : "draft",
        ...story,
      }));
      setTrending(formattedTrending);

      // Charger les recommandations basées sur les genres préférés (champ unifié "genre")
      const genres = extendData?.preferences?.genre || [];
      const recommendationsData = await webnovelsApi.getRecommendations(
        genres,
        10
      );
      const formattedRecommendations = recommendationsData.map((story) => ({
        id: story.id,
        title: story.title || "Sans titre",
        cover: story.image_url || "https://via.placeholder.com/300x450",
        category: story.genre || "Non spécifié",
        progress: 0,
        status: story.publish ? "published" : "draft",
        ...story,
      }));
      setRecommendations(formattedRecommendations);

      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement de la page home:", err);
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b"
        style={{
          background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
        }}
      >
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl" style={{ color: colors.text }}>
            Chargement...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b"
        style={{
          background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
        }}
      >
        <div className="p-6 md:p-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b pb-16"
      style={{
        background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
      }}
    >
      {/* Header */}
      <header className="p-6 md:p-12">
        <h1
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{ color: colors.text }}
        >
          Bienvenue{" "}
          {userExtend?.name || user?.email?.split("@")[0] || "Utilisateur"} !
        </h1>
        <p
          className="text-lg md:text-xl opacity-80"
          style={{ color: colors.text }}
        >
          Découvrez de nouvelles histoires passionnantes
        </p>
      </header>

      {/* Content */}
      <div className="px-6 md:px-12 pb-12 space-y-8">
        {/* Reprendre la lecture */}
        {readingHistory.length > 0 && (
          <StoryRow
            title="Reprendre la lecture"
            stories={readingHistory.slice(0, 10)}
          />
        )}

        {/* Tendances */}
        {trending.length > 0 && (
          <StoryRow title="Tendances" stories={trending} />
        )}

        {/* Recommandations */}
        {recommendations.length > 0 ? (
          <StoryRow title="Pour vous" stories={recommendations} />
        ) : (
          // Si aucune recommandation, afficher toutes les histoires publiées
          trending.length > 0 && (
            <StoryRow title="Toutes les histoires" stories={trending} />
          )
        )}

        {/* Message si aucune histoire n'est disponible */}
        {readingHistory.length === 0 &&
          trending.length === 0 &&
          recommendations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-xl mb-4" style={{ color: colors.text }}>
                Aucune histoire disponible pour le moment
              </p>
              <p className="text-md opacity-75" style={{ color: colors.text }}>
                Revenez bientôt pour découvrir de nouvelles histoires !
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default HomePage;
