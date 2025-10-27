import { createClient } from '@supabase/supabase-js';

// Variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variables d\'environnement Supabase manquantes. Vérifiez votre fichier .env'
  );
}

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Récupère l'utilisateur connecté
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
  
  return user;
};

/**
 * Récupère les données étendues de l'utilisateur
 */
export const getUserExtend = async (userId) => {
  const { data, error } = await supabase
    .from('user_extend')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
  
  return data;
};

/**
 * Récupère l'utilisateur complet (auth + user_extend)
 */
export const getFullUser = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }
  
  const userExtend = await getUserExtend(user.id);
  
  return {
    ...user,
    ...userExtend
  };
};

/**
 * Inscription d'un nouvel utilisateur
 */
export const signUp = async (email, password, userData) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: userData.username,
        name: userData.name,
        lastname: userData.lastname
      }
    }
  });

  if (authError) {
    throw authError;
  }

  // Créer l'entrée dans user_extend
  if (authData.user) {
    const { error: userExtendError } = await supabase
      .from('user_extend')
      .insert({
        id: authData.user.id,
        username: userData.username,
        name: userData.name,
        lastname: userData.lastname,
        preferences: userData.preferences || {},
        token: 0,
        age: userData.age,
        has_subscription: false,
        xp: 0
      });

    if (userExtendError) {
      console.error('Erreur lors de la création de user_extend:', userExtendError);
    }
  }

  return authData;
};

/**
 * Connexion d'un utilisateur
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Déconnexion de l'utilisateur
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw error;
  }
  
  return true;
};

/**
 * Écoute les changements d'authentification
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

export default supabase;

