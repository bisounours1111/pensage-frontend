import React from "react";
import QuestItem from "./QuestItem";
import SectionTitle from "../ui/SectionTitle";

export default function QuestSection({ title, quests, emptyText }) {
  return (
    <section className="px-6 md:px-12 mb-10">
      <SectionTitle>{title}</SectionTitle>

      {(!quests || quests.length === 0) ? (
        <div className="rounded-2xl p-6 bg-white/30 backdrop-blur border border-white/20 text-[#7a4252]">
          {emptyText}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {quests.map(q => (
            <QuestItem key={q.id} quest={q} />
          ))}
        </div>
      )}
    </section>
  );
}
