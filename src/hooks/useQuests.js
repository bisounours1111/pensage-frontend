import { useEffect, useMemo, useState } from "react";
import { questApi } from "../lib/supabaseApi";
import { getCurrentUser } from "../lib/supabase";

/**
 * Hook quêtes — connecté à Supabase.
 * - Récupère la liste des quêtes (table `quest`).
 * - Récupère la progression utilisateur (table `quest_progress`).
 * - Calcule un pourcentage local pour l'affichage.
 */
export default function useQuests() {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuests = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();

      // 1) Toutes les quêtes
      const allQuests = await questApi.getAll();

      // 2) Progression utilisateur (si connecté)
      let progressByQuestId = {};
      if (user?.id) {
        const progresses = await questApi.getProgress(user.id);
        progressByQuestId = (progresses || []).reduce((acc, p) => {
          // `p` contient: id_quest, progression, valided, et potentiellement `quest`
          acc[p.id_quest] = {
            progression: p.progression || 0,
            valided: !!p.valided,
          };
          return acc;
        }, {});
      }

      // 3) Mapper pour l'UI
      const mapped = (allQuests || []).map((q) => {
        const progress = progressByQuestId[q.id] || {
          progression: 0,
          valided: false,
        };
        const amountTarget = q.amount_target || 0;
        const percent =
          amountTarget > 0
            ? Math.min(
                100,
                Math.round((progress.progression / amountTarget) * 100)
              )
            : 0;

        return {
          id: q.id,
          title: q.title,
          description: q.description,
          xp: q.xp || 0,
          progress: percent,
          status: progress.valided || percent >= 100 ? "done" : "ongoing",
          // Données brutes utiles si besoin d'actions ultérieures
          _raw: {
            amount_target: q.amount_target,
            key_target: q.key_target,
            progression: progress.progression,
            valided: progress.valided,
          },
        };
      });

      setQuests(mapped);
    } catch (e) {
      setError(e?.message || "Erreur lors du chargement des quêtes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const ongoing = useMemo(
    () => quests.filter((q) => q.status !== "done"),
    [quests]
  );
  const finished = useMemo(
    () => quests.filter((q) => q.status === "done"),
    [quests]
  );

  const totalXp = useMemo(
    () => finished.reduce((sum, q) => sum + (q.xp || 0), 0),
    [finished]
  );
  const level = useMemo(
    () => Math.max(1, Math.floor(totalXp / 1000) + 1),
    [totalXp]
  );

  return {
    quests,
    ongoing,
    finished,
    totalXp,
    level,
    loading,
    error,
    refresh: fetchQuests,
  };
}
