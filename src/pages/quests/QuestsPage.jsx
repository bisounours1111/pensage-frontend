import React from "react";
import QuestSection from "../../components/quests/QuestSection";
import useQuests from "../../hooks/useQuests";

export default function QuestsPage() {
  const { ongoing, finished, loading, error } = useQuests();

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        background: "linear-gradient(to bottom, #f7e7eb, #f4d5de, #f2c3d1)",
      }}
    >
      <header className="p-6 md:p-12">
        <h1 className="text-4xl md:text-6xl font-bold text-[#7a4252]">
          Quêtes
        </h1>
        <p className="mt-2 text-[#7a4252] opacity-80">
          Gagne de l’XP en complétant des objectifs. Garde un œil sur ta
          progression !
        </p>
      </header>

      {loading && (
        <div className="px-6 md:px-12">
          <div className="rounded-2xl p-6 bg-white/30 backdrop-blur border border-white/20 text-[#7a4252]">
            Chargement des quêtes...
          </div>
        </div>
      )}

      {error && (
        <div className="px-6 md:px-12">
          <div className="rounded-2xl p-6 bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        </div>
      )}

      <QuestSection
        title="Quêtes en cours"
        quests={ongoing}
        emptyText="Aucune quête en cours pour le moment."
      />

      <QuestSection
        title="Quêtes terminées"
        quests={finished}
        emptyText="Tu n’as pas encore terminé de quêtes."
      />
    </div>
  );
}
