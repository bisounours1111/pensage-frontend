import React from "react";

export default function PointsBalanceCard({ points, onWeekly, onAd }) {
  return (
    <div className="w-full rounded-2xl p-6 bg-white/30 backdrop-blur shadow-lg border border-white/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p className="text-sm text-[#7a4252] opacity-80">Votre solde</p>
        <p className="text-3xl md:text-4xl font-extrabold text-[#7a4252]">
          {points.toLocaleString("fr-FR")} pts
        </p>
        <p className="text-sm text-[#7a4252] opacity-70">
          Gratuit (pubs / hebdo : 100–2000 pts)
        </p>
      </div>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 rounded-lg text-white font-semibold shadow-md transition hover:scale-105"
          style={{ backgroundColor: "#f17ca0" }}
          onClick={onWeekly}
        >
          Récompense hebdo +100
        </button>
        <button
          className="px-4 py-2 rounded-lg text-white font-semibold shadow-md transition hover:scale-105"
          style={{ backgroundColor: "#f17ca0" }}
          onClick={onAd}
        >
          Regarder une pub (100–2000)
        </button>
      </div>
    </div>
  );
}
