import { supabase } from "./supabase";

// ========================================
// API HELPERS FOR PENSAGA
// ========================================

/**
 * WEBNOVELS API
 */

export const webnovelsApi = {
  // Récupérer tous les webnovels publiés
  getAllPublished: async () => {
    const { data, error } = await supabase
      .from("webnovels")
      .select("*")
      .eq("publish", true)
      .order("id", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer les webnovels d'un utilisateur
  getByUser: async (userId) => {
    const { data, error } = await supabase
      .from("webnovels")
      .select("*")
      .eq("id_author", userId)
      .order("id", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer un webnovel par ID
  getById: async (webnovelId) => {
    const { data, error } = await supabase
      .from("webnovels")
      .select("*")
      .eq("id", webnovelId)
      .single();

    if (error) throw error;
    return data;
  },

  // Créer un nouveau webnovel
  create: async (webnovelData) => {
    const { data, error } = await supabase
      .from("webnovels")
      .insert(webnovelData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour un webnovel
  update: async (webnovelId, updates) => {
    const { data, error } = await supabase
      .from("webnovels")
      .update(updates)
      .eq("id", webnovelId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un webnovel
  delete: async (webnovelId) => {
    const { error } = await supabase
      .from("webnovels")
      .delete()
      .eq("id", webnovelId);

    if (error) throw error;
    return true;
  },
};

/**
 * EPISODES API
 */

export const episodesApi = {
  // Récupérer les épisodes d'un webnovel
  getByWebnovel: async (webnovelId) => {
    const { data, error } = await supabase
      .from("webnovels_episode")
      .select("*")
      .eq("id_webnovels", webnovelId)
      .order("number", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Créer un nouvel épisode
  create: async (episodeData) => {
    const { data, error } = await supabase
      .from("webnovels_episode")
      .insert(episodeData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mettre à jour un épisode
  update: async (episodeId, updates) => {
    const { data, error } = await supabase
      .from("webnovels_episode")
      .update(updates)
      .eq("id", episodeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un épisode
  delete: async (episodeId) => {
    const { error } = await supabase
      .from("webnovels_episode")
      .delete()
      .eq("id", episodeId);

    if (error) throw error;
    return true;
  },
};

/**
 * LIKES API
 */

export const likesApi = {
  // Toggle like sur un webnovel
  toggleLike: async (webnovelId, userId) => {
    // Vérifier si le like existe
    const { data: existingLike } = await supabase
      .from("webnovels_likes")
      .select("id")
      .eq("id_webnovels", webnovelId)
      .eq("id_user", userId)
      .single();

    if (existingLike) {
      // Supprimer le like
      const { error } = await supabase
        .from("webnovels_likes")
        .delete()
        .eq("id", existingLike.id);

      if (error) throw error;
      return false;
    } else {
      // Ajouter le like
      const { error } = await supabase.from("webnovels_likes").insert({
        id_webnovels: webnovelId,
        id_user: userId,
      });

      if (error) throw error;
      return true;
    }
  },

  // Compter les likes d'un webnovel
  countLikes: async (webnovelId) => {
    const { count, error } = await supabase
      .from("webnovels_likes")
      .select("*", { count: "exact", head: true })
      .eq("id_webnovels", webnovelId);

    if (error) throw error;
    return count || 0;
  },
};

/**
 * COMMENTS API
 */

export const commentsApi = {
  // Récupérer les commentaires d'un webnovel
  getByWebnovel: async (webnovelId) => {
    const { data, error } = await supabase
      .from("webnovels_comment")
      .select("*")
      .eq("id_webnovels", webnovelId)
      .is("parent_comment_id", null);

    if (error) throw error;
    return data;
  },

  // Créer un commentaire
  create: async (commentData) => {
    const { data, error } = await supabase
      .from("webnovels_comment")
      .insert(commentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

/**
 * USER EXTEND API
 */

export const userExtendApi = {
  // Mettre à jour les données utilisateur
  update: async (userId, updates) => {
    const { data, error } = await supabase
      .from("user_extend")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer les données utilisateur
  get: async (userId) => {
    const { data, error } = await supabase
      .from("user_extend")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },
};

/**
 * LIKES & HISTORY API
 */

export const historyApi = {
  // Récupérer les webnovels likés par un utilisateur
  getLikedWebnovels: async (userId) => {
    const { data, error } = await supabase
      .from("webnovels_likes")
      .select(
        `
        *,
        webnovels (*)
      `
      )
      .eq("id_user", userId);

    if (error) throw error;
    return data;
  },

  // Récupérer l'historique de lecture d'un utilisateur
  getReadingHistory: async (userId) => {
    const { data, error } = await supabase
      .from("webnovels_history")
      .select(
        `
        *,
        webnovels (*),
        webnovels_episode (*)
      `
      )
      .eq("id_user", userId);

    if (error) throw error;
    return data;
  },
};

/**
 * QUEST API
 */

export const questApi = {
  // Récupérer toutes les quêtes
  getAll: async () => {
    const { data, error } = await supabase.from("quest").select("*");

    if (error) throw error;
    return data;
  },

  // Récupérer la progression d'un utilisateur
  getProgress: async (userId) => {
    const { data, error } = await supabase
      .from("quest_progress")
      .select(
        `
        *,
        quest:quest(*)
      `
      )
      .eq("id_user", userId);

    if (error) throw error;
    return data;
  },
};

export default {
  webnovelsApi,
  episodesApi,
  likesApi,
  commentsApi,
  userExtendApi,
  questApi,
  historyApi,
};
