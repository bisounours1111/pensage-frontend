const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const storyApi = {
  // Générer 5 idées de pitch
  generatePitch: async (userRequest) => {
    const response = await fetch(`${API_BASE_URL}/ia/generate_pitch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_request: userRequest }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Erreur lors de la génération du pitch");
    }

    return response.json();
  },

  // Générer un synopsis
  generateSynopsis: async (pitch) => {
    const response = await fetch(`${API_BASE_URL}/ia/generate_synopsis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pitch }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || "Erreur lors de la génération du synopsis"
      );
    }

    return response.json();
  },

  // Générer les personnages
  generateCharacters: async (pitch, synopsis) => {
    const response = await fetch(`${API_BASE_URL}/ia/generate_characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pitch, synopsis }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || "Erreur lors de la génération des personnages"
      );
    }

    return response.json();
  },

  // Générer un épisode
  generateEpisode: async (
    pitch,
    synopsis,
    personnages,
    numero = 1,
    episodes_precedents = []
  ) => {
    const response = await fetch(`${API_BASE_URL}/ia/generate_episode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pitch,
        synopsis,
        personnages,
        numero,
        episodes_precedents,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || "Erreur lors de la génération de l'épisode"
      );
    }

    return response.json();
  },

  // Corriger les fautes d'orthographe et de grammaire
  fixText: async (text) => {
    const response = await fetch(`${API_BASE_URL}/ia/fix_text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Erreur lors de la correction du texte");
    }

    return response.json();
  },

  // Reformuler un texte
  rephraseText: async (text_complete, text_to_reformulate) => {
    const response = await fetch(`${API_BASE_URL}/ia/rephrase_text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text_complete, text_to_reformulate }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.detail || "Erreur lors de la reformulation du texte"
      );
    }

    return response.json();
  },
};

export default storyApi;
