import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import colors from "../../utils/constants/colors";
import { webnovelsApi, episodesApi } from "../../lib/supabaseApi";
import { getCurrentUser } from "../../lib/supabase";
import { storageApi } from "../../lib/storage";
import EpisodeList from "../../components/episodes/EpisodeList";
import CreateEpisodeForm from "../../components/episodes/CreateEpisodeForm";

const EpisodesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [webnovel, setWebnovel] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        if (!user) {
          navigate("/login");
          return;
        }

        // Charger le webnovel
        const webnovelData = await webnovelsApi.getById(id);
        setWebnovel(webnovelData);

        // Charger les épisodes
        const episodesData = await episodesApi.getByWebnovel(id);
        setEpisodes(episodesData);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError(err.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleSaveEpisode = async (episodeData) => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Vous devez être connecté");
      }

      if (editingEpisode) {
        // Mise à jour d'un épisode existant
        await episodesApi.update(editingEpisode.id, episodeData);
        setEpisodes(episodes.map(ep => ep.id === editingEpisode.id ? { ...ep, ...episodeData } : ep));
      } else {
        // Création d'un nouvel épisode
        const newEpisode = await episodesApi.create({
          ...episodeData,
          id_webnovels: id
        });
        setEpisodes([...episodes, newEpisode]);
      }

      setShowCreateForm(false);
      setEditingEpisode(null);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError(err.message || "Erreur lors de la sauvegarde de l'épisode");
    } finally {
      setLoading(false);
    }
  };

  const handleEditEpisode = (episode) => {
    setEditingEpisode(episode);
    setShowCreateForm(true);
  };

  const handleDeleteEpisode = async (episodeId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet épisode ?")) {
      return;
    }

    try {
      setLoading(true);
      await episodesApi.delete(episodeId);
      setEpisodes(episodes.filter(ep => ep.id !== episodeId));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError(err.message || "Erreur lors de la suppression de l'épisode");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewEpisode = () => {
    setEditingEpisode(null);
    setShowCreateForm(true);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingEpisode(null);
  };

  // ==================== GESTION DE L'IMAGE DE COUVERTURE ====================
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setImageError('Veuillez sélectionner un fichier image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('L\'image est trop volumineuse (max 5MB)');
      return;
    }

    try {
      setUploadingImage(true);
      setImageError(null);

      // Supprimer l'ancienne image si elle existe
      if (webnovel?.image_url) {
        const oldFilePath = storageApi.getFilePathFromUrl(webnovel.image_url);
        if (oldFilePath) {
          await storageApi.deleteImage(oldFilePath);
        }
      }

      // Upload de la nouvelle image
      const url = await storageApi.uploadImage(file);
      
      // Mettre à jour le webnovel
      const updatedWebnovel = await webnovelsApi.update(id, { image_url: url });
      setWebnovel(updatedWebnovel);
    } catch (err) {
      console.error('Erreur lors de l\'upload:', err);
      setImageError('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
      // Réinitialiser l'input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUploadingImage(true);
      setImageError(null);

      // Supprimer l'image du bucket
      if (webnovel?.image_url) {
        const filePath = storageApi.getFilePathFromUrl(webnovel.image_url);
        if (filePath) {
          await storageApi.deleteImage(filePath);
        }
      }

      // Mettre à jour le webnovel
      const updatedWebnovel = await webnovelsApi.update(id, { image_url: null });
      setWebnovel(updatedWebnovel);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setImageError('Erreur lors de la suppression de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleToggleIsOver = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Vous devez être connecté");
      }

      await webnovelsApi.update(id, { is_over: !webnovel.is_over });
      setWebnovel({ ...webnovel, is_over: !webnovel.is_over });
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      setError(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Vous devez être connecté");
      }

      await webnovelsApi.update(id, { publish: !webnovel.publish });
      setWebnovel({ ...webnovel, publish: !webnovel.publish });
    } catch (err) {
      console.error("Erreur lors de la publication:", err);
      setError(err.message || "Erreur lors de la publication");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !webnovel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-4 mx-auto mb-4"
            style={{
              borderColor: colors.primaryLight,
              borderTopColor: colors.primary,
            }}
          />
          <p style={{ color: colors.text }}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !webnovel) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate("/stories")}
            className="px-6 py-3 rounded-lg font-semibold"
            style={{ backgroundColor: colors.primary, color: colors.white }}
          >
            Retour aux histoires
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b pb-16 lg:pb-0"
      style={{
        background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
      }}
    >
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/stories")}
              className="text-2xl hover:scale-110 transition-transform"
              style={{ color: colors.text }}
            >
              ←
            </button>
            <h1
              className="text-4xl md:text-5xl font-bold flex-1"
              style={{ color: colors.text }}
            >
              {webnovel?.title || "Épisodes"}
            </h1>
          </div>

          {/* Image de couverture - Style card */}
          {webnovel?.image_url && (
            <div className="mb-6 flex flex-col items-center">
              <div 
                className="relative group cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => fileInputRef.current?.click()}
                title="Cliquer pour changer l'image"
              >
                <div className="relative overflow-hidden rounded-lg bg-white/30 backdrop-blur-sm shadow-lg aspect-[2/3] w-48 md:w-56 border border-white/40">
                  <img 
                    src={webnovel.image_url} 
                    alt="Couverture"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  
                  {/* Overlay au survol */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                    style={{ backgroundColor: colors.overlay }}
                  >
                    <div className="text-white text-center p-4">
                      <p className="text-sm font-semibold mb-1">Cliquer pour changer</p>
                      <span className="text-xs text-white/90">l'image de couverture</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bouton de suppression en dessous */}
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={uploadingImage || loading}
                className="mt-3 px-3 py-1 text-xs rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{ 
                  backgroundColor: "#FEE2E2", 
                  color: "#991B1B",
                  border: "1px solid #FCA5A5"
                }}
                title="Supprimer l'image"
              >
                ✕ Supprimer l'image
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}

          {!webnovel?.image_url && (
            <div className="mb-6 flex justify-center">
              <div className="relative group">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage || loading}
                  className="relative overflow-hidden rounded-lg bg-white/30 backdrop-blur-sm shadow-lg aspect-[2/3] w-48 md:w-56 border border-white/40 border-dashed flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
                >
                  {uploadingImage ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 mx-auto mb-2" style={{ borderColor: colors.primaryLight, borderTopColor: colors.primary }} />
                      <p className="text-sm font-semibold" style={{ color: colors.text }}>Upload en cours...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-sm font-semibold mb-1" style={{ color: colors.text }}>Ajouter une image</p>
                      <span className="text-xs" style={{ color: colors.textSecondary }}>de couverture</span>
                      <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Ratio 2:3 recommandé</p>
                    </div>
                  )}
                </button>
                
                {/* Overlay au survol */}
                {!uploadingImage && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg pointer-events-none"
                    style={{ backgroundColor: colors.overlay }}
                  >
                    <div className="text-white text-center p-4">
                      <p className="text-sm font-semibold mb-1">Cliquer pour ajouter</p>
                      <span className="text-xs text-white/90">une image de couverture</span>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}

          {imageError && (
            <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
              {imageError}
            </div>
          )}
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg" style={{ color: colors.textSecondary }}>
              Gérez les épisodes de votre webnovel
            </p>
            
            {/* Badges de statut */}
            <div className="flex gap-3">
              {webnovel?.is_over && (
                <span
                  className="px-4 py-2 rounded-lg font-semibold text-sm"
                  style={{
                    backgroundColor: colors.draft,
                    color: colors.text,
                  }}
                >
                  ✓ Terminé
                </span>
              )}
              {webnovel?.publish && (
                <span
                  className="px-4 py-2 rounded-lg font-semibold text-sm"
                  style={{
                    backgroundColor: colors.published,
                    color: colors.white,
                  }}
                >
                  🌐 Publié
                </span>
              )}
            </div>
          </div>

          {/* Boutons de contrôle */}
          <div className="flex gap-4 mb-4">
            {/* Bouton Marquer comme terminé / Reprendre l'écriture */}
            {!webnovel?.is_over ? (
              <button
                onClick={handleToggleIsOver}
                className="px-6 py-3 rounded-lg font-semibold text-white transition shadow-lg hover:scale-105"
                style={{ backgroundColor: colors.primary }}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryLight}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
              >
                ✓ Marquer comme terminé
              </button>
            ) : (
              <button
                onClick={handleToggleIsOver}
                className="px-6 py-3 rounded-lg font-semibold text-white transition shadow-lg hover:scale-105"
                style={{ backgroundColor: colors.primaryLight }}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.primary}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.primaryLight}
              >
                ✏️ Reprendre l'écriture
              </button>
            )}
            
            {/* Bouton Publier / Dépublier */}
            {!webnovel?.publish ? (
              <button
                onClick={handleTogglePublish}
                className="px-6 py-3 rounded-lg font-semibold text-white transition shadow-lg hover:scale-105"
                style={{ backgroundColor: colors.published }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.published}
              >
                🌐 Publier
              </button>
            ) : (
              <button
                onClick={handleTogglePublish}
                className="px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:scale-105"
                style={{
                  backgroundColor: "#FEE2E2",
                  color: "#991B1B",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#FECACA"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#FEE2E2"}
              >
                🔒 Dépublier
              </button>
            )}
          </div>
        </header>

        {/* Affichage des erreurs */}
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

        {/* Affichage conditionnel: Formulaire de création ou Liste des épisodes */}
        {showCreateForm ? (
          <CreateEpisodeForm
            webnovel={webnovel}
            episodes={episodes}
            editingEpisode={editingEpisode}
            onSave={handleSaveEpisode}
            onCancel={handleCancelForm}
            loading={loading}
          />
        ) : (
          <>
            {/* Bouton pour créer un nouvel épisode */}
            <div className="mb-8 flex justify-end">
              <button
                className="px-6 py-3 rounded-lg font-semibold text-white transition shadow-lg hover:scale-105"
                style={{ backgroundColor: colors.primary }}
                onMouseEnter={(e) => e.target.style.backgroundColor = colors.primaryLight}
                onMouseLeave={(e) => e.target.style.backgroundColor = colors.primary}
                onClick={handleCreateNewEpisode}
              >
                + Nouvel Épisode
              </button>
            </div>

            {/* Liste des épisodes */}
            <EpisodeList
              episodes={episodes}
              onEdit={handleEditEpisode}
              onDelete={handleDeleteEpisode}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EpisodesPage;
