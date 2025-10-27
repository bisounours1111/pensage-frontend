import React from "react";

export default function PointsBalanceCard({ points, onWeekly, onAd, status = "gratuit" }) {
  return (
    <div className="w-full rounded-2xl p-6 bg-white/30 backdrop-blur shadow-lg border border-white/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      
      <div>
        <p className="text-xl md:text-2xl font-bold text-[#7a4252]">Votre solde</p>

        <p className="text-2xl md:text-3xl font-semibold text-[#7a4252]">
          {points.toLocaleString("fr-FR")} pts
        </p>

        <p className="mt-2 text-lg font-semibold text-[#7a4252]">
          Votre statut :{" "}
          <span
            className={
              status === "premium"
                ? "text-[#7a4252] font-bold"
                : "text-[#7a4252] font-bold"
            }
          >
            {status === "premium" ? "Compte Premium ✨" : "Compte Gratuit 🔓"}
          </span>
        </p>

      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <button
          className="px-4 py-2 rounded-lg text-white font-semibold shadow-md transition hover:scale-105"
          style={{ backgroundColor: "#f17ca0" }}
          onClick={onWeekly}
        >
          +100 pts hebdo
        </button>
        <button
          className="px-4 py-2 rounded-lg text-white font-semibold shadow-md transition hover:scale-105"
          style={{ backgroundColor: "#f17ca0" }}
          onClick={onAd}
        >
          Regarder une pub
        </button>
      </div>
    </div>
  );
}
