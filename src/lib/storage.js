import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service de stockage Supabase pour les images
 */
export const storageApi = {
  /**
   * Upload une image dans le bucket Supabase
   * @param {File|Blob} file - Le fichier ou blob à uploader
   * @param {string} bucketName - Le nom du bucket (défaut: 'pensaga-bucket')
   * @param {string} folderPath - Le chemin du dossier (ex: 'covers/')
   * @returns {Promise<string>} URL publique de l'image
   */
  uploadImage: async (file, bucketName = 'pensaga-bucket', folderPath = 'covers/') => {
    try {
      // Générer un nom de fichier unique avec UUID (évite les caractères spéciaux)
      const uuid = uuidv4();
      // Vérifier si c'est un Blob ou un File
      const fileExtension = file instanceof File && file.name 
        ? file.name.split('.').pop() || 'jpg'
        : 'jpg';
      const fileName = `${folderPath}${uuid}.${fileExtension}`;

      // Upload du fichier
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erreur lors de l\'upload:', error);
        throw error;
      }

      // Récupérer l'URL publique du fichier
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Erreur lors de l\'upload de l\'image:', err);
      throw err;
    }
  },

  /**
   * Supprime une image du bucket Supabase
   * @param {string} filePath - Le chemin du fichier dans le bucket
   * @param {string} bucketName - Le nom du bucket (défaut: 'pensaga-bucket')
   * @returns {Promise<boolean>}
   */
  deleteImage: async (filePath, bucketName = 'pensaga-bucket') => {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        throw error;
      }

      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'image:', err);
      throw err;
    }
  },

  /**
   * Récupère le chemin du fichier depuis une URL publique
   * @param {string} publicUrl - L'URL publique de l'image
   * @param {string} bucketName - Le nom du bucket
   * @returns {string} Le chemin du fichier dans le bucket
   */
  getFilePathFromUrl: (publicUrl, bucketName = 'pensaga-bucket') => {
    try {
      const urlObj = new URL(publicUrl);
      // Extraire le chemin après le nom du bucket
      const pathMatch = urlObj.pathname.match(new RegExp(`/${bucketName}/(.+)$`));
      return pathMatch ? pathMatch[1] : null;
    } catch (err) {
      console.error('Erreur lors de l\'extraction du chemin:', err);
      return null;
    }
  }
};

export default storageApi;

