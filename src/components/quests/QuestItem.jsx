import React from "react";
import ProgressBar from "./ProgressBar";

export default function QuestItem({ quest }) {
  const { title, description, xp, progress = 0 } = quest;

  return (
    <div className="rounded-2xl p-5 bg-white/30 backdrop-blur border border-white/20 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg md:text-xl font-bold text-[#7a4252]">{title}</h3>
        <div className="text-base md:text-lg font-extrabold text-[#7a4252] whitespace-nowrap">
          +{xp} XP
        </div>
      </div>

      <div className="mt-3">
        <ProgressBar value={progress} />
        <div className="mt-1 text-sm font-semibold text-[#7a4252] text-right">
          {progress}%
        </div>
      </div>

      {description && (
        <p className="mt-3 text-sm text-[#7a4252] opacity-85">
          {description}
        </p>
      )}
    </div>
  );
}
