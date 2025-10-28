import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../../components/ui/Stepper";
import colors from "../../utils/constants/colors";
import storyApi from "../../utils/api/storyApi";
import { webnovelsApi } from "../../lib/supabaseApi";
import { getCurrentUser } from "../../lib/supabase";

// Import des composants d'étapes
import PitchStep from "../../components/create/PitchStep";
import SynopsisStep from "../../components/create/SynopsisStep";
import CharactersStep from "../../components/create/CharactersStep";
import TitleGenreStep from "../../components/create/TitleGenreStep";
import FinalizationStep from "../../components/create/FinalizationStep";

const CreateStoryPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // État pour l'étape 1 : Pitch
  const [pitch, setPitch] = useState("");

  // État pour l'étape 2 : Synopsis
  const [synopsis, setSynopsis] = useState("");

  // État pour l'étape 3 : Personnages
  const [characters, setCharacters] = useState([]);

  // État pour l'étape 4 : Titre et Genre
  const [storyTitle, setStoryTitle] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const steps = [
    { title: "Pitch" },
    { title: "Synopsis" },
    { title: "Personnages" },
    { title: "Titre & Genre" },
    { title: "Finalisation" },
  ];

  // ==================== GESTION DES PITCHS ====================
  const handleGeneratePitch = async (userRequest) => {
    setLoading(true);
    setError(null);

    try {
      const result = await storyApi.generatePitch(userRequest);
      const pitchText = result.pitchs;

      // Parser les pitchs depuis la réponse
      const pitchArray = parsePitchOptions(pitchText);

      return pitchArray;
    } finally {
      setLoading(false);
    }
  };

  const parsePitchOptions = (text) => {
    if (!text || typeof text !== "string") return [];

    const cleanText = text.trim();
    let paragraphs = cleanText
      .split(/\n\n+/)
      .map((p) => p.trim().replace(/^\d+\.\s*/, ""))
      .filter((p) => p.length > 20);

    if (paragraphs.length >= 5) {
      return paragraphs.slice(0, 5);
    }

    const doubleLinePitches = [];
    const lines = cleanText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l);

    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].length < 200 && lines[i + 1] && lines[i + 1].length < 200) {
        const combined = (lines[i] + " " + lines[i + 1])
          .replace(/^\d+\.\s*/, "")
          .trim();
        if (combined.length > 20) {
          doubleLinePitches.push(combined);
          i++;
        }
      }
    }

    if (doubleLinePitches.length >= 5) {
      return doubleLinePitches.slice(0, 5);
    }

    if (paragraphs.length > 0) {
      return paragraphs.slice(0, Math.min(5, paragraphs.length));
    }

    return [];
  };

  // ==================== GESTION DU SYNOPSIS ====================
  const handleGenerateSynopsis = async (pitchText) => {
    setLoading(true);
    setError(null);

    try {
      const result = await storyApi.generateSynopsis(pitchText);
      setSynopsis(result.synopsis);
    } finally {
      setLoading(false);
    }
  };

  // ==================== GESTION DES PERSONNAGES ====================
  const handleGenerateCharacters = async (pitchText, synopsisText) => {
    setLoading(true);
    setError(null);

    try {
      const result = await storyApi.generateCharacters(pitchText, synopsisText);
      const charactersList = result.characters || [];

      const charactersWithIds = charactersList.map((character, index) => ({
        ...character,
        id: index + 1
      }));

      setCharacters(charactersWithIds);
    } finally {
      setLoading(false);
    }
  };

  // ==================== NAVIGATION ====================
  const handleNext = () => {
    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setError(null);
      setCurrentStep(currentStep - 1);
    }
  };

  // ==================== FINALISATION ====================
  const handleFinalize = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer l'utilisateur connecté
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour créer une histoire");
      }

      // Préparer les données pour Supabase
      const webnovelData = {
        id_author: user.id,
        title: storyTitle,
        pitch: pitch,
        synopsis: synopsis,
        characters: characters,
        genre: selectedGenre,
        publish: false,
        is_over: false
      };

      // Sauvegarder dans Supabase
      const savedStory = await webnovelsApi.create(webnovelData);

      // Naviguer vers la page des épisodes avec l'ID de l'histoire
      navigate(`/episodes/${savedStory.id}`);
    } catch (err) {
      console.error("Erreur lors de la finalisation:", err);
      setError(err.message || "Erreur lors de la sauvegarde de l'histoire");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b"
      style={{
        background: `linear-gradient(to bottom, ${colors.bgGradientFrom}, ${colors.bgGradientVia}, ${colors.bgGradientTo})`,
      }}
    >
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            Créer une Nouvelle Histoire
          </h1>
          <p className="text-lg" style={{ color: colors.textSecondary }}>
            Laissez l'IA vous guider dans la création de votre webtoon
          </p>
        </header>

        {/* Stepper */}
        <Stepper steps={steps} currentStep={currentStep} />

        {/* Affichage des erreurs globaux */}
        {error && (
          <div
            className="mt-6 p-4 rounded-lg"
            style={{
              backgroundColor: "#FEE2E2",
              color: "#991B1B",
              border: "1px solid #FCA5A5",
            }}
          >
            {error}
          </div>
        )}

        {/* Contenu des étapes */}
        <div className="mt-12">
          {currentStep === 1 && (
            <PitchStep
              pitch={pitch}
              setPitch={setPitch}
              loading={loading}
              onGeneratePitch={handleGeneratePitch}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <SynopsisStep
              pitch={pitch}
              synopsis={synopsis}
              setSynopsis={setSynopsis}
              loading={loading}
              onGenerateSynopsis={() => handleGenerateSynopsis(pitch)}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 3 && (
            <CharactersStep
              pitch={pitch}
              synopsis={synopsis}
              characters={characters}
              setCharacters={setCharacters}
              loading={loading}
              onGenerateCharacters={handleGenerateCharacters}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 4 && (
            <TitleGenreStep
              pitch={pitch}
              synopsis={synopsis}
              storyTitle={storyTitle}
              setStoryTitle={setStoryTitle}
              selectedGenre={selectedGenre}
              setSelectedGenre={setSelectedGenre}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 5 && (
            <FinalizationStep
              pitch={pitch}
              synopsis={synopsis}
              characters={characters}
              storyTitle={storyTitle}
              selectedGenre={selectedGenre}
              onPrevious={handlePrevious}
              onFinalize={handleFinalize}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStoryPage;
