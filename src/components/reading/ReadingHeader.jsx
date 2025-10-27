import React from "react";

export default function ReadingHeader({ novel, episode }) {
  if (!novel || !episode) return null;

  return (
    <div className="rounded-2xl p-5 bg-white/30 backdrop-blur border border-white/20 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#7a4252]">{novel.title}</h1>
          {novel.author && (
            <p className="text-sm text-[#7a4252] opacity-80">par {novel.author}</p>
          )}
        </div>

        <div className="text-right">
          <div className="text-sm text-[#7a4252] opacity-80">
            Épisode {episode.number} — {episode.title}
          </div>
          <div className="text-xs text-[#7a4252] opacity-70">
            ~ {episode.length} mots • maj {episode.updatedAt}
          </div>
        </div>
      </div>
    </div>
  );
}
