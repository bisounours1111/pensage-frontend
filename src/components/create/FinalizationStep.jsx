import React from "react";
import { MdArrowBack, MdCheckCircle } from "react-icons/md";
import colors from "../../utils/constants/colors";

const FinalizationStep = ({
  pitch,
  synopsis,
  characters,
  storyTitle,
  selectedGenre,
  onPrevious,
  onFinalize,
}) => {
  return (
    <div className="space-y-6">
      <div
        className="p-8 rounded-xl shadow-lg text-center"
        style={{
          backgroundColor: colors.white,
          border: `4px solid ${colors.primary}`,
        }}
      >
        <div className="mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl font-bold"
            style={{ backgroundColor: colors.primary }}
          >
            <MdCheckCircle />
          </div>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Votre histoire est prête !
          </h2>
          <p className="text-lg mb-8" style={{ color: colors.textSecondary }}>
            Vous pouvez maintenant commencer à créer vos épisodes
          </p>
        </div>

        <div className="text-left space-y-6 mb-8">
          <div
            className="p-6 rounded-lg border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.white,
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: colors.white }}
            >
              Pitch
            </h3>
            <p style={{ color: colors.white }}>{pitch}</p>
          </div>

          <div
            className="p-6 rounded-lg border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.white,
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: colors.white }}
            >
              Synopsis
            </h3>
            <p className="whitespace-pre-wrap" style={{ color: colors.white }}>
              {synopsis.substring(0, 200)}...
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.white,
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

          <div
            className="p-6 rounded-lg border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.white,
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: colors.white }}
            >
              Genre
            </h3>
            <p style={{ color: colors.white }}>
              {selectedGenre || "Non défini"}
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              color: colors.white,
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: colors.white }}
            >
              Titre
            </h3>
            <p style={{ color: colors.white }}>{storyTitle || "Non défini"}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 border-4"
            style={{
              backgroundColor: colors.white,
              color: colors.primary,
              borderColor: colors.primary,
            }}
            onClick={onPrevious}
          >
            <span className="inline-flex items-center gap-2">
              <MdArrowBack /> Retour
            </span>
          </button>
          <button
            className="flex-1 px-8 py-4 rounded-lg font-bold text-white text-lg transition-all hover:scale-105 border-4"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
            onClick={onFinalize}
          >
            Créer mes épisodes
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalizationStep;
