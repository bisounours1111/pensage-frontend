import React from "react";

export default function EpisodeContent({ content }) {
  if (!content) return null;

  return (
    <article className="rounded-2xl p-6 md:p-8 bg-white/40 backdrop-blur border border-white/20 shadow-lg leading-relaxed">
      <div className="prose prose-p:my-4 max-w-none text-[#7a4252]">
        {content.split("\n").map((para, idx) => (
          <p key={idx}>{para.trim()}</p>
        ))}
      </div>
    </article>
  );
}
