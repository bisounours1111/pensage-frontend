import React, { useRef, useState } from "react";
import { MdArrowBack, MdCheckCircle } from "react-icons/md";
import colors from "../../utils/constants/colors";
import { storageApi } from "../../lib/storage";

const FinalizationStep = ({
  pitch,
  synopsis,
  characters,
  storyTitle,
  selectedGenre,
  onPrevious,
  onFinalize,
  onImageChange,
  coverImage,
}) => {
  const fileInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);

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

      // Upload de l'image
      const url = await storageApi.uploadImage(file);
      
      // Notifier le parent
      if (onImageChange) {
        onImageChange(url);
      }
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
      if (coverImage) {
        const filePath = storageApi.getFilePathFromUrl(coverImage);
        if (filePath) {
          await storageApi.deleteImage(filePath);
        }
      }

      // Notifier le parent
      if (onImageChange) {
        onImageChange("");
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setImageError('Erreur lors de la suppression de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };
  return (
    <div className="space-y-6">
      <div
        className="p-8 rounded-xl shadow-lg text-center"
        style={{
          backgroundColor: colors.white,
          border: `4px solid ${colors.primary}`,
        }}
      >
        <div className="mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl font-bold"
            style={{ backgroundColor: colors.primary }}
          >
            <MdCheckCircle />
          </div>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Votre histoire est prête !
          </h2>
          <p className="text-lg mb-8" style={{ color: colors.textSecondary }}>
            Vous pouvez maintenant commencer à créer vos épisodes
          </p>
        </div>

        {/* Section Image de couverture */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4" style={{ color: colors.text }}>
            Image de couverture
          </h3>
          
          {coverImage ? (
            <div className="flex flex-col items-center">
              <div 
                className="relative group cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => fileInputRef.current?.click()}
                title="Cliquer pour changer l'image"
              >
                <div className="relative overflow-hidden rounded-lg bg-white/30 backdrop-blur-sm shadow-lg aspect-[2/3] w-48 md:w-56 border border-white/40">
                  <img 
                    src={coverImage} 
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
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="relative group">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
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
            <div className="mt-4 p-3 rounded-lg text-sm text-center" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
              {imageError}
            </div>
          )}
        </div>

        <div className="text-left space-y-6 mb-8">
          <div
            className="p-6 rounded-lg border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.white,
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: colors.white }}
            >
              Pitch
            </h3>
            <p style={{ color: colors.white }}>{pitch}</p>
          </div>

          <div
            className="p-6 rounded-lg border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.white,
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: colors.white }}
            >
              Synopsis
            </h3>
            <p className="whitespace-pre-wrap" style={{ color: colors.white }}>
              {synopsis.substring(0, 200)}...
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.white,
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: colors.white }}
            >
              Personnages
            </h3>
            <p style={{ color: colors.white }}>
              {characters.length} personnage
              {characters.length > 1 ? "s" : ""} créé
              {characters.length > 1 ? "s" : ""}
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.white,
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: colors.white }}
            >
              Genre
            </h3>
            <p style={{ color: colors.white }}>
              {selectedGenre || "Non défini"}
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.white,
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: colors.white }}
            >
              Titre
            </h3>
            <p style={{ color: colors.white }}>{storyTitle || "Non défini"}</p>
          </div>

          {/* Section Image de couverture dans le récapitulatif */}
          {coverImage && (
            <div
              className="p-6 rounded-lg border-4"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.primary,
                color: colors.white,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: colors.white }}
                  >
                    Image de couverture
                  </h3>
                  <p style={{ color: colors.white }}>Image ajoutée</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={uploadingImage}
                  className="px-3 py-1 text-xs rounded-full font-semibold shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
                  style={{ 
                    backgroundColor: "#FEE2E2", 
                    color: "#991B1B",
                    border: "1px solid #FCA5A5"
                  }}
                  title="Supprimer l'image"
                >
                  ✕ Supprimer
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 border-4"
            style={{
              backgroundColor: colors.white,
              color: colors.primary,
              borderColor: colors.primary,
            }}
            onClick={onPrevious}
          >
            <span className="inline-flex items-center gap-2">
              <MdArrowBack /> Retour
            </span>
          </button>
          <button
            className="flex-1 px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:scale-105 border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
            onClick={onFinalize}
          >
            Créer mes épisodes
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalizationStep;
