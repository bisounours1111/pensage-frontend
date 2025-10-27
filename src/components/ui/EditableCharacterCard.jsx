import React, { useState } from "react";
import colors from "../../utils/constants/colors";

const EditableCharacterCard = ({ character, onUpdate, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Normaliser le personnage pour utiliser "rôle" au lieu de "histoire"
  const normalizedCharacter = {
    ...character,
    rôle: character.rôle || character.histoire || ""
  };
  
  const [editedCharacter, setEditedCharacter] = useState(normalizedCharacter);

  const handleSave = () => {
    onUpdate(editedCharacter);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCharacter({ ...normalizedCharacter });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedCharacter({ ...editedCharacter, [field]: value });
  };

  if (isEditing) {
    return (
      <div
        className="rounded-xl p-6 shadow-lg"
        style={{
          backgroundColor: colors.primaryVeryLight,
          border: `4px solid ${colors.primary}`,
        }}
      >
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-bold mb-2"
            style={{ color: colors.primary }}
          >
            Nom
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
            style={{
              borderColor: colors.primary,
              backgroundColor: colors.white,
              color: colors.text,
            }}
              value={editedCharacter.nom || ""}
              onChange={(e) => handleChange("nom", e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-sm font-bold mb-2"
              style={{ color: colors.primary }}
            >
              Âge
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.primary,
                backgroundColor: colors.white,
                color: colors.text,
              }}
              value={editedCharacter.âge || ""}
              onChange={(e) => handleChange("âge", e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-sm font-bold mb-2"
              style={{ color: colors.primary }}
            >
              Personnalité
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none"
              style={{
                borderColor: colors.primary,
                backgroundColor: colors.white,
                color: colors.text,
                minHeight: "80px",
              }}
              value={editedCharacter.personnalité || ""}
              onChange={(e) => handleChange("personnalité", e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-sm font-bold mb-2"
              style={{ color: colors.primary }}
            >
              Apparence
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none"
              style={{
                borderColor: colors.primary,
                backgroundColor: colors.white,
                color: colors.text,
                minHeight: "80px",
              }}
              value={editedCharacter.apparence || ""}
              onChange={(e) => handleChange("apparence", e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-sm font-bold mb-2"
              style={{ color: colors.primary }}
            >
              Rôle dans l'histoire
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 resize-none"
              style={{
                borderColor: colors.primary,
                backgroundColor: colors.white,
                color: colors.text,
                minHeight: "80px",
              }}
              value={editedCharacter.rôle || editedCharacter.histoire || ""}
              onChange={(e) => handleChange("rôle", e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: colors.primary }}
              onClick={handleSave}
            >
              Enregistrer
            </button>
            <button
              className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 border-2"
              style={{
                backgroundColor: colors.white,
                color: colors.primary,
                borderColor: colors.primary,
              }}
              onClick={handleCancel}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6 shadow-lg transition-transform hover:scale-105"
      style={{
        backgroundColor: colors.white,
        border: `4px solid ${colors.primaryLight}`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
            }}
          >
            {normalizedCharacter.nom?.charAt(0).toUpperCase() || index + 1}
          </div>
          <div>
            <h3 className="text-xl font-bold" style={{ color: colors.text }}>
              {normalizedCharacter.nom || `Personnage ${index + 1}`}
            </h3>
            {normalizedCharacter.âge && (
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                {normalizedCharacter.âge}
              </p>
            )}
          </div>
        </div>
        <button
          className="px-3 py-1 rounded-lg text-sm font-semibold transition-all hover:scale-105 border-2"
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
            borderColor: colors.primary,
          }}
          onClick={() => setIsEditing(true)}
        >
          Modifier
        </button>
      </div>

      <div className="space-y-3">
        {normalizedCharacter.personnalité && (
          <div>
            <span className="font-semibold" style={{ color: colors.primary }}>
              Personnalité:{" "}
            </span>
            <span style={{ color: colors.text }}>{normalizedCharacter.personnalité}</span>
          </div>
        )}

        {normalizedCharacter.apparence && (
          <div>
            <span className="font-semibold" style={{ color: colors.primary }}>
              Apparence:{" "}
            </span>
            <span style={{ color: colors.text }}>{normalizedCharacter.apparence}</span>
          </div>
        )}

        {normalizedCharacter.rôle && (
          <div>
            <span className="font-semibold" style={{ color: colors.primary }}>
              Rôle:{" "}
            </span>
            <span style={{ color: colors.text }}>{normalizedCharacter.rôle}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableCharacterCard;
