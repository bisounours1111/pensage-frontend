import React from "react";
import ProgressBar from "./ProgressBar";

export default function QuestCard({
  quest,
  onToggleChecklist,
  onDelete,
  onMarkDone,
}) {
  const { id, title, description, xp, status, checklist = [] } = quest;

  const doneCount = checklist.filter(i => i.done).length;
  const checklistPercent = checklist.length
    ? Math.round((doneCount / checklist.length) * 100)
    : status === "done" ? 100 : 0;

  return (
    <div className="rounded-2xl p-5 bg-white/30 backdrop-blur border border-white/20 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-[#7a4252]">{title}</h3>
          {description && (
            <p className="text-sm text-[#7a4252] opacity-80 mt-1">{description}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs text-[#7a4252] opacity-70">Récompense</div>
          <div className="text-base font-extrabold text-[#7a4252]">{xp} XP</div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#7a4252] opacity-80">
            Progression {status === "done" ? "(terminée)" : ""}
          </span>
          <span className="text-sm font-semibold text-[#7a4252]">
            {status === "done" ? "100%" : `${checklistPercent}%`}
          </span>
        </div>
        <ProgressBar value={status === "done" ? 100 : checklistPercent} />
      </div>

      {/* Checklist */}
      {checklist.length > 0 && (
        <div className="mt-4 space-y-2">
          {checklist.map(item => (
            <label key={item.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!item.done}
                onChange={() => onToggleChecklist(id, item.id)}
                className="w-4 h-4 accent-pink-500"
              />
              <span className={`text-sm ${item.done ? "line-through opacity-60" : ""} text-[#7a4252]`}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {status !== "done" && (
          <button
            className="px-4 py-2 rounded-lg text-white font-semibold shadow-md transition hover:scale-105"
            style={{ backgroundColor: "#f17ca0" }}
            onClick={() => onMarkDone(id)}
          >
            Marquer comme terminée
          </button>
        )}
        <button
          className="px-4 py-2 rounded-lg font-semibold shadow-md transition hover:scale-105 border border-black/10"
          onClick={() => onDelete(id)}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
