import { useEffect, useMemo, useState } from "react";

/** Front only: mock data + navigation locale */
export default function useReading({ novelId, episodeNumber }) {
  const [novel, setNovel] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // MOCK: remplace plus tard par des fetchs BDD
    const mockNovel = {
      id: novelId || "novel-1",
      title: "La Cité des Brumes",
      author: "A. V. Oris",
      updatedAt: "2025-10-20",
    };
    const mockEpisodes = [
      {
        id: "e1",
        number: 1,
        title: "Le seuil",
        length: 1280,
        updatedAt: "2025-10-18",
        content:
          "Le brouillard s’accrochait aux toits. Ely s’arrêta devant la porte scellée, une clef froide dans la paume...",
      },
      {
        id: "e2",
        number: 2,
        title: "La clef",
        length: 1430,
        updatedAt: "2025-10-19",
        content:
          "La clef vibra faiblement, puis un déclic retentit. L’obscurité derrière la porte sentait l’ivoire brûlé...",
      },
      {
        id: "e3",
        number: 3,
        title: "Les marches",
        length: 1520,
        updatedAt: "2025-10-20",
        content:
          "Les marches descendaient, plus froides à chaque palier. Ely compta ses pas pour ne pas écouter les voix...",
      },
    ];

    setNovel(mockNovel);
    setEpisodes(mockEpisodes);

    const idxFromParam = typeof episodeNumber === "number"
      ? mockEpisodes.findIndex((e) => e.number === episodeNumber)
      : 0;

    setCurrentIndex(idxFromParam >= 0 ? idxFromParam : 0);
  }, [novelId, episodeNumber]);

  const episode = useMemo(
    () => (episodes.length ? episodes[currentIndex] : null),
   [episodes, currentIndex]
  );

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < episodes.length - 1;
  const goPrev = () => hasPrev && setCurrentIndex((i) => i - 1);
  const goNext = () => hasNext && setCurrentIndex((i) => i + 1);

  return { novel, episode, episodesCount: episodes.length, hasPrev, hasNext, goPrev, goNext };
}
