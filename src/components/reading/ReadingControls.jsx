import React from "react";

export default function ReadingControls({ onPrev, onNext, hasPrev, hasNext }) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-40">
      <div className="mx-6 md:mx-12 mb-6 rounded-2xl p-4 bg-white/60 backdrop-blur border border-white/40 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          {/* Épisode précédent */}
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`px-4 py-2 rounded-lg font-semibold border border-black/10 transition ${
              hasPrev ? "text-[#7a4252] hover:scale-105" : "text-[#7a4252]/40 cursor-not-allowed"
            }`}
            title="Épisode précédent"
          >
            ← Épisode précédent
          </button>

          {/* Épisode suivant */}
          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`px-4 py-2 rounded-lg font-semibold text-white shadow-md transition ${
              hasNext ? "hover:scale-105" : "opacity-60 cursor-not-allowed"
            }`}
            style={{ backgroundColor: "#f17ca0" }}
            title="Épisode suivant"
          >
            Épisode suivant →
          </button>
        </div>
      </div>
    </div>
  );
}
