import React, { useState, useEffect } from "react";
import { MdCheck } from "react-icons/md";
import { getCurrentUser, getUserExtend } from "../../lib/supabase";
import { userExtendApi, historyApi } from "../../lib/supabaseApi";
import colors from "../../utils/constants/colors";
import { genresByCategory, genresList } from "../../utils/constants/genres";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userExtend, setUserExtend] = useState(null);
  const [likedWebnovels, setLikedWebnovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    lastname: "",
    age: "",
    preferences: {},
  });

  const maxGenreSelection = 5;

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      setUser(currentUser);
      const extendData = await getUserExtend(currentUser.id);
      setUserExtend(extendData);

      // Charger les webnovels likés
      const liked = await historyApi.getLikedWebnovels(currentUser.id);
      setLikedWebnovels(liked);

      // Convertir les anciens noms de genres en IDs si nécessaire
      let genres =
        extendData?.preferences?.genre || extendData?.preferences?.genres || [];
      genres = genres.map((genre) => {
        // Si c'est déjà un ID valide, le garder
        const genreById = genresList.find((g) => g.id === genre);
        if (genreById) return genre;

        // Sinon, essayer de trouver par nom (rétrocompatibilité)
        const genreByName = genresList.find(
          (g) =>
            g.name === genre || g.name.toLowerCase() === genre.toLowerCase()
        );
        return genreByName ? genreByName.id : genre;
      });

      // Initialiser le formulaire d'édition
      setEditForm({
        name: extendData?.name || "",
        lastname: extendData?.lastname || "",
        age: extendData?.age || "",
        preferences: {
          ...extendData?.preferences,
          genre: genres,
        },
      });
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer le niveau basé sur l'XP (100 XP par niveau)
  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  // Calculer l'XP pour le niveau suivant
  const calculateXPForNextLevel = (xp) => {
    const currentLevel = calculateLevel(xp);
    const xpForCurrentLevel = (currentLevel - 1) * 100;
    const xpProgress = xp - xpForCurrentLevel;
    const xpNeeded = 100;
    return { xpProgress, xpNeeded };
  };

  const handleSaveEdit = async () => {
    try {
      await userExtendApi.update(user.id, {
        name: editForm.name,
        lastname: editForm.lastname,
        age: editForm.age ? parseInt(editForm.age) : null,
        preferences: editForm.preferences,
      });

      // Recharger les données
      const extendData = await getUserExtend(user.id);
      setUserExtend(extendData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde des modifications");
    }
  };

  const handleGenreToggle = (genreId) => {
    const currentGenres = editForm.preferences.genre || [];
    const isSelected = currentGenres.includes(genreId);
    const canSelectMore = currentGenres.length < maxGenreSelection;

    // Si déjà sélectionné, on désélectionne
    if (isSelected) {
      const newGenres = currentGenres.filter((g) => g !== genreId);
      setEditForm({
        ...editForm,
        preferences: { ...editForm.preferences, genre: newGenres },
      });
    }
    // Sinon, on sélectionne si on n'a pas atteint la limite
    else if (canSelectMore) {
      setEditForm({
        ...editForm,
        preferences: {
          ...editForm.preferences,
          genre: [...currentGenres, genreId],
        },
      });
    }
  };

  const getFullName = () => {
    if (userExtend?.name && userExtend?.lastname) {
      return `${userExtend.name} ${userExtend.lastname}`;
    } else if (userExtend?.username) {
      return userExtend.username;
    } else if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Utilisateur";
  };

  const getFavoritesGenres = () => {
    const prefGenres =
      userExtend?.preferences?.genre || userExtend?.preferences?.genres;
    if (prefGenres) {
      const genres = prefGenres;
      if (Array.isArray(genres) && genres.length > 0) {
        // Convertir les IDs en noms
        const genreNames = genres.map((genreId) => {
          const genre = genresList.find((g) => g.id === genreId);
          return genre ? genre.name : genreId;
        });
        return genreNames.join(", ");
      }
    }
    return "Aucun genre favori";
  };

  const formatLikedWebnovels = () => {
    return likedWebnovels
      .map((like) => ({
        id: like.webnovels.id,
        title: like.webnovels.title || "Sans titre",
        category: like.webnovels.genre || "Non spécifié",
        status: like.webnovels.publish ? "published" : "draft",
        cover: "https://via.placeholder.com/300x450",
        ...like.webnovels,
      }))
      .filter((webnovel) => webnovel.title);
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

  const { xpProgress, xpNeeded } = calculateXPForNextLevel(userExtend?.xp || 0);
  const level = calculateLevel(userExtend?.xp || 0);

  return (
    <div
      className="min-h-screen bg-gradient-to-b pb-16"
      style={{
        background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
      }}
    >
      <div className="p-6 md:p-12 max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            Bienvenue sur votre profil{" "}
            {userExtend?.name || userExtend?.username}
          </h1>
          <p className="text-lg opacity-80" style={{ color: colors.text }}>
            Gérez vos informations et suivez votre progression
          </p>
        </div>

        {/* Barre d'XP */}
        <div
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
          style={{ backgroundColor: colors.whiteTransparent }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2
                className="text-2xl font-semibold"
                style={{ color: colors.text }}
              >
                Niveau {level}
              </h2>
              <p className="text-sm opacity-75" style={{ color: colors.text }}>
                {userExtend?.xp || 0} XP total
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75" style={{ color: colors.text }}>
                {xpProgress}/{xpNeeded} XP vers le niveau {level + 1}
              </p>
            </div>
          </div>
          <div className="w-full bg-white-200 rounded-full h-6 overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{
                backgroundColor: colors.primary,
                width: `${(xpProgress / xpNeeded) * 100}%`,
              }}
            >
              {xpProgress}/{xpNeeded}
            </div>
          </div>
        </div>

        {/* Informations utilisateur */}
        <div
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
          style={{ backgroundColor: colors.whiteTransparent }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-2xl font-semibold"
              style={{ color: colors.text }}
            >
              Informations personnelles
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg font-semibold transition hover:scale-105"
              style={{ backgroundColor: colors.primary, color: colors.white }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = colors.primaryLight)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = colors.primary)
              }
            >
              {isEditing ? "Annuler" : "Modifier"}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label
                  className="block mb-2 font-semibold"
                  style={{ color: colors.text }}
                >
                  Prénom
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-300"
                  style={{ backgroundColor: colors.white }}
                />
              </div>
              <div>
                <label
                  className="block mb-2 font-semibold"
                  style={{ color: colors.text }}
                >
                  Nom
                </label>
                <input
                  type="text"
                  value={editForm.lastname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastname: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-300"
                  style={{ backgroundColor: colors.white }}
                />
              </div>
              <div>
                <label
                  className="block mb-2 font-semibold"
                  style={{ color: colors.text }}
                >
                  Âge
                </label>
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) =>
                    setEditForm({ ...editForm, age: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-300"
                  style={{ backgroundColor: colors.white }}
                />
              </div>
              <div>
                <label
                  className="block mb-2 font-semibold"
                  style={{ color: colors.text }}
                >
                  Genres favoris
                </label>
                <p
                  className="text-xs mb-3"
                  style={{ color: colors.text, opacity: 0.7 }}
                >
                  Choisissez jusqu'à {maxGenreSelection} genres que vous aimez
                  lire
                </p>
                {editForm.preferences.genre?.length > 0 && (
                  <p className="text-xs mb-3" style={{ color: colors.primary }}>
                    {editForm.preferences.genre.length}/{maxGenreSelection}{" "}
                    sélectionnés
                  </p>
                )}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {Object.entries(genresByCategory).map(
                    ([category, genres]) => (
                      <div key={category} className="space-y-2">
                        <h3
                          className="text-sm font-bold uppercase tracking-wide"
                          style={{ color: colors.primary }}
                        >
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {genres.map((genre) => {
                            const selected =
                              editForm.preferences.genre?.includes(genre.id);
                            const canSelectMore =
                              (editForm.preferences.genre?.length || 0) <
                              maxGenreSelection;
                            const selectable = !selected && canSelectMore;

                            return (
                              <button
                                key={genre.id}
                                type="button"
                                onClick={() => handleGenreToggle(genre.id)}
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
                                    selected
                                      ? colors.primary
                                      : "rgba(255,255,255,0.3)"
                                  }`,
                                }}
                              >
                                {genre.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
                {(!editForm.preferences.genre?.length ||
                  editForm.preferences.genre?.length === maxGenreSelection) && (
                  <div
                    className="text-center mt-4 text-sm"
                    style={{ color: colors.primary }}
                  >
                    {editForm.preferences.genre?.length ===
                    maxGenreSelection ? (
                      <span className="inline-flex items-center gap-1">
                        <MdCheck /> Maximum atteint ! Désélectionnez un genre
                        pour en choisir un autre.
                      </span>
                    ) : (
                      "Sélectionnez vos genres préférés"
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleSaveEdit}
                className="w-full py-3 rounded-lg font-semibold transition hover:scale-105"
                style={{ backgroundColor: colors.primary, color: colors.white }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = colors.primaryLight)
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = colors.primary)
                }
              >
                Enregistrer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p
                  className="text-sm opacity-75 mb-1"
                  style={{ color: colors.text }}
                >
                  Nom
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: colors.text }}
                >
                  {getFullName()}
                </p>
              </div>
              {user?.email && (
                <div>
                  <p
                    className="text-sm opacity-75 mb-1"
                    style={{ color: colors.text }}
                  >
                    Email
                  </p>
                  <p className="text-lg" style={{ color: colors.text }}>
                    {user.email}
                  </p>
                </div>
              )}
              {userExtend?.age && (
                <div>
                  <p
                    className="text-sm opacity-75 mb-1"
                    style={{ color: colors.text }}
                  >
                    Âge
                  </p>
                  <p className="text-lg" style={{ color: colors.text }}>
                    {userExtend.age} ans
                  </p>
                </div>
              )}
              <div>
                <p
                  className="text-sm opacity-75 mb-1"
                  style={{ color: colors.text }}
                >
                  Genres favoris
                </p>
                <p className="text-lg" style={{ color: colors.text }}>
                  {getFavoritesGenres()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Historique des novels likés */}
        <div
          className="bg-white rounded-lg shadow-lg p-6"
          style={{ backgroundColor: colors.whiteTransparent }}
        >
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Mes novels favoris
          </h2>
          {likedWebnovels.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg opacity-75" style={{ color: colors.text }}>
                Vous n'avez pas encore liké de novels
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {formatLikedWebnovels().map((webnovel) => (
                <div
                  key={webnovel.id}
                  className="group cursor-pointer flex-shrink-0 w-48 md:w-56"
                  onClick={() =>
                    (window.location.href = `/episodes/${webnovel.id}`)
                  }
                >
                  <div className="relative overflow-hidden rounded-lg bg-white/30 backdrop-blur-sm shadow-lg aspect-[2/3] mb-2 border border-white/40">
                    <img
                      src={webnovel.cover}
                      alt={webnovel.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      style={{ backgroundColor: colors.overlay }}
                    >
                      <div className="text-white text-center p-4">
                        <p className="text-sm font-semibold mb-1">
                          {webnovel.title}
                        </p>
                        <span className="text-xs text-white/90">
                          {webnovel.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3
                    className="font-medium text-sm truncate"
                    style={{ color: colors.text }}
                  >
                    {webnovel.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
