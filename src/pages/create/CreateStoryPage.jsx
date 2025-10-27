import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Stepper from "../../components/ui/Stepper";
import EditableCharacterCard from "../../components/ui/EditableCharacterCard";
import TextEditor from "../../components/ui/TextEditor";
import colors from "../../utils/constants/colors";
import storyApi from "../../utils/api/storyApi";

const CreateStoryPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // État pour l'étape 1 : Pitch
  const [userRequest, setUserRequest] = useState("");
  const [pitchOptions, setPitchOptions] = useState([]);
  const [selectedPitch, setSelectedPitch] = useState(null);

  // État pour l'étape 2 : Synopsis
  const [synopsis, setSynopsis] = useState("");

  // État pour l'étape 3 : Personnages
  const [characters, setCharacters] = useState([]);

  const steps = [
    { title: "Pitch" },
    { title: "Synopsis" },
    { title: "Personnages" },
    { title: "Finalisation" },
  ];

  // ==================== ÉTAPE 1 : PITCH ====================
  const handleGeneratePitch = async () => {
    if (!userRequest.trim()) {
      setError("Veuillez entrer une description pour votre histoire");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await storyApi.generatePitch(userRequest);

      // Parser les 5 pitchs depuis la réponse
      const pitchText = result.pitchs;
      console.log("Réponse brute de l'IA:", pitchText);

      const pitchArray = parsePitchOptions(pitchText);
      console.log("Pitchs parsés:", pitchArray);

      if (pitchArray.length === 0) {
        setError("Aucun pitch n'a pu être extrait. Veuillez réessayer.");
      } else {
        setPitchOptions(pitchArray);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parsePitchOptions = (text) => {
    if (!text || typeof text !== "string") {
      console.error("Texte invalide pour le parsing:", text);
      return [];
    }

    // Nettoyer le texte
    const cleanText = text.trim();

    // Méthode 1: Séparer par double saut de ligne
    let paragraphs = cleanText
      .split(/\n\n+/)
      .map((p) => p.trim().replace(/^\d+\.\s*/, "")) // Enlever les numéros au début
      .filter((p) => p.length > 20); // Filtrer les paragraphes trop courts

    console.log(
      "Méthode 1 - Paragraphes détectés:",
      paragraphs.length,
      paragraphs
    );

    // Si on a 5 paragraphes ou plus, on retourne les 5 premiers
    if (paragraphs.length >= 5) {
      return paragraphs.slice(0, 5);
    }

    // Méthode 2: Chercher des patterns de séparation
    // Parfois les pitchs sont sur 2 lignes (titre + description)
    const doubleLinePitches = [];
    const lines = cleanText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l);

    for (let i = 0; i < lines.length - 1; i++) {
      // Si une ligne fait moins de 150 caractères et la suivante aussi,
      // les combiner pour former un pitch
      if (lines[i].length < 200 && lines[i + 1] && lines[i + 1].length < 200) {
        const combined = (lines[i] + " " + lines[i + 1])
          .replace(/^\d+\.\s*/, "")
          .trim();
        if (combined.length > 20) {
          doubleLinePitches.push(combined);
          i++; // Sauter la ligne suivante
        }
      }
    }

    console.log(
      "Méthode 2 - Pitchs combinés:",
      doubleLinePitches.length,
      doubleLinePitches
    );

    if (doubleLinePitches.length >= 5) {
      return doubleLinePitches.slice(0, 5);
    }

    // Méthode 3: Si vraiment on ne trouve rien, découper en blocs de taille similaire
    if (paragraphs.length > 0) {
      return paragraphs.slice(0, Math.min(5, paragraphs.length));
    }

    // Dernier recours: retourner le texte brut découpé intelligemment
    const sentences = cleanText.split(/(?<=[.!?])\s+/);
    const chunks = [];
    let currentChunk = "";

    sentences.forEach((sentence) => {
      if (currentChunk.length + sentence.length < 300) {
        currentChunk += (currentChunk ? " " : "") + sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence;
      }
    });

    if (currentChunk) chunks.push(currentChunk);

    console.log("Méthode 3 - Chunks créés:", chunks.length, chunks);
    return chunks.slice(0, 5);
  };

  const handleSelectPitch = (pitch) => {
    console.log("Pitch sélectionné:", pitch);
    setSelectedPitch(pitch);
    setError(null); // Effacer les erreurs quand on sélectionne
  };

  const handlePitchNext = () => {
    console.log(
      "Tentative de passage à l'étape suivante. Pitch sélectionné:",
      selectedPitch
    );

    if (!selectedPitch) {
      setError("Veuillez sélectionner un pitch");
      return;
    }

    setError(null);
    setCurrentStep(2);
    console.log("Passage à l'étape 2 - Synopsis");

    // NE PAS générer automatiquement - l'utilisateur décidera
  };

  // ==================== ÉTAPE 2 : SYNOPSIS ====================
  const handleGenerateSynopsis = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await storyApi.generateSynopsis(selectedPitch);
      setSynopsis(result.synopsis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSynopsisNext = () => {
    if (!synopsis.trim()) {
      setError("Le synopsis ne peut pas être vide");
      return;
    }
    setError(null);
    setCurrentStep(3);

    // NE PAS générer automatiquement - l'utilisateur décidera
  };

  // ==================== ÉTAPE 3 : PERSONNAGES ====================
  const handleGenerateCharacters = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await storyApi.generateCharacters(selectedPitch, synopsis);
      const parsedCharacters = parseCharacters(result.characters);
      setCharacters(parsedCharacters);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseCharacters = (text) => {
    // Essayer d'abord de séparer par double saut de ligne (paragraphes)
    let characterBlocks = text
      .split(/\n\n+/)
      .map((block) => block.trim())
      .filter((block) => block.length > 0);

    // Si on n'a pas au moins 3 blocs, essayer de séparer par numéros
    if (characterBlocks.length < 3) {
      characterBlocks = text
        .split(/(?:^|\n)\s*\d+\.\s+/)
        .filter((block) => block.trim());
    }

    return characterBlocks.map((block, index) => {
      const lines = block.split("\n").filter((line) => line.trim());
      const character = { id: index + 1 };

      // Variables pour stocker les valeurs
      let currentKey = null;

      lines.forEach((line) => {
        const cleanLine = line.replace(/^\*\*|\*\*$/g, "").trim();

        // Détecter les clés avec deux points
        const keyMatch = cleanLine.match(/^([^:]+):\s*(.+)$/);

        if (keyMatch) {
          const key = keyMatch[1].toLowerCase().trim();
          const value = keyMatch[2].trim();

          if (key.includes("nom")) {
            character.nom = value;
            currentKey = "nom";
          } else if (key.includes("âge") || key.includes("age")) {
            character.âge = value;
            currentKey = "âge";
          } else if (
            key.includes("personnalité") ||
            key.includes("personnalite")
          ) {
            character.personnalité = value;
            currentKey = "personnalité";
          } else if (key.includes("apparence")) {
            character.apparence = value;
            currentKey = "apparence";
          } else if (
            key.includes("histoire") ||
            key.includes("background") ||
            key.includes("rôle") ||
            key.includes("role")
          ) {
            character.histoire = value;
            currentKey = "histoire";
          }
        } else if (currentKey && cleanLine) {
          // Continuer la valeur de la clé précédente sur plusieurs lignes
          character[currentKey] =
            (character[currentKey] || "") + " " + cleanLine;
        } else if (!character.nom && cleanLine && index === 0) {
          // Si c'est la première ligne et qu'on n'a pas encore de nom
          character.nom = cleanLine;
        }
      });

      // Si pas de nom trouvé, utiliser un nom par défaut
      if (!character.nom) {
        character.nom = `Personnage ${index + 1}`;
      }

      return character;
    });
  };

  const handleCharactersNext = () => {
    if (characters.length === 0) {
      setError("Vous devez générer au moins un personnage");
      return;
    }
    setCurrentStep(4);
  };

  const handleUpdateCharacter = (index, updatedCharacter) => {
    const newCharacters = [...characters];
    newCharacters[index] = updatedCharacter;
    setCharacters(newCharacters);
  };

  // ==================== ÉTAPE 4 : FINALISATION ====================
  const handleFinalize = () => {
    // TODO: Sauvegarder l'histoire dans la base de données
    // Puis rediriger vers la page des épisodes
    navigate("/episodes", {
      state: {
        pitch: selectedPitch,
        synopsis,
        characters,
      },
    });
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
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

        {/* Contenu des étapes */}
        <div className="mt-12">
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

          {/* ÉTAPE 1 : PITCH */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div
                className="p-10 rounded-2xl shadow-2xl"
                style={{
                  backgroundColor: colors.white,
                  border: `4px solid ${colors.primary}`,
                }}
              >
                <div className="text-center mb-8">
                  <h2
                    className="text-4xl font-bold mb-4"
                    style={{ color: colors.text }}
                  >
                    Décrivez votre histoire
                  </h2>
                  <p
                    className="text-xl"
                    style={{ color: colors.textSecondary }}
                  >
                    Donnez-nous une idée de base et l'IA créera 5 pitchs uniques
                    pour vous
                  </p>
                </div>

                <textarea
                  className="w-full p-6 rounded-xl border-3 resize-none focus:outline-none focus:ring-4 text-lg"
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: colors.white,
                    color: colors.text,
                    minHeight: "180px",
                    borderWidth: "3px",
                  }}
                  placeholder="Ex: Une jeune fille découvre qu'elle a des pouvoirs magiques et doit sauver son monde..."
                  value={userRequest}
                  onChange={(e) => setUserRequest(e.target.value)}
                  disabled={loading}
                />

                <button
                  className="mt-6 w-full px-8 py-5 rounded-xl font-bold text-xl text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                  style={{ backgroundColor: colors.primary }}
                  onClick={handleGeneratePitch}
                  disabled={loading || !userRequest.trim()}
                >
                  {loading
                    ? "Génération en cours..."
                    : "Générer 5 pitchs avec l'IA"}
                </button>

                {/* Indicateur de chargement */}
                {loading && (
                  <div className="mt-8 flex flex-col justify-center items-center py-8">
                    <div
                      className="animate-spin rounded-full h-16 w-16 border-4 mb-4"
                      style={{
                        borderColor: colors.primaryLight,
                        borderTopColor: colors.primary,
                      }}
                    />
                    <p
                      className="text-xl font-semibold"
                      style={{ color: colors.primary }}
                    >
                      L'IA génère vos pitchs...
                    </p>
                    <p
                      className="text-sm mt-2"
                      style={{ color: colors.textSecondary }}
                    >
                      Cela peut prendre quelques secondes
                    </p>
                  </div>
                )}
              </div>

              {/* Affichage des options de pitch */}
              {pitchOptions.length > 0 && !loading && (
                <div className="space-y-6">
                  {/* Message de succès */}
                  <div
                    className="p-6 rounded-xl border-3 text-center shadow-lg"
                    style={{
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                      borderWidth: "4px",
                      color: colors.white,
                    }}
                  >
                    <p
                      className="font-bold text-2xl"
                      style={{ color: colors.white }}
                    >
                      {pitchOptions.length} pitchs générés avec succès
                    </p>
                    <p className="mt-2 text-lg" style={{ color: colors.white }}>
                      Sélectionnez votre préféré pour continuer
                    </p>
                  </div>

                  <h3
                    className="text-3xl font-bold text-center"
                    style={{ color: colors.text }}
                  >
                    Choisissez votre pitch
                  </h3>

                  <div className="grid grid-cols-1 gap-5">
                    {pitchOptions.map((pitch, index) => (
                      <div
                        key={index}
                        className={`p-8 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl ${
                          selectedPitch === pitch
                            ? "ring-4 shadow-2xl"
                            : "shadow-lg"
                        }`}
                        style={{
                          backgroundColor:
                            selectedPitch === pitch
                              ? colors.primary
                              : colors.white,
                          border: `4px solid ${
                            selectedPitch === pitch
                              ? colors.primary
                              : colors.primaryLight
                          }`,
                          ringColor: colors.primary,
                          color: selectedPitch === pitch ? colors.white : colors.text,
                        }}
                        onClick={() => handleSelectPitch(pitch)}
                      >
                        <div className="flex items-start gap-6">
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-2xl shadow-lg"
                            style={{
                              backgroundColor: colors.white,
                              color: colors.primary,
                              border: `3px solid ${colors.white}`,
                            }}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-lg leading-relaxed"
                            >
                              {pitch}
                            </p>
                            {selectedPitch === pitch && (
                              <div className="mt-4">
                                <span
                                  className="font-bold text-sm px-3 py-1 rounded-full"
                                  style={{
                                    color: colors.primary,
                                    backgroundColor: colors.white,
                                  }}
                                >
                                  SÉLECTIONNÉ
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="w-full px-8 py-6 rounded-xl font-bold text-xl text-white transition-all hover:scale-105 disabled:opacity-50 shadow-xl"
                    style={{ backgroundColor: colors.primary }}
                    onClick={handlePitchNext}
                    disabled={!selectedPitch}
                  >
                    {selectedPitch
                      ? "Continuer avec ce pitch →"
                      : "Sélectionnez un pitch pour continuer"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ÉTAPE 2 : SYNOPSIS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Carte avec le pitch sélectionné */}
              <div
                className="p-6 rounded-xl shadow-lg"
                style={{
                  backgroundColor: colors.primary,
                  border: `4px solid ${colors.primary}`,
                  color: colors.white,
                }}
              >
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: colors.white }}
                >
                  Pitch sélectionné
                </h3>
                <p style={{ color: colors.white }}>{selectedPitch}</p>
              </div>

              {/* Synopsis */}
              <div
                className="p-8 rounded-xl shadow-lg"
                style={{ 
                  backgroundColor: colors.white,
                  border: `4px solid ${colors.primaryLight}`
                }}
              >
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ color: colors.text }}
                >
                  Synopsis de votre histoire
                </h2>
                <p
                  className="mb-6 text-lg"
                  style={{ color: colors.textSecondary }}
                >
                  {loading
                    ? "Génération du synopsis par l'IA en cours..."
                    : synopsis.trim()
                    ? "Le synopsis détaillé de votre histoire. Sélectionnez du texte pour corriger ou reformuler."
                    : "Cliquez sur le bouton ci-dessous pour générer un synopsis avec l'IA."}
                </p>

                {loading ? (
                  <div className="flex flex-col justify-center items-center py-16">
                    <div
                      className="animate-spin rounded-full h-16 w-16 border-4 mb-4"
                      style={{
                        borderColor: colors.primaryLight,
                        borderTopColor: colors.primary,
                      }}
                    />
                    <p
                      className="text-lg font-semibold"
                      style={{ color: colors.primary }}
                    >
                      L'IA rédige votre synopsis...
                    </p>
                  </div>
                ) : synopsis.trim() ? (
                  <TextEditor
                    text={synopsis}
                    onTextChange={setSynopsis}
                    placeholder="Votre synopsis..."
                  />
                ) : (
                  <div className="text-center py-12">
                    <p
                      className="mb-6 text-lg"
                      style={{ color: colors.textSecondary }}
                    >
                      Aucun synopsis généré pour le moment
                    </p>
                    <button
                      className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 shadow-lg"
                      style={{ backgroundColor: colors.primary }}
                      onClick={handleGenerateSynopsis}
                    >
                      Générer le synopsis avec l'IA
                    </button>
                  </div>
                )}
              </div>

              {/* Boutons de navigation */}
              <div className="flex gap-4">
                <button
                  className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
                  style={{
                    backgroundColor: colors.white,
                    color: colors.primary,
                    border: `4px solid ${colors.primary}`,
                  }}
                  onClick={handlePrevious}
                >
                  ← Retour
                </button>
                <button
                  className="flex-1 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 disabled:opacity-50 shadow-lg"
                  style={{ 
                    backgroundColor: colors.primary,
                    border: `4px solid ${colors.primary}`
                  }}
                  onClick={handleSynopsisNext}
                  disabled={!synopsis.trim() || loading}
                >
                  Continuer vers les personnages →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : PERSONNAGES */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Récapitulatif Pitch + Synopsis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-xl shadow-lg"
                  style={{
                    backgroundColor: colors.primary,
                    border: `4px solid ${colors.primary}`,
                    color: colors.white,
                  }}
                >
                  <h3
                    className="text-sm font-bold mb-2"
                    style={{ color: colors.white }}
                  >
                    Pitch
                  </h3>
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: colors.white }}
                  >
                    {selectedPitch}
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl shadow-lg"
                  style={{
                    backgroundColor: colors.primary,
                    border: `4px solid ${colors.primary}`,
                    color: colors.white,
                  }}
                >
                  <h3
                    className="text-sm font-bold mb-2"
                    style={{ color: colors.white }}
                  >
                    Synopsis
                  </h3>
                  <p
                    className="text-sm line-clamp-2"
                    style={{ color: colors.white }}
                  >
                    {synopsis.substring(0, 100)}...
                  </p>
                </div>
              </div>

              {/* Personnages */}
              <div
                className="p-8 rounded-xl shadow-lg"
                style={{ 
                  backgroundColor: colors.white,
                  border: `4px solid ${colors.primaryLight}`
                }}
              >
                <h2
                  className="text-3xl font-bold mb-4"
                  style={{ color: colors.text }}
                >
                  Personnages de votre histoire
                </h2>
                <p
                  className="mb-8 text-lg"
                  style={{ color: colors.textSecondary }}
                >
                  {loading
                    ? "L'IA crée vos personnages..."
                    : characters.length > 0
                    ? `${characters.length} personnage${
                        characters.length > 1 ? "s" : ""
                      } principal${characters.length > 1 ? "aux" : ""} créé${
                        characters.length > 1 ? "s" : ""
                      }`
                    : "Cliquez sur le bouton ci-dessous pour générer les personnages avec l'IA."}
                </p>

                {loading ? (
                  <div className="flex flex-col justify-center items-center py-16">
                    <div
                      className="animate-spin rounded-full h-16 w-16 border-4 mb-4"
                      style={{
                        borderColor: colors.primaryLight,
                        borderTopColor: colors.primary,
                      }}
                    />
                    <p
                      className="text-lg font-semibold"
                      style={{ color: colors.primary }}
                    >
                      L'IA crée vos personnages...
                    </p>
                  </div>
                ) : characters.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {characters.map((character, index) => (
                        <EditableCharacterCard
                          key={character.id || index}
                          character={character}
                          onUpdate={(updated) =>
                            handleUpdateCharacter(index, updated)
                          }
                          index={index}
                        />
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <button
                        className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                        style={{
                          backgroundColor: colors.primaryLight,
                          color: colors.white,
                        }}
                        onClick={handleGenerateCharacters}
                        disabled={loading}
                      >
                        Régénérer les personnages
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p
                      className="mb-6 text-lg"
                      style={{ color: colors.textSecondary }}
                    >
                      Aucun personnage généré pour le moment
                    </p>
                    <button
                      className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 shadow-lg"
                      style={{ backgroundColor: colors.primary }}
                      onClick={handleGenerateCharacters}
                    >
                      Générer les personnages avec l'IA
                    </button>
                  </div>
                )}
              </div>

              {/* Boutons de navigation */}
              <div className="flex gap-4">
                <button
                  className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
                  style={{
                    backgroundColor: colors.white,
                    color: colors.primary,
                    border: `4px solid ${colors.primary}`,
                  }}
                  onClick={handlePrevious}
                >
                  ← Retour
                </button>
                <button
                  className="flex-1 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 disabled:opacity-50 shadow-lg"
                  style={{ 
                    backgroundColor: colors.primary,
                    border: `4px solid ${colors.primary}`
                  }}
                  onClick={handleCharactersNext}
                  disabled={characters.length === 0 || loading}
                >
                  Finaliser →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : FINALISATION */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div
                className="p-8 rounded-xl shadow-lg text-center"
                style={{ 
                  backgroundColor: colors.white,
                  border: `4px solid ${colors.primary}`
                }}
              >
                <div className="mb-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl font-bold"
                    style={{ backgroundColor: colors.primary }}
                  >
                    ✓
                  </div>
                  <h2
                    className="text-3xl font-bold mb-4"
                    style={{ color: colors.text }}
                  >
                    Votre histoire est prête !
                  </h2>
                  <p
                    className="text-lg mb-8"
                    style={{ color: colors.textSecondary }}
                  >
                    Vous pouvez maintenant commencer à créer vos épisodes
                  </p>
                </div>

                {/* Récapitulatif */}
                <div className="text-left space-y-6 mb-8">
                  <div
                    className="p-6 rounded-lg border-4"
                    style={{ 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                      color: colors.white
                    }}
                  >
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: colors.white }}
                    >
                      Pitch
                    </h3>
                    <p style={{ color: colors.white }}>{selectedPitch}</p>
                  </div>

                  <div
                    className="p-6 rounded-lg border-4"
                    style={{ 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                      color: colors.white
                    }}
                  >
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: colors.white }}
                    >
                      Synopsis
                    </h3>
                    <p
                      className="whitespace-pre-wrap"
                      style={{ color: colors.white }}
                    >
                      {synopsis.substring(0, 200)}...
                    </p>
                  </div>

                  <div
                    className="p-6 rounded-lg border-4"
                    style={{ 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                      color: colors.white
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
                </div>

                {/* Boutons */}
                <div className="flex gap-4">
                  <button
                    className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 border-4"
                    style={{
                      backgroundColor: colors.white,
                      color: colors.primary,
                      borderColor: colors.primary,
                    }}
                    onClick={handlePrevious}
                  >
                    ← Retour
                  </button>
                  <button
                    className="flex-1 px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:scale-105 border-4"
                    style={{ 
                      backgroundColor: colors.primary,
                      borderColor: colors.primary
                    }}
                    onClick={handleFinalize}
                  >
                    Créer mes épisodes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStoryPage;
