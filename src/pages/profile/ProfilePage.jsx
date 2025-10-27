import React, { useState, useEffect } from 'react';
import { getCurrentUser, getUserExtend } from '../../lib/supabase';
import { userExtendApi, historyApi } from '../../lib/supabaseApi';
import colors from '../../utils/constants/colors';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userExtend, setUserExtend] = useState(null);
  const [likedWebnovels, setLikedWebnovels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    lastname: '',
    age: '',
    preferences: {}
  });

  const availableGenres = [
    'Romance', 'Fantasy', 'Science Fiction', 'Action', 'Aventure', 
    'Drame', 'Mystère', 'Horreur', 'Comédie', 'Historique'
  ];

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        window.location.href = '/login';
        return;
      }

      setUser(currentUser);
      const extendData = await getUserExtend(currentUser.id);
      setUserExtend(extendData);

      // Charger les webnovels likés
      const liked = await historyApi.getLikedWebnovels(currentUser.id);
      setLikedWebnovels(liked);

      // Initialiser le formulaire d'édition
      setEditForm({
        name: extendData?.name || '',
        lastname: extendData?.lastname || '',
        age: extendData?.age || '',
        preferences: {
          ...extendData?.preferences,
          genres: extendData?.preferences?.genres || []
        }
      });
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
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
        preferences: editForm.preferences
      });

      // Recharger les données
      const extendData = await getUserExtend(user.id);
      setUserExtend(extendData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des modifications');
    }
  };

  const handleGenreToggle = (genre) => {
    const currentGenres = editForm.preferences.genres || [];
    const newGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];
    
    setEditForm({
      ...editForm,
      preferences: { ...editForm.preferences, genres: newGenres }
    });
  };

  const getFullName = () => {
    if (userExtend?.name && userExtend?.lastname) {
      return `${userExtend.name} ${userExtend.lastname}`;
    } else if (userExtend?.username) {
      return userExtend.username;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  const getFavoritesGenres = () => {
    if (userExtend?.preferences?.genres) {
      const genres = userExtend.preferences.genres;
      if (Array.isArray(genres) && genres.length > 0) {
        return genres.join(', ');
      }
    }
    return 'Aucun genre favori';
  };

  const formatLikedWebnovels = () => {
    return likedWebnovels
      .map(like => ({
        id: like.webnovels.id,
        title: like.webnovels.title || 'Sans titre',
        category: like.webnovels.genre || 'Non spécifié',
        status: like.webnovels.publish ? 'published' : 'draft',
        cover: "https://via.placeholder.com/300x450",
        ...like.webnovels
      }))
      .filter(webnovel => webnovel.title);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b" style={{ background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` }}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-xl" style={{ color: colors.text }}>Chargement...</div>
        </div>
      </div>
    );
  }

  const { xpProgress, xpNeeded } = calculateXPForNextLevel(userExtend?.xp || 0);
  const level = calculateLevel(userExtend?.xp || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b pb-16" style={{ background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})` }}>
      <div className="p-6 md:p-12 max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: colors.text }}>
            Bienvenue sur votre profil {userExtend?.name || userExtend?.username}
          </h1>
          <p className="text-lg opacity-80" style={{ color: colors.text }}>
            Gérez vos informations et suivez votre progression
          </p>
        </div>

        {/* Barre d'XP */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6" style={{ backgroundColor: colors.whiteTransparent }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: colors.text }}>Niveau {level}</h2>
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
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ 
                backgroundColor: colors.primary,
                width: `${(xpProgress / xpNeeded) * 100}%` 
              }}
            >
              {xpProgress}/{xpNeeded}
            </div>
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6" style={{ backgroundColor: colors.whiteTransparent }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold" style={{ color: colors.text }}>Informations personnelles</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg font-semibold transition hover:scale-105"
              style={{ backgroundColor: colors.primary, color: colors.white }}
              onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryLight}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold" style={{ color: colors.text }}>Prénom</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-300"
                  style={{ backgroundColor: colors.white }}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold" style={{ color: colors.text }}>Nom</label>
                <input
                  type="text"
                  value={editForm.lastname}
                  onChange={(e) => setEditForm({ ...editForm, lastname: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-300"
                  style={{ backgroundColor: colors.white }}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold" style={{ color: colors.text }}>Âge</label>
                <input
                  type="number"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-pink-300"
                  style={{ backgroundColor: colors.white }}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold" style={{ color: colors.text }}>Genres favoris</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${
                        editForm.preferences.genres?.includes(genre)
                          ? 'text-white'
                          : ''
                      }`}
                      style={{
                        backgroundColor: editForm.preferences.genres?.includes(genre)
                          ? colors.primary
                          : colors.whiteTransparent,
                        color: editForm.preferences.genres?.includes(genre)
                          ? colors.white
                          : colors.text
                      }}
                      onMouseEnter={(e) => {
                        if (!editForm.preferences.genres?.includes(genre)) {
                          e.target.style.backgroundColor = colors.whiteTransparentLight;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!editForm.preferences.genres?.includes(genre)) {
                          e.target.style.backgroundColor = colors.whiteTransparent;
                        }
                      }}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSaveEdit}
                className="w-full py-3 rounded-lg font-semibold transition hover:scale-105"
                style={{ backgroundColor: colors.primary, color: colors.white }}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryLight}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
              >
                Enregistrer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm opacity-75 mb-1" style={{ color: colors.text }}>Nom</p>
                <p className="text-lg font-semibold" style={{ color: colors.text }}>
                  {getFullName()}
                </p>
              </div>
              {user?.email && (
                <div>
                  <p className="text-sm opacity-75 mb-1" style={{ color: colors.text }}>Email</p>
                  <p className="text-lg" style={{ color: colors.text }}>{user.email}</p>
                </div>
              )}
              {userExtend?.age && (
                <div>
                  <p className="text-sm opacity-75 mb-1" style={{ color: colors.text }}>Âge</p>
                  <p className="text-lg" style={{ color: colors.text }}>{userExtend.age} ans</p>
                </div>
              )}
              <div>
                <p className="text-sm opacity-75 mb-1" style={{ color: colors.text }}>Genres favoris</p>
                <p className="text-lg" style={{ color: colors.text }}>{getFavoritesGenres()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Historique des novels likés */}
        <div className="bg-white rounded-lg shadow-lg p-6" style={{ backgroundColor: colors.whiteTransparent }}>
          <h2 className="text-2xl font-semibold mb-4" style={{ color: colors.text }}>Mes novels favoris</h2>
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
                  onClick={() => window.location.href = `/episodes/${webnovel.id}`}
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
                        <p className="text-sm font-semibold mb-1">{webnovel.title}</p>
                        <span className="text-xs text-white/90">{webnovel.category}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm truncate" style={{ color: colors.text }}>{webnovel.title}</h3>
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

