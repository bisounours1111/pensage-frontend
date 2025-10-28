import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import colors from "../../utils/constants/colors";

const EditableCharacterCard = ({ character, index, onEdit, onDelete }) => {
  // Normaliser le personnage pour utiliser "rôle" au lieu de "histoire"
  const normalizedCharacter = {
    ...character,
    rôle: character.rôle || character.histoire || "",
  };
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
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-lg text-sm font-semibold transition-all hover:scale-105 border-2"
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
              borderColor: colors.primary,
            }}
            onClick={() => onEdit && onEdit(index, normalizedCharacter)}
          >
            <MdEdit size={18} />
          </button>
          <button
            className="px-3 py-1 rounded-lg text-sm font-semibold transition-all hover:scale-105 border-2"
            style={{
              backgroundColor: colors.white,
              color: "#b91c1c",
              borderColor: "#fecaca",
            }}
            onClick={() => onDelete && onDelete(index)}
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {normalizedCharacter.personnalité && (
          <div>
            <span className="font-semibold" style={{ color: colors.primary }}>
              Personnalité:{" "}
            </span>
            <span style={{ color: colors.text }}>
              {normalizedCharacter.personnalité}
            </span>
          </div>
        )}

        {normalizedCharacter.apparence && (
          <div>
            <span className="font-semibold" style={{ color: colors.primary }}>
              Apparence:{" "}
            </span>
            <span style={{ color: colors.text }}>
              {normalizedCharacter.apparence}
            </span>
          </div>
        )}

        {normalizedCharacter.rôle && (
          <div>
            <span className="font-semibold" style={{ color: colors.primary }}>
              Rôle:{" "}
            </span>
            <span style={{ color: colors.text }}>
              {normalizedCharacter.rôle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableCharacterCard;
