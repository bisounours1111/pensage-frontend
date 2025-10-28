import React, { useState, useEffect } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdClose,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import {
  webnovelsApi,
  episodesApi,
  likesApi,
  commentsApi,
  historyApi,
} from "../../lib/supabaseApi";
import { getCurrentUser } from "../../lib/supabase";
import colors from "../../utils/constants/colors";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdComment,
  MdVisibility,
  MdShare,
} from "react-icons/md";

const ReadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [webnovel, setWebnovel] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [user, setUser] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likers, setLikers] = useState([]);
  const [viewsCount, setViewsCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showLikers, setShowLikers] = useState(false);
  const [showCharacters, setShowCharacters] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [episodePages, setEpisodePages] = useState([]);
  const contentRef = React.useRef(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Découper le contenu en pages lors du changement d'épisode
  useEffect(() => {
    if (!selectedEpisode) return;

    const content = selectedEpisode.content || "";

    // Découper proprement le contenu en paragraphes HTML
    // Garder les balises intactes
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    const paragraphs = tempDiv.querySelectorAll("p, div, br");

    // Si pas de paragraphes HTML, utiliser le contenu brut découpé
    if (paragraphs.length === 0) {
      // Découper par phrases (., !, ?, suivi d'un espace)
      const sentences = content.split(/([.!?]\s+|\n\n)/);
      const pages = [];
      let currentPage = "";

      for (const sentence of sentences) {
        const testDiv = document.createElement("div");
        testDiv.innerHTML = currentPage + sentence;
        const height = testDiv.scrollHeight;

        // Environ 8 lignes = ~400px de hauteur
        if (height > 400 && currentPage.trim().length > 0) {
          pages.push(currentPage.trim());
          currentPage = sentence;
        } else {
          currentPage += sentence;
        }
      }

      if (currentPage.trim().length > 0) {
        pages.push(currentPage.trim());
      }

      setEpisodePages(pages.length > 0 ? pages : [content]);
      setCurrentPage(0);
      return;
    }

    // Approche avec les paragraphes HTML
    const pages = [];
    let currentPage = "";

    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i];
      const paraContent = para.outerHTML || para.textContent;

      // Tester la hauteur avec ce paragraphe ajouté
      const testDiv = document.createElement("div");
      testDiv.style.width = "100%";
      testDiv.style.fontSize = "1.1rem";
      testDiv.style.lineHeight = "1.8";
      testDiv.style.padding = "1rem";
      testDiv.innerHTML = currentPage + paraContent;

      // Si ça dépasse ~400px (environ 8 lignes), on crée une nouvelle page
      const height = testDiv.offsetHeight || testDiv.scrollHeight;

      if (height > 350 && currentPage.trim().length > 0) {
        pages.push(currentPage.trim());
        currentPage = paraContent;
      } else {
        currentPage += paraContent;
      }
    }

    // Ajouter le reste
    if (currentPage.trim().length > 0) {
      pages.push(currentPage.trim());
    }

    setEpisodePages(pages.length > 0 ? pages : [content]);
    setCurrentPage(0);

    // Remonter en haut quand on change d'épisode
    // setTimeout(() => {
    //   window.scrollTo({ top: 0, behavior: "smooth" });
    // }, 100);
  }, [selectedEpisode]);

  // Remonter en haut de la page quand on change de page
  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, [currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      // Charger le webnovel
      const webnovelData = await webnovelsApi.getById(id);
      setWebnovel(webnovelData);

      // Charger les épisodes
      const episodesData = await episodesApi.getByWebnovel(id);
      setEpisodes(episodesData);

      // Sélectionner le premier épisode par défaut
      if (episodesData.length > 0) {
        setSelectedEpisode(episodesData[0]);

        // Enregistrer la lecture dans l'historique
        await historyApi.addToReadingHistory(
          currentUser.id,
          id,
          episodesData[0].id,
          episodesData[0].number
        );
      }

      // Charger les likes
      const likesCountData = await likesApi.countLikes(id);
      setLikesCount(likesCountData);

      const hasLikedData = await likesApi.hasLiked(id, currentUser.id);
      setIsLiked(hasLikedData);

      // Charger les vues
      const viewsCountData = await likesApi.countViews(id);
      setViewsCount(viewsCountData);

      // Charger les commentaires
      const commentsData = await commentsApi.getByWebnovel(id);
      setComments(commentsData);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user || !webnovel) return;

    try {
      const result = await likesApi.toggleLike(webnovel.id, user.id);
      setIsLiked(result);
      setLikesCount(result ? likesCount + 1 : likesCount - 1);

      // Recharger les likers
      const likersData = await likesApi.getLikers(webnovel.id);
      setLikers(likersData);
    } catch (error) {
      console.error("Erreur lors du like:", error);
    }
  };

  const handleLoadLikers = async () => {
    if (likers.length === 0 && webnovel) {
      const likersData = await likesApi.getLikers(webnovel.id);
      setLikers(likersData);
    }
    setShowLikers(true);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !webnovel) return;

    try {
      setCommentLoading(true);
      const comment = await commentsApi.create({
        id_webnovels: webnovel.id,
        id_user: user.id,
        content: newComment.trim(),
      });

      setComments([comment, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Erreur lors de la création du commentaire:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEpisodeChange = async (episode) => {
    // Remonter en haut immédiatement
    // window.scrollTo({ top: 0, behavior: "instant" });

    setSelectedEpisode(episode);

    // Enregistrer la lecture dans l'historique
    if (user && webnovel) {
      try {
        await historyApi.addToReadingHistory(
          user.id,
          webnovel.id,
          episode.id,
          episode.number
        );
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'historique:", error);
      }
    }

    // Remonter en haut après un court délai
    // setTimeout(() => {
    //   window.scrollTo({ top: 0, behavior: "smooth" });
    // }, 50);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b flex items-center justify-center"
        style={{
          background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
        }}
      >
        <div className="text-xl" style={{ color: colors.text }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!webnovel) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b flex items-center justify-center"
        style={{
          background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
        }}
      >
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: colors.text }}>
            Webnovel introuvable
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 rounded-lg font-semibold text-white"
            style={{ backgroundColor: colors.primary }}
          >
            Retour à l'accueil
          </button>
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
      <header
        className="sticky top-16 z-40 py-4 backdrop-blur-sm"
        style={{ backgroundColor: `rgba(255, 255, 255, 0.9)` }}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl hover:scale-110 transition-transform"
            style={{ color: colors.text }}
          >
            <MdArrowBack />
          </button>

          <h1
            className="text-xl md:text-2xl font-bold truncate flex-1 px-4"
            style={{ color: colors.text }}
          >
            {webnovel.title}
          </h1>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition hover:scale-105"
              style={{
                backgroundColor: isLiked
                  ? colors.primary
                  : colors.whiteTransparent,
                color: isLiked ? "white" : colors.text,
              }}
            >
              {isLiked ? <MdFavorite /> : <MdFavoriteBorder />}
              <span className="text-sm font-semibold">{likesCount}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg transition hover:scale-105"
              style={{
                backgroundColor: colors.whiteTransparent,
                color: colors.text,
              }}
            >
              <MdComment />
              <span className="text-sm font-semibold">{comments.length}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Informations du webnovel */}
        <div
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
          style={{ backgroundColor: colors.whiteTransparent }}
        >
          <div className="flex items-start gap-4 mb-4">
            {webnovel.image_url ? (
              <img
                src={webnovel.image_url}
                alt={webnovel.title}
                className="w-32 h-48 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-32 h-48 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-white text-4xl">📚</span>
              </div>
            )}
            <div className="flex-1">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {webnovel.title}
              </h2>
              <p
                className="text-lg mb-2"
                style={{ color: colors.text, opacity: 0.8 }}
              >
                {webnovel.genre || "Genre non spécifié"}
              </p>
              {webnovel.synopsis && (
                <p
                  className="text-sm mb-4"
                  style={{ color: colors.text, opacity: 0.7 }}
                >
                  {webnovel.synopsis}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm">
                <div
                  className="flex items-center gap-1"
                  style={{ color: colors.text }}
                >
                  <MdVisibility />
                  <span>{viewsCount} vues</span>
                </div>
                <div
                  className="flex items-center gap-1"
                  style={{ color: colors.text }}
                >
                  <MdFavorite />
                  <span>{likesCount} likes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition hover:scale-105"
              style={{
                backgroundColor: isLiked ? colors.primary : "white",
                color: isLiked ? "white" : colors.primary,
                border: `2px solid ${colors.primary}`,
              }}
            >
              {isLiked ? <MdFavorite /> : <MdFavoriteBorder />}
              {isLiked ? "Unlike" : "Like"}
            </button>

            <button
              onClick={handleLoadLikers}
              className="px-6 py-3 rounded-lg font-semibold transition hover:scale-105"
              style={{
                backgroundColor: colors.whiteTransparent,
                color: colors.text,
              }}
            >
              Voir les likes
            </button>
          </div>
        </div>

        {/* Personnages */}
        {Array.isArray(webnovel.characters) &&
          webnovel.characters.length > 0 && (
            <div
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
              style={{ backgroundColor: colors.whiteTransparent }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-xl font-semibold"
                  style={{ color: colors.text }}
                >
                  Personnages
                </h3>
                <button
                  onClick={() => setShowCharacters(!showCharacters)}
                  className="px-3 py-1 rounded-lg font-semibold transition hover:scale-105"
                  style={{
                    backgroundColor: colors.white,
                    color: colors.text,
                    border: `1px solid ${colors.text}`,
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    {showCharacters ? <MdExpandLess /> : <MdExpandMore />}
                    {showCharacters ? "Réduire" : "Afficher"}
                  </span>
                </button>
              </div>

              {showCharacters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {webnovel.characters.map((ch, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg p-4 border"
                      style={{
                        borderColor: colors.white,
                        backgroundColor: "rgba(255,255,255,0.6)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                          style={{
                            backgroundColor: colors.primary,
                            color: "white",
                          }}
                        >
                          {(ch?.nom || `P${idx + 1}`)
                            ?.toString()
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div
                            className="font-bold"
                            style={{ color: colors.text }}
                          >
                            {ch?.nom || `Personnage ${idx + 1}`}
                          </div>
                          {ch?.âge && (
                            <div
                              className="text-sm opacity-80"
                              style={{ color: colors.text }}
                            >
                              {ch.âge}
                            </div>
                          )}
                        </div>
                      </div>
                      {ch?.rôle && (
                        <div className="mb-1">
                          <span
                            className="font-semibold"
                            style={{ color: colors.primary }}
                          >
                            Rôle:{" "}
                          </span>
                          <span style={{ color: colors.text }}>{ch.rôle}</span>
                        </div>
                      )}
                      {ch?.personnalité && (
                        <div className="mb-1">
                          <span
                            className="font-semibold"
                            style={{ color: colors.primary }}
                          >
                            Personnalité:{" "}
                          </span>
                          <span style={{ color: colors.text }}>
                            {ch.personnalité}
                          </span>
                        </div>
                      )}
                      {ch?.apparence && (
                        <div>
                          <span
                            className="font-semibold"
                            style={{ color: colors.primary }}
                          >
                            Apparence:{" "}
                          </span>
                          <span style={{ color: colors.text }}>
                            {ch.apparence}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        {/* Sélection d'épisode */}
        {episodes.length > 0 && (
          <div
            className="bg-white rounded-lg shadow-lg p-6 mb-6"
            style={{ backgroundColor: colors.whiteTransparent }}
          >
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: colors.text }}
            >
              Épisodes
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => handleEpisodeChange(episode)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    selectedEpisode?.id === episode.id
                      ? "shadow-md"
                      : "hover:bg-white/50"
                  }`}
                  style={{
                    backgroundColor:
                      selectedEpisode?.id === episode.id
                        ? colors.primary
                        : colors.whiteTransparent,
                    color:
                      selectedEpisode?.id === episode.id
                        ? "white"
                        : colors.text,
                  }}
                >
                  <div className="font-semibold">Épisode {episode.number}</div>
                  {episode.title && (
                    <div className="text-sm opacity-75">{episode.title}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contenu de l'épisode */}
        {selectedEpisode && (
          <>

            <div
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
              style={{ backgroundColor: colors.whiteTransparent }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  Épisode {selectedEpisode.number}:{" "}
                  {selectedEpisode.title || webnovel.title}
                </h3>
                {episodePages.length > 1 && (
                  <div
                    className="text-sm font-semibold"
                    style={{ color: colors.primary }}
                  >
                    Page {currentPage + 1} / {episodePages.length}
                  </div>
                )}
              </div>

              {/* Navigation pages */}
              {episodePages.length > 1 && (
                <div className="flex items-center justify-between mb-4 gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        currentPage === 0 ? "transparent" : colors.primary,
                      color: currentPage === 0 ? colors.text : "white",
                    }}
                  >
                    <span className="inline-flex items-center gap-1">
                      <MdArrowBack /> Page précédente
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(episodePages.length - 1, currentPage + 1)
                      )
                    }
                    disabled={currentPage === episodePages.length - 1}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        currentPage === episodePages.length - 1
                          ? "transparent"
                          : colors.primary,
                      color:
                        currentPage === episodePages.length - 1
                          ? colors.text
                          : "white",
                    }}
                  >
                    <span className="inline-flex items-center gap-1">
                      Page suivante <MdArrowForward />
                    </span>
                  </button>
                </div>
              )}

              <div
                ref={contentRef}
                className="episode-content"
                style={{
                  color: colors.text,
                  fontSize: "clamp(1rem, 4vw, 1.2rem)",
                  lineHeight: "1.75",
                  letterSpacing: "0.02em",
                  wordSpacing: "0.08em",
                  textAlign: "left",
                  padding: "1rem",
                  maxHeight: "50vh",
                  overflow: "auto",
                }}
                dangerouslySetInnerHTML={{
                  __html: episodePages[currentPage] || "",
                }}
              />

              <style>{`
                .episode-content p {
                  margin-bottom: 1.5rem !important;
                  margin-top: 1.5rem !important;
                }
                
                .episode-content p:first-child {
                  margin-top: 0 !important;
                }
                
                .episode-content p:last-child {
                  margin-bottom: 0 !important;
                }
                
                .episode-content br {
                  display: block;
                  margin: 0.5rem 0 !important;
                }
                
                .episode-content {
                  white-space: pre-wrap;
                }
              `}</style>
            </div>

            {/* Navigation épisodes - Bottom */}
            <div className="flex items-center justify-between mb-6 gap-2">
              <button
                onClick={() => {
                  const currentIndex = episodes.findIndex(
                    (ep) => ep.id === selectedEpisode.id
                  );
                  if (currentIndex > 0) {
                    handleEpisodeChange(episodes[currentIndex - 1]);
                  }
                }}
                disabled={
                  episodes.findIndex((ep) => ep.id === selectedEpisode.id) === 0
                }
                className="flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    episodes.findIndex((ep) => ep.id === selectedEpisode.id) ===
                    0
                      ? "transparent"
                      : colors.primary,
                  color:
                    episodes.findIndex((ep) => ep.id === selectedEpisode.id) ===
                    0
                      ? colors.text
                      : "white",
                }}
              >
                <span className="inline-flex items-center gap-1">
                  <MdArrowBack /> Précédent
                </span>
              </button>

              <div className="text-center px-2">
                <div
                  className="text-xs font-semibold"
                  style={{ color: colors.text }}
                >
                  {selectedEpisode.number} / {episodes.length}
                </div>
              </div>

              <button
                onClick={() => {
                  const currentIndex = episodes.findIndex(
                    (ep) => ep.id === selectedEpisode.id
                  );
                  if (currentIndex < episodes.length - 1) {
                    handleEpisodeChange(episodes[currentIndex + 1]);
                  }
                }}
                disabled={
                  episodes.findIndex((ep) => ep.id === selectedEpisode.id) ===
                  episodes.length - 1
                }
                className="flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor:
                    episodes.findIndex((ep) => ep.id === selectedEpisode.id) ===
                    episodes.length - 1
                      ? "transparent"
                      : colors.primary,
                  color:
                    episodes.findIndex((ep) => ep.id === selectedEpisode.id) ===
                    episodes.length - 1
                      ? colors.text
                      : "white",
                }}
              >
                <span className="inline-flex items-center gap-1">
                  Suivant <MdArrowForward />
                </span>
              </button>
            </div>
          </>
        )}

        {/* Modal: Liste des likers */}
        {showLikers && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  Personnes qui ont liké
                </h3>
                <button
                  onClick={() => setShowLikers(false)}
                  className="text-2xl hover:scale-110"
                  style={{ color: colors.text }}
                >
                  <MdClose />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[60vh] p-4">
                {likers.length === 0 ? (
                  <p
                    className="text-center py-8"
                    style={{ color: colors.text }}
                  >
                    Personne n'a liké pour le moment
                  </p>
                ) : (
                  <div className="space-y-2">
                    {likers.map((like) => (
                      <div
                        key={like.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                        <div>
                          <div
                            className="font-semibold"
                            style={{ color: colors.text }}
                          >
                            {like.user_extend?.name || "Utilisateur"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Commentaires */}
        {showComments && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  Commentaires ({comments.length})
                </h3>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-3xl hover:scale-110 transition-transform"
                  style={{ color: colors.text }}
                >
                  <MdClose />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
                {/* Formulaire de commentaire */}
                <form
                  onSubmit={handleSubmitComment}
                  className="mb-6 pb-6 border-b"
                >
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Partagez votre avis..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-500 resize-none"
                    style={{ backgroundColor: colors.white }}
                    rows="4"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || commentLoading}
                    className="mt-3 px-6 py-2 rounded-lg font-semibold transition hover:scale-105 disabled:opacity-50"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.white,
                    }}
                  >
                    {commentLoading ? "Envoi..." : "💬 Commenter"}
                  </button>
                </form>

                {/* Liste des commentaires */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-lg" style={{ color: colors.text }}>
                        Aucun commentaire pour le moment
                      </p>
                      <p
                        className="text-sm opacity-75 mt-2"
                        style={{ color: colors.text }}
                      >
                        Soyez le premier à commenter !
                      </p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-l-4 p-4 rounded-lg transition hover:shadow-md"
                        style={{
                          borderLeftColor: colors.primary,
                          backgroundColor: colors.whiteTransparent,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                            style={{
                              backgroundColor: colors.primary,
                              color: "white",
                            }}
                          >
                            {(comment.user_extend?.name ||
                              "A")[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="font-bold text-lg"
                                style={{ color: colors.text }}
                              >
                                {comment.user_extend?.name || "Anonyme"}
                              </span>
                              <span
                                className="text-xs opacity-60"
                                style={{ color: colors.text }}
                              >
                                {comment.created_at
                                  ? new Date(
                                      comment.created_at
                                    ).toLocaleDateString("fr-FR", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })
                                  : ""}
                              </span>
                            </div>
                            <p
                              className="text-base"
                              style={{ color: colors.text }}
                            >
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadPage;
