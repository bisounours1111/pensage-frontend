import React from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import EditableCharacterCard from "../ui/EditableCharacterCard";
import colors from "../../utils/constants/colors";

const CharactersStep = ({
  pitch,
  synopsis,
  characters,
  setCharacters,
  loading,
  onGenerateCharacters,
  onNext,
  onPrevious,
}) => {
  const [error, setError] = React.useState(null);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newCharacter, setNewCharacter] = React.useState({
    nom: "",
    âge: "",
    personnalité: "",
    apparence: "",
    rôle: "",
  });

  const handleGenerate = async () => {
    setError(null);
    try {
      await onGenerateCharacters(pitch, synopsis);
    } catch (err) {
      setError(err.message);
    }
  };

  // Edition inline maintenant gérée via handleEditStart + formulaire global

  const handleEditStart = (index, data) => {
    setShowAddForm(true);
    setNewCharacter({
      nom: data.nom || "",
      âge: data.âge || "",
      personnalité: data.personnalité || "",
      apparence: data.apparence || "",
      rôle: data.rôle || data.histoire || "",
    });
    // Retirer temporairement l'élément pour éviter doublon pendant édition; il sera revalidé à l'ajout
    const cloned = [...characters];
    cloned.splice(index, 1);
    setCharacters(cloned);
  };

  const handleDeleteCharacter = (index) => {
    const cloned = [...characters];
    cloned.splice(index, 1);
    setCharacters(cloned);
  };

  const handleNext = () => {
    if (characters.length === 0) {
      setError("Vous devez générer au moins un personnage");
      return;
    }
    onNext();
  };

  const handleCreateCharacter = () => {
    setError(null);
    const trimmedName = (newCharacter.nom || "").trim();
    if (!trimmedName) {
      setError("Le nom du personnage est requis");
      return;
    }
    const created = {
      nom: trimmedName,
      âge: newCharacter.âge?.toString().trim() || "",
      personnalité: (newCharacter.personnalité || "").trim(),
      apparence: (newCharacter.apparence || "").trim(),
      rôle: (newCharacter.rôle || "").trim(),
    };
    setCharacters([...(characters || []), created]);
    setNewCharacter({
      nom: "",
      âge: "",
      personnalité: "",
      apparence: "",
      rôle: "",
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
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
          <p className="text-sm line-clamp-2" style={{ color: colors.white }}>
            {pitch}
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
          <p className="text-sm line-clamp-2" style={{ color: colors.white }}>
            {synopsis.substring(0, 100)}...
          </p>
        </div>
      </div>

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

      <div
        className="p-8 rounded-xl shadow-lg"
        style={{
          backgroundColor: colors.white,
          border: `4px solid ${colors.primaryLight}`,
        }}
      >
        <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
          Personnages de votre histoire
        </h2>
        <p className="mb-8 text-lg" style={{ color: colors.textSecondary }}>
          {loading
            ? "L'IA crée vos personnages..."
            : characters.length > 0
            ? `${characters.length} personnage${
                characters.length > 1 ? "s" : ""
              } principal${characters.length > 1 ? "aux" : ""} créé${
                characters.length > 1 ? "s" : ""
              }`
            : "Cliquez sur le bouton ci-dessous pour générer les personnages avec l'IA"}
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
            <div className="mb-4 flex justify-end">
              <button
                className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: colors.white,
                  color: colors.text,
                  border: `2px solid ${colors.primary}`,
                }}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? "Fermer le formulaire" : "Ajouter un personnage"}
              </button>
            </div>

            {showAddForm && (
              <div
                className="mb-6 p-4 rounded-xl border-2"
                style={{
                  borderColor: colors.primaryLight,
                  backgroundColor: colors.white,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-bold mb-1"
                      style={{ color: colors.primary }}
                    >
                      Nom *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: colors.primaryLight,
                        backgroundColor: colors.white,
                        color: colors.text,
                      }}
                      value={newCharacter.nom}
                      onChange={(e) =>
                        setNewCharacter({
                          ...newCharacter,
                          nom: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-bold mb-1"
                      style={{ color: colors.primary }}
                    >
                      Âge
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: colors.primaryLight,
                        backgroundColor: colors.white,
                        color: colors.text,
                      }}
                      value={newCharacter.âge}
                      onChange={(e) =>
                        setNewCharacter({
                          ...newCharacter,
                          âge: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm font-bold mb-1"
                      style={{ color: colors.primary }}
                    >
                      Personnalité
                    </label>
                    <textarea
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none"
                      style={{
                        borderColor: colors.primaryLight,
                        backgroundColor: colors.white,
                        color: colors.text,
                        minHeight: "80px",
                      }}
                      value={newCharacter.personnalité}
                      onChange={(e) =>
                        setNewCharacter({
                          ...newCharacter,
                          personnalité: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm font-bold mb-1"
                      style={{ color: colors.primary }}
                    >
                      Apparence
                    </label>
                    <textarea
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none"
                      style={{
                        borderColor: colors.primaryLight,
                        backgroundColor: colors.white,
                        color: colors.text,
                        minHeight: "80px",
                      }}
                      value={newCharacter.apparence}
                      onChange={(e) =>
                        setNewCharacter({
                          ...newCharacter,
                          apparence: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm font-bold mb-1"
                      style={{ color: colors.primary }}
                    >
                      Rôle dans l'histoire
                    </label>
                    <textarea
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none"
                      style={{
                        borderColor: colors.primaryLight,
                        backgroundColor: colors.white,
                        color: colors.text,
                        minHeight: "80px",
                      }}
                      value={newCharacter.rôle}
                      onChange={(e) =>
                        setNewCharacter({
                          ...newCharacter,
                          rôle: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 border-2"
                    style={{
                      backgroundColor: colors.white,
                      color: colors.primary,
                      borderColor: colors.primary,
                    }}
                    onClick={() => setShowAddForm(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105"
                    style={{ backgroundColor: colors.primary }}
                    onClick={handleCreateCharacter}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character, index) => (
                <EditableCharacterCard
                  key={character.id || index}
                  character={character}
                  onEdit={handleEditStart}
                  onDelete={handleDeleteCharacter}
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
                onClick={handleGenerate}
                disabled={loading}
              >
                Régénérer les personnages (5 tokens)
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-lg" style={{ color: colors.textSecondary }}>
              Aucun personnage pour le moment
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: colors.primary }}
                onClick={handleGenerate}
              >
                Générer avec l'IA (5 tokens)
              </button>
              <button
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: colors.white,
                  color: colors.text,
                  border: `2px solid ${colors.primary}`,
                }}
                onClick={() => setShowAddForm(true)}
              >
                Ajouter manuellement
              </button>
            </div>

            {showAddForm && (
              <div
                className="mt-4 p-4 rounded-xl border-2 text-left max-w-3xl mx-auto"
                style={{
                  borderColor: colors.primaryLight,
                  backgroundColor: colors.white,
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-bold mb-1"
                      style={{ color: colors.primary }}
                    >
                      Nom *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: colors.primaryLight,
                        backgroundColor: colors.white,
                        color: colors.text,
                      }}
                      value={newCharacter.nom}
                      onChange={(e) =>
                        setNewCharacter({
                          ...newCharacter,
                          nom: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-bold mb-1"
                      style={{ color: colors.primary }}
                    >
                      Âge
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: colors.primaryLight,
                        backgroundColor: colors.white,
                        color: colors.text,
                      }}
                      value={newCharacter.âge}
                      onChange={(e) =>
                        setNewCharacter({
                          ...newCharacter,
                          âge: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm font-bold mb-1"
                      style={{ color: colors.primary }}
                    >
                      Personnalité
                    </label>
                    <textarea
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none"
                      style={{
                        borderColor: colors.primaryLight,
                        backgroundColor: colors.white,
                        color: colors.text,
                        minHeight: "80px",
                      }}
                      value={newCharacter.personnalité}
                      onChange={(e) =>
                        setNewCharacter({
                          ...newCharacter,
                          personnalité: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm font-bold mb-1"
                      style={{ color: colors.primary }}
                    >
                      Apparence
                    </label>
                    <textarea
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none"
                      style={{
                        borderColor: colors.primaryLight,
                        backgroundColor: colors.white,
                        color: colors.text,
                        minHeight: "80px",
                      }}
                      value={newCharacter.apparence}
                      onChange={(e) =>
                        setNewCharacter({
                          ...newCharacter,
                          apparence: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm font-bold mb-1"
                      style={{ color: colors.primary }}
                    >
                      Rôle dans l'histoire
                    </label>
                    <textarea
                      className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none"
                      style={{
                        borderColor: colors.primaryLight,
                        backgroundColor: colors.white,
                        color: colors.text,
                        minHeight: "80px",
                      }}
                      value={newCharacter.rôle}
                      onChange={(e) =>
                        setNewCharacter({
                          ...newCharacter,
                          rôle: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 border-2"
                    style={{
                      backgroundColor: colors.white,
                      color: colors.primary,
                      borderColor: colors.primary,
                    }}
                    onClick={() => setShowAddForm(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105"
                    style={{ backgroundColor: colors.primary }}
                    onClick={handleCreateCharacter}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
          style={{
            backgroundColor: colors.white,
            color: colors.primary,
            border: `4px solid ${colors.primary}`,
          }}
          onClick={onPrevious}
        >
          <span className="inline-flex items-center gap-2">
            <MdArrowBack /> Retour
          </span>
        </button>
        <button
          className="flex-1 px-8 py-4 rounded-xl font-bold text-lg text-white transition-all hover:scale-105 disabled:opacity-50 shadow-lg"
          style={{
            backgroundColor: colors.primary,
            border: `4px solid ${colors.primary}`,
          }}
          onClick={handleNext}
          disabled={characters.length === 0 || loading}
        >
          <span className="inline-flex items-center gap-2">
            Finaliser <MdArrowForward />
          </span>
        </button>
      </div>
    </div>
  );
};

export default CharactersStep;
