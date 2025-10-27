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

  // Récupérer les tendances (webnovels récents publiés)
  getTrending: async (limit = 10) => {
    const { data, error } = await supabase
      .from("webnovels")
      .select("*")
      .eq("publish", true)
      .order("id", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Récupérer les recommandations basées sur les genres favoris
  getRecommendations: async (favoriteGenres = [], limit = 10) => {
    const { data, error } = await supabase
      .from("webnovels")
      .select("*")
      .eq("publish", true);

    if (error) throw error;

    // Filtrer les webnovels par genres favoris
    if (favoriteGenres.length > 0) {
      return data
        .filter((webnovel) => {
          const storyGenre = webnovel.genre?.toLowerCase();
          return favoriteGenres.some(
            (genre) =>
              genre.toLowerCase() === storyGenre ||
              storyGenre?.includes(genre.toLowerCase()) ||
              genre.toLowerCase().includes(storyGenre)
          );
        })
        .slice(0, limit);
    }

    return data.slice(0, limit);
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

  // Récupérer un épisode par ID
  getById: async (episodeId) => {
    const { data, error } = await supabase
      .from("webnovels_episode")
      .select("*")
      .eq("id", episodeId)
      .single();

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

  // Récupérer les utilisateurs qui ont liké un webnovel
  getLikers: async (webnovelId) => {
    const { data, error } = await supabase
      .from("webnovels_likes")
      .select(
        `
        *,
        user_extend (*)
      `
      )
      .eq("id_webnovels", webnovelId);

    if (error) throw error;
    return data;
  },

  // Vérifier si un utilisateur a liké un webnovel
  hasLiked: async (webnovelId, userId) => {
    const { data, error } = await supabase
      .from("webnovels_likes")
      .select("id")
      .eq("id_webnovels", webnovelId)
      .eq("id_user", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  },

  // Compter les vues d'un webnovel (via l'historique)
  countViews: async (webnovelId) => {
    const { count, error } = await supabase
      .from("webnovels_history")
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
  // Récupérer les commentaires d'un webnovel avec les auteurs
  getByWebnovel: async (webnovelId) => {
    const { data, error } = await supabase
      .from("webnovels_comment")
      .select(
        `
        *,
        user_extend (*)
      `
      )
      .eq("id_webnovels", webnovelId)
      .is("parent_comment_id", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Créer un commentaire
  create: async (commentData) => {
    const { data, error } = await supabase
      .from("webnovels_comment")
      .insert(commentData)
      .select(
        `
        *,
        user_extend (*)
      `
      )
      .single();

    if (error) throw error;
    return data;
  },

  // Récupérer les réponses d'un commentaire
  getReplies: async (commentId) => {
    const { data, error } = await supabase
      .from("webnovels_comment")
      .select(
        `
        *,
        user_extend (*)
      `
      )
      .eq("parent_comment_id", commentId)
      .order("created_at", { ascending: true });

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
      .eq("id_user", userId)
      .order("id", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Récupérer l'historique pour un webnovel et utilisateur
  getHistoryForWebnovel: async (userId, webnovelId) => {
    const { data, error } = await supabase
      .from("webnovels_history")
      .select("*")
      .eq("id_user", userId)
      .eq("id_webnovels", webnovelId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },

  // Ajouter ou mettre à jour l'historique de lecture
  addToReadingHistory: async (
    userId,
    webnovelId,
    episodeId,
    currentEpisodeNumber
  ) => {
    // Vérifier si l'utilisateur a déjà une entrée pour cet épisode exact
    const { data: existingEpisodeHistory } = await supabase
      .from("webnovels_history")
      .select("id")
      .eq("id_user", userId)
      .eq("id_webnovels", webnovelId)
      .eq("id_webnovels_episode", episodeId)
      .maybeSingle();

    // Si l'utilisateur a déjà une entrée pour cet épisode, ne rien faire
    if (existingEpisodeHistory) {
      return existingEpisodeHistory;
    }

    // Récupérer l'épisode actuel pour obtenir son numéro
    const { data: episode } = await supabase
      .from("webnovels_episode")
      .select("number")
      .eq("id", episodeId)
      .single();

    const episodeNumber = episode?.number || currentEpisodeNumber;

    // Vérifier si l'utilisateur a une entrée pour ce webnovel (n'importe quel épisode)
    const existingWebnovelHistory = await historyApi.getHistoryForWebnovel(
      userId,
      webnovelId
    );

    // Récupérer tous les épisodes précédents
    const { data: previousEpisodes } = await supabase
      .from("webnovels_episode")
      .select("id, number")
      .eq("id_webnovels", webnovelId)
      .lt("number", episodeNumber);

    // Marquer tous les épisodes précédents comme terminés
    if (previousEpisodes && previousEpisodes.length > 0) {
      for (const prevEpisode of previousEpisodes) {
        const { data: prevHistory } = await supabase
          .from("webnovels_history")
          .select("id")
          .eq("id_user", userId)
          .eq("id_webnovels", webnovelId)
          .eq("id_webnovels_episode", prevEpisode.id)
          .maybeSingle();

        if (!prevHistory) {
          // Créer une entrée pour l'épisode précédent marqué comme terminé
          await supabase.from("webnovels_history").insert({
            id_user: userId,
            id_webnovels: webnovelId,
            id_webnovels_episode: prevEpisode.id,
            is_over: true,
          });
        }
      }
    }

    if (existingWebnovelHistory) {
      // Mettre à jour l'historique existant avec le nouvel épisode
      const { data, error } = await supabase
        .from("webnovels_history")
        .update({
          id_webnovels_episode: episodeId,
          is_over: false,
        })
        .eq("id", existingWebnovelHistory.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Créer une nouvelle entrée
      const { data, error } = await supabase
        .from("webnovels_history")
        .insert({
          id_user: userId,
          id_webnovels: webnovelId,
          id_webnovels_episode: episodeId,
          is_over: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },
};

/**
 * SHOP API
 */

export const shopTokenApi = {
  // Récupérer tous les packs de tokens disponibles
  getAll: async () => {
    const { data, error } = await supabase
      .from("shop_token")
      .select("*")
      .order("token_amount", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Acheter un pack de tokens
  buy: async (userId, shopTokenId) => {
    // Créer la transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("transaction")
      .insert({
        id_user: userId,
        id_shop_token: shopTokenId,
        status: "completed",
        date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Récupérer le nombre de tokens
    const { data: shopToken } = await supabase
      .from("shop_token")
      .select("token_amount")
      .eq("id", shopTokenId)
      .single();

    // Mettre à jour le solde de l'utilisateur
    const { data: userExtend } = await supabase
      .from("user_extend")
      .select("token")
      .eq("id", userId)
      .single();

    const { error: updateError } = await supabase
      .from("user_extend")
      .update({ token: (userExtend?.token || 0) + shopToken.token_amount })
      .eq("id", userId);

    if (updateError) throw updateError;

    return transaction;
  },
};

export const shopSubscriptionApi = {
  // Récupérer tous les abonnements disponibles
  getAll: async () => {
    const { data, error } = await supabase
      .from("shop_subscription")
      .select("*")
      .order("price", { ascending: true });

    if (error) throw error;
    return data;
  },

  // Acheter un abonnement Premium
  buy: async (userId, shopSubscriptionId) => {
    // Créer la transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("transaction")
      .insert({
        id_user: userId,
        id_shop_subscription: shopSubscriptionId,
        status: "completed",
        date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Activer l'abonnement Premium
    const { error: updateError } = await supabase
      .from("user_extend")
      .update({ has_subscription: true })
      .eq("id", userId);

    if (updateError) throw updateError;

    return transaction;
  },
};

/**
 * WEEKLY REWARD API
 */

export const weeklyRewardApi = {
  // Vérifier si l'utilisateur peut récupérer sa récompense hebdomadaire
  canClaimWeekly: async (userId) => {
    // Récupérer l'utilisateur pour vérifier son statut premium
    const { data: user } = await supabase
      .from("user_extend")
      .select("has_subscription")
      .eq("id", userId)
      .single();

    const isPremium = user?.has_subscription || false;

    // Calculer la date d'il y a 7 jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateThreshold = sevenDaysAgo.toISOString().split("T")[0];

    // Vérifier s'il y a une transaction de type reward plus récente que 7 jours
    const { data: recentTransactions, error } = await supabase
      .from("transaction")
      .select("*")
      .eq("id_user", userId)
      .eq("status", "completed")
      .eq("type", "reward") // Seulement les récompenses gratuites
      .gte("date", dateThreshold);

    if (error) throw error;

    // S'il n'y a pas de transaction reward dans les 7 derniers jours, on peut récupérer
    const hasRecentReward = recentTransactions && recentTransactions.length > 0;

    return {
      canClaim: !hasRecentReward,
      isPremium,
      lastTransactionDate: hasRecentReward ? recentTransactions[0]?.date : null,
    };
  },

  // Récupérer la récompense hebdomadaire
  claimWeekly: async (userId) => {
    // Vérifier si on peut récupérer
    const { canClaim, isPremium } = await weeklyRewardApi.canClaimWeekly(
      userId
    );

    if (!canClaim) {
      throw new Error("Vous avez déjà récupéré votre récompense cette semaine");
    }

    const rewardAmount = isPremium ? 2000 : 100;

    // Créer une transaction de type "reward" pour tracer les récompenses gratuites
    const { error: transactionError } = await supabase
      .from("transaction")
      .insert({
        id_user: userId,
        status: "completed",
        date: new Date().toISOString().split("T")[0],
        type: "reward", // Type pour les récompenses gratuites
      });

    if (transactionError) throw transactionError;

    // Mettre à jour le solde de l'utilisateur
    const { data: userExtend } = await supabase
      .from("user_extend")
      .select("token")
      .eq("id", userId)
      .single();

    const { error: updateError } = await supabase
      .from("user_extend")
      .update({ token: (userExtend?.token || 0) + rewardAmount })
      .eq("id", userId);

    if (updateError) throw updateError;

    return rewardAmount;
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
  shopTokenApi,
  shopSubscriptionApi,
  weeklyRewardApi,
};
