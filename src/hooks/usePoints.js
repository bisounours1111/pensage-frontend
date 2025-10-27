import { useState, useCallback } from "react";

export default function usePoints(initial = 1200) {
  const [points, setPoints] = useState(initial);

  const addPoints = useCallback((n) => setPoints((p) => p + n), []);
  const rewardWeekly = useCallback(() => setPoints((p) => p + 100), []);
  const rewardAd = useCallback(() => {
    const bonus = Math.floor(Math.random() * 1901) + 100; // 100–2000
    setPoints((p) => p + bonus);
    return bonus; 
  }, []);

  return { points, addPoints, rewardWeekly, rewardAd, setPoints };
}
