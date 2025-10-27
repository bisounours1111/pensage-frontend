import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useReading from "../../hooks/useReading";
import ReadingHeader from "../../components/reading/ReadingHeader";
import EpisodeContent from "../../components/reading/EpisodeContent";
import SectionTitle from "../../components/ui/SectionTitle";
import ReadingControls from "../../components/reading/ReadingControls";

export default function ReadingPage() {
  const navigate = useNavigate();
  const { novelId, episodeNumber } = useParams();

  const {
    novel,
    episode,
    hasPrev,
    hasNext,
    goPrev,
    goNext,
  } = useReading({
    novelId,
    episodeNumber: episodeNumber ? Number(episodeNumber) : undefined,
  });

  const handleBack = () => navigate(-1);

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: "linear-gradient(to bottom, #f7e7eb, #f4d5de, #f2c3d1)" }}
    >
      <header className="p-6 md:p-12 space-y-6">
        <ReadingHeader novel={novel} episode={episode} />
      </header>

      <main className="px-6 md:px-12 space-y-6">
        <SectionTitle>Lecture</SectionTitle>
        <EpisodeContent content={episode?.content} />
      </main>

      <div className="mt-10" />

      <ReadingControls
        onBack={handleBack}
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />
    </div>
  );
}
