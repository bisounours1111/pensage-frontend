import React from "react";
import colors from "../../utils/constants/colors";

const CharacterCard = ({ character, index }) => {
  return (
    <div
      className="rounded-xl p-6 shadow-lg transition-transform hover:scale-105 backdrop-blur-sm"
      style={{
        backgroundColor: colors.whiteTransparent,
        border: `2px solid ${colors.primaryLight}`,
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{
            backgroundColor: colors.primary,
            color: colors.white,
          }}
        >
          {character.nom?.charAt(0) || index + 1}
        </div>
        <div>
          <h3 className="text-xl font-bold" style={{ color: colors.text }}>
            {character.nom || `Personnage ${index + 1}`}
          </h3>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {character.role || character.âge || ""}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {character.âge && (
          <div>
            <span className="font-semibold" style={{ color: colors.primary }}>
              Âge:{" "}
            </span>
            <span style={{ color: colors.text }}>{character.âge}</span>
          </div>
        )}

        {character.personnalité && (
          <div>
            <span className="font-semibold" style={{ color: colors.primary }}>
              Personnalité:{" "}
            </span>
            <span style={{ color: colors.text }}>{character.personnalité}</span>
          </div>
        )}

        {character.apparence && (
          <div>
            <span className="font-semibold" style={{ color: colors.primary }}>
              Apparence:{" "}
            </span>
            <span style={{ color: colors.text }}>{character.apparence}</span>
          </div>
        )}

        {character.histoire && (
          <div>
            <span className="font-semibold" style={{ color: colors.primary }}>
              Histoire:{" "}
            </span>
            <span style={{ color: colors.text }}>{character.histoire}</span>
          </div>
        )}

        {character.description && !character.histoire && (
          <div>
            <span style={{ color: colors.text }}>{character.description}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;
