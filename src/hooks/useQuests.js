import { useMemo, useState } from "react";

/**
 * Hook quêtes — state local (prêt à connecter à Supabase).
 * - Pas d'actions user (suppression / terminé) : tout viendra de la BDD.
 * - Progression numérique (0–100) utilisée pour l'affichage.
 */
export default function useQuests() {
  const [quests] = useState([
    {
      id: "q1",
      title: "Écrire 500 mots",
      description: "Rédige un nouveau chapitre aujourd’hui.",
      xp: 150,
      progress: 40,
      status: "ongoing",
    },
    {
      id: "q2",
      title: "Lire 3 chapitres",
      description: "Lis 3 chapitres d’une histoire de la communauté.",
      xp: 120,
      progress: 65,
      status: "ongoing",
    },
    {
      id: "q3",
      title: "Publier un extrait",
      description: "Partage un extrait sur ton profil.",
      xp: 80,
      progress: 100,
      status: "done",
    },
  ]);

  const ongoing = useMemo(() => quests.filter(q => q.status !== "done"), [quests]);
  const finished = useMemo(() => quests.filter(q => q.status === "done"), [quests]);

  // XP total (ex: somme des quêtes terminées)
  const totalXp = useMemo(
    () => finished.reduce((sum, q) => sum + (q.xp || 0), 0),
    [finished]
  );

  // Level simple (ex: palier de 1000 XP)
  const level = useMemo(() => Math.max(1, Math.floor(totalXp / 1000) + 1), [totalXp]);

  return { quests, ongoing, finished, totalXp, level };
}
